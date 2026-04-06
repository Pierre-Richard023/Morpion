<?php

namespace App\Repository;

use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class MatchmakingRepository
{
    private const QUEUE_KEY = 'matchmaking.queue';
    private const PLAYER_TTL = 15;

    public function __construct(
        #[Target('game.cache')]
        private CacheInterface $cache
    ) {}

    public function addPlayer(string $playerId): void
    {
        $queue = $this->getQueue();

        if (!in_array($playerId, $queue, true)) {
            $queue[] = $playerId;
            $this->saveQueue($queue);
        }
        $this->refreshHeartbeat($playerId);
    }

    public function removePlayer(string $playerId): void
    {
        $queue = array_values(
            array_filter($this->getQueue(), fn($id) => $id !== $playerId)
        );
        $this->saveQueue($queue);
        $this->cache->delete("matchmaking.heartbeat.{$playerId}");
    }

    public function getQueue(): array
    {
        try {
            $queue = $this->cache->get(self::QUEUE_KEY, function (ItemInterface $item) {
                $item->expiresAfter(3600);
                return [];
            });
        } catch (\Exception) {
            return [];
        }

        $active = array_values(
            array_filter($queue, fn($id) => $this->isAlive($id))
        );

        if (count($active) !== count($queue)) {
            $this->saveQueue($active);
        }

        return $active;
    }

    public function countWaiting(): int
    {
        return count($this->getQueue());
    }

    public function popPair(): ?array
    {
        $queue = $this->getQueue();

        if (count($queue) < 2) {
            return null;
        }

        $playerRed = array_shift($queue);
        $playerBlack= array_shift($queue);

        $this->saveQueue($queue);

        $this->cache->delete("matchmaking.heartbeat.{$playerRed}");
        $this->cache->delete("matchmaking.heartbeat.{$playerBlack}");

        return [$playerRed, $playerBlack];
    }

 
    public function refreshHeartbeat(string $playerId): void
    {
        $key = "matchmaking.heartbeat.{$playerId}";
        $this->cache->delete($key);
        $this->cache->get($key, function (ItemInterface $item) {
            $item->expiresAfter(self::PLAYER_TTL);
            return true;
        });
    }

     private function isAlive(string $playerId): bool
    {
        try {
            $this->cache->get(
                "matchmaking.heartbeat.{$playerId}",
                function () {
                    throw new \Exception('expired');
                }
            );
            return true;
        } catch (\Exception) {
            return false;
        }
    }

    private function saveQueue(array $queue): void
    {
        $this->cache->delete(self::QUEUE_KEY);
        $this->cache->get(self::QUEUE_KEY, function (ItemInterface $item) use ($queue) {
            $item->expiresAfter(3600);
            return $queue;
        });
    }
}
