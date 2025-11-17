import {configureStore} from '@reduxjs/toolkit'
import gameReducer from './reducer/gameReducer'
import playersReducer from './reducer/playersReducer'
import sessionReducer from './reducer/sessionReducer'


export const store = configureStore({
    reducer: {
        game: gameReducer,
        players: playersReducer,
        session: sessionReducer,
    }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store