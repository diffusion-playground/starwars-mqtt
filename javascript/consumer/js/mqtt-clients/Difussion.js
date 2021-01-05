export default class Difussion {
    constructor(topic, onConnectedCallback, onReceiveMessageCallback) {
        this.topic = topic;
        this.client = null;
        this.onConnectedCallback = onConnectedCallback;
        this.onReceiveMessageCallback = onReceiveMessageCallback
    }


    connect = () => {
        diffusion.connect({
            host: "127.0.0.1",
            port: 8086,
            principal : "admin",
            credentials: "password"
        }).then( (session) => {
            session.topics.add(this.topic, diffusion.topics.TopicType.JSON);
            this.subscribe(session)
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
        this.onReceiveMessageCallback(newValue.get());
    }
}