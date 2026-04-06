export interface Player {
    id: string
    username: string
    currentGameId: string | null
}

export type GameMode = 'online' | 'friend' | 'bot'

export const GAME_MODE_ROUTES: Record<GameMode, string> = {
    online: '/game/online',
    friend: '/game/friend',
    bot: '/game/bot',
}