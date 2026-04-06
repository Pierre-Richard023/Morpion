import { useEffect, useRef } from 'react'
import { useAppDispatch } from './reduxHooks'
import { MercureGameEvent, MercureMatchmakingEvent, MercureCountEvent } from '../interface/all'
import { updateGame } from '../store/reducer/gameReducer'
import { MERCURE_URL } from '../utils/variables'
import { setMatched, setWaitingCount } from '../store/reducer/matchmakingReducer'




export function useGameMercure(gameId: string | null): void {
    const dispatch = useAppDispatch()
    const esRef = useRef<EventSource | null>(null)

    useEffect(() => {
        if (!gameId) return

        const url = new URL(MERCURE_URL)
        url.searchParams.append('topic', `game/${gameId}`)

        esRef.current = new EventSource(url.toString(), { withCredentials: true })

        esRef.current.onmessage = (event: MessageEvent) => {
            const data: MercureGameEvent = JSON.parse(event.data as string)
            if (data.game) {
                dispatch(updateGame(data.game))
            }
        }

        esRef.current.onerror = () => {
            console.error('[Mercure] Erreur de connexion à la partie')
        }

        return () => {
            esRef.current?.close()
            esRef.current = null
        }
    }, [gameId, dispatch])
}



export function useMatchmakingMercure(playerId: string | null): void {
    const dispatch = useAppDispatch()
    const esRef = useRef<EventSource | null>(null)

    useEffect(() => {
        if (!playerId) return

        const url = new URL(MERCURE_URL)
        // Topic privé : seulement ce joueur reçoit "match_found"
        url.searchParams.append('topic', `matchmaking.${playerId}`)
        // Topic public : compteur de joueurs en attente
        url.searchParams.append('topic', 'matchmaking.count')

        esRef.current = new EventSource(url.toString())

        esRef.current.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data as string)

            // Match trouvé → rediriger vers la partie
            if (data.type === 'match_found') {
                const payload = data as MercureMatchmakingEvent
                dispatch(setMatched({ gameId: payload.gameId, game: payload.game }))
            }

            // Mise à jour du compteur
            if ('waiting' in data) {
                const payload = data as MercureCountEvent
                dispatch(setWaitingCount(payload.waiting))
            }
        }

        esRef.current.onerror = () => {
            console.error('[Mercure] Erreur matchmaking')
        }

        return () => {
            esRef.current?.close()
            esRef.current = null
        }
    }, [playerId, dispatch])
}