import React, { useEffect, useRef } from 'react'
import { useMatchmakingMercure } from '../../hooks/useMercure'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { joinMatchmaking, leaveMatchmaking, sendHeartbeat, resetMatchmaking } from '../../store/reducer/matchmakingReducer'


interface MatchmakingProps {
    onMatchFound: (gameId: string) => void
    onCancel: () => void
}

export default function Matchmaking({ onMatchFound, onCancel }: MatchmakingProps) {
    const dispatch = useAppDispatch()
    const player = useAppSelector(state => state.player.data)
    const matchmaking = useAppSelector(state => state.matchmaking)

    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useMatchmakingMercure(player?.id ?? null)

    useEffect(() => {
        if (!player) return
        dispatch(joinMatchmaking(player.id))

        heartbeatRef.current = setInterval(() => {
            dispatch(sendHeartbeat(player.id))
        }, 5000)

        const handleUnload = () => {
            navigator.sendBeacon(
                '/api/matchmaking/leave',
                JSON.stringify({ playerId: player.id })
            )
        }
        window.addEventListener('beforeunload', handleUnload)

        return () => {
            clearInterval(heartbeatRef.current!)
            window.removeEventListener('beforeunload', handleUnload)
            dispatch(leaveMatchmaking(player.id))
        }
    }, [player, dispatch])

    useEffect(() => {
        if (matchmaking.status === 'matched' && matchmaking.gameId) {
            clearInterval(heartbeatRef.current!)
            onMatchFound(matchmaking.gameId)
        }
    }, [matchmaking.status, matchmaking.gameId, onMatchFound])

    const handleCancel = () => {
        if (!player) return
        clearInterval(heartbeatRef.current!)
        dispatch(leaveMatchmaking(player.id)).then(() => {
            dispatch(resetMatchmaking())
            onCancel()
        })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 gap-8">

            <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    🎮
                </div>
            </div>

            <div className="text-center space-y-2">
                <p className="text-white text-xl font-bold">Recherche d'un adversaire...</p>
                <p className="text-gray-400 text-sm">
                    {matchmaking.waiting <= 1
                        ? 'Tu es le seul en attente pour le moment'
                        : `${matchmaking.waiting} joueurs en attente`
                    }
                </p>
            </div>

            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>

            <button
                onClick={handleCancel}
                className="cursor-pointer px-6 py-2 rounded-xl border border-gray-700 text-gray-400 hover:border-rose-500 hover:text-rose-400 transition-colors duration-200" >
                Annuler la recherche
            </button>

        </div>
    )
}