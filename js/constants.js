// js/constants.js

// --- Configurações do Jogo ---
export const GAME_SPEED = 120; // Velocidade do jogo em milissegundos (quanto menor, mais rápido)
export const GRID_SIZE = 20;   // O tabuleiro tem 20x20 quadrados
export const TILE_SIZE = 20;   // Cada quadrado tem 20x20 pixels

// --- Dados das Skins ---
export const SKINS = [
    { id: 'green', name: 'Verde Clássico', head: '#48bb78', body: '#38a169', cost: 0 },
    { id: 'blue', name: 'Azul Elétrico', head: '#4299e1', body: '#3182ce', cost: 10 },
    { id: 'purple', name: 'Roxo Real', head: '#9f7aea', body: '#805ad5', cost: 100 },
    { id: 'orange', name: 'Laranja Atômico', head: '#f6ad55', body: '#ed8936', cost: 1000 },
    { id: 'rainbow', name: 'Arco-Íris Mítico', head: 'red', body: 'orange', cost: -1 } // Custo -1 significa que é uma recompensa
];

// --- Dados dos Upgrades ---
export const UPGRADES = {
    appleValue: { 
        name: 'Maçã Nutritiva', 
        desc: 'Ganha +1 maçã vermelha por coleta.', 
        maxLevel: 10, 
        cost: level => Math.floor(75 * Math.pow(1.8, level)), 
        type: 'red' 
    },
    maxApples: { 
        name: 'Cesta Maior', 
        desc: 'Aumenta o nº de maçãs no mapa.', 
        maxLevel: 5, 
        cost: level => Math.floor(200 * Math.pow(1.9, level)), 
        type: 'red' 
    },
    bonusChance: { 
        name: 'Sorte Bônus', 
        desc: 'Aumenta a chance da Maçã Bônus.', 
        maxLevel: 4, 
        cost: () => 200, 
        type: 'golden' 
    }
};

// --- Dados das Conquistas ---
export const ACHIEVEMENTS = {
    red500: { name: 'Novato', desc: 'Colete 500 maçãs vermelhas.', goal: 500, reward: 25, check: (stats) => stats.totalRedApples || 0 },
    gold100: { name: 'Rei Midas', desc: 'Colete 100 moedas douradas.', goal: 100, reward: 50, check: (stats) => stats.totalGoldenPoints || 0 },
    size50: { name: 'Comilão', desc: 'Alcance um tamanho de 50.', goal: 50, reward: 75, check: (stats) => stats.maxSnakeSize || 0 },
    allSkins: { name: 'Mestre das Skins', desc: 'Compre todas as skins.', goal: SKINS.filter(s => s.cost > 0).length, reward: 150, check: (pData) => pData.purchasedSkins.length - 1 },
    allAchievements: { name: 'Colecionador', desc: 'Desbloqueie todas as outras conquistas.', goal: () => Object.keys(ACHIEVEMENTS).length -1, reward: 0, check: (pData) => pData.claimedAchievements.length }
};