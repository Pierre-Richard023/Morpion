// src/hooks/useChronos.ts
import { useState, useEffect, useRef } from 'react'
import type { Game } from '../interface/all'
import { sendTimeout } from '../store/reducer/gameReducer'
import { useAppDispatch } from './reduxHooks'

interface ChronosResult {
    redTime: number
    blackTime: number
}

export function useChronos(game: Game | null, playerId: string | null): ChronosResult {


    const dispatch = useAppDispatch()
    const [redTime, setRedTime] = useState<number>(60)
    const [blackTime, setBlackTime] = useState<number>(60)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const timeoutSentRef = useRef<boolean>(false)

    useEffect(() => {
        if (!game) return

        setRedTime(game.timeLeft.red)
        setBlackTime(game.timeLeft.black)
        timeoutSentRef.current = false

        if (game.status !== 'playing') {
            clearInterval(intervalRef.current!)
            return
        }

        const elapsed = Math.floor(Date.now() / 1000) - game.lastMoveAt
        const current = game.currentPlayer

        const isMyTurn = current === 'red'
            ? game.playerRed?.id === playerId
            : game.playerBlack?.id === playerId

        let startTime = current === 'red'
            ? Math.max(0, game.timeLeft.red - elapsed)
            : Math.max(0, game.timeLeft.black - elapsed)


        if (current === 'red')
            setRedTime(Math.max(0, game.timeLeft.red - elapsed))
        else
            setBlackTime(Math.max(0, game.timeLeft.black - elapsed))

        clearInterval(intervalRef.current!)

        intervalRef.current = setInterval(() => {
            startTime = Math.max(0, startTime - 1)
            if (current === 'red') setRedTime(startTime)
            else setBlackTime(startTime)

            if (startTime === 0 && isMyTurn && !timeoutSentRef.current && playerId) {
                timeoutSentRef.current = true
                clearInterval(intervalRef.current!)
                dispatch(sendTimeout({ gameId: game.id, playerId }))
            }
        }, 1000)

        return () => clearInterval(intervalRef.current!)

    }, [game?.currentPlayer, game?.status, game?.lastMoveAt])

    return { redTime, blackTime }
}