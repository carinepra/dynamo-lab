// ============================================
// SCREENS MODULE
// ============================================
// Gerenciamento de navegação entre telas

/**
 * Referências para as telas principais
 */
export const screens = {
    start: document.getElementById('start-screen'),
    questMap: document.getElementById('quest-map-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen')
};

/**
 * Mostra uma tela específica e oculta todas as outras
 * @param {string} screenName - Nome da tela: start, questMap, quiz, result
 */
export function showScreen(screenName) {
    // Ocultar todas as telas
    hideAllScreens();
    
    // Mostrar tela especificada
    if (screens[screenName]) {
        screens[screenName].classList.remove('hidden');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log(`📺 Tela exibida: ${screenName}`);
    } else {
        console.error(`Tela não encontrada: ${screenName}`);
    }
}

/**
 * Oculta todas as telas
 */
export function hideAllScreens() {
    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.add('hidden');
        }
    });
}

/**
 * Retorna para a tela inicial
 */
export function exitToStart() {
    showScreen('start');
    console.log('🏠 Retornado à tela inicial');
}

/**
 * Retorna para o mapa de quest
 */
export function returnToQuestMap() {
    showScreen('questMap');
    console.log('🗺️ Retornado ao mapa de quest');
}

/**
 * Vai para a tela de quiz
 */
export function goToQuiz() {
    showScreen('quiz');
    console.log('📝 Iniciando quiz');
}

/**
 * Vai para a tela de resultado
 */
export function goToResult() {
    showScreen('result');
    console.log('🏆 Mostrando resultado');
}

/**
 * Verifica se uma tela está visível
 * @param {string} screenName - Nome da tela
 * @returns {boolean} true se tela está visível
 */
export function isScreenVisible(screenName) {
    const screen = screens[screenName];
    if (!screen) return false;
    return !screen.classList.contains('hidden');
}

/**
 * Obtém a tela atual visível
 * @returns {string|null} Nome da tela atual ou null
 */
export function getCurrentScreen() {
    for (const [name, screen] of Object.entries(screens)) {
        if (screen && !screen.classList.contains('hidden')) {
            return name;
        }
    }
    return null;
}

/**
 * Adiciona animação de transição suave entre telas
 * @param {string} screenName - Nome da tela destino
 * @param {string} animation - Tipo de animação: 'fade', 'slide'
 */
export function transitionToScreen(screenName, animation = 'fade') {
    const currentScreen = getCurrentScreen();
    
    if (currentScreen) {
        const current = screens[currentScreen];
        
        // Aplicar animação de saída
        if (animation === 'fade') {
            current.style.opacity = '0';
            setTimeout(() => {
                current.classList.add('hidden');
                current.style.opacity = '';
                showScreenWithAnimation(screenName, animation);
            }, 300);
        } else {
            showScreen(screenName);
        }
    } else {
        showScreen(screenName);
    }
}

/**
 * Mostra tela com animação de entrada
 * @param {string} screenName - Nome da tela
 * @param {string} animation - Tipo de animação
 */
function showScreenWithAnimation(screenName, animation) {
    const screen = screens[screenName];
    if (!screen) return;
    
    if (animation === 'fade') {
        screen.style.opacity = '0';
        screen.classList.remove('hidden');
        requestAnimationFrame(() => {
            screen.style.transition = 'opacity 0.3s ease';
            screen.style.opacity = '1';
            setTimeout(() => {
                screen.style.transition = '';
            }, 300);
        });
    } else {
        showScreen(screenName);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Verifica se todas as telas foram carregadas corretamente
 * @returns {boolean} true se todas as telas existem
 */
export function validateScreens() {
    const missing = [];
    
    for (const [name, screen] of Object.entries(screens)) {
        if (!screen) {
            missing.push(name);
        }
    }
    
    if (missing.length > 0) {
        console.error(`❌ Telas não encontradas: ${missing.join(', ')}`);
        return false;
    }
    
    console.log('✅ Todas as telas carregadas');
    return true;
}

// Validar na inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateScreens);
} else {
    validateScreens();
}

console.log('✅ Screens module loaded');

