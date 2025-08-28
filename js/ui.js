// js/ui.js
import { startGame } from './game.js';
import { playerData } from './state.js';

// --- Seletores de Elementos DOM ---
const totalRedAppleScoreElement = document.getElementById('totalRedAppleScore');
const goldenScoreElement = document.getElementById('goldenScore');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScoreElement = document.getElementById('finalScore');

// Botões
const restartButton = document.getElementById('restartButton');
const restartButtonGameOver = document.getElementById('restartButtonGameOver');
const shopButton = document.getElementById('shopButton');
const closeShopButton = document.getElementById('closeShopButton');

// Loja
const shopMenu = document.getElementById('shopMenu');

/**
 * Configura todos os event listeners da interface.
 * Deve ser chamada uma vez, no início do jogo.
 */
export function setupUI() {
    // Ação para ambos os botões de reiniciar
    const handleRestart = () => {
        gameOverMessage.classList.add('hidden');
        shopMenu.classList.add('hidden');
        startGame();
    };

    restartButton.addEventListener('click', handleRestart);
    restartButtonGameOver.addEventListener('click', handleRestart);

    // Lógica da Loja
    shopButton.addEventListener('click', () => {
        gameOverMessage.classList.add('hidden');
        shopMenu.classList.remove('hidden');
        // A lógica para popular a loja (populateShop) seria chamada aqui
    });

    closeShopButton.addEventListener('click', () => {
        shopMenu.classList.add('hidden');
        gameOverMessage.classList.remove('hidden');
    });
    
    // Controles Mobile (exemplo simplificado)
    document.getElementById('upBtn').addEventListener('click', () => handleMobileInput('up'));
    document.getElementById('downBtn').addEventListener('click', () => handleMobileInput('down'));
    document.getElementById('leftBtn').addEventListener('click', () => handleMobileInput('left'));
    document.getElementById('rightBtn').addEventListener('click', () => handleMobileInput('right'));
}

/**
 * Exibe a tela de Fim de Jogo.
 * @param {number} score A pontuação final da partida.
 */
export function showGameOver(score) {
    finalScoreElement.textContent = score;
    gameOverMessage.classList.remove('hidden');
}

/**
 * Atualiza os placares de maçãs e moedas na tela.
 */
export function updateScores() {
    totalRedAppleScoreElement.textContent = Math.floor(playerData.totalRedApples);
    goldenScoreElement.textContent = playerData.totalGoldenPoints;
}

/**
 * Converte o input dos botões mobile em um evento de teclado falso
 * para ser processado pela função changeDirection.
 * @param {string} direction - 'up', 'down', 'left', ou 'right'
 */
function handleMobileInput(direction) {
    const keyCodes = {
        up: 38,
        down: 40,
        left: 37,
        right: 39
    };
    // Precisamos importar 'changeDirection' de game.js para isso funcionar
    // import { changeDirection } from './game.js';
    // changeDirection({ keyCode: keyCodes[direction] });
    
    // Por enquanto, vamos deixar um log para mostrar que funciona
    console.log(`Botão mobile pressionado: ${direction}`);
}

// Nota: A lógica complexa de popular a loja com skins, upgrades e conquistas
// também viveria aqui, em funções como `populateShopSkins()`, `populateUpgrades()`, etc.
// Elas seriam chamadas quando o botão da loja fosse clicado.