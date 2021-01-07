import mqtt from 'mqtt';

export default class Mosquitto {    
    constructor(topic, onConnectedCallback) {        
        this.topic = topic;
        this.client = null;
        this.onConnectedCallback = onConnectedCallback;
    }

    connect = (serverUrl, params = null) => {        
        if (params) {
            this.client = mqtt.connect(serverUrl, params);    
        } else {
            this.client = mqtt.connect(serverUrl);
        }
        this.client.on('error', this.onConnectError);
        this.client.on('connect', this.onConnect);
        this.client.on('message', this.onReceivedDialogue);
    }

    onConnectError = (error) => {
        console.log(error);
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
        dialogueLine.time = new Date(); // Sets the time the message is sent
        console.log(dialogueLine);
        this.client.publish(this.topic, JSON.stringify(dialogueLine), {
            properties: {
                contentType: "JSON"
            }
        });
    }

    onReceivedDialogue = (topic, message) => {        
        let receivedMessage = JSON.parse(message);
        receivedMessage.recievedTime = new Date();
        console.log('RECEIVED MESSAGE: ', receivedMessage);
    }
}