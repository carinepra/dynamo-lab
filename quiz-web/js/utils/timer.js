// ============================================
// TIMER MODULE
// ============================================
// Gerenciamento do cronômetro do quiz

import { state } from '../state.js';
import { Icons } from '../icons.js';

/**
 * Elemento DOM do timer
 */
const timerElement = () => document.getElementById('timer');

/**
 * Callback para quando o tempo esgotar
 */
let onTimeoutCallback = null;

/**
 * Inicia o cronômetro
 * @param {number} seconds - Tempo em segundos
 * @param {Function} onTimeout - Callback quando tempo esgotar
 */
export function startTimer(seconds, onTimeout = null) {
    // Armazenar callback
    if (onTimeout) {
        onTimeoutCallback = onTimeout;
    }
    
    // Limpar timer anterior se existir (prevenir múltiplos timers)
    stopTimer();
    
    // Inicializar tempo
    state.timeRemaining = seconds;
    state.startTime = Date.now();
    updateTimerDisplay();
    
    // Iniciar interval
    state.timer = setInterval(() => {
        state.timeRemaining--;
        updateTimerDisplay();
        
        if (state.timeRemaining <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
    
    console.log(`⏱️ Timer iniciado: ${seconds}s`);
}

/**
 * Para o cronômetro
 */
export function stopTimer() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
        console.log('⏹️ Timer parado');
    }
}

/**
 * Atualiza o display do timer na interface
 */
export function updateTimerDisplay() {
    const element = timerElement();
    if (!element) {
        return;
    }
    
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Atualizar conteúdo com ícone
    element.innerHTML = Icons.get('timer') + ` ${timeStr}`;
    
    // Alerta visual quando faltam 30 segundos
    if (state.timeRemaining <= 30) {
        element.style.color = '#f44336'; // Vermelho
        element.classList.add('timer-warning');
    } else {
        element.style.color = '';
        element.classList.remove('timer-warning');
    }
    
    // Alerta extra quando faltam 10 segundos
    if (state.timeRemaining <= 10 && state.timeRemaining > 0) {
        element.classList.add('timer-critical');
    } else {
        element.classList.remove('timer-critical');
    }
}

/**
 * Manipula o evento de timeout (tempo esgotado)
 * Chama o callback registrado ou executa ação padrão
 */
function handleTimeout() {
    console.log('⏰ Timeout! Tempo esgotado.');
    
    if (onTimeoutCallback && typeof onTimeoutCallback === 'function') {
        onTimeoutCallback();
    }
}

/**
 * Obtém o tempo decorrido desde o início
 * @returns {number} Segundos decorridos
 */
export function getElapsedTime() {
    if (!state.startTime) {
        return 0;
    }
    return Math.floor((Date.now() - state.startTime) / 1000);
}

/**
 * Obtém o tempo restante
 * @returns {number} Segundos restantes
 */
export function getRemainingTime() {
    return state.timeRemaining || 0;
}

/**
 * Adiciona tempo ao cronômetro (bônus)
 * @param {number} seconds - Segundos a adicionar
 */
export function addTime(seconds) {
    state.timeRemaining += seconds;
    updateTimerDisplay();
    console.log(`➕ ${seconds}s adicionados ao timer`);
}

/**
 * Remove tempo do cronômetro (penalidade)
 * @param {number} seconds - Segundos a remover
 */
export function removeTime(seconds) {
    state.timeRemaining = Math.max(0, state.timeRemaining - seconds);
    updateTimerDisplay();
    console.log(`➖ ${seconds}s removidos do timer`);
}

/**
 * Pausa o cronômetro
 */
export function pauseTimer() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
        console.log('⏸️ Timer pausado');
    }
}

/**
 * Retoma o cronômetro pausado
 */
export function resumeTimer() {
    if (!state.timer && state.timeRemaining > 0) {
        state.timer = setInterval(() => {
            state.timeRemaining--;
            updateTimerDisplay();
            
            if (state.timeRemaining <= 0) {
                stopTimer();
                handleTimeout();
            }
        }, 1000);
        console.log('▶️ Timer retomado');
    }
}

/**
 * Verifica se o timer está ativo
 * @returns {boolean} true se timer está rodando
 */
export function isTimerActive() {
    return state.timer !== null;
}

console.log('✅ Timer module loaded');

