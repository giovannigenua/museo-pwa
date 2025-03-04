const urlMap = {
    'ACFD065E1A514932AC01000002040849': 'https://www.museofrigento.it/virtualtour/',
};
// Mappa degli URL

// Avvia la scansione dei beacon
function startScanning() {
    // Verifica se il browser supporta la libreria
    if (!EddystoneScanner) {
        console.error('La libreria EddystoneScanner non è supportata.');
        return;
    }

    console.log('Avvio della scansione dei beacon...');

    // Configura il listener per i beacon rilevati
    EddystoneScanner.addEventListener('found', (beacon) => {
        console.log('Beacon rilevato:', beacon);

        // Verifica se è un beacon Eddystone-UID
        if (beacon.type === 'uid') {
            const namespace = beacon.id.slice(0, 20); // I primi 10 byte (20 caratteri esadecimali)
            const instance = beacon.id.slice(20); // Ultimi 6 byte (12 caratteri esadecimali)
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
    });

    // Avvia la scansione
    EddystoneScanner.start();
}

// Ferma la scansione
function stopScanning() {
    EddystoneScanner.stop();
    console.log('Scansione BLE fermata.');
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
