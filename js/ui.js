// js/ui.js
import { startGame, changeDirection } from './game.js';
import { gameState, playerData } from './state.js';
import { savePlayerData } from './data.js';
import { SKINS, UPGRADES, ACHIEVEMENTS } from './constants.js';

// --- Seletores de Elementos DOM ---
const totalRedAppleScoreElement = document.getElementById('totalRedAppleScore');
const goldenScoreElement = document.getElementById('goldenScore');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScoreElement = document.getElementById('finalScore');
const multiplierBarFill = document.getElementById('multiplierBarFill');
const bonusCounterContainer = document.getElementById('bonusCounterContainer');
const bonusChargesElement = document.getElementById('bonusCharges');

// Botões
const restartButton = document.getElementById('restartButton');
const restartButtonGameOver = document.getElementById('restartButtonGameOver');
const shopButton = document.getElementById('shopButton');
const backToGameOverButton = document.getElementById('backToGameOverButton');
const skinsTabButton = document.getElementById('skinsTabButton');
const upgradesTabButton = document.getElementById('upgradesTabButton');
const achievementsTabButton = document.getElementById('achievementsTabButton');

// Loja
const shopMenu = document.getElementById('shopMenu');
const skinsContent = document.getElementById('skinsContent');
const upgradesContent = document.getElementById('upgradesContent');
const achievementsContent = document.getElementById('achievementsContent');

export function setupUI() {
    const handleRestart = () => {
        gameOverMessage.classList.add('hidden');
        shopMenu.classList.add('hidden');
        startGame();
    };
    restartButton.addEventListener('click', handleRestart);
    restartButtonGameOver.addEventListener('click', handleRestart);

    shopButton.addEventListener('click', () => {
        gameOverMessage.classList.add('hidden');
        shopMenu.classList.remove('hidden');
        skinsTabButton.click(); // Abre na aba de skins por padrão
    });
    backToGameOverButton.addEventListener('click', () => {
        shopMenu.classList.add('hidden');
        gameOverMessage.classList.remove('hidden');
    });

    // Lógica das Abas da Loja
    skinsTabButton.addEventListener('click', () => switchTab('skins'));
    upgradesTabButton.addEventListener('click', () => switchTab('upgrades'));
    achievementsTabButton.addEventListener('click', () => switchTab('achievements'));
    
    // Controles Mobile
    document.getElementById('upBtn').addEventListener('click', () => changeDirection({ keyCode: 38 }));
    document.getElementById('downBtn').addEventListener('click', () => changeDirection({ keyCode: 40 }));
    document.getElementById('leftBtn').addEventListener('click', () => changeDirection({ keyCode: 37 }));
    document.getElementById('rightBtn').addEventListener('click', () => changeDirection({ keyCode: 39 }));
}

function switchTab(tabName) {
    // Esconde todos
    [skinsContent, upgradesContent, achievementsContent].forEach(c => c.classList.add('hidden'));
    [skinsTabButton, upgradesTabButton, achievementsTabButton].forEach(b => b.classList.remove('active'));

    // Mostra o selecionado
    const content = document.getElementById(`${tabName}Content`);
    const button = document.getElementById(`${tabName}TabButton`);
    content.classList.remove('hidden');
    button.classList.add('active');

    // Popula o conteúdo
    if (tabName === 'skins') populateSkins();
    if (tabName === 'upgrades') populateUpgrades();
    if (tabName === 'achievements') populateAchievements();
}

function populateSkins() {
    skinsContent.innerHTML = '';
    SKINS.forEach(skin => {
        // ... (A lógica de criar e popular os elementos da loja de skins vai aqui)
        // Esta é uma recriação simplificada da sua lógica original:
        const isPurchased = playerData.purchasedSkins.includes(skin.id);
        const isEquipped = skin.id === playerData.equippedSkin;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center justify-between bg-gray-800 p-2 rounded-lg';
        
        let buttonHTML;
        if (isEquipped) {
            buttonHTML = `<button class="shop-btn text-xs font-bold py-2 px-3 rounded-md bg-gray-500" disabled>EQUIPADO</button>`;
        } else if (isPurchased) {
            buttonHTML = `<button class="shop-btn text-xs font-bold py-2 px-3 rounded-md bg-green-500 hover:bg-green-600" data-skin-id="${skin.id}">EQUIPAR</button>`;
        } else {
            const canAfford = playerData.totalGoldenPoints >= skin.cost;
            buttonHTML = `<button class="shop-btn text-xs font-bold py-2 px-3 rounded-md ${canAfford ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-600 opacity-50'}" ${!canAfford ? 'disabled' : ''} data-skin-id="${skin.id}" data-cost="${skin.cost}">COMPRAR <span class="text-yellow-300">${skin.cost}</span></button>`;
        }

        itemDiv.innerHTML = `
            <span class="text-xs">${skin.name}</span>
            ${buttonHTML}
        `;
        skinsContent.appendChild(itemDiv);
    });

    // Adiciona eventos aos novos botões
    skinsContent.querySelectorAll('button[data-skin-id]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.skinId;
            if (e.currentTarget.dataset.cost) { // É uma compra
                playerData.totalGoldenPoints -= parseInt(e.currentTarget.dataset.cost);
                playerData.purchasedSkins.push(id);
            }
            playerData.equippedSkin = id;
            savePlayerData();
            updateScores();
            populateSkins(); // Re-renderiza a lista
        });
    });
}

function populateUpgrades() {
    // Lógica para popular upgrades...
    upgradesContent.innerHTML = 'Funcionalidade de Upgrades a ser implementada.';
}
function populateAchievements() {
    // Lógica para popular conquistas...
    achievementsContent.innerHTML = 'Funcionalidade de Conquistas a ser implementada.';
}


export function showGameOver(score) {
    finalScoreElement.textContent = score;
    gameOverMessage.classList.remove('hidden');
}

export function updateScores() {
    totalRedAppleScoreElement.textContent = Math.floor(playerData.totalRedApples);
    goldenScoreElement.textContent = playerData.totalGoldenPoints;
}

export function updateMultiplierBar() {
    const percentage = ((gameState.runMultiplier - 1) / (2 - 1)) * 100;
    multiplierBarFill.style.height = `${percentage}%`;
}

export function updateBonusCounterUI() {
    bonusChargesElement.textContent = gameState.bonusCharges;
    bonusCounterContainer.style.opacity = gameState.bonusCharges > 0 ? '1' : '0.2';
}