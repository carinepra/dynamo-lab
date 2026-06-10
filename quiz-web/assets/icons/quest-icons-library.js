/**
 * BIBLIOTECA DE ÍCONES QUEST - IDENTIDADE VISUAL AURORA LABS
 * Todos os ícones em SVG seguindo as cores e estilo da Aurora Labs
 * Versão: 1.1.0 - 27/11/2025 (otimizada)
 */

const QuestIcons = {
    
    // ============================================
    // STATUS ICONS
    // ============================================
    
    available: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="avail-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#67d2df"/><stop offset="100%" style="stop-color:#4fb9c6"/></linearGradient></defs><path d="M16 4 L19 13 L28 13 L21 19 L24 28 L16 22 L8 28 L11 19 L4 13 L13 13 Z" fill="url(#avail-g)" stroke="#fff" stroke-width="1.5"/><circle cx="16" cy="16" r="2" fill="#f9e27d"/></svg>`,
    
    inProgress: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="prog-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f9e27d"/><stop offset="100%" style="stop-color:#c0a445"/></linearGradient></defs><path d="M16 6 Q12 12 14 16 Q10 18 12 24 Q14 20 16 22 Q18 20 20 24 Q22 18 18 16 Q20 12 16 6 Z" fill="url(#prog-g)"/><path d="M16 10 Q14 14 15 16 Q13 17 14 20 Q15 18 16 19 Q17 18 18 20 Q19 17 17 16 Q18 14 16 10 Z" fill="#fff" opacity="0.6"/></svg>`,
    
    locked: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="lock-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#abbdc8"/><stop offset="100%" style="stop-color:#546c7e"/></linearGradient></defs><rect x="10" y="16" width="12" height="10" rx="2" fill="url(#lock-g)"/><path d="M13 16 L13 12 Q13 9 16 9 Q19 9 19 12 L19 16" fill="none" stroke="url(#lock-g)" stroke-width="2.5"/><circle cx="16" cy="21" r="1.5" fill="#fff"/></svg>`,
    
    completed: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="comp-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#789d4a"/><stop offset="100%" style="stop-color:#558833"/></linearGradient></defs><circle cx="16" cy="16" r="12" fill="url(#comp-g)"/><path d="M10 16 L14 20 L22 12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    
    // ============================================
    // ACTION ICONS
    // ============================================
    
    mission: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="miss-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f94f48"/><stop offset="100%" style="stop-color:#d13630"/></linearGradient></defs><circle cx="16" cy="16" r="11" fill="none" stroke="url(#miss-g)" stroke-width="2"/><circle cx="16" cy="16" r="7" fill="none" stroke="url(#miss-g)" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="url(#miss-g)"/></svg>`,
    
    timer: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="time-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#002740"/><stop offset="100%" style="stop-color:#003d5c"/></linearGradient></defs><circle cx="16" cy="18" r="10" fill="none" stroke="url(#time-g)" stroke-width="2.5"/><path d="M16 18 L16 11" stroke="#67d2df" stroke-width="2.5" stroke-linecap="round"/><path d="M16 18 L20 20" stroke="#67d2df" stroke-width="2" stroke-linecap="round"/><rect x="13" y="6" width="6" height="3" rx="1" fill="url(#time-g)"/></svg>`,
    
    xp: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="xp-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f9e27d"/><stop offset="100%" style="stop-color:#c0a445"/></linearGradient></defs><path d="M16 4 L18 12 L26 12 L20 17 L22 25 L16 20 L10 25 L12 17 L6 12 L14 12 Z" fill="url(#xp-g)" stroke="#886B1D" stroke-width="1"/><circle cx="16" cy="15" r="3" fill="#fff" opacity="0.5"/></svg>`,
    
    note: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="note-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#67d2df"/><stop offset="100%" style="stop-color:#39a0ae"/></linearGradient></defs><rect x="8" y="6" width="16" height="20" rx="2" fill="url(#note-g)"/><line x1="11" y1="11" x2="21" y2="11" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="15" x2="21" y2="15" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><line x1="11" y1="19" x2="17" y2="19" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    
    trophy: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="troph-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f9e27d"/><stop offset="100%" style="stop-color:#c0a445"/></linearGradient></defs><path d="M11 8 L11 12 Q11 16 16 16 Q21 16 21 12 L21 8 Z" fill="url(#troph-g)"/><rect x="14" y="16" width="4" height="6" fill="url(#troph-g)"/><rect x="11" y="22" width="10" height="2" rx="1" fill="url(#troph-g)"/><path d="M10 8 L8 8 Q6 8 6 11 Q6 13 8 13 L10 13" fill="none" stroke="url(#troph-g)" stroke-width="2"/><path d="M22 8 L24 8 Q26 8 26 11 Q26 13 24 13 L22 13" fill="none" stroke="url(#troph-g)" stroke-width="2"/><circle cx="16" cy="11" r="2" fill="#fff" opacity="0.4"/></svg>`,
    
    stats: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="stat-g" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" style="stop-color:#789d4a"/><stop offset="100%" style="stop-color:#558833"/></linearGradient></defs><rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="#002740" stroke-width="2"/><rect x="9" y="18" width="3" height="6" rx="1" fill="url(#stat-g)"/><rect x="14" y="14" width="3" height="10" rx="1" fill="url(#stat-g)"/><rect x="19" y="10" width="3" height="14" rx="1" fill="url(#stat-g)"/></svg>`,
    
    map: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="map-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#67d2df"/><stop offset="100%" style="stop-color:#39a0ae"/></linearGradient></defs><rect x="4" y="6" width="24" height="20" rx="2" fill="url(#map-g)"/><path d="M10 6 L10 26 M16 6 L16 26 M22 6 L22 26" stroke="#fff" stroke-width="1.5" opacity="0.4"/><circle cx="13" cy="13" r="2" fill="#f9e27d"/><circle cx="19" cy="19" r="2" fill="#fff"/><path d="M13 13 L19 19" stroke="#fff" stroke-width="1.5" stroke-dasharray="2,2"/></svg>`,
    
    tool: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="tool-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#abbdc8"/><stop offset="100%" style="stop-color:#546c7e"/></linearGradient></defs><rect x="8" y="14" width="16" height="4" rx="2" fill="url(#tool-g)"/><circle cx="10" cy="16" r="4" fill="none" stroke="url(#tool-g)" stroke-width="2"/><rect x="20" y="12" width="6" height="8" rx="1" fill="url(#tool-g)"/></svg>`,
    
    error: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="err-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f94f48"/><stop offset="100%" style="stop-color:#d13630"/></linearGradient></defs><circle cx="16" cy="16" r="12" fill="url(#err-g)"/><path d="M12 12 L20 20 M20 12 L12 20" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
    
    success: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="succ-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#67d2df"/><stop offset="100%" style="stop-color:#4fb9c6"/></linearGradient></defs><path d="M16 4 L17 15 L16 16 L15 15 Z" fill="url(#succ-g)"/><path d="M28 16 L17 17 L16 16 L17 15 Z" fill="url(#succ-g)"/><path d="M16 28 L15 17 L16 16 L17 17 Z" fill="url(#succ-g)"/><path d="M4 16 L15 15 L16 16 L15 17 Z" fill="url(#succ-g)"/><circle cx="16" cy="16" r="3" fill="#f9e27d"/></svg>`,
    
    book: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="quest-icon-inline"><defs><linearGradient id="book-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#67d2df"/><stop offset="100%" style="stop-color:#39a0ae"/></linearGradient></defs><rect x="14" y="10" width="20" height="28" rx="2" fill="url(#book-g)"/><rect x="16" y="12" width="16" height="24" rx="1" fill="#e6f9ff"/><rect x="14" y="10" width="3" height="28" fill="#4fb9c6"/><line x1="20" y1="18" x2="28" y2="18" stroke="#002740" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="22" x2="28" y2="22" stroke="#002740" stroke-width="1.5" stroke-linecap="round"/><line x1="20" y1="26" x2="26" y2="26" stroke="#002740" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    
    // ============================================
    // CHAPTER ICONS (Ícones de Capítulos)
    // ============================================
    
    academy: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="quest-icon-chapter"><defs><linearGradient id="acad-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#002740"/><stop offset="100%" style="stop-color:#003d5c"/></linearGradient></defs><polygon points="24,8 28,12 20,12" fill="#001a2e"/><rect x="18" y="12" width="12" height="28" rx="2" fill="url(#acad-g)"/><rect x="14" y="30" width="20" height="10" rx="2" fill="#002740"/><rect x="22" y="16" width="4" height="4" fill="#67d2df" opacity="0.6"/><rect x="22" y="22" width="4" height="4" fill="#67d2df" opacity="0.6"/><rect x="22" y="28" width="4" height="4" fill="#67d2df" opacity="0.6"/></svg>`,
    
    sword: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="quest-icon-chapter"><defs><linearGradient id="sword-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#abbdc8"/><stop offset="100%" style="stop-color:#546c7e"/></linearGradient></defs><g transform="rotate(-45 24 24)"><rect x="22" y="8" width="4" height="24" fill="url(#sword-g)" rx="1"/><polygon points="22,8 24,4 26,8" fill="#67d2df"/><rect x="18" y="32" width="12" height="3" fill="#f9e27d" rx="1"/><rect x="22" y="35" width="4" height="6" fill="#002740" rx="1"/><circle cx="24" cy="40" r="2" fill="#f9e27d"/></g></svg>`,
    
    crystal: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="quest-icon-chapter"><defs><linearGradient id="crys-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#a259ff"/><stop offset="100%" style="stop-color:#823cd6"/></linearGradient></defs><polygon points="24,10 30,18 30,30 24,38 18,30 18,18" fill="url(#crys-g)"/><polygon points="24,10 28,16 24,22 20,16" fill="#eee6ff" opacity="0.4"/><circle cx="24" cy="24" r="4" fill="#fff" opacity="0.3"/></svg>`,
    
    crown: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="quest-icon-chapter"><defs><linearGradient id="crown-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f9e27d"/><stop offset="100%" style="stop-color:#c0a445"/></linearGradient></defs><path d="M10 32 L12 20 L18 26 L24 16 L30 26 L36 20 L38 32 Z" fill="url(#crown-g)"/><rect x="10" y="32" width="28" height="4" rx="2" fill="url(#crown-g)"/><circle cx="12" cy="20" r="2" fill="#f94f48"/><circle cx="24" cy="16" r="2" fill="#67d2df"/><circle cx="36" cy="20" r="2" fill="#789d4a"/></svg>`,
    
    shield: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="quest-icon-chapter"><defs><linearGradient id="shld-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#c0a445"/><stop offset="100%" style="stop-color:#886B1D"/></linearGradient></defs><path d="M24 8 L36 14 L36 24 Q36 32 24 40 Q12 32 12 24 L12 14 Z" fill="url(#shld-g)"/><path d="M24 14 L30 18 L30 24 Q30 28 24 34 Q18 28 18 24 L18 18 Z" fill="#fff" opacity="0.3"/><path d="M20 22 L23 25 L28 20" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    
    graduation: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="quest-icon-chapter"><defs><linearGradient id="grad-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#002740"/><stop offset="100%" style="stop-color:#124666"/></linearGradient></defs><polygon points="24,14 38,20 24,26 10,20" fill="url(#grad-g)"/><rect x="22" y="26" width="4" height="8" fill="url(#grad-g)"/><circle cx="24" cy="34" r="2" fill="#f9e27d"/><path d="M36 22 L36 28 Q36 30 24 32 Q12 30 12 28 L12 22" fill="#67d2df" opacity="0.4"/></svg>`,
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    /**
     * Retorna o SVG de um ícone específico
     * @param {string} iconName - Nome do ícone
     * @returns {string} - HTML do SVG
     */
    get(iconName) {
        return this[iconName] || this.available;
    },
    
    /**
     * Retorna o ícone de status apropriado
     * @param {string} status - Status (unlocked, in-progress, locked, completed)
     * @returns {string} - HTML do SVG
     */
    getStatus(status) {
        const statusMap = {
            'unlocked': 'available',
            'in-progress': 'inProgress',
            'locked': 'locked',
            'completed': 'completed'
        };
        return this.get(statusMap[status] || 'available');
    },
    
    /**
     * Retorna o ícone de capítulo baseado no emoji ou nome
     * @param {string} emojiOrName - Emoji ou nome do capítulo
     * @returns {string} - HTML do SVG
     */
    getChapter(emojiOrName) {
        const chapterMap = {
            '🏛️': 'academy',
            '⚔️': 'sword',
            '🔮': 'crystal',
            '👑': 'crown',
            '🛡️': 'shield',
            '📚': 'book',
            '🎓': 'graduation',
            '🗺️': 'map',
            '📖': 'book',
            '🏰': 'academy',
            '💎': 'crystal'
        };
        return this.get(chapterMap[emojiOrName] || 'academy');
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.QuestIcons = QuestIcons;
    console.log('✅ QuestIcons carregado! Total de ícones:', Object.keys(QuestIcons).length - 3);
    console.log('📦 Exemplo de ícone XP:', QuestIcons.get('xp').substring(0, 50) + '...');
}

// Exportar para Node.js (se aplicável)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestIcons;
}
