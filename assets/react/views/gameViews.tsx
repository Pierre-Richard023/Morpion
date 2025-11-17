import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { playerAbandon, requestReplay, reset, startGame } from "../store/reducer/gameReducer";

import Board from "../components/board/board";
import ScoreBoard from "../components/scoreBoard/scoreBoard";
import ResultModal from "../components/resultModal/resultModal";




const GameViews = () => {

    const dispatch = useAppDispatch()
    const { status, winner, winnerReason, currentPlayer } = useAppSelector((state) => state.game);
    const [toastMessage, setToastMessage] = useState<string>('');

    useEffect(() => {
        dispatch(startGame());
    }, []);


    const handleReplay = () => dispatch(requestReplay(currentPlayer))
    const handleAbandon = () => dispatch(playerAbandon(currentPlayer))
    const handleModalClose = () => {
        setToastMessage('');
    }
    const handleLeave = () => {

    }



    useEffect(() => {
        if (status === 'finished') {
            let msg = '';
            if (winnerReason === 'draw') msg = 'Match nul !';
            else if (winner) msg = ` Joueur ${winner} a gagné !`;
            setToastMessage(msg);
        }
    }, [status, winner, winnerReason]);



    return (
        <>
            <div className="container mx-auto p-4">
                <ScoreBoard />

                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">


                    {status === 'finished' && (
                        <ResultModal
                            message={toastMessage}
                            onClose={handleModalClose}
                        />
                    )}

                    {
                        status === 'playing' &&
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <Board />
                            </div>

                            <div className="mt-6">
                                <button className="flex items-center space-x-2 border border-gray-400 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={handleAbandon}
                                >
                                    <span>Abandonner</span>
                                </button>
                            </div>
                        </>
                    }

                    {status === 'finished' &&
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <div className="space-x-2 mt-4">
                                    <button onClick={handleReplay} className="px-4 py-2 bg-primary text-white rounded-lg">
                                        rejouer
                                    </button>
                                    <button onClick={handleLeave} className="px-4 py-2 bg-secondary text-white rounded-lg">
                                        quitter la salle
                                    </button>
                                </div>
                            </div>
                        </>
                    }


                </div>
            </div>
        </>
    )
}


export default GameViews