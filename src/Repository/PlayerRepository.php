<?php

namespace App\Repository;

use App\Model\Player;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class PlayerRepository
{
    private const PLAYER_TTL = 3600; // 1h

    public function __construct(
        private CacheInterface $gameCache
    ) {}

    public function save(Player $player): void
    {
        $key  = "player.{$player->id}";
        $data = $player->toArray();

        $this->gameCache->delete($key);
        $this->gameCache->get($key, function (ItemInterface $item) use ($data) {
            $item->expiresAfter(self::PLAYER_TTL);
            return $data;
        });
    }

    public function find(string $playerId): ?Player
    {
        try {
            $data = $this->gameCache->get("player.{$playerId}", function () {
                return null;
            });
            return $data ? Player::fromArray($data) : null;
        } catch (\Exception) {
            return null;
        }
    }
}
