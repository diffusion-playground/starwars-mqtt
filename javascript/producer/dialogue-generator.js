import DialogueReader from './DialogueReader.js';
import MosquittoMqtt from './mqtt-clients/MosquittoMqtt.js';
import Diffusion from './mqtt-clients/Diffusion.js';

class Main {    
    constructor() {
        console.log('Starting dialogue producer...');                
        this.dialogues = [];
        this.sendDialogInterval = null;
        this.client = this.getClient();
        this.client.connect();
    }    

    getClient = () => {
        const isDiffusion = this.getServerType() === 'diffusion' || !this.getServerType() === 'mosquitto';
        if (isDiffusion) {
            console.log('Starting Diffusion Client...');
            return new Diffusion('StarWars', this.onServerConnected);
        }
        console.log('Starting MQTT Client...');
        const useDiffusionServer = this.useDiffusion();
        return new MosquittoMqtt('StarWars', useDiffusionServer, this.onServerConnected);
    }

    getServerType = () => { 
        const args = process.argv.slice(2);
        return args[0]? args[0] : 'diffusion'; //By default we connect to difussion
    }

    useDiffusion = () => {
        const args = process.argv.slice(2);
        return args[1] && args[1] == 'useDiffusionServer' ? true : false; //By default we connect to difussion
    }

    isBytesTesting = () => {
        const args = process.argv.slice(2);
        for (const arg of args) {
            if (arg === 'bytesTest') {
                return true;
            }
        }
        return false;
    }

    /**
     * This function is the callback that's called when the connection to the MQTT server succeded
     */
    onServerConnected = () => {
        console.log('Beginning Transmission. Stick to the right side of the Force');
        this.dialogueReader = new DialogueReader(
            {
                onLineCallback: dialogue => this.storeDialogue(dialogue),
                onCloseCallback: () => this.onFinishedReadingDialogueFile(),
                bytesTest: this.isBytesTesting()
            }
        );
        this.dialogueReader.readFile('./dialogues/episode_iv');
    }

    /**
     * When a Line of the file was read, this callback is called.
     * This function sends the message to the MQTT server, using the client previusly instanciated.
     * @param {*} dialogLine The dialog object from the DialogReader
     */
    storeDialogue = dialogLine => { 
        this.dialogues.unshift(dialogLine);
    }

    
    sendDialogueLines = () => {
        this.sendDialogInterval = setInterval(() => {
            let line = this.dialogues.pop();
            if (line) {
                this.client.sendDialogue(line)                
            } else {
                clearInterval(this.sendDialogInterval);
                console.log('Dialog file read. Ending Transmission. May the Force Be With you...');
            }
         }, 2000); 
    }

    /**
     * This callback function is called when the DialogReader has finished reading the while dialogues file.
     */
    onFinishedReadingDialogueFile = () => {
        this.sendDialogueLines();        
    }

}

const main = new Main();