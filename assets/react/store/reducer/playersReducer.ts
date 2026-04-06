import { Player } from "@/react/interface/all";
import api from "../../services/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PlayersState {
    data: Player | null
    loading: boolean
    error: string | null
}

const initialState: PlayersState = {
    data: null,
    loading: false,
    error: null,
}


export const loadPlayer = createAsyncThunk<Player, string>(
    'player/load',
    async (playerId) => {
        const res = await api.get<Player>(`/players/${playerId}`)
        return res.data
    }
)


export const playersSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<Player>) => {
            state.data = action.payload
        },
        clearPlayer: (state) => {
            state.data = null
            localStorage.removeItem('playerId')
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPlayer.fulfilled, (state, action: PayloadAction<Player | null>) => {
                state.data = action.payload
            })
            .addCase(loadPlayer.rejected, (state) => {
                localStorage.removeItem('playerId')
            })
    },
})


export const { setPlayer, clearPlayer } = playersSlice.actions;
export default playersSlice.reducer



