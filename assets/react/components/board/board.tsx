import React from "react"
import { useAppSelector } from "../../hooks/reduxHooks"
import Square from "../square/square"




const Board = () => {


        const square = useAppSelector((state) => state.game.board)


    return (
        <>
            <div className="grid grid-cols-3 grid-rows-3 w-full max-w-md aspect-square">
                {
                    square.map((obj, index) => (
                        <Square key={index} position={obj} />
                    ))
                }
            </div>

        </>
    )
}

export default Board