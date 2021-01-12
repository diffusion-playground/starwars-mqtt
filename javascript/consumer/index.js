import Mosquitto from './js/mqtt-clients/Mosquitto';
import Diffusion from './js/mqtt-clients/Diffusion';
import { animate } from './js/starwars';

class App {
    constructor() {
        this.client = this.getClient();
        this.client.connect();
        this.scrollEl = document.querySelector('#scrollText');
    }

    getClient = () => {
        const isDiffusion = this.getQueryStringParams().has('diffusion') || !this.getQueryStringParams().has('mosquitto');
        if (isDiffusion) {            
            console.log('Starting Diffusion Client...');
            return new Diffusion('StarWars', this.onConnected, this.onMessageReceived);
        }
        console.log('Starting MQTT Client...');
        const useDiffusionServer = this.getQueryStringParams().has('useDiffusionServer');
        return new Mosquitto('StarWars', useDiffusionServer, this.onConnected, this.onMessageReceived);
    }

    getQueryStringParams = () => {
        return new URLSearchParams(window.location.search);
    }

    onConnected = () => { 
        console.log('Connected, I have');
        animate(); // From starwars.js
    }

    onMessageReceived = (message) => { 
        console.log(message);
        if (this.scrollEl) {
            let newLine = document.createElement('p');
            newLine.innerHTML = `<span class="character">${message.character}: </span>${message.text}`;
            let newParagraph = document.createElement('div');
            newParagraph.className = 'history text_history animation_history';
            newParagraph.append(newLine);
            this.scrollEl.append(newParagraph);
        }

    }
}

new App();