// js/game.js
import { gameState, playerData } from './state.js';
import { GRID_SIZE, GAME_SPEED, UPGRADES } from './constants.js';
import { showGameOver, updateMultiplierBar, updateBonusCounterUI, updateScores } from './ui.js';
import { savePlayerData } from './data.js';
import { drawCanvasBackground, drawSnake, drawFoods, drawObstacles } from './drawing.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export function startGame() {
    // Reseta o estado do jogo para uma nova partida
    gameState.snake = [ { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 } ];
    gameState.dx = 0; // CORREÇÃO: Começa parado
    gameState.dy = 0; // CORREÇÃO: Começa parado
    gameState.sessionAppleCount = 0;
    gameState.isGameOver = false;
    gameState.changingDirection = false;
    gameState.foods = [];
    gameState.obstacles = [];
    gameState.runMultiplier = 1.0;
    gameState.growthSinceMultiplierIncrease = 0;
    gameState.bonusCharges = 0;
    gameState.obstaclesSurvivedInRun = 0;

    updateMultiplierBar();
    updateBonusCounterUI();
    
    // Limpa timers anteriores para evitar acúmulo
    if (gameState.loop) clearInterval(gameState.loop);
    if (gameState.obstacleSpawnTimer) clearInterval(gameState.obstacleSpawnTimer);

    spawnFood(); // Gera a primeira comida
    gameState.obstacleSpawnTimer = setInterval(trySpawnObstacle, 15000); // Gera obstáculos
    
    gameState.loop = setInterval(main, GAME_SPEED);
}

function main() {
    if (gameState.isGameOver) return;
    
    gameState.changingDirection = false;
    if (gameState.dx !== 0 || gameState.dy !== 0) { // Só move se a direção foi definida
      moveSnake();
    }
    drawGame(); 
    checkCollision();
}

function drawGame() {
    drawCanvasBackground(ctx, canvas);
    drawFoods(ctx);
    drawObstacles(ctx);
    drawSnake(ctx);
}

function moveSnake() {
    const head = { x: (gameState.snake[0].x + gameState.dx + GRID_SIZE) % GRID_SIZE, y: (gameState.snake[0].y + gameState.dy + GRID_SIZE) % GRID_SIZE };
    gameState.snake.unshift(head);

    const didEatFood = gameState.foods.some((food, index) => {
        if (head.x === food.x && head.y === food.y) {
            handleFoodConsumption(index);
            return true;
        }
        return false;
    });

    if (!didEatFood) {
        gameState.snake.pop();
    }
}

function handleFoodConsumption(foodIndex) {
    const food = gameState.foods.splice(foodIndex, 1)[0];
    gameState.growthSinceMultiplierIncrease++;
    
    let bonusMultiplier = 1;
    if (gameState.bonusCharges > 0 && food.type !== 'bonus') {
        bonusMultiplier = 3;
        gameState.bonusCharges--;
        updateBonusCounterUI();
    }

    switch(food.type) {
        case 'red':
            const appleValueUpgrade = playerData.upgrades.appleValue ? playerData.upgrades.appleValue.level : 0;
            const value = (1 + appleValueUpgrade) * gameState.runMultiplier * bonusMultiplier;
            gameState.sessionAppleCount++;
            playerData.totalRedApples += value;
            break;
        case 'golden':
            playerData.totalGoldenPoints += (1 * bonusMultiplier);
            break;
        case 'bonus':
            gameState.bonusCharges += 3;
            updateBonusCounterUI();
            break;
    }
    
    // Atualiza o multiplicador
    if (gameState.growthSinceMultiplierIncrease >= 3 && gameState.runMultiplier < 2.0) {
        gameState.runMultiplier = Math.min(2.0, gameState.runMultiplier + 0.05);
        updateMultiplierBar();
        gameState.growthSinceMultiplierIncrease = 0;
    }
    
    spawnFood();
    updateScores();
}

function spawnFood() {
    let newFood = {};
    const bonusChanceUpgrade = playerData.upgrades.bonusChance ? (playerData.upgrades.bonusChance.level * 0.01) : 0;
    const chance = Math.random();

    if (chance < 0.01 + bonusChanceUpgrade) newFood.type = 'bonus';
    else if (chance < 0.15) newFood.type = 'golden';
    else newFood.type = 'red';

    while (true) {
        newFood.x = Math.floor(Math.random() * GRID_SIZE);
        newFood.y = Math.floor(Math.random() * GRID_SIZE);
        if (![...gameState.snake, ...gameState.foods].some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    gameState.foods.push(newFood);
}

function trySpawnObstacle() {
    if (gameState.obstacles.length > 0) return;
    let obstacle = { parts: [] };

    const x = Math.floor(Math.random() * (GRID_SIZE - 2));
    const y = Math.floor(Math.random() * (GRID_SIZE - 2));

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            obstacle.parts.push({x: x + i, y: y + j});
        }
    }
    
    // Checa se o obstáculo colide com a cobra ou comida
    if (obstacle.parts.some(part => gameState.snake.some(p => p.x === part.x && p.y === part.y))) return;
    if (obstacle.parts.some(part => gameState.foods.some(f => f.x === part.x && f.y === part.y))) return;

    obstacle.state = 'green';
    gameState.obstacles.push(obstacle);

    setTimeout(() => { if(obstacle) obstacle.state = 'yellow'; }, 4000);
    setTimeout(() => { if(obstacle) obstacle.state = 'red'; }, 7000);
    setTimeout(() => {
        const idx = gameState.obstacles.indexOf(obstacle);
        if (idx > -1) {
            gameState.obstacles.splice(idx, 1);
            gameState.obstaclesSurvivedInRun++;
        }
    }, 17000);
}

function checkCollision() {
    if (!gameState.snake.length) return;
    const head = gameState.snake[0];

    // Colisão com o corpo
    for (let i = 4; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            gameOver();
            return;
        }
    }
    // Colisão com obstáculos
    for (const obs of gameState.obstacles) {
        if (obs.state === 'red' && obs.parts.some(part => head.x === part.x && head.y === part.y)) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameState.isGameOver = true;
    clearInterval(gameState.loop);
    clearInterval(gameState.obstacleSpawnTimer);
    
    // Salvar estatísticas
    playerData.stats.totalRedApples = playerData.totalRedApples;
    playerData.stats.totalGoldenPoints = playerData.totalGoldenPoints;
    playerData.stats.maxSnakeSize = Math.max(playerData.stats.maxSnakeSize || 0, gameState.snake.length);
    playerData.stats.totalObstaclesSurvived = (playerData.stats.totalObstaclesSurvived || 0) + gameState.obstaclesSurvivedInRun;
    
    savePlayerData();
    showGameOver(gameState.sessionAppleCount);
}

export function changeDirection(event) {
    if (gameState.changingDirection) return;
    const keyPressed = event.keyCode;
    
    // Inicia o jogo no primeiro toque
    const isStarting = gameState.dx === 0 && gameState.dy === 0;

    const goingUp = gameState.dy === -1;
    const goingDown = gameState.dy === 1;
    const goingRight = gameState.dx === 1;
    const goingLeft = gameState.dx === -1;

    if (keyPressed === 37 && !goingRight) { gameState.dx = -1; gameState.dy = 0; }
    else if (keyPressed === 38 && !goingDown) { gameState.dx = 0; gameState.dy = -1; }
    else if (keyPressed === 39 && !goingLeft && !isStarting) { gameState.dx = 1; gameState.dy = 0; }
    else if (keyPressed === 40 && !goingUp) { gameState.dx = 0; gameState.dy = 1; }
    else { return; }

    gameState.changingDirection = true;
}