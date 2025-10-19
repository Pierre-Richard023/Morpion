
import React from "react";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Position} from "../../interface/position";

interface GameState {
    mode: "Friend" | "Bot" | "Online" | null
    value: 'red' | 'black'
    squarePosition: Position[]
    winner: 'red' | 'black' | null
    playable: boolean
    moves: number
}

const initialState: GameState = {
    mode: null,
    value: "red",
    playable: true,
    moves: 0,
    winner: null,
    squarePosition: [
        {
            position: 1,
            value: null
        },
        {
            position: 2,
            value: null
        },
        {
            position: 3,
            value: null
        },
        {
            position: 4,
            value: null
        },
        {
            position: 5,
            value: null
        },
        {
            position: 6,
            value: null
        },
        {
            position: 7,
            value: null
        },
        {
            position: 8,
            value: null
        },
        {
            position: 9,
            value: null
        },
    ]
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {

        chooseMode: (state, action: PayloadAction<"Friend" | "Bot" | "Online">) => {
            state.mode = action.payload
        },
        play: (state, action: PayloadAction<number>) => {

            if (state.playable) {
                const id = state.squarePosition.findIndex(obj => obj.position === action.payload)
                if (state.squarePosition[id].value == null) {
                    state.squarePosition[id].value = state.value
                    state.value = state.value === "red" ? "black" : "red"

                    if (state.moves < 8)
                        state.moves += 1
                    else
                        state.playable = false
                }

            }

        },
        reset: (state) => {

            for (let i = 0; i < state.squarePosition.length; i++) {
                state.squarePosition[i].value = null
            }
            state.moves = 0
            state.playable = true
            state.value = "red"
            state.winner = null

        },
        checkIfSomeoneWin: (state) => {

            const winConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ];


            for (let i = 0; i < winConditions.length; i++) {

                const [a, b, c] = winConditions[i]
                if (state.squarePosition[a].value != null && state.squarePosition[a].value == state.squarePosition[b].value && state.squarePosition[b].value == state.squarePosition[c].value) {
                    state.playable = false
                    state.winner = state.squarePosition[a].value
                    return
                }

            }


        },
    }
})


export const {
    play, checkIfSomeoneWin, reset,
    chooseMode
} = gameSlice.actions

export default gameSlice.reducer