// ============================================
// NOTIFICATION SYSTEM
// ============================================
// Toast notifications para feedback do usuário

import { Icons } from '../icons.js';

/**
 * Elementos DOM do sistema de notificação
 */
const elements = {
    notificationToast: document.getElementById('notification-toast'),
    notificationIcon: document.getElementById('notification-icon'),
    notificationMessage: document.getElementById('notification-message'),
    notificationClose: document.getElementById('notification-close')
};

/**
 * Timeout da notificação atual
 */
let notificationTimeout = null;

/**
 * Mapa de ícones para tipos de notificação
 */
const notificationIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: '💡',
    timeout: '⏰',
    hint: '🤖'
};

/**
 * Mostra uma notificação toast com HTML confiável (ícones SVG internos).
 * @param {string} htmlContent - HTML gerado internamente pela aplicação
 * @param {string} type - Tipo: success, error, warning, info, timeout, hint
 * @param {number} duration - Duração em ms (0 = não fecha automaticamente)
 */
export function showRichNotification(htmlContent, type = 'info', duration = 5000) {
    if (!elements.notificationToast || !elements.notificationMessage) {
        alert(htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
        return;
    }

    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    if (elements.notificationIcon) {
        elements.notificationIcon.textContent = notificationIcons[type] || notificationIcons.info;
    }

    elements.notificationMessage.innerHTML = htmlContent;

    elements.notificationToast.classList.remove('success', 'error', 'warning', 'info', 'timeout', 'hint', 'rich');
    elements.notificationToast.classList.add(type, 'rich');

    elements.notificationToast.classList.remove('hidden');

    if (duration > 0) {
        notificationTimeout = setTimeout(() => {
            hideNotification();
        }, duration);
    }
}

/**
 * Mostra uma notificação toast
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo: success, error, warning, info, timeout, hint
 * @param {number} duration - Duração em ms (0 = não fecha automaticamente)
 */
export function showNotification(message, type = 'info', duration = 5000) {
    // Fallback para alert se elementos não existirem
    if (!elements.notificationToast || !elements.notificationIcon || !elements.notificationMessage) {
        const icon = notificationIcons[type] || notificationIcons.info;
        alert(`${icon} ${message}`);
        return;
    }
    
    // Limpar timeout anterior
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Configurar ícone
    if (elements.notificationIcon) {
        elements.notificationIcon.textContent = notificationIcons[type] || notificationIcons.info;
    }
    
    // Configurar mensagem sem interpretar HTML vindo de API/usuário.
    if (elements.notificationMessage) {
        const lines = String(message).split('\n');
        elements.notificationMessage.replaceChildren();
        lines.forEach((line, index) => {
            if (index > 0) {
                elements.notificationMessage.appendChild(document.createElement('br'));
            }
            elements.notificationMessage.appendChild(document.createTextNode(line));
        });
    }
    
    // Remover classes de tipo anteriores
    elements.notificationToast.classList.remove('success', 'error', 'warning', 'info', 'timeout', 'hint', 'rich');
    elements.notificationToast.classList.add(type);
    
    // Mostrar notificação
    elements.notificationToast.classList.remove('hidden');
    
    // Auto-ocultar após duration (se duration > 0)
    if (duration > 0) {
        notificationTimeout = setTimeout(() => {
            hideNotification();
        }, duration);
    }
}

/**
 * Oculta a notificação atual
 */
export function hideNotification() {
    if (elements.notificationToast) {
        elements.notificationToast.classList.add('hidden');
    }
    
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
        notificationTimeout = null;
    }
}

/**
 * Mostra uma notificação de sucesso
 * @param {string} message - Mensagem
 * @param {number} duration - Duração em ms
 */
export function showSuccess(message, duration = 3000) {
    showNotification(message, 'success', duration);
}

/**
 * Mostra uma notificação de erro
 * @param {string} message - Mensagem
 * @param {number} duration - Duração em ms
 */
export function showError(message, duration = 5000) {
    showNotification(message, 'error', duration);
}

/**
 * Mostra uma notificação de aviso
 * @param {string} message - Mensagem
 * @param {number} duration - Duração em ms
 */
export function showWarning(message, duration = 4000) {
    showNotification(message, 'warning', duration);
}

/**
 * Mostra uma notificação informativa
 * @param {string} message - Mensagem
 * @param {number} duration - Duração em ms
 */
export function showInfo(message, duration = 3000) {
    showNotification(message, 'info', duration);
}

/**
 * Inicializa o sistema de notificações
 */
export function initNotifications() {
    // Adicionar listener no botão de fechar
    if (elements.notificationClose) {
        elements.notificationClose.addEventListener('click', hideNotification);
    }
    
    console.log('✅ Notifications module initialized');
}

// Auto-inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}

console.log('✅ Notifications module loaded');

