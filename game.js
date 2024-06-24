const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ambientSound = document.getElementById('ambientSound');
const failSound = document.getElementById('failSound');

let groundSprite = new Image();
groundSprite.src = './sprites/dirt_ground.png';  // Caminho para a imagem do chão
let groundWidth = 34; // largura do sprite do chão
let groundHeight = 34; // altura do sprite do chão

let greenMonsterSprite = new Image();
greenMonsterSprite.src = './sprites/monster1.png' ;  // Caminho para o sprite do obstáculo

let purpleMonsterSprite = new Image();
purpleMonsterSprite.src = './sprites/monster2.png' ;  // Caminho para o sprite do obstáculo

let knight_Death = new Image();
knight_Death.src = './sprites/knight_Death.png';

let gameState = 'playing';


// Variáveis do jogo
let knight = {
    x: 50,
    y: 150,
    width: 20,
    height: 50,
    dy: 0,
    jumpStrength: 10,
    gravity: 0.5,
    grounded: false,
    sprite: new Image(),
    spriteWidth: 14, // Largura de um único sprite
    spriteHeight: 22, // Altura de um único sprite
    spriteIndex: 0, // Índice do sprite atual
    spriteCount: 8, // Número total de sprites na imagem
    spriteSpacing: 18
};

let monster = {
    
}


knight.sprite.src = './sprites/knight.png';

let obstacles = [];
let gameSpeed = 2.5;
let score = 0;
let animationSpeed = 10; // Menor valor = mais rápido
let frameCount = 0;

// Função para desenhar o knightssauro
function drawknight() {
    let spriteX;
    if (knight.spriteIndex === 0 || knight.spriteIndex === knight.spriteCount - 1) {
        spriteX = knight.spriteIndex * knight.spriteWidth;
    } else {
        spriteX = knight.spriteIndex * (knight.spriteWidth + knight.spriteSpacing);
    }
    ctx.drawImage(knight.sprite, spriteX, 0, knight.spriteWidth, knight.spriteHeight, knight.x, knight.y - 20, knight.width, knight.height);
    // Ajuste em knight.y - 20 para posicionar o knightssauro um pouco acima do chão

    frameCount++;
    if (frameCount >= animationSpeed) {
        knight.spriteIndex = (knight.spriteIndex + 1) % knight.spriteCount;
        frameCount = 0;
    }
}

// Função para desenhar o chão
function drawGround() {
    for (let x = 0; x < canvas.width; x += groundWidth) {
        ctx.drawImage(groundSprite, x, canvas.height - groundHeight, groundWidth, groundHeight);
    }
}

// Função para desenhar obstáculos como sprites
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.sprite, obstacle.x, obstacle.y - 20, obstacle.width, obstacle.height);
        // Ajuste em obstacle.y - 20 para posicionar os obstáculos um pouco acima do chão
    });
}

// Função para atualizar obstáculos
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 500) {
        let obstacle = {
            x: canvas.width,
            y: 160,
            width: 30, // Largura do obstáculo
            height: 30, // Altura do obstáculo
            sprite: Math.random() < 0.5 ? greenMonsterSprite : purpleMonsterSprite // Escolha aleatória entre os sprites
        };
        obstacles.push(obstacle);
    }

    if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        score++;
    }
}

// Função para detectar colisão
function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            knight.x < obstacle.x + obstacle.width &&
            knight.x + knight.width > obstacle.x &&
            knight.y < obstacle.y + obstacle.height &&
            knight.y + knight.height > obstacle.y
        ) {
            // Colisão detectada
            ambientSound.pause();
            failSound.play();
            stopGame();
            gameOver(); // Mostra a tela de game over
        }
    });
}

function stopGame() {
    gameState = 'gameOver';  // Altera o estado do jogo para 'gameOver'
    cancelAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(knight_Death, 0, 0, 100, 100, knight.x, knight.y, knight.width, knight.height);
}


// Função para reiniciar o jogo
function resetGame() {
    score = 0;
    obstacles = [];
    knight.y = 150;
    knight.dy = 0;
    knight.grounded = false;
    knight.spriteIndex = 0; // Reseta o índice do sprite do knightssauro
    gameState = 'playing'; // Altera o estado do jogo para 'playing' para reiniciar o loop do jogo
    ambientSound.currentTime = 0;
    ambientSound.play();
    gameLoop(); // Reinicia o loop do jogo
}

// Função para atualizar o knightssauro
function updateknight() {
    if (knight.grounded && knight.dy === 0 && isJumping) {
        knight.dy = -knight.jumpStrength;
        knight.grounded = false;
    }

    knight.dy += knight.gravity;
    knight.y += knight.dy;

    if (knight.y + knight.height > canvas.height - 10) {
        knight.y = canvas.height - 10 - knight.height;
        knight.dy = 0;
        knight.grounded = true;
    }
}

// Variável para detectar se o jogador está tentando pular
let isJumping = false;
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = false;
    }
});

// Função para desenhar o score
function drawScore() {
    ctx.font = '24px MyCustomFont'; // Defina o tamanho e o nome da fonte personalizada
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Função para desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawknight();
    drawObstacles();
    drawScore();
}

// Função para atualizar o jogo
function update() {
    updateknight();
    updateObstacles();
    detectCollision();
}

function gameOver() {
    // Mostra a tela de game over
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawScore();
    //drawObstacles();
    //desenha o persanagem morto
    ctx.drawImage(knight_Death, 0, 0, 100, 100, knight.x, 145, 200, 200);

    ctx.font = '30px MyCustomFont';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2 - 15);

    // Adiciona um EventListener para reiniciar o jogo ao pressionar o pulo
    document.addEventListener('keydown', restartGame);
}

function restartGame(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        document.removeEventListener('keydown', restartGame); // Remove o EventListener para evitar múltiplas reinicializações
        resetGame(); // Reinicia o jogo
    }
}


function gameLoop() {
    if (gameState === 'playing') {
        draw();
        update();
        requestAnimationFrame(gameLoop);
    } else if (gameState === 'gameOver') {
        draw();
        gameOver();
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                gameState = 'playing';
            }
        });
    }
}


// Iniciar o loop do jogo
gameLoop();
