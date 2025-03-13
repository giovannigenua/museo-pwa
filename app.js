let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log("L'utente ha accettato l'installazione");
            } else {
                console.log("L'utente ha rifiutato l'installazione");
            }
            deferredPrompt = null;
        });
    });
});

const MQTT_BROKER = "wss://79.41.31.251:8884"; // WebSocket MQTT
const MQTT_TOPIC = "test/museo";

// Mappa degli URL per ogni beacon
const urlMap = {
    "ACFD065EC3C011E39BBE1A514932AC01": "https://www.museofrigento.it/virtualtour/"
};

const client = mqtt.connect(MQTT_BROKER, {
    username: "mqtt_user",
    password: "gegenua85"
});

// Elementi HTML
const notificationDiv = document.getElementById("notification");
const openTourButton = document.getElementById("openTour");
const contentDiv = document.getElementById("content");

// Funzione per scansionare i beacon BLE specifici
function startBeaconScan() {
    navigator.bluetooth.requestDevice({
        filters: [{
            services: ['battery_service'], // Filtra per il servizio che i beacon BLE possono trasmettere
        }],
        optionalServices: []  // Puoi anche specificare altri servizi GATT opzionali se conosci quelli dei tuoi beacon
    })
    .then(device => {
        console.log("Dispositivo trovato: ", device);

        // Aggiungi un listener per gli advertising dei beacon
        device.addEventListener('advertisementreceived', event => {
            const rssi = event.rssi;  // RSSI del beacon
            const uuid = event.deviceId;  // UUID del beacon (o indirizzo MAC)

            console.log(`Beacon trovato: ${uuid}, RSSI: ${rssi}`);

            // Logica per determinare la stanza in base all'RSSI
            if (rssi > -60) { // Se il beacon è abbastanza vicino
                // Pubblica il valore RSSI sul topic MQTT
                client.publish(MQTT_TOPIC, rssi.toString());
            }
        });
    })
    .catch(error => console.error("Errore nella scansione dei beacon: ", error));
}

// Aggiungi un listener per il click che avvia la scansione dei beacon
const scanButton = document.getElementById("scanButton");
scanButton.addEventListener("click", () => {
    startBeaconScan(); // Avvia la scansione dei beacon al click dell'utente
});

client.on("connect", () => {
    console.log("Connesso al broker MQTT");
    client.subscribe(MQTT_TOPIC, (err) => {
        if (!err) {
            console.log(`Sottoscritto al topic ${MQTT_TOPIC}`);
        }
    });
});

client.on("message", (topic, message) => {
    if (topic === MQTT_TOPIC) {
        const rssi = parseInt(message.toString(), 10);
        console.log(`Beacon rilevato! RSSI: ${rssi} sono nella sala 1`);

        if (rssi > -80) { // Se il beacon è abbastanza vicino
            const beaconId = "ACFD065EC3C011E39BBE1A514932AC01";
            const url = urlMap[beaconId];

            if (url) {
                // Mostra la notifica con il pulsante "Apri"
                notificationDiv.style.display = "block";

                // Quando l'utente preme "Apri", carica il Virtual Tour nel div
                openTourButton.onclick = () => {
                    notificationDiv.style.display = "none"; // Nasconde la notifica

                    // Carica il Virtual Tour nell'iframe
                    contentDiv.innerHTML = `
                        <iframe 
                            src="${url}" 
                            width="100%" 
                            height="500px" 
                            frameborder="0" 
                            allowfullscreen>
                        </iframe>
                    `;
                };
            }
        }
    }
});

client.on("error", (error) => {
    console.error("Errore MQTT:", error);
});
