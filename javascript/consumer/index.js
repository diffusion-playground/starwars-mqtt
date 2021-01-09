import Mosquitto from './js/mqtt-clients/Mosquitto';
import Difussion from './js/mqtt-clients/Difussion';
import { animate } from './js/starwars';

class App {
    constructor() {
        this.client = this.getClient();
        this.client.connect();
    }

    getClient = () => {
        const isDifussion = this.getQueryStringParams().has('difussion') || !this.getQueryStringParams().has('mosquitto');
        if (isDifussion) {            
            console.log('Starting Difussion Client...');
            return new Difussion('StarWars', this.onConnected, this.onMessageReceived);
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
    }
}

new App();