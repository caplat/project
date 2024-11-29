const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Définir la balle
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4
};

// Définir les paddles
const paddleWidth = 10, paddleHeight = 100;
const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 4
};
const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 4
};

// Variables de contrôle
let upPressed = false, downPressed = false;

// Gérer les entrées clavier pour déplacer le paddle gauche
document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") upPressed = true;
    if (event.key == "ArrowDown") downPressed = true;
});
document.addEventListener("keyup", (event) => {
    if (event.key == "ArrowUp") upPressed = false;
    if (event.key == "ArrowDown") downPressed = false;
});

// Fonction de mise à jour du jeu
function update() {
    // Déplacer les paddles
    if (upPressed && leftPaddle.y > 0) leftPaddle.y -= leftPaddle.dy;
    if (downPressed && leftPaddle.y < canvas.height - paddleHeight) leftPaddle.y += leftPaddle.dy;

    // Déplacer la balle
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Détection des collisions avec les bords
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Détection des collisions avec les paddles
    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight) {
        ball.dx = -ball.dx;
    }

    if (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight) {
        ball.dx = -ball.dx;
    }

    // Vérifier si la balle sort du terrain (game over ou reset)
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
}

// Fonction de dessin
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer l'écran

    // Dessiner la balle
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    // Dessiner les paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

// Fonction principale
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Appel à chaque frame
}

// Démarrer le jeu
gameLoop();