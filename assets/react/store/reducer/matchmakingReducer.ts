import { Game, MatchmakingStatus } from '../../interface/all'
import api from '../../services/api'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface MatchmakingState {
  status:  MatchmakingStatus
  waiting: number
  gameId:  string | null
  game:    Game | null
  error:   string | null
}

const initialState: MatchmakingState = {
  status:  'idle',
  waiting: 0,
  gameId:  null,
  game:    null,
  error:   null,
}

// Rejoindre la file
export const joinMatchmaking = createAsyncThunk<
  { status: string; waiting?: number; gameId?: string; game?: Game },
  string  // playerId
>(
  'matchmaking/join',
  async (playerId) => {
    const res = await api.post('/matchmaking/join', { playerId })
    return res.data
  }
)

// Heartbeat (toutes les 5s)
export const sendHeartbeat = createAsyncThunk<
  { status: string; waiting?: number; gameId?: string; game?: Game },
  string  // playerId
>(
  'matchmaking/heartbeat',
  async (playerId) => {
    const res = await api.post('/matchmaking/heartbeat', { playerId })
    return res.data
  }
)

// Quitter la file
export const leaveMatchmaking = createAsyncThunk<void, string>(
  'matchmaking/leave',
  async (playerId) => {
    await api.delete('/matchmaking/leave', { data: { playerId } })
  }
)

const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    // Match trouvé via Mercure
    setMatched: (state, action: PayloadAction<{ gameId: string; game: Game }>) => {
      state.status = 'matched'
      state.gameId = action.payload.gameId
      state.game   = action.payload.game
    },
    // Mise à jour du compteur via Mercure
    setWaitingCount: (state, action: PayloadAction<number>) => {
      state.waiting = action.payload
    },
    resetMatchmaking: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Join
      .addCase(joinMatchmaking.fulfilled, (state, action) => {
        if (action.payload.status === 'matched' && action.payload.gameId) {
          state.status = 'matched'
          state.gameId = action.payload.gameId
          state.game   = action.payload.game ?? null
        } else {
          state.status  = 'waiting'
          state.waiting = action.payload.waiting ?? 1
        }
      })
      .addCase(joinMatchmaking.rejected, (state, action) => {
        state.error = action.error.message ?? 'Erreur'
      })

      // Heartbeat
      .addCase(sendHeartbeat.fulfilled, (state, action) => {
        if (action.payload.status === 'matched' && action.payload.gameId) {
          state.status = 'matched'
          state.gameId = action.payload.gameId
          state.game   = action.payload.game ?? null
        } else {
          state.waiting = action.payload.waiting ?? state.waiting
        }
      })

      // Leave
      .addCase(leaveMatchmaking.fulfilled, () => initialState)
  },
})

export const { setMatched, setWaitingCount, resetMatchmaking } = matchmakingSlice.actions
export default matchmakingSlice.reducer