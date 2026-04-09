import React from 'react'
import type { Game, Player } from '../../interface/all'



interface RematchPanelProps {
    game: Game
    myPlayer: Player
    mySymbol: 'red' | 'black'
    onRematch: () => void
    onDecline: () => void
    onLeave: () => void
}



const RematchPanel = ({ game, myPlayer, mySymbol, onRematch, onDecline, onLeave }: RematchPanelProps) => {

    const iHaveRequested = game.rematchRequests.includes(myPlayer.id)
    const adversaryRequested = game.rematchRequests.length > 0 && !iHaveRequested


    const getResultMessage = (): { text: string; color: string } => {
        if (game.finishReason === 'player_left' || game.finishReason === 'player_disconnected') {
            return game.winner === mySymbol
                ? { text: 'Adversaire déconnecté — tu gagnes !', color: 'text-emerald-400' }
                : { text: 'Tu as quitté la partie.', color: 'text-rose-400' }
        }
        if (game.winner === 'draw') return { text: 'Égalité !', color: 'text-yellow-400' }
        if (game.winner === mySymbol) return { text: 'Tu as gagné !', color: 'text-emerald-400' }
        return { text: 'Tu as perdu...', color: 'text-rose-400' }
    }

    const result = getResultMessage()


    return (
        <>
            <div className="flex flex-col items-center justify-center">

                <div className="flex flex-col items-center gap-6 p-6 bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm">

                    <p className={`text-xl font-black ${result.color}`}>{result.text}</p>

                    {adversaryRequested && !iHaveRequested && (
                        <div className="bg-indigo-950 border border-indigo-700 rounded-xl px-4 py-3 text-center">
                            <p className="text-indigo-300 text-sm">
                                Ton adversaire veut rejouer !
                            </p>
                        </div>
                    )}

                    {iHaveRequested && (
                        <div className="bg-gray-800 rounded-xl px-4 py-3 text-center">
                            <p className="text-gray-400 text-sm">
                                En attente de la réponse de l'adversaire...
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 w-full">

                        {!iHaveRequested && (
                            <button onClick={onRematch} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors duration-200" >
                                {adversaryRequested ? 'Oui !' : 'Rejouer'}
                            </button>
                        )}

                        {!iHaveRequested && (
                            <button onClick={onDecline} className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors duration-200" >
                                Refuser
                            </button>
                        )}

                        <button
                            onClick={onLeave}
                            className="w-full border border-gray-700 hover:border-rose-500 text-gray-500 hover:text-rose-400 font-medium py-2 rounded-xl transition-colors duration-200 text-sm" >
                            Quitter la partie
                        </button>

                    </div>
                </div>
                
            </ div>
        </>

    )
}



export default RematchPanel