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


    const handleReplay = () => {

        dispatch(requestReplay(currentPlayer))
        handleModalClose();

    }
    const handleAbandon = () => dispatch(playerAbandon(currentPlayer))
    const handleModalClose = () => {
        setToastMessage('');
    }
    const handleLeave = () => {
        window.location.replace("/");
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
                                <button className="cursor-pointer flex items-center space-x-2 border border-gray-400 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={handleAbandon}
                                >
                                    <span>Abandonner</span>
                                </button>
                            </div>
                        </>
                    }

                    {status === 'finished' &&
                        <>
                            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
                                <button onClick={handleReplay} type="button" className="cursor-pointer w-40 py-3 active:scale-95 transition text-sm text-white rounded-full bg-primary">
                                    <span className="mb-0.5">
                                        rejouer
                                    </span>
                                </button>
                                <button onClick={handleLeave} type="button" className="cursor-pointer w-40 py-3 active:scale-95 transition text-sm text-white rounded-full bg-secondary">
                                    <span className="mb-0.5">
                                        quitter la salle
                                    </span>
                                </button>
                            </div>
                        </>
                    }


                </div>
            </div>
        </>
    )
}


export default GameViews