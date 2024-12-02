document.addEventListener('DOMContentLoaded', function(){
    const maincontent = document.getElementById('main-content');

    // Fonction pour charger le contenu à partir de l'URL
    function loadContent(url) {
        fetch(url)  // Envoie une requête pour récupérer le contenu de l'URL
            .then(response => response.text())  // Récupère la réponse sous forme de texte
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                maincontent.innerHTML = tempDiv.querySelector('#main-content').innerHTML
            })
            .catch(error => console.error('Erreur de chargement :', error));
    }

    // Ajouter un écouteur d'événements sur les liens pour changer le contenu
    function setupLinks(){
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(event){
                event.preventDefault();  // Empêche le comportement par défaut de rechargement de page
                const url = this.getAttribute('href');  // Récupère l'URL du lien
                loadContent(url);  // Charge le contenu sans recharger la page
                window.history.pushState({}, '', url);  // Change l'URL sans recharger la page
            });
        });
    }

    // Écouter l'événement 'popstate' pour charger le contenu lorsqu'on navigue dans l'historique
    window.addEventListener('popstate', function() {
        const url = window.location.pathname;  // Récupère l'URL actuelle
        loadContent(url).then(() => setupLinks());  // Charge le contenu correspondant à cette URL
    });

    // Charger le contenu initial si une URL est déjà définie dans l'historique
    loadContent(window.location.pathname).then(() => setupLinks());
});