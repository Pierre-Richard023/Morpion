import React, { useEffect, useState } from "react"
import Game from "../components/game/game"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { loadPlayer } from "../store/reducer/playersReducer"
import { View } from "../interface/all"
import { resetMatchmaking } from "../store/reducer/matchmakingReducer"
import Matchmaking from "../components/matchmaking/matchmaking"


const GameViews = () => {

    const dispatch = useAppDispatch()
    const player = useAppSelector(state => state.player.data)

    const [gameId, setGameId] = useState<string | null>(null)
    const [view, setView] = useState<View>('matchmaking')

    useEffect(() => {
        const savedId = localStorage.getItem('playerId')
        if (savedId) dispatch(loadPlayer(savedId))
    }, [dispatch])



    const handleMatchFound = (id: string) => {
        setGameId(id)
        setView('game')
    }

    const handleBackToSearch = () => {
        dispatch(resetMatchmaking())
        setGameId(null)
        setView('matchmaking')
    }


    if (!player) {
        return (
            <>
                <div className="min-h-screen bg-gray-950 flex items-center justify-center">

                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-4 border-secondary" />
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                            🎮
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {view === 'matchmaking' && (
                <Matchmaking
                    onMatchFound={handleMatchFound}
                    onCancel={() => window.location.href = '/'}
                />
            )}
            {view === 'game' && gameId && (
                <Game
                    gameId={gameId}
                    onLeave={handleBackToSearch}
                />
            )}
        </>
    )
}


export default GameViews