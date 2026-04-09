import React from 'react'

interface PlayerClockProps {
    timeLeft: number
    isActive: boolean
    symbol: 'red' | 'black'
}

const PlayerClock = ({ timeLeft, isActive, symbol }: PlayerClockProps) => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

    const getTimeColor = () => {
        if (timeLeft <= 10) return 'text-rose-400'
        if (timeLeft <= 20) return 'text-yellow-400'
        return 'text-white'
    }

    const getBorderColor = () => {
        if (!isActive) return 'border-gray-800'
        if (symbol === 'red') return 'border-red-500'
        return 'border-gray-400'
    }

    return (
        <div className={` flex flex-col items-center gap-2 px-1 py-1 rounded-2xl bg-gray-900 border-2 transition-all duration-300 ${getBorderColor()} ${isActive ? 'shadow-lg' : 'opacity-60'} `}>
            <span className={`text-base font-black font-mono tabular-nums transition-colors ${getTimeColor()}`}>
                {display}
            </span>
        </div>
    )
}

export default PlayerClock