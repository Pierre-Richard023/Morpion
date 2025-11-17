import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import NinjaBlack from "../../utils/images/ninja-black.svg"
import NinjaRed from "../../utils/images/ninja-red.svg";
import { decrementTimer } from "../../store/reducer/gameReducer";
import { addScore } from "../../store/reducer/playersReducer";

const ScoreBoard = () => {


    const dispatch = useAppDispatch()
    const redPlayer = useAppSelector((state) => state.players.red);
    const blackPlayer = useAppSelector((state) => state.players.black);
    const { currentPlayer, timers, status, winner } = useAppSelector((state) => state.game);

    useEffect(() => {
        if (status !== 'playing') return
        const timer = setInterval(() => {
            dispatch(decrementTimer());
        }, 1000);
        return () => clearInterval(timer);
    }, [dispatch, status, currentPlayer]);


    useEffect(() => {
        if (winner) dispatch(addScore(winner));
    }, [winner, dispatch]);

    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="flex items-center justify-center bg-gray-50 p-4">
                    <div className="flex items-center space-x-6 bg-white shadow rounded-full px-4 py-2">

                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <img
                                    src={NinjaRed}
                                    alt="Red Ninja avatar"
                                    className={`w-10 h-10 rounded-full border-2 ${currentPlayer === 'red' ? 'border-primary' : 'border-gray-700'} `}
                                />
                                {currentPlayer === 'red' &&
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>

                                }
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-sm font-semibold text-gray-800">
                                    {redPlayer?.name}
                                </span>
                                <span className={`text-xs ${currentPlayer === 'red' ? 'bg-primary text-white ' : 'bg-gray-200 text-gray-800'} font-medium px-1.5 py-0.5 rounded`}   >
                                    {timers.red === undefined ? '02:00' : `${Math.floor(timers.red / 60)}:${(timers.red % 60).toString().padStart(2, '0')}`}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-500">
                            <div className="text-lg font-bold">
                                {redPlayer?.score}
                            </div>
                            <div className="text-lg font-bold">
                                {blackPlayer?.score}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-sm font-semibold text-gray-800">
                                    {blackPlayer?.name}
                                </span>
                                <span className={`text-xs ${currentPlayer === 'black' ? 'bg-primary text-white ' : 'bg-gray-200 text-gray-800'} font-medium px-1.5 py-0.5 rounded`}   >
                                    {timers.black === undefined ? '02:00' : `${Math.floor(timers.black / 60)}:${(timers.black % 60).toString().padStart(2, '0')}`}
                                </span>
                            </div>
                            <div className="relative">
                                <img
                                    src={NinjaBlack}
                                    alt="Black Ninja avatar"
                                    className={`w-10 h-10 rounded-full border-2 ${currentPlayer === 'black' ? 'border-primary' : 'border-gray-700'} `}
                                />
                                {currentPlayer === 'black' &&
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>

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