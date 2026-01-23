import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    connect() {
        const playerName = localStorage.getItem("player");
        if (!playerName) {
            window.location.href = "/";
            return;
        }

 
        // Envoie au serveur que le joueur est dans le lobby
        // fetch("/api/lobby/join", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ name: playerName })
        // });

        // this.listenRealTime();
    }

    listenRealTime() {
        const eventSource = new EventSource("/.well-known/mercure?topic=lobby");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Nouveau joueur ou match:", data);

            if (data.match && data.players.includes(localStorage.getItem("playerName"))) {
                window.location.href = `/match/${data.match}`;
            }
        };
    }
}
