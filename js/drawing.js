// js/drawing.js
import { gameState, playerData } from './state.js';
import { TILE_SIZE, SKINS } from './constants.js';

export function drawCanvasBackground(ctx, canvas) {
    const darkColor = '#1a202c', lightColor = '#2d3748';
    for (let x = 0; x < canvas.width / TILE_SIZE; x++) {
        for (let y = 0; y < canvas.height / TILE_SIZE; y++) {
            ctx.fillStyle = ((x + y) % 2 === 0) ? darkColor : lightColor;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

export function drawSnake(ctx) {
    const skin = SKINS.find(s => s.id === playerData.equippedSkin);
    
    gameState.snake.forEach((part, index) => {
        ctx.fillStyle = (index === 0) ? skin.head : skin.body;
        ctx.strokeStyle = '#1a202c'; // Contorno para destacar
        ctx.lineWidth = 2;
        ctx.fillRect(part.x * TILE_SIZE, part.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeRect(part.x * TILE_SIZE, part.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });
}

export function drawFoods(ctx) {
    const colorMap = {
        red: '#e53e3e',
        golden: '#f6e05e',
        bonus: '#9f7aea' // Cor roxa para o bônus, mais visível
    };
    gameState.foods.forEach(food => {
        ctx.fillStyle = colorMap[food.type];
        ctx.beginPath();
        const radius = TILE_SIZE / 2;
        const x = food.x * TILE_SIZE + radius;
        const y = food.y * TILE_SIZE + radius;
        ctx.arc(x, y, radius - 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Efeito de brilho para a maçã bônus
        if (food.type === 'bonus') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2*Math.PI);
            ctx.fill();
        }
    });
}