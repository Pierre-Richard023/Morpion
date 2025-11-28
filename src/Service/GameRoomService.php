<?php


namespace App\Service;



class GameRoomService
{
    public function __construct() {}

    public function generateRoomId(): string
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $max = strlen($characters) - 1;

        $code = '';
        for ($i = 0; $i < 10; $i++) {
            $code .= $characters[random_int(0, $max)];
        }

        return $code;
    }

}
