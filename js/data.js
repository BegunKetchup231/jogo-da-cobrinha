// js/data.js
import { playerData } from './state.js';
import { updateScores } from './ui.js';

// Usamos uma chave única para salvar todos os dados em um só objeto
const STORAGE_KEY = 'snakeGameData';

/**
 * Salva o objeto playerData no localStorage.
 */
export function savePlayerData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData));
    } catch (e) {
        console.error("Falha ao salvar os dados:", e);
    }
}

/**
 * Carrega os dados do localStorage para o objeto playerData.
 * Se não houver dados salvos, os valores padrão são mantidos.
 */
export function loadPlayerData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Mescla os dados salvos no objeto playerData.
            // Isso garante que se novas propriedades forem adicionadas no código,
            // o jogo não quebre com um save antigo.
            Object.assign(playerData, parsedData);
        } catch (e) {
            console.error("Falha ao carregar os dados:", e);
            // Em caso de erro, continua com os dados padrão.
        }
    }
    
    // Atualiza a UI com os dados carregados (ou padrão)
    updateScores();
}