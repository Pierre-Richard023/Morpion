
import React from "react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { checkWinner } from "../../services/checkWinner";
import { Board } from "@/react/interface/board";

interface GameState {
    status: 'waiting' | 'playing' | 'finished'
    currentPlayer: 'red' | 'black'
    value: 'red' | 'black'
    board: Board
    winner: 'red' | 'black' | null
    winnerReason: 'win' | 'timeout' | 'abandon' | 'draw' | null
    playable: boolean
    moves: number
    timers: {
        red: number
        black: number
    }
    replayRequests: {
        red: boolean
        black: boolean
    }
}

const initialState: GameState = {
    status: 'waiting',
    currentPlayer: 'red',
    value: "red",
    playable: true,
    timers: {
        red: 60,
        black: 60,
    },
    moves: 0,
    winner: null,
    winnerReason: null,
    replayRequests: {
        red: false,
        black: false,
    },
    board: [
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
        startGame: (state) => {
            state.status = 'playing';
            state.currentPlayer = Math.random() < 0.5 ? 'red' : 'black';
            state.winner = null;
            state.timers = { red: 60, black: 60 };
            for (let i = 0; i < state.board.length; i++) {
                state.board[i].value = null
            }
        },
        playMove: (state, action: PayloadAction<number>) => {

            if (state.playable) {
                const id = state.board.findIndex(obj => obj.position === action.payload)
                if (state.board[id].value == null) {
                    state.board[id].value = state.currentPlayer

                    const winner = checkWinner(state.board)

                    if (winner) {
                        state.winner = winner
                        state.playable = false
                        state.status = 'finished';
                        return
                    }
                    else
                        state.currentPlayer = state.currentPlayer === "red" ? "black" : "red"

                }

            }

        },
        reset: (state) => {

            for (let i = 0; i < state.board.length; i++) {
                state.board[i].value = null
            }
            state.moves = 0
            state.playable = true
            state.value = "red"
            state.winner = null

        },
        decrementTimer(state) {
            if (state.status !== 'playing') return;

            const current = state.currentPlayer;
            state.timers[current] -= 1;

            if (state.timers[current] <= 0) {
                state.timers[current] = 0;
                state.status = 'finished';
                state.winner = current === 'red' ? 'black' : 'red';
            }
        },
        playerAbandon(state, action: PayloadAction<'red' | 'black'>) {
            if (state.status !== 'playing') return;
            state.winner = action.payload === 'red' ? 'black' : 'red';
            state.winnerReason = 'abandon';
            state.status = 'finished';
        },
        requestReplay(state, action: PayloadAction<'red' | 'black'>) {
            state.replayRequests[action.payload] = true;
            if (state.replayRequests.red && state.replayRequests.black) {
                state.currentPlayer = Math.random() < 0.5 ? 'red' : 'black';
                state.winner = null;
                state.winnerReason = null;
                state.status = 'playing';
                state.replayRequests = { red: false, black: false };
                state.timers = { red: 60, black: 60 };
                for (let i = 0; i < state.board.length; i++) {
                    state.board[i].value = null
                }
            }
        },
    }
})


export const {
    startGame,
    playMove,
    reset, decrementTimer,
    playerAbandon,
    requestReplay
} = gameSlice.actions

export default gameSlice.reducer