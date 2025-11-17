import { createSlice } from "@reduxjs/toolkit";


interface PlayersState {

    connected: boolean;
    roomId: string | null;
    playersOnline: number;
}

const initialState: PlayersState = {
    connected: false,
    roomId: null,
    playersOnline: 0,
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {}
})


export const { } = sessionSlice.actions;
export default sessionSlice.reducer



