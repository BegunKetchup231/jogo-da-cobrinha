// js/main.js
import { startGame, changeDirection } from './game.js';
import { loadPlayerData } from './data.js';
import { setupUI } from './ui.js';

// Função principal que roda quando a página carrega
function init() {
    loadPlayerData(); // Carrega os dados salvos do jogador
    setupUI();        // Configura os botões da interface
    startGame();      // Inicia a primeira partida
}

// Adiciona os listeners de eventos
document.addEventListener('keydown', changeDirection);

// Inicializa o jogo
init();