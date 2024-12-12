const route = (event) => {
    event.preventDefault();  // Empêche le comportement par défaut (rechargement de la page)
    
    // Met à jour l'URL sans recharger la page 
    window.history.pushState({}, "", event.target.href);
    
    // Appelle la fonction pour charger le contenu de la nouvelle URL
    handleLocation();
};

const handleLocation = async () => {
    const path = window.location.pathname;  // Récupère le chemin de l'URL actuelle
    
    try {
        // Fetch le contenu associé au chemin actuel
        const response = await fetch(path);  // Assurez-vous que le serveur renvoie les bonnes pages
        if (!response.ok) {
            throw new Error("Page non trouvée");  // Lancer une erreur si la réponse n'est pas OK
        }
        const html = await response.text();  // Convertir la réponse en texte
        
        // Crée un élément temporaire pour isoler le contenu spécifique
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Récupère uniquement le contenu du bloc 'main-content'
        const newContent = tempDiv.querySelector('#main-content');
        if (newContent) {
            document.getElementById('main-content').innerHTML = newContent.innerHTML;
            if (path === "/pong/game/")
                startPongGame()
        } else {
            throw new Error("Bloc 'main-content' introuvable");
        }
    } catch (error) {
        // Affiche un message d'erreur si la page est introuvable
        document.getElementById('main-content').innerHTML = "<h1>Page non trouvée</h1>";
    }
};

// Gère les changements d'historique (quand l'utilisateur clique sur "Précédent" ou "Suivant")
window.onpopstate = handleLocation;

// Expose la fonction route à l'objet window pour pouvoir l'utiliser dans d'autres parties du code
window.route = route;

// Appelle handleLocation dès le chargement de la page pour afficher le contenu initial
handleLocation();
