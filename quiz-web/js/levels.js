// ============================================
// SISTEMA DE NÍVEIS QUEST
// ============================================
// Gerenciamento de níveis, badges e ícones SVG de progressão

import { QUEST_LEVELS } from './config.js';

/**
 * Gera um ícone SVG para um tipo de nível específico
 * @param {string} iconType - Tipo de ícone: shield, map, sword, crystal, crown
 * @param {string} gradientId - ID único para o gradiente SVG
 * @returns {string} - String HTML do SVG
 */
export function getLevelIcon(iconType, gradientId) {
    const icons = {
        shield: `<svg class="quest-level-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#c0a445;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#886B1D;stop-opacity:1" />
            </linearGradient></defs>
            <path d="M16 4 L24 8 L24 16 Q24 22 16 28 Q8 22 8 16 L8 8 Z" fill="url(#${gradientId})"/>
            <path d="M16 8 L20 10 L20 16 Q20 20 16 24 Q12 20 12 16 L12 10 Z" fill="#fff" opacity="0.3"/>
        </svg>`,
        map: `<svg class="quest-level-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#abbdc8;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#546c7e;stop-opacity:1" />
            </linearGradient></defs>
            <rect x="4" y="6" width="24" height="20" rx="2" fill="url(#${gradientId})"/>
            <path d="M10 6 L10 26 M16 6 L16 26 M22 6 L22 26" stroke="#ffffff" stroke-width="1.5" opacity="0.4"/>
            <circle cx="13" cy="13" r="2" fill="#f9e27d"/>
            <circle cx="19" cy="19" r="2" fill="#ffffff"/>
        </svg>`,
        sword: `<svg class="quest-level-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f9e27d;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#c0a445;stop-opacity:1" />
            </linearGradient></defs>
            <rect x="8" y="4" width="16" height="4" fill="url(#${gradientId})"/>
            <rect x="14" y="8" width="4" height="16" fill="url(#${gradientId})"/>
            <rect x="12" y="24" width="8" height="3" rx="1" fill="url(#${gradientId})"/>
            <circle cx="16" cy="28" r="1.5" fill="url(#${gradientId})"/>
        </svg>`,
        crystal: `<svg class="quest-level-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a259ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#823cd6;stop-opacity:1" />
            </linearGradient></defs>
            <path d="M16 4 L10 12 L16 28 L22 12 Z" fill="url(#${gradientId})"/>
            <path d="M16 4 L16 28 M10 12 L22 12" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
        </svg>`,
        crown: `<svg class="quest-level-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a259ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#823cd6;stop-opacity:1" />
            </linearGradient></defs>
            <path d="M6 24 L8 12 L16 18 L24 12 L26 24 Z" fill="url(#${gradientId})"/>
            <circle cx="8" cy="12" r="2" fill="#f9e27d"/>
            <circle cx="16" cy="8" r="2" fill="#f9e27d"/>
            <circle cx="24" cy="12" r="2" fill="#f9e27d"/>
        </svg>`
    };
    return icons[iconType] || icons.shield;
}

/**
 * Obt

ém o rank/nível baseado no XP atual
 * @param {number} xp - XP total do jogador
 * @returns {Object} - {name, icon, class} do nível
 */
export function getRank(xp) {
    const level = QUEST_LEVELS.find(l => xp >= l.min && xp <= l.max);
    if (!level) {
        // Se passar de 9999 XP, retorna Grão-Mestre
        const lastLevel = QUEST_LEVELS[QUEST_LEVELS.length - 1];
        return { name: lastLevel.name, icon: lastLevel.icon, class: lastLevel.badge };
    }
    return { name: level.name, icon: level.emoji, class: level.badge };
}

/**
 * Atualiza o badge visual de nível do jogador na interface
 * @param {number} xp - XP total do jogador
 */
export function updatePlayerLevel(xp) {
    const level = QUEST_LEVELS.find(l => xp >= l.min && xp <= l.max) || QUEST_LEVELS[QUEST_LEVELS.length - 1];
    
    // Atualizar badge no mapa da quest
    const badge = document.getElementById('player-badge');
    if (badge) {
        badge.className = `quest-level-badge quest-level-${level.badge}`;
        const iconContainer = badge.querySelector('.quest-level-icon');
        if (iconContainer) {
            iconContainer.outerHTML = getLevelIcon(level.icon, `level-icon-${level.badge}`);
        }
        const nameEl = badge.querySelector('.quest-level-name');
        if (nameEl) nameEl.textContent = level.name;
        const xpEl = badge.querySelector('.quest-level-xp');
        if (xpEl) xpEl.innerHTML = `<span id="total-xp-display">${xp}</span> / ${level.max} XP`;
    }
    
    // Atualizar badge no quiz (se existir)
    const badgeQuiz = document.getElementById('player-badge-quiz');
    if (badgeQuiz) {
        badgeQuiz.className = `quest-level-badge quest-level-${level.badge}`;
        const iconContainer = badgeQuiz.querySelector('.quest-level-icon');
        if (iconContainer) {
            iconContainer.outerHTML = getLevelIcon(level.icon, `level-icon-quiz-${level.badge}`);
        }
        const nameEl = badgeQuiz.querySelector('.quest-level-name');
        if (nameEl) nameEl.textContent = level.name;
        const xpEl = badgeQuiz.querySelector('.quest-level-xp');
        if (xpEl) xpEl.innerHTML = `<span id="xp-quiz-display">${xp}</span> XP`;
    }
    
    // Atualizar barra de progresso XP
    const xpBar = document.getElementById('xp-bar-fill');
    if (xpBar) {
        const progress = ((xp - level.min) / (level.max - level.min)) * 100;
        xpBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

/**
 * Obtém informações detalhadas do nível atual
 * @param {number} xp - XP total do jogador
 * @returns {Object} - Informações completas do nível
 */
export function getCurrentLevelInfo(xp) {
    const level = QUEST_LEVELS.find(l => xp >= l.min && xp <= l.max) || QUEST_LEVELS[QUEST_LEVELS.length - 1];
    return {
        ...level,
        progress: ((xp - level.min) / (level.max - level.min)) * 100,
        xpToNext: level.max - xp
    };
}

console.log('✅ Levels module loaded');

