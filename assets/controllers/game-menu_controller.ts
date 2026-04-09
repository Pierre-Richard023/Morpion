import { Controller } from '@hotwired/stimulus'
import type { GameMode, Player, GAME_MODE_ROUTES } from '../types/player'

export default class GameMenuController extends Controller {

    static values = {
        playerId: String, 
    }

    declare playerIdValue: string

    static targets = ['playerBadge', 'playerName']

    declare playerBadgeTarget: HTMLElement
    declare playerNameTarget: HTMLElement

    static outlets = ['player-modal']

    declare playerModalOutlet: any 

    connect(): void {
        if (!this.playerIdValue) {
            const saved = localStorage.getItem('player')
            if (saved) {
                const player: Player = JSON.parse(saved)
                this.playerIdValue = player.id
                this.showPlayerBadge(player)
            }
        } else {
            const saved = localStorage.getItem('player')
            if (saved) this.showPlayerBadge(JSON.parse(saved))
        }
    }

    selectMode(event: Event): void {
        const btn = event.currentTarget as HTMLElement
        const mode = btn.dataset.gameMenuModeParam as GameMode

        if (!mode) return

        if (this.isLoggedIn()) {
            this.goToMode(mode)
        } else {
            this.playerModalOutlet.openForMode(mode)
        }
    }

    onPlayerCreated(player: Player, mode: GameMode): void {
        this.playerIdValue = player.id
        this.showPlayerBadge(player)
        this.goToMode(mode)
    }

    private isLoggedIn(): boolean {
        return !!this.playerIdValue
    }

    private goToMode(mode: GameMode): void {
        const routes: Record<GameMode, string> = {
            online: '/game/online',
            friend: '/game/friend',
            bot: '/game/bot',
        }
        window.location.href = routes[mode]
    }

    private showPlayerBadge(player: Player): void {
        this.playerNameTarget.textContent = player.username
        this.playerBadgeTarget.classList.remove('hidden')
        this.playerBadgeTarget.classList.add('flex')
    }
}