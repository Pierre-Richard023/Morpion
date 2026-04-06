<?php

namespace App\Controller\api;

use App\Model\Player;
use App\Repository\PlayerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/players')]
class PlayerController extends AbstractController
{


    public function __construct(private readonly PlayerRepository $playerRepository) {}


    #[Route('', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data     = $request->toArray();
        $username = trim($data['username'] ?? '');

        if (empty($username) || strlen($username) > 20) {
            return $this->json(['error' => 'Username invalide'], 400);
        }

        $player = new Player($username);
        $this->playerRepository->save($player);

        return $this->json($player->toArray(), 201);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(string $id): JsonResponse
    {
        $player = $this->playerRepository->find($id);

        if (!$player) {
            return $this->json(['error' => 'Joueur non trouvé'], 404);
        }

        return $this->json($player->toArray());
    }
}
