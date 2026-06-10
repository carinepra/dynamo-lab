// ============================================
// GERENCIAMENTO DE ESTADO
// ============================================
// Estado global do quiz - todos os dados da sessão atual

export const state = {
    sessionId: null,
    currentQuestion: null,
    currentQuestionIndex: 0,
    totalQuestions: 7,
    totalXP: 0,
    playerName: '',
    language: 'python',
    contentLanguage: 'en',
    timer: null,
    timeRemaining: 0,
    startTime: null,
    hintsUsed: 0,
    answers: [],
    currentLab: null,
    labsProgress: {},
    nextQuestion: null,
    quizCompleted: false,
    isStartingChapter: false,
    autoAdvanceTimeout: null  // Para controlar auto-advance após timeout
};

// Expor state para testes E2E
if (typeof window !== 'undefined') {
    window.state = state;
}

// Funções auxiliares para manipular o estado
export function resetState() {
    state.sessionId = null;
    state.currentQuestion = null;
    state.currentQuestionIndex = 0;
    state.totalXP = 0;
    state.answers = [];
    state.hintsUsed = 0;
    state.quizCompleted = false;
    state.nextQuestion = null;
}

export function updateXP(amount) {
    state.totalXP += amount;
    if (state.totalXP < 0) state.totalXP = 0;
    return state.totalXP;
}

export function setState(updates) {
    Object.assign(state, updates);
}

export function getCurrentLevel() {
    // Esta função será implementada no módulo levels.js
    // mas deixamos aqui como placeholder
    return state.totalXP;
}

