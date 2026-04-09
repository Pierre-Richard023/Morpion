import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game } from "@/react/interface/all";
import api from "../../services/api";


interface MovePayload {
    gameId: string
    position: number
    playerId: string
}

interface GameState {
    data: Game | null
    loading: boolean
    error: string | null
}

const initialState: GameState = {
    data: null,
    loading: false,
    error: null,
}


export const fetchGame = createAsyncThunk<Game, string>(
    'game/fetch',
    async (gameId) => {
        const res = await api.get<Game>(`/games/${gameId}`)
        return res.data
    }
)

export const playMove = createAsyncThunk<Game, MovePayload>(
    'game/move',
    async ({ gameId, position, playerId }) => {
        const res = await api.post<Game>(`/games/${gameId}/move`, { position, playerId })
        return res.data
    }
)

export const abandonGame = createAsyncThunk<void, { gameId: string; playerId: string }>(
    'game/abandon',
    async ({ gameId, playerId }) => {
        await api.delete(`/games/${gameId}`, { data: { playerId } })
    }
)

export const requestRematch = createAsyncThunk<Game, { gameId: string; playerId: string }>(
    'game/rematch',
    async ({ gameId, playerId }) => {
        const res = await api.post<{ status: string; game: Game }>(
            `/games/${gameId}/rematch`, { playerId }
        )
        return res.data.game
    }
)

export const declineRematch = createAsyncThunk<void, { gameId: string; playerId: string }>(
    'game/declineRematch',
    async ({ gameId, playerId }) => {
        await api.delete(`/games/${gameId}/rematch`, {
            data: { playerId }
        })
    }
)

export const sendTimeout = createAsyncThunk<void, { gameId: string; playerId: string }>(
    'game/timeout',
    async ({ gameId, playerId }) => {
        await api.post(`/games/${gameId}/timeout`, { playerId })
    }
)



export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateGame: (state, action: PayloadAction<Game>) => {
            state.data = action.payload
        },
        clearGame: (state) => {
            state.data = null
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGame.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchGame.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchGame.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? 'Erreur'
            })
            .addCase(playMove.fulfilled, (state, action) => {
                state.data = action.payload
            })
            .addCase(playMove.rejected, (state, action) => {
                state.error = action.error.message ?? 'Coup invalide'
            })
            .addCase(abandonGame.fulfilled, (state) => {
                state.data = null
            })
            .addCase(requestRematch.fulfilled, (state, action) => {
                state.data = action.payload
            })
    },
})


export const { updateGame, clearGame } = gameSlice.actions

export default gameSlice.reducer