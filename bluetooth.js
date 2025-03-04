async function scanForBeacons() {
    try {
        console.log('Avvio della scansione dei beacon...');

        if (!navigator.bluetooth || !navigator.bluetooth.requestLEScan) {
            throw new Error('Il browser non supporta la scansione BLE.');
        }

        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state !== 'granted') {
            throw new Error('È necessario concedere i permessi per la posizione.');
        }

        const scanner = await navigator.bluetooth.requestLEScan({
            acceptAllAdvertisements: true
        });

        console.log('Scansione BLE avviata.');

        navigator.bluetooth.addEventListener('advertisementreceived', event => {
            console.log('Pacchetto di advertising rilevato:', event);
            // Gestisci i dati del beacon qui
        });

        setTimeout(() => {
            scanner.stop();
            console.log('Scansione BLE fermata.');
        }, 30000);

    } catch (error) {
        console.error('Errore:', error);
        document.getElementById('content').innerHTML = `<p>${error.message}</p>`;
    }
}

// Aggiunge il pulsante per avviare la scansione
document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.createElement('button');
    scanButton.textContent = 'Cerca beacon';
    scanButton.style.margin = '20px';
    scanButton.style.padding = '10px 20px';
    scanButton.style.backgroundColor = '#007BFF';
    scanButton.style.color = '#fff';
    scanButton.style.border = 'none';
    scanButton.style.borderRadius = '5px';
    scanButton.style.cursor = 'pointer';
    scanButton.addEventListener('click', scanForBeacons);
    
    document.body.appendChild(scanButton);
});
