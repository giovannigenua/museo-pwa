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

const urlMap = {
    'ACFD065E1A514932AC01000002040849': 'https://www.museofrigento.it/virtualtour/',
};
// Mappa degli URL

// Avvia la scansione dei beacon
async function startScanning() {
    try {
        console.log('Avvio della scansione dei beacon...');

        // Verifica se il browser supporta l'API Web Bluetooth
        if (!navigator.bluetooth) {
            throw new Error('Il browser non supporta l\'API Web Bluetooth.');
        }

        // Richiedi un dispositivo Bluetooth
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true, // Accetta tutti i dispositivi BLE
            optionalServices: ['0000feaa-0000-1000-8000-00805f9b34fb'] // UUID del servizio Eddystone
        });

        console.log('Dispositivo trovato:', device.name);

        // Connetti al dispositivo
        const server = await device.gatt.connect();
        console.log('Connesso al dispositivo:', device.name);

        // Ottieni il servizio Eddystone
        const service = await server.getPrimaryService('0000feaa-0000-1000-8000-00805f9b34fb');
        console.log('Servizio Eddystone trovato:', service);

        // Leggi i dati del beacon
        const characteristic = await service.getCharacteristic('2a6e'); // Caratteristica Eddystone
        const value = await characteristic.readValue();
        const decoder = new TextDecoder('utf-8');
        const beaconData = decoder.decode(value);

        console.log('Dati del beacon:', beaconData);

        // Decodifica l'identificativo del beacon
        const beaconId = beaconData.slice(0, 32); // Esempio: estrai i primi 32 caratteri
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

        // Disconnetti dal dispositivo
        await server.disconnect();
        console.log('Disconnesso dal dispositivo:', device.name);

    } catch (error) {
        console.error('Errore:', error);
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `<p>Errore durante la scansione dei beacon: ${error.message}</p>`;
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
    scanButton.addEventListener('click', startScanning);

    document.querySelector('main').appendChild(scanButton);
});
