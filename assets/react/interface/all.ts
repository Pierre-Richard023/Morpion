export type Symbol = 'red' | 'black'
export type GameStatus = 'waiting' | 'playing' | 'finished'
export type Winner = Symbol | 'draw' | null
export type View = 'matchmaking' | 'game'

export interface Player {
    id: string
    username: string
    currentGameId: string | null
}

export interface Game {
    id: string
    board: (Symbol | null)[] 
    status: GameStatus
    currentPlayer: Symbol
    winner: Winner
    playerRed: Player | null
    playerBlack: Player | null
    createdAt: number
}

export interface MercureGameEvent {
    type: 'game_start' | 'move_played' | 'player_left'
    game: Game
}


export type MatchmakingStatus = 'idle' | 'waiting' | 'matched'

export interface MatchmakingState {
    status: MatchmakingStatus
    waiting: number         
    gameId: string | null
}

export interface MercureMatchmakingEvent {
    type: 'match_found'
    gameId: string
    game: Game
}

export interface MercureCountEvent {
    waiting: number
}