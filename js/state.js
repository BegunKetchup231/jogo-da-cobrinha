// js/state.js

// Estado do Jogo (Valores que mudam durante a partida e são resetados)
export const gameState = {
    snake: [],
    foods: [],
    obstacles: [],
    dx: 0,
    dy: 0,
    changingDirection: false,
    isGameOver: false,
    sessionAppleCount: 0,
    loop: null,
    runMultiplier: 1.0,
    growthSinceMultiplierIncrease: 0,
    bonusCharges: 0,
    obstacleSpawnTimer: null,
    obstaclesSurvivedInRun: 0,
};

// Dados do Jogador (Valores que persistem entre partidas)
export const playerData = {
    totalRedApples: 0,
    totalGoldenPoints: 0,
    upgrades: {},
    stats: {
        totalRedApples: 0,
        totalGoldenPoints: 0,
        maxSnakeSize: 0,
        totalObstaclesSurvived: 0,
    },
    equippedSkin: 'green',
    purchasedSkins: ['green'],
    claimedAchievements: []
};