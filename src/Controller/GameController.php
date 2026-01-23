<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class GameController extends AbstractController
{


    #[Route('/game', 'play')]
    public function play()
    {
        return $this->render('Game/board.html.twig');
    }



    #[Route('/lobby', 'lobby')]
    public function lobby()
    {
        return $this->render('Game/lobby.html.twig');
    }

    #[Route('/lobby-test', 'lobby.t')]
    public function publish(HubInterface $hub): Response
    {
        $update = new Update(
            'https://example.com/books/1',
            json_encode(['status' => 'Fonctionne correctement !'])
        );

        $hub->publish($update);

        return new Response('published!');
    }
}
