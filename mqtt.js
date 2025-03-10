// mqtt.js - Gestione connessione MQTT

const MQTT_BROKER = "ws://172.27.103.176:9002"; // WebSocket MQTT (assicurati che il broker supporti WebSocket)
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
        console.log(`📨 Messaggio ricevuto su ${topic}: ${message.toString()}`);
        
        // Verifica che l'elemento esista prima di modificarlo
        const contentDiv = document.getElementById('content');
        if (contentDiv) {
            contentDiv.innerHTML = `<p>Messaggio dal Beacon: ${message.toString()}</p>`;
        } else {
            console.error('Elemento con ID "content" non trovato');
        }
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
