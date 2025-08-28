// js/state.js

// Estado do Jogo (Valores que mudam durante a partida)
export const gameState = {
    snake: [],
    foods: [],
    dx: 0,
    dy: 0,
    changingDirection: false,
    isGameOver: false,
    score: 0,
    loop: null,
};

// Dados do Jogador (Valores que persistem entre partidas)
export const playerData = {
    totalRedApples: 0,
    totalGoldenPoints: 0,
    upgrades: {},
    stats: {},
    equippedSkin: 'green',
    purchasedSkins: ['green'],
    claimedAchievements: []
};