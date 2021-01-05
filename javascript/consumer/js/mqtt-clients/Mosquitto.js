export default class Mosquitto {    
    constructor(topic, onConnectedCallback) {        
        this.topic = topic;
        this.client = null;
        this.onConnectedCallback = onConnectedCallback;
    }

    connect = () => {        
        let mqtt = require('mqtt');
        this.client = mqtt.connect('ws://test.mosquitto.org:8081');        
        this.client.on('error', this.onConnectError);
        this.client.on('connect', this.onConnect);
        this.client.on('message', this.onReceivedDialogue);
    }

    onConnectError = (error) => {
        console.log('MQTT error: ', error);
    };

    onConnect = () => {
        this.subscribe();
    }

    subscribe = () => { 
        console.log('this.topic: ', this.topic);
        this.client.subscribe(this.topic, (err) => {            
            if (!err) {
                this.onConnectedCallback();
                this.sendDialogue({
                    character: 'NARRATOR',
                    text: 'This is StarWars Dialogues'
                });
            } else {
                console.log(err);
            }
        })
    }    

    // Interface Functions
    sendDialogue(dialogueLine) {
        console.log(dialogueLine);
        this.client.publish(this.topic, JSON.stringify(dialogueLine));
    }

    onReceivedDialogue = (topic, message) => {        
        console.log('INCOMMING MESSAGE: ', JSON.parse(message));
    }
}