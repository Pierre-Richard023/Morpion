import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import NinjaBlack from "../../utils/images/ninja-black.svg"
import NinjaRed from "../../utils/images/ninja-red.svg";

const ScoreBoard = () => {


    const dispatch = useAppDispatch()
    const game = useAppSelector(state => state.game.data)

    const redPlayer = useAppSelector((state) => state.game.data?.playerRed);
    const blackPlayer = useAppSelector((state) => state.game.data?.playerBlack);
    const currentPlayer = useAppSelector((state) => state.game.data?.currentPlayer)
    // const { currentPlayer, timers, status, winner } = useAppSelector((state) => state.game);


    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="flex items-center justify-center  p-4">
                    <div className="flex items-center space-x-6 bg-gray-700 shadow rounded-full px-4 py-2">

                        <div className="flex items-center space-x-2">
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
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-sm font-semibold text-gray-300">
                                    {redPlayer?.username}
                                </span>
                                <span className={`text-xs ${currentPlayer === 'red' ? 'bg-secondary text-white ' : 'bg-gray-200 text-gray-800'} font-medium px-1.5 py-0.5 rounded`}   >
                                    60
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-400">
                            <div className="text-lg font-bold">
                                0
                            </div>
                            <div className="text-lg font-bold">
                                0
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-sm font-semibold text-gray-300">
                                    {blackPlayer?.username}
                                </span>
                                <span className={`text-xs ${currentPlayer === 'black' ? 'bg-secondary text-white ' : 'bg-gray-200 text-gray-800'} font-medium px-1.5 py-0.5 rounded`}   >
                                    60
                                </span>
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