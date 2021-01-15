import mqtt from 'mqtt';

export default class MosquittoMqtt {    
    constructor(topic, useDiffusionSrv, onConnectedCallback) {        
        this.topic = topic;
        this.client = null;
        this.onConnectedCallback = onConnectedCallback;
        this.useDiffusionSrv = useDiffusionSrv;
    }

    connect = () => {                
        if (this.useDiffusionSrv) {
            console.log('Using MQTT with Diffusion server');
            this.client = mqtt.connect('ws://127.0.0.1:8086/diffusion', {
                protocolVersion: 5,
                username: 'admin',
                password: 'password'
            });
        } else {
            console.log('Using MQTT with Mosquitto server');
            this.client = mqtt.connect('ws://test.mosquitto.org:8081');
        }
        
        
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
                if (this.onConnectedCallback) {
                    this.onConnectedCallback();
                }                
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
        //console.log('INCOMMING MESSAGE: ', JSON.parse(message));
    }
}