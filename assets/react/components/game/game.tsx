import React, { useEffect } from 'react'
import Board from '../board/board'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { useGameMercure } from '../../hooks/useMercure'
import { Symbol } from '../../interface/all'
import { abandonGame, clearGame, fetchGame, playMove } from '../../store/reducer/gameReducer'
import ScoreBoard from '../scoreBoard/scoreBoard'

interface GameProps {
    gameId: string
    onLeave: () => void
}

const Game = ({ gameId, onLeave }: GameProps) => {
    const dispatch = useAppDispatch()
    const game = useAppSelector(state => state.game.data)
    const error = useAppSelector(state => state.game.error)
    const player = useAppSelector(state => state.player.data)

    useEffect(() => {
        dispatch(fetchGame(gameId))
    }, [gameId, dispatch])

    useGameMercure(gameId)

    if (!game || !player) return (
        <>
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-white text-xl font-bold">Chargement de la partie...</p>
                </div>

                <div className="flex mt-2 gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </>
    )

    const mySymbol: Symbol = game.playerRed?.id === player?.id ? 'red' : 'black'
    const isMyTurn = game.currentPlayer === mySymbol && game.status === 'playing'

    const handleCellClick = (position: number) => {
        if (!isMyTurn || !player) return
        dispatch(playMove({ gameId, position, playerId: player.id }))
    }

    const handleAbandon = async () => {
        if (!player) return
        await dispatch(abandonGame({ gameId, playerId: player.id }))
        dispatch(clearGame())
        onLeave()
    }

    const getStatusMessage = (): string => {
        if (game.status === 'waiting') return 'En attente d\'un adversaire...'
        if (game.status === 'finished') {
            if (game.winner === 'draw') return ' Égalité !'
            if (game.winner === mySymbol) return 'Tu as gagné !'
            return 'Tu as perdu...'
        }
        return isMyTurn ? ' C\'est ton tour !' : ' Tour de l\'adversaire...'
    }



    return (

        <>
            <section className="min-h-screen container bg-gray-950 mx-auto p-4">
                <ScoreBoard />

                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">


                    <div className="w-full max-w-md mx-auto mb-6 text-center text-gray-300">
                        <p>{getStatusMessage()}</p>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>


                    <div className="flex flex-col items-center justify-center">
                        <Board
                            board={game.board}
                            onCellClick={handleCellClick}
                        />
                    </div>

                    <div className="mt-6">

                        {game.status === 'finished' && (
                            <button className="cursor-pointer flex items-center space-x-2 border border-gray-400 rounded px-3 py-1 text-sm text-gray-700 hover:bg-500-100"
                                onClick={() => { dispatch(clearGame()); onLeave() }}>
                                Retour au lobby
                            </button>
                        )}
                        {game.status !== 'finished' && (
                            <button className="cursor-pointer flex items-center space-x-2 border border-gray-400 rounded px-3 py-1 text-sm bg-gray-700  text-gray-300 hover:bg-gray-500"
                                onClick={handleAbandon}
                            >
                                <span>Abandonner</span>
                            </button>
                        )}
                    </div>

                </div>

            </section>


        </>
    )
}


export default Game