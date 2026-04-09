<?php

namespace App\Controller\api;

use App\Model\Game;
use App\Repository\GameRepository;
use App\Repository\MatchmakingRepository;
use App\Repository\PlayerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/matchmaking')]
class MatchmakingController extends AbstractController
{
    public function __construct(
        private MatchmakingRepository $matchmakingRepository,
        private PlayerRepository      $playerRepository,
        private GameRepository        $gameRepository,
        private HubInterface          $hub
    ) {}

    #[Route('/join', methods: ['POST'])]
    public function join(Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $playerId = $data['playerId'] ?? null;

        $player = $this->playerRepository->find($playerId);
        if (!$player) {
            return $this->json(['error' => 'Joueur introuvable'], 404);
        }

        $this->matchmakingRepository->addPlayer($playerId);

        $pair = $this->matchmakingRepository->popPair();

        if ($pair !== null) {
            return $this->createMatch($pair[0], $pair[1]);
        }

        $this->publishQueueCount();

        return $this->json([
            'status'  => 'waiting',
            'waiting' => $this->matchmakingRepository->countWaiting(),
        ]);
    }

    #[Route('/leave', methods: ['DELETE'])]
    public function leave(Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $playerId = $data['playerId'] ?? null;

        if ($playerId) {
            $this->matchmakingRepository->removePlayer($playerId);
            $this->publishQueueCount();
        }

        return $this->json(['status' => 'left']);
    }

    #[Route('/heartbeat', methods: ['POST'])]
    public function heartbeat(Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $playerId = $data['playerId'] ?? null;

        if (!$playerId) {
            return $this->json(['error' => 'playerId requis'], 400);
        }

        $this->matchmakingRepository->refreshHeartbeat($playerId);
        $pair = $this->matchmakingRepository->popPair();

        if ($pair !== null) {
            return $this->createMatch($pair[0], $pair[1]);
        }

        return $this->json([
            'status'  => 'waiting',
            'waiting' => $this->matchmakingRepository->countWaiting(),
        ]);
    }

    #[Route('/count', methods: ['GET'])]
    public function count(): JsonResponse
    {
        return $this->json([
            'waiting' => $this->matchmakingRepository->countWaiting(),
        ]);
    }

    private function createMatch(string $playerRedId, string $playerBlackId): JsonResponse
    {
        $playerRed = $this->playerRepository->find($playerRedId);
        $playerBlack = $this->playerRepository->find($playerBlackId);

        if (!$playerRed || !$playerBlack) {
            return $this->json(['error' => 'Joueur introuvable lors du match'], 500);
        }

        $game = new Game();
        $game->playerRed = $playerRed->toArray();
        $game->playerBlack = $playerBlack->toArray();
        $game->status  = 'playing';
        $game->startedAt = time(); 

        $this->gameRepository->save($game);

        $matchData = [
            'type'   => 'match_found',
            'gameId' => $game->id,
            'game'   => $game->toArray(),
        ];

        $this->hub->publish(new Update(
            "matchmaking.{$playerRedId}",
            json_encode($matchData)
        ));

        $this->hub->publish(new Update(
            "matchmaking.{$playerBlackId}",
            json_encode($matchData)
        ));

        $this->publishQueueCount();

        return $this->json([
            'status' => 'matched',
            'gameId' => $game->id,
            'game'   => $game->toArray(),
        ]);
    }

    private function publishQueueCount(): void
    {
        $this->hub->publish(new Update(
            'matchmaking.count',
            json_encode(['waiting' => $this->matchmakingRepository->countWaiting()])
        ));
    }
}
