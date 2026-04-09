import React from "react";
import NinjaBlack from "../../utils/images/ninja-black.svg"
import NinjaRed from "../../utils/images/ninja-red.svg";
import type { Score, Player } from '../../interface/all'
import PlayerClock from '../playerClock/playerClock'

interface ScoreBoardProps {
    score: Score
    playerRed: Player | null
    redTime: number
    playerBlack: Player | null
    blackTime: number
    roundNumber: number
    currentPlayer: 'red' | 'black'
    gameStatus: 'waiting' | 'playing' | 'finished'
}


const ScoreBoard = ({ score, playerRed, redTime, playerBlack, blackTime, roundNumber, currentPlayer, gameStatus }: ScoreBoardProps) => {


    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="flex items-center justify-center  p-4">
                    <div className="flex items-center gap-4 bg-gray-700 shadow rounded-full px-4 py-2">

                        <div className="flex items-center py-2 px-1.5 gap-4">
                            <div className="relative">
                                <img
                                    src={NinjaRed}
                                    alt="Red Ninja avatar"
                                    className={`w-10 h-10 rounded-full border-2 bg-gray-400 ${currentPlayer === 'red' ? 'border-secondary' : 'border-gray-700'} `}
                                />
                                {currentPlayer === 'red' &&
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white"></div>

                                }
                            </div>
                            <div className="flex flex-col gap-y-1.5 items-center leading-none">
                                <span className="text-sm font-semibold text-gray-300">
                                    {playerRed?.username}
                                </span>
                                <PlayerClock
                                    timeLeft={redTime}
                                    isActive={gameStatus === 'playing' && currentPlayer === 'red'}
                                    symbol="red"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2.5 text-gray-400">

                            <span className="text-xs font-bold uppercase tracking-widest">
                                Manche {roundNumber}
                            </span>
                            <div className="flex  items-center  gap-x-2.5">
                                <div className="text-lg font-bold">
                                    {score.red}
                                </div>
                                <div className="text-lg font-bold">
                                    {score.black}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center py-2 px-1.5 gap-4">
                            <div className="flex flex-col gap-y-1.5 items-center leading-none">
                                <span className="text-sm font-semibold text-gray-300">
                                    {playerBlack?.username}
                                </span>
                                <PlayerClock
                                    timeLeft={blackTime}
                                    isActive={gameStatus === 'playing' && currentPlayer === 'black'}
                                    symbol="black"
                                />
                            </div>
                            <div className="relative">
                                <img
                                    src={NinjaBlack}
                                    alt="Black Ninja avatar"
                                    className={`w-10 h-10 rounded-full border-2 bg-gray-400 ${currentPlayer === 'black' ? 'border-secondary' : 'border-gray-700'} `}
                                />
                                {currentPlayer === 'black' &&
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white"></div>

                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )

}
export default ScoreBoard