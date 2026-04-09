import { useEffect, useRef } from 'react'
import api from '../services/api'

export function useGameHeartbeat(gameId: string | null, playerId: string | null): void {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (!gameId || !playerId) return

        intervalRef.current = setInterval(() => {
            api.post(`/games/${gameId}/heartbeat`, { playerId }).catch(() => { })
        }, 5000)

        const handleUnload = () => {
            navigator.sendBeacon(
                `/api/games/${gameId}/leave`,
                new Blob([JSON.stringify({ playerId })], { type: 'application/json' })
            )
        }
        window.addEventListener('beforeunload', handleUnload)

        return () => {
            clearInterval(intervalRef.current!)
            window.removeEventListener('beforeunload', handleUnload)

            if (gameId && playerId) {
                navigator.sendBeacon(
                    `/api/games/${gameId}/leave`,
                    new Blob([JSON.stringify({ playerId })], { type: 'application/json' })
                )
            }
        }
    }, [gameId, playerId])
}