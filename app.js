document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<p>Caricamento in corso...</p>';

    // Simula il caricamento di un virtual tour
    setTimeout(() => {
        contentDiv.innerHTML = `
            <iframe 
                src="https://www.museofrigento.it/virtualtour/" 
                width="100%" 
                height="500px" 
                frameborder="0" 
                allowfullscreen>
            </iframe>
        `;
    }, 2000);
});