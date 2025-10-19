import React from "react"
import { Position } from "../../interface/position"
import { useAppDispatch } from "../../hooks/reduxHooks"
import { play } from "../../store/reducer/gameReducer"
import NinjaBlack from "../../utils/images/ninja-black.svg"
import NinjaRed from "../../utils/images/ninja-red.svg";

interface squareState {
    position: Position
}

const Square = ({ position }: squareState) => {



    const dispatch = useAppDispatch()

    const handleClick = () => {
        dispatch(play(position.position))
    }

    return (
        <>
            <div className="border-2 border-slate-900 aspect-square p-6 flex justify-center " onClick={handleClick}>
                {position.value != null &&
                    <img className="ninja-svg" src={position.value == "red" ? NinjaRed : NinjaBlack}
                        alt={position.value} />}
            </div>
        </>
    )
}


export default Square