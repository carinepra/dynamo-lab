// ============================================
// FEEDBACK MODULE
// ============================================
// Sistema de feedback visual (loading, confirmação, resultados)

import { Icons } from '../icons.js';
import { escapeHTML, formatMarkdown } from '../utils/markdown.js';

/**
 * Elementos DOM do sistema de feedback
 */
const elements = {
    feedback: () => document.getElementById('feedback-area'),
    loadingOverlay: () => document.getElementById('loading-overlay'),
    confirmModal: () => document.getElementById('confirm-modal')
};

const FEEDBACK_TEXT = {
    'pt-BR': {
        correct: 'Correto!',
        incorrect: 'Incorreto',
        finalResult: 'Ver Resultado Final',
        nextQuestion: 'Próxima Questão',
        itemsScanned: 'items lidos'
    },
    en: {
        correct: 'Correct!',
        incorrect: 'Incorrect',
        finalResult: 'View Final Result',
        nextQuestion: 'Next Question',
        itemsScanned: 'items scanned'
    }
};

function getFeedbackText(contentLanguage = 'pt-BR') {
    return FEEDBACK_TEXT[contentLanguage] || FEEDBACK_TEXT['pt-BR'];
}

/**
 * Mostra feedback do resultado de uma resposta
 * @param {Object} result - Resultado da validação
 * @param {string} contentLanguage - Idioma de conteúdo selecionado
 */
export function showFeedback(result, contentLanguage = 'pt-BR') {
    const feedback = elements.feedback();  // Corrigido: não é função, é propriedade
    const text = getFeedbackText(contentLanguage);
    
    if (!feedback) {
        console.error('Feedback element not found');
        return;
    }
    
    feedback.classList.remove('hidden', 'success', 'error');
    feedback.classList.add(result.correct ? 'success' : 'error');
    
    const icon = result.correct ? '✅' : '❌';
    const title = result.correct ? text.correct : text.incorrect;
    
    // Estatísticas de execução (se disponível)
    let statsHtml = '';
    if (result.execution_time_ms !== null && result.execution_time_ms !== undefined) {
        const executionTime = Number(result.execution_time_ms);
        const executionTimeLabel = Number.isFinite(executionTime) ? executionTime.toFixed(2) : '0.00';
        const itemsScanned = result.items_scanned !== null && result.items_scanned !== undefined
            ? escapeHTML(result.items_scanned)
            : null;
        statsHtml = `
            <div class="feedback-stats">
                <div class="feedback-stat">${Icons.get('timer')} ${executionTimeLabel}ms</div>
                ${itemsScanned !== null ? 
                    `<div class="feedback-stat">${Icons.get('stats')} ${itemsScanned} ${text.itemsScanned}</div>` : ''}
            </div>
        `;
    }
    
    // Formatar feedback com Markdown
    const formattedFeedback = formatMarkdown(result.feedback);
    
    // Botão de ação (Próxima ou Ver Resultado)
    let actionButton = '';
    if (result.quiz_completed) {
        actionButton = `
            <button class="btn-primary" data-action="next-question" type="button">
                ${Icons.get('trophy')} ${text.finalResult}
            </button>
        `;
    } else if (result.next_question) {
        // Sempre avançar para próxima questão (sem "tentar novamente")
        actionButton = `
            <button class="btn-primary" data-action="next-question" type="button">
                ${Icons.get('next')} ${text.nextQuestion}
            </button>
        `;
    }
    
    feedback.innerHTML = `
        <h3>${icon} ${title}</h3>
        <div class="feedback-content">
            ${formattedFeedback}
        </div>
        ${statsHtml}
        ${actionButton}
    `;
    
    feedback.classList.remove('hidden');
    
    // Scroll suave para o feedback
    setTimeout(() => {
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Oculta o feedback
 */
export function hideFeedback() {
    const feedback = elements.feedback();
    if (feedback) {
        feedback.classList.add('hidden');
    }
}

/**
 * Mostra/oculta overlay de carregamento
 * @param {boolean} show - true para mostrar, false para ocultar
 * @param {string} message - Mensagem de carregamento
 */
export function showLoading(show, message = 'Carregando...') {
    const loadingOverlay = elements.loadingOverlay();
    
    if (!loadingOverlay) {
        console.warn('Loading overlay element not found');
        return;
    }
    
    if (show) {
        loadingOverlay.classList.remove('hidden');
        if (message) {
            const messageEl = loadingOverlay.querySelector('p');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

/**
 * Alias para ocultar loading
 */
export function hideLoading() {
    showLoading(false);
}

/**
 * Mostra modal de confirmação
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem do modal
 * @returns {Promise<boolean>} true se confirmado, false se cancelado
 */
export function showConfirm(title, message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-modal-title');
        const messageEl = document.getElementById('confirm-modal-message');
        const cancelBtn = document.getElementById('confirm-modal-cancel');
        const okBtn = document.getElementById('confirm-modal-ok');
        
        // Fallback para native confirm
        if (!modal || !titleEl || !messageEl || !cancelBtn || !okBtn) {
            console.error('Modal elements not found, using native confirm');
            resolve(confirm(`${title}\n\n${message}`));
            return;
        }
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        modal.classList.remove('hidden');
        
        const handleCancel = () => {
            modal.classList.add('hidden');
            cancelBtn.removeEventListener('click', handleCancel);
            okBtn.removeEventListener('click', handleOk);
            resolve(false);
        };
        
        const handleOk = () => {
            modal.classList.add('hidden');
            cancelBtn.removeEventListener('click', handleCancel);
            okBtn.removeEventListener('click', handleOk);
            resolve(true);
        };
        
        cancelBtn.addEventListener('click', handleCancel);
        okBtn.addEventListener('click', handleOk);
    });
}

/**
 * Oculta o modal de confirmação
 */
export function hideConfirm() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Mostra uma mensagem de sucesso temporária
 * @param {string} message - Mensagem de sucesso
 * @param {number} duration - Duração em ms
 */
export function showSuccess(message, duration = 3000) {
    const feedback = elements.feedback();
    if (!feedback) return;
    
    feedback.classList.remove('hidden', 'error');
    feedback.classList.add('success');
    feedback.innerHTML = `<h3>✅ ${escapeHTML(message)}</h3>`;
    
    if (duration > 0) {
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, duration);
    }
}

/**
 * Mostra uma mensagem de erro temporária
 * @param {string} message - Mensagem de erro
 * @param {number} duration - Duração em ms
 */
export function showError(message, duration = 5000) {
    const feedback = elements.feedback();
    if (!feedback) return;
    
    feedback.classList.remove('hidden', 'success');
    feedback.classList.add('error');
    feedback.innerHTML = `<h3>❌ ${escapeHTML(message)}</h3>`;
    
    if (duration > 0) {
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, duration);
    }
}

console.log('✅ Feedback module loaded');

