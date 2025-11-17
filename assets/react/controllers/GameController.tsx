import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import GameViews from "../views/gameViews";
import ScoreBoard from "../components/scoreBoard/scoreBoard";


const GameController = () =>{

    return(
        <>
            <Provider store={store}>
                <GameViews />
            </Provider>        
        </>
    )
}



export default GameController

