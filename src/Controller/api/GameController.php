<?php

namespace App\Controller\api;

use App\Repository\GameRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;


#[Route('/api/games')]
class GameController extends AbstractController
{

    public function __construct(private HubInterface $hub, private GameRepository $gameRepository) {}

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
        $position = $data['position'] ?? null;   // 0-8
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

        $game->board[$position] = $game->currentPlayer;
        $game->checkWinner();

        if ($game->status === 'playing') {
            $game->currentPlayer = $game->currentPlayer === 'red' ? 'black' : 'red';
        }
        $this->gameRepository->save($game);

        $this->hub->publish(new Update(
            "game/{$id}",
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
        $game->winner = $game->playerRed['id'] === $playerId ? 'red' : 'black';

        $this->gameRepository->save($game);

        $this->hub->publish(new Update(
            "game/{$id}",
            json_encode([
                'type'   => 'player_left',
                'game'   => $game->toArray(),
            ])
        ));

        return $this->json(['success' => true]);
    }
}
