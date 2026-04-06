import React from "react"
import { Symbol } from "@/react/interface/all"
import Square from "../square/square"

interface BoardProps {
    board: (Symbol | null)[]
    onCellClick: (index: number) => void
}

const Board = ({ board, onCellClick }: BoardProps) => {

    return (
        <>
            <div className="grid grid-cols-3 grid-rows-3 w-full max-w-md aspect-square">
                {board.map((cell, index) => (
                    <Square key={index} position={index} value={cell} onCellClick={onCellClick} />
                ))}
            </div>

        </>
    )
}

export default Board