import { Controller } from '@hotwired/stimulus';



export default class extends Controller {

    connect() {

        console.log('fonctionne')
    }


    play()
    {
        console.log('check play')
    }
}