// ============================================
// CONFIGURAÇÃO & CONSTANTES
// ============================================

// API URLs - detecta automaticamente se está em Docker ou local
export const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:17091'  // Rodando localmente (porta 17091)
    : `http://${window.location.hostname}:17091`;  // Rodando em Docker

export const API_URL = `${API_BASE_URL}/api/quiz`;

// Versão exibida em runtime. O cache busting em index.html continua manual enquanto não houver build tooling.
export const APP_VERSION = '2.1.0';

// Sistema de Níveis Quest
export const QUEST_LEVELS = [
    { min: 0, max: 500, name: 'Escudeiro', badge: 'bronze', description: 'Aprendiz', icon: 'shield' },
    { min: 501, max: 1000, name: 'Cartógrafo', badge: 'silver', description: 'Explorador', icon: 'map' },
    { min: 1001, max: 1500, name: 'Cavaleiro', badge: 'gold', description: 'Guardião', icon: 'sword' },
    { min: 1501, max: 2000, name: 'Oráculo', badge: 'principal', description: 'Sábio', icon: 'crystal' },
    { min: 2001, max: 9999, name: 'Grão-Mestre', badge: 'legend', description: 'Arquiteto-Mor', icon: 'crown' }
];

// Constantes do Quiz
export const MAX_QUESTIONS = 7;
export const HINT_XP_PENALTY = 10;
export const TIMEOUT_DURATION = 300; // 5 minutos em segundos
export const LAB_IDS = Object.freeze(['lab1', 'lab2', 'lab3']);
export const QUIZ_RESULT_MAX_XP = 1500;
export const DEFAULT_CHAPTER_MAX_XP = 1500;

// Treinamento: todos os capítulos ficam disponíveis para permitir navegação livre durante o workshop.
export const TRAINING_UNLOCK_ALL_CHAPTERS = true;

export const QUIZ_DELAYS = Object.freeze({
    validationWarningMs: 3000,
    startErrorReturnMs: 3000,
    invalidQuestionNotificationMs: 5000,
    timeoutNotificationMs: 5000,
    timeoutFallbackMs: 3000,
    hintNotificationMs: 22000,
    apiErrorNotificationMs: 8000,
    completionRedirectMs: 1500,
    chapterCompleteNotificationMs: 10000,
    chapterCompleteReturnMs: 10000,
    finishErrorNotificationMs: 5000,
    finishErrorReturnMs: 2000,
    exportSuccessNotificationMs: 5000
});

