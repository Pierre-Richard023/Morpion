<?php

namespace App\Model;

use Symfony\Component\Uid\Uuid;

class Player
{
    public string $id;
    public string $username;
    public ?string $currentGameId;

    public function __construct(string $username)
    {
        $this->id            = Uuid::v4()->toRfc4122();
        $this->username      = $username;
        $this->currentGameId = null;
    }

    public static function fromArray(array $data): self
    {
        $player = new self($data['username']);
        $player->id            = $data['id'];
        $player->currentGameId = $data['currentGameId'] ?? null;
        return $player;
    }

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'username'      => $this->username,
            'currentGameId' => $this->currentGameId,
        ];
    }
}