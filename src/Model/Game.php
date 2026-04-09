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
    public int $startedAt;
    public ?string $finishReason;
    public array $score;
    public array $rematchRequests;
    public int $roundNumber;
    public string $firstPlayer;
    public array $timeLeft;
    public int $lastMoveAt;


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
        $this->startedAt     = 0;
        $this->finishReason  = null;
        $this->score         = [
            'red'   => 0,
            'black' => 0,
            'draws' => 0,
        ];

        $this->rematchRequests = [];
        $this->roundNumber     = 1;
        $this->firstPlayer     = 'red';
        $this->timeLeft        = [
            'red'   => 60,
            'black' => 60,
        ];
        $this->lastMoveAt = time();
    }


    public static function fromArray(array $data): self
    {
        $game = new self();
        foreach ($data as $key => $value) {
            if (property_exists($game, $key)) {
                $game->$key = $value;
            }
        }
        return $game;
    }

    public function toArray(): array
    {
        return [
            'id'                => $this->id,
            'board'             => $this->board,
            'status'            => $this->status,
            'currentPlayer'     => $this->currentPlayer,
            'winner'            => $this->winner,
            'playerRed'         => $this->playerRed,
            'playerBlack'       => $this->playerBlack,
            'timeLeft'          => $this->timeLeft,
            'lastMoveAt'        => $this->lastMoveAt,
            'finishReason'      => $this->finishReason,
            'score'             => $this->score,
            'rematchRequests'   => $this->rematchRequests,
            'roundNumber'       => $this->roundNumber,
            'firstPlayer'       => $this->firstPlayer,
            'createdAt'         => $this->createdAt,
            'startedAt'         => $this->startedAt,
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
                $this->score[$this->winner]++;
                return;
            }
        }

        if (!in_array(null, $this->board, true)) {
            $this->winner        = 'draw';
            $this->status        = 'finished';
            $this->score['draws']++;
        }
    }

    public function resetForRematch(): void
    {
        $this->board  = array_fill(0, 9, null);
        $this->status = 'playing';
        $this->winner = null;
        $this->finishReason  = null;
        $this->rematchRequests = [];
        $this->roundNumber++;
        $this->startedAt = time();
        $this->firstPlayer   = $this->firstPlayer === 'red' ? 'black' : 'red';
        $this->currentPlayer = $this->firstPlayer;
        $this->timeLeft = [
            'red'   => 60,
            'black' => 60,
        ];
        $this->lastMoveAt = time();
    }
}
