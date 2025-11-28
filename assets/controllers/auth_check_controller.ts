import { Controller } from "@hotwired/stimulus";

export default class extends Controller {


    static targets = ["modal", "playerName", "error"];
    static values = {
        mode: String,
        url: String
    };

    declare readonly modalTarget: HTMLElement;
    declare readonly playerNameTarget: HTMLInputElement;
    declare readonly errorTarget: HTMLElement;
    declare readonly modeValue: string;
    declare readonly urlValue: string;

    connect() {

    }


    checkAuth(event: Event) {
        event.preventDefault();


        const player = localStorage.getItem("player");

        if (!player) {
            this.showModal();
            return;
        }

        this.proceed();
    }

    savePlayer() {

        const name = this.playerNameTarget.value.trim();

        if (!name) {
            this.errorTarget.textContent = "Veuillez entrer un nom de joueur.";
            this.errorTarget.classList.remove("hidden");
            return;
        }

        localStorage.setItem("player", name);

        this.closeModal();
        this.proceed();
    }

    showModal() {
        this.modalTarget.classList.remove("hidden");
    }

    closeModal() {
        this.modalTarget.classList.add("hidden");
        this.clearError();

    }

    clearError() {
        this.errorTarget.textContent = "";
        this.errorTarget.classList.add("hidden");
    }

    proceed() { 
        if (this.urlValue) {
            window.location.href = this.urlValue;
        }
    }
}