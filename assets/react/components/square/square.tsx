import React from "react"
import { Position } from "../../interface/position"
import { useAppDispatch } from "../../hooks/reduxHooks"
import { playMove } from "../../store/reducer/gameReducer"
import NinjaBlack from "../../utils/images/ninja-black.svg"
import NinjaRed from "../../utils/images/ninja-red.svg";

interface squareState {
    position: Position
}

const Square = ({ position }: squareState) => {



    const dispatch = useAppDispatch()

    const handleClick = () => {
        dispatch(playMove(position.position))
    }

    return (
        <>
            <div className={`aspect-square p-6 flex justify-center ${position.position <= 6 ? "border-b-6" : ""}  ${position.position % 3 !== 0 ? "border-r-6" : ""}`} onClick={handleClick}>
                {position.value != null &&
                    <img className="ninja-svg" src={position.value == "red" ? NinjaRed : NinjaBlack}
                        alt={position.value} />}
            </div>
        </>
    )
}


export default Square