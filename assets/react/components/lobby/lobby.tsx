import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchLobby, createGame, joinGame } from '../../store/reducer/lobbyReducer'
import { useLobbyMercure } from '../../hooks/useMercure'
import { Game } from '@/react/interface/all'


interface LobbyProps {
    onGameJoined: (gameId: string) => void
}



const Lobby = ({ onGameJoined }: LobbyProps) => {
    const dispatch = useAppDispatch()
    const games = useAppSelector(state => state.lobby.games)
    const loading = useAppSelector(state => state.lobby.loading)
    const player = useAppSelector(state => state.player.data)

    useEffect(() => {
        dispatch(fetchLobby())
    }, [dispatch])

    // Écoute les mises à jour en temps réel
    useLobbyMercure()

    const handleCreate = async () => {
        if (!player) return
        const result = await dispatch(createGame(player.id))
        if (createGame.fulfilled.match(result)) {
            onGameJoined(result.payload.id)
        }
    }

    const handleJoin = async (gameId: string) => {
        if (!player) return
        const result = await dispatch(joinGame({ gameId, playerId: player.id }))
        if (joinGame.fulfilled.match(result)) {
            onGameJoined(result.payload.id)
        }
    }

    return (
        <div className="lobby">
            <h2>Lobby</h2>

            <button onClick={handleCreate} disabled={loading}>
                ➕ Créer une partie
            </button>

            <h3>Parties disponibles ({games.length})</h3>

            {loading && <p>Chargement...</p>}

            {!loading && games.length === 0 && (
                <p>Aucune partie en attente. Crée la première !</p>
            )}

            <ul>
                {games.map((game: Game) => (
                    <li key={game.id}>
                        <span>🎮 {game.playerRed?.username} attend...</span>
                        {game.playerRed?.id !== player?.id && (
                            <button onClick={() => handleJoin(game.id)}>
                                Rejoindre
                            </button>
                        )}
                        {game.playerRed?.id === player?.id && (
                            <span> (ta partie)</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Lobby