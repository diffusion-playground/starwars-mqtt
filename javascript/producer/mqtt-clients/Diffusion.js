import diffusion from 'diffusion';

export default class Diffusion {
    constructor(topic, onConnectedCallback, onReceiveMessageCallback) {
        this.topic = topic;
        this.client = null;
        this.session = null;
        this.onConnectedCallback = onConnectedCallback;
        this.onReceiveMessageCallback = onReceiveMessageCallback
    }


    connect = () => {
        diffusion.connect({
            host: "127.0.0.1",
            port: 8086,
            principal : "admin",
            credentials: "password"
        }).then((session) => {
            this.session = session;
            this.session.topics.add(this.topic, diffusion.topics.TopicType.JSON);
            this.subscribe(this.session)
            this.onConnectedCallback()
        });
    }

    subscribe = (session) => { 
        session.addStream(
            this.topic,
            diffusion.datatypes.json()).on('value',
            this.onReceiveMessage    
        );

        session.select(this.topic);
    }

    onReceiveMessage = (topic, specification, newValue, oldValue) => {
        let message = newValue.get();
        message.receiveTime = new Date();
        if (this.onReceiveMessageCallback) {
            this.onReceiveMessageCallback(message);
        }        
    }

    // Interface Functions
    sendDialogue(dialogueLine) {
        console.log(dialogueLine);
        this.session.topicUpdate.set(this.topic, diffusion.datatypes.json(), dialogueLine);
    }
}