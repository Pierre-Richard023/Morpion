<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{


    #[Route('/','home')]
    public function index()
    {
        return $this->render('Home/index.html.twig',[]);
    }

    
}
