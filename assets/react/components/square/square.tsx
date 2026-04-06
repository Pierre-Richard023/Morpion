import React from "react"
import NinjaBlack from "../../utils/images/ninja-black.svg"
import NinjaRed from "../../utils/images/ninja-red.svg";

interface squareState {
    position: number
    value: 'red' | 'black' | null
    onCellClick: (index: number) => void
}

const Square = ({ position, value, onCellClick }: squareState) => {

    return (
        <>
            <div className={`aspect-square p-6 flex justify-center ${position <= 5 ? "border-b-6  border-gray-400" : ""}  ${position % 3 !== 2 ? "border-r-6 border-gray-400" : ""}`} onClick={() => onCellClick(position)}>
                {value != null && <img className="ninja-svg" src={value == "red" ? NinjaRed : NinjaBlack} alt={value} />}
            </div>
        </>
    )
}


export default Square