<?php

namespace App\Controller\api;

use App\Repository\GameRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

#[Route('/api/games')]
class GameController extends AbstractController
{

    public function __construct(
        private HubInterface $hub,
        private GameRepository $gameRepository,
        #[Target('game.cache')]
        private CacheInterface $cache
    ) {}

    #[Route('/{id}', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        $game = $this->gameRepository->find($id);

        if (!$game) {
            return $this->json(['error' => 'Partie non trouvée'], 404);
        }

        return $this->json($game->toArray());
    }

    #[Route('/{id}/move', methods: ['POST'])]
    public function move(string $id, Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $position = $data['position'] ?? null;
        $playerId = $data['playerId'] ?? null;

        if ($position === null || !is_int($position) || $position < 0 || $position > 8) {
            return $this->json(['error' => 'Position invalide'], 400);
        }

        $game = $this->gameRepository->find($id);
        if (!$game) {
            return $this->json(['error' => 'Partie non trouvée'], 404);
        }

        if ($game->status !== 'playing') {
            return $this->json(['error' => 'Partie non active'], 409);
        }

        $isPlayerRed = $game->playerRed['id'] === $playerId;
        $isPlayerBlack = $game->playerBlack['id'] === $playerId;

        if (!$isPlayerRed && !$isPlayerBlack) {
            return $this->json(['error' => 'Tu n\'es pas dans cette partie'], 403);
        }

        $expectedSymbol = $game->currentPlayer;
        $playerSymbol   = $isPlayerRed ? 'red' : 'black';

        if ($playerSymbol !== $expectedSymbol) {
            return $this->json(['error' => 'Ce n\'est pas ton tour'], 409);
        }

        if ($game->board[$position] !== null) {
            return $this->json(['error' => 'Case déjà jouée'], 409);
        }


        $elapsed = time() - $game->lastMoveAt;
        $game->timeLeft[$playerSymbol] -= $elapsed;

        if ($game->timeLeft[$playerSymbol] <= 0) {
            $game->timeLeft[$playerSymbol] = 0;
            $game->status = 'finished';
            $game->winner = $playerSymbol === 'red' ? 'black' : 'red';
            $game->finishReason = 'timeout';
            $game->score[$game->winner]++;

            $this->gameRepository->save($game);

            $this->hub->publish(new Update(
                "game.{$id}",
                json_encode(['type' => 'timeout', 'game' => $game->toArray()])
            ));

            return $this->json($game->toArray());
        }


        $game->board[$position] = $game->currentPlayer;
        $game->lastMoveAt = time();
        $game->checkWinner();


        if ($game->status === 'playing') {
            $game->currentPlayer = $game->currentPlayer === 'red' ? 'black' : 'red';
        }
        $this->gameRepository->save($game);

        $this->hub->publish(new Update(
            "game.{$id}",
            json_encode([
                'type' => 'move_played',
                'game' => $game->toArray(),
            ])
        ));

        return $this->json($game->toArray());
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function abandon(string $id, Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $playerId = $data['playerId'] ?? null;

        $game = $this->gameRepository->find($id);
        if (!$game) {
            return $this->json(['error' => 'Partie non trouvée'], 404);
        }

        $game->status = 'finished';
        $game->winner = $game->playerRed['id'] === $playerId ? 'black' : 'red';

        $this->gameRepository->save($game);

        $this->hub->publish(new Update(
            "game.{$id}",
            json_encode([
                'type'   => 'player_left',
                'game'   => $game->toArray(),
            ])
        ));

        return $this->json(['success' => true]);
    }

    #[Route('/{id}/heartbeat', methods: ['POST'])]
    public function heartbeat(string $id, Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $playerId = $data['playerId'] ?? null;

        $game = $this->gameRepository->find($id);
        if (!$game || $game->status !== 'playing') {
            return $this->json(['ok' => false]);
        }

        $key = "game.heartbeat.{$id}.{$playerId}";
        $this->cache->delete($key);
        $this->cache->get($key, function (ItemInterface $item) {
            $item->expiresAfter(15);
            return true;
        });

        return $this->json(['ok' => true]);
    }

    #[Route('/{id}/leave', methods: ['POST'])]
    public function leave(string $id, Request $request): JsonResponse
    {

        $content  = $request->getContent();
        $data     = json_decode($content, true) ?? [];
        $playerId = $data['playerId'] ?? null;


        $game = $this->gameRepository->find($id);
        if (!$game || $game->status === 'finished') {
            return $this->json(['ok' => false]);
        }

        if (!$playerId) {
            return $this->json(['error' => 'playerId manquant'], 400);
        }
        $game->status = 'finished';
        $game->winner = $game->playerRed['id'] === $playerId ? 'black' : 'red';
        $game->finishReason = 'player_left';

        $this->gameRepository->save($game);

        $this->hub->publish(new Update(
            "game.{$id}",
            json_encode([
                'type' => 'player_left',
                'game' => $game->toArray(),
            ])
        ));

        return $this->json(['ok' => true]);
    }

    #[Route('/{id}/rematch', methods: ['POST'])]
    public function rematch(string $id, Request $request): JsonResponse
    {
        $content  = $request->getContent();
        $data     = json_decode($content, true) ?? [];
        $playerId = $data['playerId'] ?? null;

        if (!$playerId) {
            return $this->json(['error' => 'playerId manquant'], 400);
        }

        $game = $this->gameRepository->find($id);
        if (!$game) {
            return $this->json(['error' => 'Partie introuvable'], 404);
        }

        if ($game->status !== 'finished') {
            return $this->json(['error' => 'La partie n\'est pas terminée'], 409);
        }

        $isPlayerRed   = $game->playerRed['id']   === $playerId;
        $isPlayerBlack = $game->playerBlack['id'] === $playerId;

        if (!$isPlayerRed && !$isPlayerBlack) {
            return $this->json(['error' => 'Tu n\'es pas dans cette partie'], 403);
        }

        if (!in_array($playerId, $game->rematchRequests, true)) {
            $game->rematchRequests[] = $playerId;
        }

        $bothAccepted =
            in_array($game->playerRed['id'],   $game->rematchRequests, true) &&
            in_array($game->playerBlack['id'], $game->rematchRequests, true);

        if ($bothAccepted) {
            $game->resetForRematch();
            $this->gameRepository->save($game);

            $this->hub->publish(new Update(
                "game.{$id}",
                json_encode([
                    'type' => 'rematch_started',
                    'game' => $game->toArray(),
                ])
            ));

            return $this->json(['status' => 'rematch_started', 'game' => $game->toArray()]);
        }

        $this->gameRepository->save($game);

        $this->hub->publish(new Update(
            "game.{$id}",
            json_encode([
                'type' => 'rematch_requested',
                'game' => $game->toArray(),
            ])
        ));

        return $this->json(['status' => 'rematch_requested', 'game' => $game->toArray()]);
    }

    #[Route('/{id}/rematch', methods: ['DELETE'])]
    public function declineRematch(string $id, Request $request): JsonResponse
    {
        $content  = $request->getContent();
        $data     = json_decode($content, true) ?? [];
        $playerId = $data['playerId'] ?? null;

        $game = $this->gameRepository->find($id);
        if (!$game) {
            return $this->json(['error' => 'Partie introuvable'], 404);
        }

        $this->hub->publish(new Update(
            "game.{$id}",
            json_encode([
                'type'     => 'rematch_declined',
                'byPlayer' => $playerId,
                'game'     => $game->toArray(),
            ])
        ));

        return $this->json(['status' => 'rematch_declined']);
    }

    #[Route('/{id}/timeout', methods: ['POST'])]
    public function timeout(string $id, Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $playerId = $data['playerId'] ?? null;

        $game = $this->gameRepository->find($id);
        if (!$game || $game->status !== 'playing') {
            return $this->json(['ok' => false]);
        }

        $currentPlayerId = $game->currentPlayer === 'red'
            ? $game->playerRed['id']
            : $game->playerBlack['id'];

        if ($currentPlayerId !== $playerId) {
            return $this->json(['ok' => false]);
        }

        $elapsed   = time() - $game->lastMoveAt;
        $remaining = $game->timeLeft[$game->currentPlayer] - $elapsed;

        if ($remaining > 3) {
            return $this->json(['ok' => false, 'remaining' => $remaining]);
        }

        $loser  = $game->currentPlayer;
        $winner = $loser === 'red' ? 'black' : 'red';

        $game->timeLeft[$loser] = 0;
        $game->status           = 'finished';
        $game->winner           = $winner;
        $game->finishReason     = 'timeout';
        $game->score[$winner]++;

        $this->gameRepository->save($game);

        $this->hub->publish(new Update(
            "game.{$id}",
            json_encode(['type' => 'timeout', 'game' => $game->toArray()])
        ));

        return $this->json(['ok' => true, 'game' => $game->toArray()]);
    }
}
