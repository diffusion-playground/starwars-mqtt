import Mosquitto from './mqtt-clients/Mosquitto.js';
import DialogueReader from './DialogueReader.js';

class Main {    
    constructor() {
        console.log('Starting dialogue producer...');                
        this.dialogues = [];
        this.sendDialogInterval = null;
        this.client = new Mosquitto('StarWars', this.onServerConnected);
        this.connectToServer();
    }    

    getServerType = () => { 
        const args = process.argv.slice(2);
        return args[0]? args[0] : 'difussion'; //By default we connect to difussion
    }

    connectToServer = () => {
        if (this.getServerType() === 'difussion') {
            this.client.connect('tcp://localhost:8086', {
                protocolVersion: 5,
                username: 'admin',
                password: 'password'
            });
            return;
        }
        this.client.connect('tcp://test.mosquitto.org');
    }

    /**
     * This function is the callback that's called when the connection to the MQTT server succeded
     */
    onServerConnected = () => {
        console.log('Beginning Transmission. Stick to the right side of the Force');
        this.dialogueReader = new DialogueReader(
            {
                onLineCallback: dialogue => this.storeDialogue(dialogue),
                onCloseCallback: () => this.onFinishedReadingDialogueFile()
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
         }, 1000); 
    }

    /**
     * This callback function is called when the DialogReader has finished reading the while dialogues file.
     */
    onFinishedReadingDialogueFile = () => {
        this.sendDialogueLines();        
    }

}

const main = new Main();