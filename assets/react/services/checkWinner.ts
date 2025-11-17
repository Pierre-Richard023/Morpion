import { Board } from "../interface/board";


export const checkWinner = (board: Board): 'red' | 'black' | null => {

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let [a, b, c] of winConditions) {
        if (board[a].value && board[a].value === board[b].value && board[a].value === board[c].value) {
            return board[a].value;
        }
    }


    return null
}
