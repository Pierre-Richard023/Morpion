<?php

namespace App\Model;

use Symfony\Component\Uid\Uuid;

class Game
{

    public string $id;
    public array $board;
    public string $status;
    public string $currentPlayer;
    public ?string $winner;
    public ?array $playerRed;
    public ?array $playerBlack;
    public int $createdAt;

    public function __construct()
    {
        $this->id            = Uuid::v4()->toRfc4122();
        $this->board         = array_fill(0, 9, null);
        $this->status        = 'waiting';
        $this->currentPlayer = 'red';
        $this->winner        = null;
        $this->playerRed     = null;
        $this->playerBlack   = null;
        $this->createdAt     = time();
    }


    public static function fromArray(array $data): self
    {
        $game = new self();
        foreach ($data as $key => $value) {
            $game->$key = $value;
        }
        return $game;
    }

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'board'         => $this->board,
            'status'        => $this->status,
            'currentPlayer' => $this->currentPlayer,
            'winner'        => $this->winner,
            'playerRed'     => $this->playerRed,
            'playerBlack'   => $this->playerBlack,
            'createdAt'     => $this->createdAt,
        ];
    }

    public function checkWinner(): void
    {
        $lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        foreach ($lines as [$a, $b, $c]) {
            if (
                $this->board[$a] !== null &&
                $this->board[$a] === $this->board[$b] &&
                $this->board[$a] === $this->board[$c]
            ) {
                $this->winner = $this->board[$a];
                $this->status = 'finished';
                return;
            }
        }

        if (!in_array(null, $this->board, true)) {
            $this->winner = 'draw';
            $this->status = 'finished';
        }
    }
}
