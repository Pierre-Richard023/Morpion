<?php

namespace App\Repository;

use App\Model\Game;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class GameRepository
{
    private const GAME_TTL  = 7200;

    public function __construct(private CacheInterface $gameCache) {}

    public function save(Game $game): void
    {
        $key  = "game.{$game->id}";
        $data = $game->toArray();

        $this->gameCache->delete($key);
        $this->gameCache->get($key, function (ItemInterface $item) use ($data) {
            $item->expiresAfter(self::GAME_TTL);
            return $data;
        });
    }

    public function find(string $gameId): ?Game
    {
        try {
            $data = $this->gameCache->get("game.{$gameId}", function () {
                return null;
            });
            return $data ? Game::fromArray($data) : null;
        } catch (\Exception) {
            return null;
        }
    }

    public function delete(string $gameId): void
    {
        $this->gameCache->delete("game.{$gameId}");
    }
}
