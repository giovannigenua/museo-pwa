let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    // Previeni la visualizzazione automatica del prompt di installazione
    event.preventDefault();
    deferredPrompt = event;

    // Mostra il pulsante di installazione
    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';

    // Gestisci il clic sul pulsante di installazione
    installButton.addEventListener('click', () => {
        // Mostra il prompt di installazione
        deferredPrompt.prompt();

        // Attendi la scelta dell'utente
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('L\'utente ha accettato l\'installazione');
            } else {
                console.log('L\'utente ha rifiutato l\'installazione');
            }

            // Resetta la variabile deferredPrompt
            deferredPrompt = null;
        });
    });
});

// mqtt.js - Gestione connessione MQTT

const MQTT_BROKER = "ws://172.18.0.6:9001"; // WebSocket MQTT (assicurati che il broker supporti WebSocket)
const MQTT_USERNAME = "mqqt-user";
const MQTT_PASSWORD = "gegenua85";
const MQTT_TOPIC = "test/museo";

let client;

function connectMQTT() {
    client = mqtt.connect(MQTT_BROKER, {
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD
    });

    client.on("connect", () => {
        console.log("MQTT connesso");
        client.subscribe(MQTT_TOPIC, (err) => {
            if (!err) {
                console.log(`Iscritto al topic: ${MQTT_TOPIC}`);
            }
        });
    });

    client.on("message", (topic, message) => {
        console.log(`Messaggio ricevuto su ${topic}: ${message.toString()}`);
        document.getElementById("mqttMessages").innerHTML += `<p>${message.toString()}</p>`;
    });

    client.on("error", (error) => {
        console.error("Errore MQTT:", error);
    });
}

function sendMQTTMessage() {
    const message = "Messaggio di test dal client";
    client.publish(MQTT_TOPIC, message);
    console.log("Messaggio inviato:", message);
}

// Avvia la connessione MQTT quando la pagina è caricata
document.addEventListener("DOMContentLoaded", connectMQTT);
