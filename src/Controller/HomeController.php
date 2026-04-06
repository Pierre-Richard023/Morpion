<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{


    #[Route('/', 'home')]
    public function index()
    {
        return $this->render('Home/index.html.twig', []);
    }

    #[Route('/game/online', name: 'game_online')]
    public function online(): Response
    {
        return $this->render('Game/online.html.twig');
    }

    #[Route('/game/friend', name: 'game_friend')]
    public function friend(): Response
    {
        return $this->render('game/friend.html.twig');
    }

    #[Route('/game/bot', name: 'game_bot')]
    public function bot(): Response
    {
        return $this->render('game/bot.html.twig');
    }
}
