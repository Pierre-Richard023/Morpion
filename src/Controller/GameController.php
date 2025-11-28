<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;

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
}
