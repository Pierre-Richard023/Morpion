import { Controller } from '@hotwired/stimulus'
import type { GameMode, Player } from '../types/player'

export default class PlayerModalController extends Controller {

    static values = {
        apiUrl: String, 
    }

    declare apiUrlValue: string
    static targets = ['backdrop', 'modal', 'input', 'error', 'submitBtn', 'btnText', 'btnLoader']

    declare backdropTarget: HTMLElement
    declare modalTarget: HTMLElement
    declare inputTarget: HTMLInputElement
    declare errorTarget: HTMLElement
    declare submitBtnTarget: HTMLButtonElement
    declare btnTextTarget: HTMLElement
    declare btnLoaderTarget: HTMLElement

    static outlets = ['game-menu']
    declare gameMenuOutlet: any
    private pendingMode: GameMode | null = null


    openForMode(mode: GameMode): void {
        this.pendingMode = mode
        this.open()
    }

    open(): void {
        this.backdropTarget.classList.remove('hidden')
        this.modalTarget.classList.remove('hidden')
        setTimeout(() => this.inputTarget.focus(), 50)
    }

    close(): void {
        this.backdropTarget.classList.add('hidden')
        this.modalTarget.classList.add('hidden')
        this.inputTarget.value = ''
        this.clearError()
        // this.pendingMode = null  
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') this.close()
        if (event.key === 'Enter') this.submit()
    }

    clearError(): void {
        this.errorTarget.classList.add('hidden')
        this.errorTarget.textContent = ''
    }

    async submit(): Promise<void> {
        const username = this.inputTarget.value.trim()

        if (!username) {
            this.showError('Merci de saisir un pseudo.')
            return
        }
        if (username.length < 2) {
            this.showError('Le pseudo doit faire au moins 2 caractères.')
            return
        }
        if (username.length > 20) {
            this.showError('Le pseudo ne peut pas dépasser 20 caractères.')
            return
        }

        this.setLoading(true)

        try {
            const response = await fetch(this.apiUrlValue, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            })

            if (!response.ok) {
                const err = await response.json() as { error?: string }
                this.showError(err.error ?? 'Une erreur est survenue.')
                return
            }

            const player: Player = await response.json() as Player
            localStorage.setItem('player', JSON.stringify(player))
            localStorage.setItem('playerId', player.id)

            this.close()

            console.log('Player created:2222')
            if (this.pendingMode) {
                this.gameMenuOutlet.onPlayerCreated(player, this.pendingMode)
            }

        } catch (e) {
            this.showError('Impossible de se connecter au serveur.')
        } finally {
            this.setLoading(false)
        }
    }


    private showError(message: string): void {
        this.errorTarget.textContent = message
        this.errorTarget.classList.remove('hidden')
        this.inputTarget.focus()
    }

    private setLoading(loading: boolean): void {
        this.submitBtnTarget.disabled = loading
        this.btnTextTarget.classList.toggle('hidden', loading)
        this.btnLoaderTarget.classList.toggle('hidden', !loading)
    }
}