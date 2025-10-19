import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {checkIfSomeoneWin, reset } from "../store/reducer/gameReducer";


import NinjaBlack from "../utils/images/ninja-black.svg"
import NinjaRed from "../utils/images/ninja-red.svg";
import Board from "../components/board/board";




const GameViews = () => {


    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.game.mode);
    const square = useAppSelector((state) => state.game.squarePosition);
    const winner = useAppSelector((state) => state.game.winner);
    const value = useAppSelector((state) => state.game.value);
    const playable = useAppSelector((state) => state.game.playable);


    
    useEffect(() => {
        dispatch(checkIfSomeoneWin());
    }, [square]);


    return (
        <>
            <section className="">
                <div className="container flex flex-col justify-center p-4 mx-auto md:p-8">
                    <h2 className="mb-12 text-4xl font-bold leading-none text-center sm:text-5xl">
                        Morpion en ligne
                    </h2>
                    <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 divide-gray-300">
                        <div className="">

                            <div className="">
                                {
                                    winner == null && playable &&
                                    <div className="flex align-center my-4 gap-2">
                                        <p>Joueur : </p>
                                        <img className="w-8 h-8" src={value == "red" ? NinjaRed : NinjaBlack}
                                            alt={value} />
                                    </div>
                                }
                                {!playable &&
                                    <div className="">
                                        {
                                            winner == null &&
                                            <p> Match nul !!</p>
                                        }
                                        {
                                            winner != null &&
                                            <>
                                                <img className="w-12 h-12"
                                                    src={winner == "red" ? NinjaRed : NinjaBlack}
                                                    alt={value} />
                                                <span>à gagné </span>
                                            </>
                                        }

                                    </div>}
                            </div>
                        </div>

                        <Board />


                        <div className="">

                            <button type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2focus:outline-none"
                                onClick={() => dispatch(reset())}

                            >
                                Rejouer
                            </button>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


export default GameViews