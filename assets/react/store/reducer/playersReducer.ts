import { Player } from "@/react/interface/player";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PlayersState {
    red: Player | null;
    black: Player | null;
}

const initialState: PlayersState = {
    red: {
        id: '1',
        name: 'Red Player',
        color: 'red',
        score: 0,
    },
    black: {
        id: '2',
        name: 'Black Player',
        color: 'black',
        score: 0,
    },
}

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayerName(state, action) {

        },
        addScore(state, action: PayloadAction<'red' | 'black'>) {

            if (action.payload === 'red')
                state.red!.score += 1;
            else
                state.black!.score += 1;

        },
        resetScores(state) {
        },
    }
})


export const { setPlayerName, addScore, resetScores } = playersSlice.actions;
export default playersSlice.reducer



