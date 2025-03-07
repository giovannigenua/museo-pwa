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

// Simulazione dei beacon per test
const fakeBeacons = [
    {
        id: 'ACFD065E1A514932AC01000002040849',
        name: 'Beacon 1',
        rssi: -60 // Simuliamo un segnale forte
    },
    {
        id: 'BCFD065E1A514932AC01000002040850',
        name: 'Beacon 2',
        rssi: -80 // Simuliamo un segnale più debole
    }
];

const urlMap = {
    'ACFD065E1A514932AC01000002040849': 'https://www.museofrigento.it/virtualtour/'
};

// Funzione per simulare la scansione dei beacon
function simulateScanning() {
    console.log('Simulazione scansione beacon in corso...');
    
    const strongestBeacon = fakeBeacons.reduce((prev, curr) => (curr.rssi > prev.rssi ? curr : prev));
    console.log(`Beacon rilevato: ${strongestBeacon.name} (RSSI: ${strongestBeacon.rssi})`);
    
    if (strongestBeacon.rssi > -70) {
        const url = urlMap[strongestBeacon.id];
        if (url) {
            displayVirtualTour(url);
        } else {
            console.log('Nessun contenuto associato al beacon rilevato.');
        }
    }
}

// Funzione per visualizzare il virtual tour
function displayVirtualTour(url) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<iframe src="${url}" width="100%" height="500px" frameborder="0" allowfullscreen></iframe>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.createElement('button');
    scanButton.textContent = 'Simula Scansione Beacon';
    scanButton.style.marginTop = '20px';
    scanButton.style.padding = '10px 20px';
    scanButton.style.backgroundColor = '#007BFF';
    scanButton.style.color = '#fff';
    scanButton.style.border = 'none';
    scanButton.style.borderRadius = '5px';
    scanButton.style.cursor = 'pointer';
    scanButton.addEventListener('click', simulateScanning);

    document.querySelector('main').appendChild(scanButton);
});
