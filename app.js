
const urlMap = {
    'ACFD065E1A514932AC01000002040849': 'https://www.museofrigento.it/virtualtour/',
};
// Funzione per avviare la scansione dei beacon
async function scanForBeacons() {
    try {
        console.log('Avvio della scansione dei beacon...');

        // Verifica se il browser supporta l'API Web Bluetooth Scanning
        if (!navigator.bluetooth || !navigator.bluetooth.requestLEScan) {
            throw new Error('Il browser non supporta la scansione BLE. Prova con Chrome per Android.');
        }

        // Richiedi i permessi per la posizione (necessari per il Bluetooth su Android)
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state !== 'granted') {
            throw new Error('È necessario concedere i permessi per la posizione.');
        }

        // Avvia la scansione BLE
        const scanner = await navigator.bluetooth.requestLEScan({
            acceptAllAdvertisements: true // Accetta tutti i pacchetti di advertising
        });

        console.log('Scansione BLE avviata.');

        // Ascolta i pacchetti di advertising
        navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
            console.log('Pacchetto di advertising rilevato:', event);

            // Estrai i dati del beacon (es. Eddystone UID)
            const serviceData = event.serviceData;
            if (serviceData && serviceData.get('feaa')) { // 'feaa' è l'UUID di Eddystone
                const data = new DataView(serviceData.get('feaa').buffer);
                const frameType = data.getUint8(0);

                // Verifica se è un pacchetto Eddystone UID
                if (frameType === 0x00) {
                    const namespace = Array.from(new Uint8Array(data.buffer, 2, 10))
                        .map(byte => byte.toString(16).padStart(2, '0'))
                        .join('')
                        .toUpperCase();
                    const instance = Array.from(new Uint8Array(data.buffer, 12, 6))
                        .map(byte => byte.toString(16).padStart(2, '0'))
                        .join('')
                        .toUpperCase();
                    const beaconId = namespace + instance;

                    console.log('Identificativo del beacon rilevato:', beaconId);

                    // Ottieni l'URL corrispondente dalla mappa
                    const url = urlMap[beaconId];
                    if (url) {
                        // Mostra il virtual tour o il contenuto corrispondente
                        const contentDiv = document.getElementById('content');
                        contentDiv.innerHTML = `
                            <iframe 
                                src="${url}" 
                                width="100%" 
                                height="500px" 
                                frameborder="0" 
                                allowfullscreen>
                            </iframe>
                        `;
                    } else {
                        console.error('Identificativo non riconosciuto:', beaconId);
                        const contentDiv = document.getElementById('content');
                        contentDiv.innerHTML = `<p>Nessun contenuto trovato per questo beacon.</p>`;
                    }
                }
            }
        });

        // Ferma la scansione dopo 30 secondi (opzionale)
        setTimeout(() => {
            scanner.stop();
            console.log('Scansione BLE fermata.');
        }, 30000);

    } catch (error) {
        console.error('Errore:', error);
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `<p>${error.message}</p>`;
    }
}

// Avvia la scansione quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.createElement('button');
    scanButton.textContent = 'Cerca beacon';
    scanButton.style.marginTop = '20px';
    scanButton.style.padding = '10px 20px';
    scanButton.style.backgroundColor = '#007BFF';
    scanButton.style.color = '#fff';
    scanButton.style.border = 'none';
    scanButton.style.borderRadius = '5px';
    scanButton.style.cursor = 'pointer';
    scanButton.addEventListener('click', scanForBeacons);

    document.querySelector('main').appendChild(scanButton);
});
