function startPongGame(){
    console.log("test start pong game")
    // Dimensions et context du jeu
    let board, context;
    let boardWidth = 750, boardHeight = 500;

    // Joueurs
    let playerWidth = 10, playerHeight = 50;
    let player1 = {   
        x: 10, 
        y: boardHeight / 2,
        width: playerWidth, 
        height: playerHeight, 
        velocityY: 0 
    };

    let player2 = { 
        x: boardWidth - playerWidth - 10, 
        y: boardHeight / 2, 
        width: playerWidth, 
        height: playerHeight, 
        velocityY: 0 
    };

    // Balle
    let ballWidth = 10, ballHeight = 10;
    let ball = { 
        x: boardWidth / 2, 
        y: boardHeight / 2, width: ballWidth, 
        height: ballHeight, 
        velocityX: 5, 
        velocityY: 5 
    };
    let maxSpeed = 6;

    // Scores
    let player1Score = 0, player2Score = 0;

    // Etat du jeu
    let gameState = "waiting"; // "waiting", "countdown", "playing"
    let countdownTime = 3; // Le compte à rebours commence à 3

        board = document.getElementById("board");
        board.width = boardWidth;
        board.height = boardHeight;
        context = board.getContext("2d");

        requestAnimationFrame(update);
        document.addEventListener("keydown", movePlayer);
        document.addEventListener("keyup", stopPlayer);

        // Démarrer le compte à rebours seulement au début
        if (gameState === "waiting") {
            displayReadyMessage();
        }

    // Fonction pour afficher "READY"
    function displayReadyMessage() {
        gameState = "waiting";  // Attendre que l'utilisateur soit prêt
        context.clearRect(0, 0, boardWidth, boardHeight);  // Effacer l'écran
        context.fillStyle = "white";
        context.font = "30px sans-serif";
        context.textAlign = "center";
        context.fillText("READY", boardWidth / 2, boardHeight / 2);

        setTimeout(startCountdown, 1000);  // Afficher "READY" pendant 1 seconde, puis lancer le compte à rebours
    }

    // Fonction pour démarrer le compte à rebours
    function startCountdown() {
        gameState = "countdown";  // Passer en état "countdown"
        countdownTime = 3;  // Réinitialiser le compte à rebours
        countdown();  // Lancer le compte à rebours
    }

    // Fonction pour afficher le compte à rebours
    function countdown() {
        if (countdownTime > 0) {
            context.clearRect(0, 0, boardWidth, boardHeight);  // Effacer l'écran à chaque étape du compte à rebours
            context.fillStyle = "white";
            context.font = "60px sans-serif";
            context.textAlign = "center";
            context.fillText(countdownTime, boardWidth / 2, boardHeight / 2);

            countdownTime--;
            setTimeout(countdown, 1000);  // Répéter chaque seconde
        } else {
            startGame();  // Lorsque le compte à rebours est terminé, commencer le jeu
        }
    }

    // Fonction pour démarrer le jeu
    function startGame() {
        gameState = "playing";  // Passer en état "playing"
        ball.velocityX = 5;  // Vitesse initiale
        ball.velocityY = 5;  // Vitesse initiale
        update();  // Lancer le jeu
    }

    // Fonction pour mettre à jour le jeu
    function update() {
        if (gameState !== "playing") return;  // Ne pas exécuter l'update si le jeu n'est pas en cours

        requestAnimationFrame(update);
        context.clearRect(0, 0, boardWidth, boardHeight);

        // Mise à jour des joueurs
        player1.y = Math.min(Math.max(player1.y + player1.velocityY, 0), boardHeight - playerHeight);
        context.fillStyle = "skyblue";
        context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

        player2.y = Math.min(Math.max(player2.y + player2.velocityY, 0), boardHeight - playerHeight);
        context.fillStyle = "pink";
        context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

        // Mise à jour de la balle
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        // Rebond sur les murs
        if (ball.y <= 0 || ball.y + ballHeight >= boardHeight) {
            ball.velocityY *= -1;
            // Ajouter une petite vitesse minimale dans la direction Y si la balle se déplace trop lentement
            if (Math.abs(ball.velocityY) < 1) {
                ball.velocityY = (ball.velocityY > 0 ? 1 : -1); // Définit une vitesse minimale pour éviter de coller au mur
            }
        }

        // Rebond sur les paddles
        if (detectCollision(ball, player1)) {
            ball.velocityX = Math.abs(ball.velocityX); // Change direction to the right
            adjustBallSpeed(player1);
        } else if (detectCollision(ball, player2)) {
            ball.velocityX = -Math.abs(ball.velocityX); // Change direction to the left
            adjustBallSpeed(player2);
        }

        // Marquer un point
        if (ball.x < 0) { player2Score++; resetGame(1); }
        if (ball.x + ballWidth > boardWidth) { player1Score++; resetGame(-1); }

        context.fillStyle = "white";
        context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

        // Score
        context.font = "45px sans-serif";
        context.fillText(player1Score, boardWidth / 5, 45);
        context.fillText(player2Score, boardWidth * 4 / 5 - 45, 45);

        // Ligne centrale
        for (let i = 10; i < boardHeight; i += 25) {
            context.fillRect(boardWidth / 2 - 2, i, 4, 15);
        }
    }

    // Déplacement des joueurs
    function movePlayer(e) {
        if (e.code === "KeyW") player1.velocityY = -5;
        if (e.code === "KeyS") player1.velocityY = 5;
        if (e.code === "ArrowUp") player2.velocityY = -5;
        if (e.code === "ArrowDown") player2.velocityY = 5;
    }

    function stopPlayer(e) {
        if (e.code === "KeyW" || e.code === "KeyS") player1.velocityY = 0;
        if (e.code === "ArrowUp" || e.code === "ArrowDown") player2.velocityY = 0;
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    function adjustBallSpeed(player) {
        // Ajuste la direction verticale en fonction de l'impact
        let hitPosition = (ball.y + ballHeight / 2) - (player.y + playerHeight / 2);
        ball.velocityY += hitPosition * 0.1; // Impact de l'angle de collision

        // Limite la vitesse de la balle
        let speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
        if (speed > maxSpeed) {
            let ratio = maxSpeed / speed;
            ball.velocityX *= ratio;
            ball.velocityY *= ratio;
        }

        // Augmente légèrement la vitesse pour intensifier le jeu
        ball.velocityX *= 1.05;
        ball.velocityY *= 1.05;
    }

    // Fonction pour réinitialiser le jeu
    function resetGame(direction) {
        ball = {   
            x: boardWidth / 2, 
            y: boardHeight / 2, 
            width: ballWidth, 
            height: ballHeight, 
            velocityX: direction * 5, 
            velocityY: 5
        };
    }
}

