// js/game.js
import { gameState, playerData } from './state.js';
import { GRID_SIZE, GAME_SPEED } from './constants.js';
import { showGameOver } from './ui.js';
import { savePlayerData } from './data.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export function startGame() {
    // Reseta o estado do jogo para uma nova partida
    gameState.snake = [ { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 } ];
    gameState.dx = 1; // Começa movendo para a direita
    gameState.dy = 0;
    gameState.score = 0;
    gameState.isGameOver = false;
    gameState.changingDirection = false;
    gameState.foods = [];

    spawnFood(); // Gera a primeira comida
    
    if (gameState.loop) clearInterval(gameState.loop);
    gameState.loop = setInterval(main, GAME_SPEED);
}

function main() {
    if (gameState.isGameOver) {
        clearInterval(gameState.loop);
        showGameOver(gameState.score);
        return;
    }
    
    gameState.changingDirection = false;
    moveSnake();
    checkCollision();
    // O desenho agora é chamado dentro do loop principal
    // (Poderia ser em um loop separado de renderização para jogos mais complexos)
    drawGame(); 
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
    const food = gameState.foods[foodIndex];
    
    // CORREÇÃO DO BUG/MELHORIA: Bônus é aplicado imediatamente
    let appleValue = 1;
    if (food.type === 'bonus') {
        appleValue = 5; // Maçã bônus vale 5x mais!
    }
    
    gameState.score += 1;
    playerData.totalRedApples += appleValue;
    playerData.totalGoldenPoints += food.type === 'golden' ? 1 : 0;
    
    gameState.foods.splice(foodIndex, 1);
    spawnFood();
    
    // Atualiza os dados salvos e a UI
    savePlayerData();
    document.getElementById('totalRedAppleScore').textContent = Math.floor(playerData.totalRedApples);
    document.getElementById('goldenScore').textContent = playerData.totalGoldenPoints;
}

function spawnFood() {
    let newFood = {};
    const chance = Math.random();

    if (chance < 0.05) newFood.type = 'bonus';
    else if (chance < 0.15) newFood.type = 'golden';
    else newFood.type = 'red';

    while (true) {
        newFood.x = Math.floor(Math.random() * GRID_SIZE);
        newFood.y = Math.floor(Math.random() * GRID_SIZE);
        // Verifica se a comida não vai aparecer em cima da cobra
        if (!gameState.snake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    gameState.foods.push(newFood);
}

function checkCollision() {
    const head = gameState.snake[0];
    // Colisão com o próprio corpo
    for (let i = 4; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            gameState.isGameOver = true;
        }
    }
}

// A função de desenho principal agora vive aqui
import { drawCanvasBackground, drawSnake, drawFoods } from './drawing.js';

function drawGame() {
    drawCanvasBackground(ctx, canvas);
    drawSnake(ctx);
    drawFoods(ctx);
}

export function changeDirection(event) {
    if (gameState.changingDirection) return;
    gameState.changingDirection = true;
    
    const keyPressed = event.keyCode;
    const goingUp = gameState.dy === -1;
    const goingDown = gameState.dy === 1;
    const goingRight = gameState.dx === 1;
    const goingLeft = gameState.dx === -1;

    if (keyPressed === 37 && !goingRight) { gameState.dx = -1; gameState.dy = 0; }
    if (keyPressed === 38 && !goingDown) { gameState.dx = 0; gameState.dy = -1; }
    if (keyPressed === 39 && !goingLeft) { gameState.dx = 1; gameState.dy = 0; }
    if (keyPressed === 40 && !goingUp) { gameState.dx = 0; gameState.dy = 1; }
}