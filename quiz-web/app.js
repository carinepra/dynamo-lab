// ============================================
// AURORA LABS DYNAMODB QUEST - MAIN ENTRY POINT
// ============================================
// Versão: 2.1.0 (Modular)
// Arquitetura: ES6 Modules (11 módulos)
// ============================================

// ============================================
// IMPORTS - Core Modules
// ============================================
import {
    API_URL,
    APP_VERSION,
    QUEST_LEVELS,
    MAX_QUESTIONS,
    HINT_XP_PENALTY,
    LAB_IDS,
    QUIZ_DELAYS,
    QUIZ_RESULT_MAX_XP,
    DEFAULT_CHAPTER_MAX_XP,
    TRAINING_UNLOCK_ALL_CHAPTERS
} from './js/config.js';
import { SVG, Icons } from './js/icons.js';
import { state, setState } from './js/state.js';
import { getLevelIcon, updatePlayerLevel, getRank } from './js/levels.js';
import * as API from './js/api.js';

// ============================================
// IMPORTS - UI Modules
// ============================================
import { screens, showScreen, hideAllScreens } from './js/ui/screens.js';
import { showFeedback, showLoading, showConfirm, hideLoading } from './js/ui/feedback.js';
import { showNotification, showRichNotification, hideNotification } from './js/ui/notifications.js';

// ============================================
// IMPORTS - Utils Modules
// ============================================
import { startTimer, stopTimer, updateTimerDisplay } from './js/utils/timer.js';
import { getAnswerFromUI, disableAnswerInputs } from './js/utils/validator.js';
import { escapeHTML, formatMarkdown } from './js/utils/markdown.js';

// ============================================
// EXPOR PARA TESTES E2E
// ============================================
// Expor state e funções globalmente para permitir acesso em testes E2E
if (typeof window !== 'undefined') {
    window.state = state;
    window.setState = setState;
    window.QUEST_LEVELS = QUEST_LEVELS;
    window.Icons = Icons;
}

// ============================================
// ELEMENTOS DO DOM (Locais)
// ============================================
const elements = {
    playerName: document.getElementById('player-name'),
    language: document.getElementById('language'),
    contentLanguage: document.getElementById('content-language'),
    enterQuestBtn: document.getElementById('enter-quest-btn'),
    playerNameDisplay: document.getElementById('player-name-display'),
    playerLanguageDisplay: document.getElementById('player-language-display'),
    totalXPDisplay: document.getElementById('total-xp-display'),
    rankDisplay: document.getElementById('rank-display'),
    chaptersContainer: document.getElementById('chapters-container'),
    progressTableBody: document.getElementById('progress-table-body'),
    ranksJourney: document.getElementById('ranks-journey'),
    questionNumber: document.getElementById('question-number'),
    timer: document.getElementById('timer'),
    xp: document.getElementById('xp'),
    questionTitle: document.getElementById('question-title'),
    questionDescription: document.getElementById('question-description'),
    answerArea: document.getElementById('answer-area'),
    hintBtn: document.getElementById('hint-btn'),
    validateBtn: document.getElementById('validate-btn'),
    feedback: document.getElementById('feedback-area'),
    finalStats: document.getElementById('final-stats'),
    restartBtn: document.getElementById('restart-btn'),
    exportBtn: document.getElementById('export-btn'),
    notificationClose: document.getElementById('notification-close')
};

function safeIconText(value) {
    return Icons.replaceEmojis(escapeHTML(value || ''));
}

const UI_TEXT = {
    'pt-BR': {
        nameRequired: 'Por favor, digite seu nome!',
        codeLanguageRequired: 'Por favor, selecione uma linguagem!',
        contentLanguageRequired: 'Por favor, selecione o idioma do conteúdo!',
        loadingChapters: 'Carregando capítulos...',
        loadingStartChapter: 'Iniciando capítulo...',
        loadingValidate: 'Validando resposta...',
        loadingTimeout: 'Processando timeout...',
        loadingFinish: 'Finalizando capítulo...',
        available: 'DISPONÍVEL',
        inProgress: 'EM PROGRESSO',
        locked: 'BLOQUEADO',
        completed: 'COMPLETO',
        learnTitle: 'O que você vai aprender:',
        missions: 'Missões:',
        redo: 'REFAZER',
        continue: 'CONTINUAR',
        start: 'COMEÇAR',
        blocked: 'BLOQUEADO',
        progressLocked: 'Bloqueado',
        progressCompleted: 'Completo',
        progressInProgress: 'Em progresso',
        progressAvailable: 'Disponível',
        questionLabel: 'Pergunta',
        invalidQuestionReceived: 'Erro: questão inválida recebida do servidor.',
        invalidQuestionCore: 'Questão sem id, título ou tipo.',
        invalidTimer: 'Questão sem timer válido.',
        invalidOptions: 'Questão de múltipla escolha sem opções.',
        invalidType: 'Tipo de questão desconhecido',
        defaultMultipleChoice: 'Escolha a opção correta:',
        defaultOpenAnswer: 'Preencha os campos com a Partition Key (PK) e Sort Key (SK) corretas:',
        defaultCode: 'Escreva o código para resolver o problema:',
        answerRequired: 'Por favor, preencha sua resposta!',
        timeoutNotification: 'Tempo esgotado! Mostrando resposta correta...',
        loadingButton: 'Carregando...',
        hintTitle: 'Pedir Ajuda ao Copilot',
        hintConfirm: `Pedir ajuda custará ${HINT_XP_PENALTY} XP. Deseja continuar?`,
        hintLabel: 'DICA',
        hintPenalty: 'Penalidade',
        chapterComplete: 'CAPÍTULO COMPLETO!',
        xpEarned: 'XP ganhos!',
        totalXP: 'XP Total',
        rankLabel: 'Rank',
        nextChapterUnlocked: 'Próximo capítulo desbloqueado!',
        playerNameLabel: 'Nome do(a) Aventureiro(a):',
        codingLanguageLabel: 'Escolha sua Arma (Linguagem):',
        contentLanguageLabel: 'Idioma do Conteúdo:',
        enterQuestMap: 'Entrar no Mapa da Quest',
        adventurerLabel: 'Aventureiro(a):',
        codingLanguageShort: 'Linguagem:',
        chapterMapTitle: 'Mapa de Capítulos',
        overallProgressTitle: 'Progresso Geral',
        chapterColumn: 'Capítulo',
        statusColumn: 'Status',
        heroSubtitle: 'Domine o DynamoDB e resolva o desafio de escala',
        introWelcomeTitle: 'Bem-vindo ao Reino da Aurora Labs!',
        introWelcomeBody: 'Venha explorar DynamoDB - uma tecnologia poderosa para bancos de dados de alta performance!',
        introScenarioTitle: 'Cenário de Aprendizado:',
        introScenarioBody: 'Zelda e Link precisam de uma home do app ultra-rápida. Vamos usar este desafio para aprender DynamoDB na prática!',
        introQuestTitle: 'Sua Quest:',
        introQuestItem1: 'Dominar uma nova tecnologia AWS',
        introQuestItem2: 'Entender quando e como usar NoSQL',
        introQuestItem3: 'Expandir seu arsenal de ferramentas!',
        formBadge: '💫 Preencha para começar sua quest',
        playerNamePlaceholder: 'Digite seu nome',
        hintBtnLabel: `Dica (-10 XP)`,
        validateBtnLabel: 'Validar Resposta',
        modalCancel: 'Cancelar',
        modalConfirm: 'Confirmar',
        adventurerJourney: 'Jornada do Aventureiro',
        youAreHere: '← Você'
    },
    en: {
        nameRequired: 'Please enter your name.',
        codeLanguageRequired: 'Please select a coding language.',
        contentLanguageRequired: 'Please select a content language.',
        loadingChapters: 'Loading chapters...',
        loadingStartChapter: 'Starting chapter...',
        loadingValidate: 'Validating answer...',
        loadingTimeout: 'Processing timeout...',
        loadingFinish: 'Finishing chapter...',
        available: 'AVAILABLE',
        inProgress: 'IN PROGRESS',
        locked: 'LOCKED',
        completed: 'COMPLETED',
        learnTitle: 'What you will learn:',
        missions: 'Missions:',
        redo: 'RETRY',
        continue: 'CONTINUE',
        start: 'START',
        blocked: 'LOCKED',
        progressLocked: 'Locked',
        progressCompleted: 'Completed',
        progressInProgress: 'In progress',
        progressAvailable: 'Available',
        questionLabel: 'Question',
        invalidQuestionReceived: 'Error: invalid question received from the server.',
        invalidQuestionCore: 'Question is missing id, title, or type.',
        invalidTimer: 'Question has no valid timer.',
        invalidOptions: 'Multiple-choice question has no options.',
        invalidType: 'Unknown question type',
        defaultMultipleChoice: 'Choose the correct option:',
        defaultOpenAnswer: 'Fill in the correct Partition Key (PK) and Sort Key (SK):',
        defaultCode: 'Write the code to solve the problem:',
        answerRequired: 'Please fill in your answer.',
        timeoutNotification: 'Time is up! Showing the correct answer...',
        loadingButton: 'Loading...',
        hintTitle: 'Ask Copilot for Help',
        hintConfirm: `Asking for help costs ${HINT_XP_PENALTY} XP. Do you want to continue?`,
        hintLabel: 'HINT',
        hintPenalty: 'Penalty',
        chapterComplete: 'CHAPTER COMPLETED!',
        xpEarned: 'XP earned!',
        totalXP: 'Total XP',
        rankLabel: 'Rank',
        nextChapterUnlocked: 'Next chapter unlocked!',
        playerNameLabel: 'Adventurer Name:',
        codingLanguageLabel: 'Choose Your Tool (Coding Language):',
        contentLanguageLabel: 'Content Language:',
        enterQuestMap: 'Enter Quest Map',
        adventurerLabel: 'Adventurer:',
        codingLanguageShort: 'Coding language:',
        chapterMapTitle: 'Chapter Map',
        overallProgressTitle: 'Overall Progress',
        chapterColumn: 'Chapter',
        statusColumn: 'Status',
        heroSubtitle: 'Master DynamoDB and tackle the scale challenge',
        introWelcomeTitle: 'Welcome to the Aurora Labs Kingdom!',
        introWelcomeBody: 'Explore DynamoDB - a powerful technology for high-performance databases!',
        introScenarioTitle: 'Learning Scenario:',
        introScenarioBody: 'Zelda and Link need an ultra-fast app home screen. We will use this challenge to learn DynamoDB in practice!',
        introQuestTitle: 'Your Quest:',
        introQuestItem1: 'Master a new AWS technology',
        introQuestItem2: 'Understand when and how to use NoSQL',
        introQuestItem3: 'Expand your toolkit!',
        formBadge: '✦ Fill in to start your quest',
        playerNamePlaceholder: 'Enter your name',
        hintBtnLabel: `Hint (-10 XP)`,
        validateBtnLabel: 'Validate Answer',
        modalCancel: 'Cancel',
        modalConfirm: 'Confirm',
        adventurerJourney: 'Adventurer Journey',
        youAreHere: '← You'
    }
};

function t(key) {
    const dictionary = UI_TEXT[state.contentLanguage] || UI_TEXT['pt-BR'];
    return dictionary[key] || UI_TEXT['pt-BR'][key] || key;
}

function localizeContent(value) {
    if (!value || state.contentLanguage !== 'en') return value;
    return value.translations?.en || value;
}

function localizeChapter(chapter) {
    if (!chapter || state.contentLanguage !== 'en') return chapter;
    const translation = chapter.translations?.en || {};
    return {
        ...chapter,
        ...translation,
        details: {
            ...(chapter.details || {}),
            ...(translation.details || {})
        }
    };
}

function applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-badge]').forEach((element) => {
        element.dataset.badgeText = t(element.dataset.i18nBadge);
    });
}

function getChapterMaxXP(chapter) {
    const xpText = chapter?.details?.xp || '';
    const parsedXP = Number.parseInt(String(xpText).replace(/[^\d]/g, ''), 10);
    return Number.isFinite(parsedXP) && parsedXP > 0 ? parsedXP : DEFAULT_CHAPTER_MAX_XP;
}

// ============================================
// QUEST MAP - CHAPTERS METADATA
// ============================================
let CHAPTERS = [];

/**
 * Carrega metadados dos capítulos de cada lab
 */
async function loadChaptersMetadata() {
    const loadedChapters = [];
    
    for (const lab of LAB_IDS) {
        try {
            const response = await fetch(`../labs/${lab}/metadata.json`, { cache: 'no-store' });
            if (response.ok) {
                const metadata = await response.json();
                loadedChapters.push(metadata);
                console.log(`✅ Metadata carregado: ${lab}`);
            } else {
                console.warn(`⚠️  Metadata não encontrado para ${lab}`);
            }
        } catch (error) {
            console.error(`❌ Erro ao carregar metadata de ${lab}:`, error);
        }
    }
    
    CHAPTERS = loadedChapters;
    console.log(`📚 Total de ${CHAPTERS.length} capítulos carregados`);
    
    return CHAPTERS;
}

// ============================================
// QUEST MAP - FUNCTIONS
// ============================================

function loadProgress() {
    const saved = localStorage.getItem('quest_progress');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.playerName === state.playerName) {
                const labsProgress = data.labsProgress || {};
                // Recalcular XP total a partir do progresso dos labs para evitar descompasso
                const calculatedXP = Object.values(labsProgress)
                    .reduce((sum, lab) => sum + (lab.xpEarned || 0), 0);
                setState({
                    labsProgress: labsProgress,
                    totalXP: calculatedXP,
                    contentLanguage: data.contentLanguage || 'en'
                });
            }
        } catch (e) {
            console.error('Erro ao carregar progresso:', e);
        }
    }
}

function saveProgress() {
    const data = {
        playerName: state.playerName,
        language: state.language,
        contentLanguage: state.contentLanguage,
        labsProgress: state.labsProgress,
        totalXP: state.totalXP,
        lastUpdated: Date.now()
    };
    localStorage.setItem('quest_progress', JSON.stringify(data));
}

function getChapterStatus(chapter) {
    const progress = state.labsProgress[chapter.id];
    
    if (progress && progress.completed) {
        return 'completed';
    }
    
    if (progress && progress.xpEarned > 0) {
        return 'in-progress';
    }
    
    if (TRAINING_UNLOCK_ALL_CHAPTERS) {
        return 'unlocked';
    }
    
    if (!chapter.unlockRequirement) {
        return 'unlocked';
    }
    
    return state.labsProgress[chapter.unlockRequirement]?.completed ? 'unlocked' : 'locked';
}

async function enterQuestMap() {
    const name = elements.playerName.value.trim();
    const language = elements.language.value;
    const contentLanguage = elements.contentLanguage?.value || 'pt-BR';
    
    if (!name) {
        showNotification(t('nameRequired'), 'warning', QUIZ_DELAYS.validationWarningMs);
        if (elements.playerName) elements.playerName.focus();
        return;
    }
    
    if (!language) {
        showNotification(t('codeLanguageRequired'), 'warning', QUIZ_DELAYS.validationWarningMs);
        return;
    }
    
    if (!contentLanguage) {
        showNotification(t('contentLanguageRequired'), 'warning', QUIZ_DELAYS.validationWarningMs);
        return;
    }
    
    setState({ playerName: name, language: language, contentLanguage: contentLanguage });
    applyStaticTranslations();
    
    // Atualizar displays
    if (elements.playerNameDisplay) {
        elements.playerNameDisplay.textContent = name;
    }
    if (elements.playerLanguageDisplay) {
        elements.playerLanguageDisplay.textContent = getLanguageDisplay(language);
        
        const languageIcon = document.getElementById('language-icon-header');
        if (languageIcon) {
            languageIcon.outerHTML = getLanguageIconSVG(language);
        }
    }
    
    loadProgress();
    // Re-aplicar escolha explícita do usuário (loadProgress pode restaurar valor antigo do localStorage)
    setState({ contentLanguage: contentLanguage });
    applyStaticTranslations();
    
    // Sempre recarregar capítulos para garantir traduções atualizadas
    showLoading(true, t('loadingChapters'));
    await loadChaptersMetadata();
    showLoading(false);
    
    renderChapters();
    renderProgressTable();
    renderLevelsTable();
    updatePlayerStats();
    
    showScreen('questMap');
}

function renderChapters() {
    if (!elements.chaptersContainer) {
        console.warn('chaptersContainer não encontrado');
        return;
    }
    
    elements.chaptersContainer.innerHTML = '';
    
    CHAPTERS.forEach((chapter) => {
        const chapterView = localizeChapter(chapter);
        const status = getChapterStatus(chapter);
        const progress = state.labsProgress[chapter.id] || { xpEarned: 0, percentage: 0 };
        
        const card = document.createElement('div');
        card.className = `chapter-card ${status}`;
        
        const isLocked = status === 'locked';
        const isCompleted = status === 'completed';
        const accordionId = `accordion-${String(chapter.id || '').replace(/[^a-zA-Z0-9_-]/g, '-')}`;
        const safeTitle = escapeHTML(chapterView.title);
        const safeSubtitle = escapeHTML(chapterView.subtitle);
        const safeNarrator = safeIconText(chapterView.narrator);
        const safeHighlights = (chapterView.highlights || []).map(h => `<li>${safeIconText(h)}</li>`).join('');
        const safeMissions = (chapterView.missions || []).map(m => `<li>${safeIconText(m)}</li>`).join('');
        const safeTime = escapeHTML(chapterView.details?.time || '');
        const safeXP = escapeHTML(chapterView.details?.xp || '');
        const safeType = escapeHTML(chapterView.details?.type || '');
        const safeBadge = safeIconText(chapterView.details?.badge || '');
        
        card.innerHTML = `
            <div class="chapter-summary" data-action="toggle-chapter" data-accordion-id="${accordionId}">
                <div class="chapter-header-compact">
                    <div class="chapter-icon">${Icons.getChapter(chapter.icon)}</div>
                    <div class="chapter-title-group">
                        <h2>${safeTitle}</h2>
                        <p class="chapter-subtitle">${safeSubtitle}</p>
                    </div>
                    <div class="chapter-meta">
                        <span class="chapter-status-compact ${status}">
                            ${status === 'unlocked' ? Icons.getStatus('unlocked') + ' ' + t('available') : ''}
                            ${status === 'in-progress' ? Icons.getStatus('in-progress') + ' ' + t('inProgress') : ''}
                            ${status === 'locked' ? Icons.getStatus('locked') + ' ' + t('locked') : ''}
                            ${status === 'completed' ? Icons.getStatus('completed') + ' ' + t('completed') : ''}
                        </span>
                        <span class="chapter-xp-compact">${Icons.get('xp')} ${escapeHTML(progress.xpEarned || 0)} / ${safeXP}</span>
                    </div>
                    ${isLocked ? '<div class="lock-icon-compact">' + Icons.get('locked') + '</div>' : ''}
                    <button
                        class="accordion-toggle"
                        type="button"
                        data-action="toggle-chapter"
                        data-accordion-id="${accordionId}"
                        id="toggle-${accordionId}"
                        aria-expanded="false"
                        aria-controls="${accordionId}"
                        aria-label="Expandir ${safeTitle}"
                    >
                        <span class="toggle-icon"></span>
                    </button>
                </div>
            </div>
            
            <div id="${accordionId}" class="chapter-details-accordion" role="region" aria-labelledby="toggle-${accordionId}">
                <div class="chapter-description">
                    <div class="chapter-narrator">${safeNarrator}</div>
                    
                    <h4 style="margin-top: var(--space-3); color: var(--brand-navy-40); font-weight: 700;">
                        ${t('learnTitle')}
                    </h4>
                    <ul class="chapter-highlights">
                        ${safeHighlights}
                    </ul>
                    
                    <div class="chapter-missions">
                        <h4>${Icons.get('mission')} ${t('missions')}</h4>
                        <ul class="missions-list">
                            ${safeMissions}
                        </ul>
                    </div>
                    
                    <div class="chapter-details">
                        <div class="detail-item">${Icons.get('timer')} ${safeTime}</div>
                        <div class="detail-item">${Icons.get('xp')} ${safeXP}</div>
                        <div class="detail-item">${Icons.get('note')} ${safeType}</div>
                    </div>
                    <div class="chapter-details">
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            ${safeBadge}
                        </div>
                    </div>
                </div>
                
                <div class="chapter-button">
                    <button 
                        class="btn-primary ${isLocked ? 'locked' : ''}" 
                        ${isLocked ? 'disabled' : ''}
                        data-action="start-chapter"
                        data-chapter-id="${escapeHTML(chapter.id)}"
                        data-lab="${escapeHTML(chapter.lab)}"
                    >
                        ${isCompleted ? Icons.get('success') + ' ' + t('redo') : isLocked ? Icons.get('locked') + ' ' + t('blocked') : (status === 'in-progress' ? t('continue') : t('start'))}
                    </button>
                </div>
            </div>
        `;
        
        elements.chaptersContainer.appendChild(card);
    });
}

function toggleAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    if (!accordion) return;
    
    const card = accordion.closest('.chapter-card');
    const toggle = card?.querySelector('.accordion-toggle');
    const willExpand = !accordion.classList.contains('expanded');
    
    accordion.classList.toggle('expanded', willExpand);
    if (toggle) {
        toggle.classList.toggle('expanded', willExpand);
        toggle.setAttribute('aria-expanded', String(willExpand));
        const title = card?.querySelector('.chapter-title-group h2')?.textContent || 'capítulo';
        toggle.setAttribute('aria-label', `${willExpand ? 'Recolher' : 'Expandir'} ${title}`);
    }
}

function handleChapterContainerClick(event) {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget || !elements.chaptersContainer?.contains(actionTarget)) return;
    
    const action = actionTarget.dataset.action;
    
    if (action === 'toggle-chapter') {
        event.preventDefault();
        toggleAccordion(actionTarget.dataset.accordionId);
        return;
    }
    
    if (action === 'start-chapter') {
        event.preventDefault();
        if (actionTarget.disabled) return;
        startChapter(actionTarget.dataset.chapterId, actionTarget.dataset.lab);
    }
}

function renderProgressTable() {
    if (!elements.progressTableBody) {
        console.warn('progressTableBody não encontrado');
        return;
    }
    
    elements.progressTableBody.innerHTML = '';
    
    CHAPTERS.forEach(chapter => {
        const chapterView = localizeChapter(chapter);
        const progress = state.labsProgress[chapter.id] || { xpEarned: 0 };
        const status = getChapterStatus(chapter);
        const shortTitle = chapterView.title.split(':')[1] || chapterView.title;
        const totalXP = String(chapterView.details?.xp || '').replace(' XP', '');
        
        const row = document.createElement('div');
        row.className = 'progress-row';
        
        row.innerHTML = `
            <span>${Icons.getChapter(chapter.icon)} ${escapeHTML(shortTitle)}</span>
            <span>${Icons.getStatus(status)} ${status === 'locked' ? t('progressLocked') : status === 'completed' ? t('progressCompleted') : status === 'in-progress' ? t('progressInProgress') : t('progressAvailable')}</span>
            <span>${escapeHTML(progress.xpEarned)} / ${escapeHTML(totalXP)} XP</span>
        `;
        
        elements.progressTableBody.appendChild(row);
    });
}

function updatePlayerStats() {
    state.totalXP = Object.values(state.labsProgress).reduce((sum, p) => sum + (p.xpEarned || 0), 0);
    updatePlayerLevel(state.totalXP);
    
    const rank = getRank(state.totalXP);
    if (elements.rankDisplay) {
        elements.rankDisplay.textContent = rank.name;
    }
}

/**
 * Renderiza a Jornada do Aventureiro - Cards de classificação
 */
function renderLevelsTable() {
    if (!elements.ranksJourney) {
        console.warn('ranksJourney não encontrado');
        return;
    }
    
    const currentRank = getRank(state.totalXP);
    
    // Emojis alinhados com completion.html
    const RANK_EMOJIS = {
        bronze: '🛡️',      // Escudeiro
        silver: '🗺️',      // Cartógrafo
        gold: '⚔️',        // Cavaleiro
        principal: '🔮',   // Oráculo
        legend: '👑'       // Grão-Mestre
    };
    
    const cards = QUEST_LEVELS.map(level => {
        const isCurrent = currentRank.name === level.name;
        const emoji = RANK_EMOJIS[level.badge] || '⭐';
        return `
            <div class="rank-card rank-${escapeHTML(level.badge)}${isCurrent ? ' current' : ''}"${isCurrent ? ` data-you="${escapeHTML(t('youAreHere'))}"` : ''}>
                <div class="rank-card-icon">${emoji}</div>
                <div class="rank-card-name">${escapeHTML(level.name)}</div>
                <div class="rank-card-desc">${escapeHTML(level.description)}</div>
                <div class="rank-card-xp">${escapeHTML(String(level.min))}+ XP</div>
            </div>
        `;
    }).join('');
    
    elements.ranksJourney.innerHTML = `
        <div class="ranks-journey-title">
            <span>${t('adventurerJourney')}</span>
        </div>
        <div class="ranks-grid">${cards}</div>
    `;
}

// ============================================
// QUIZ - START CHAPTER
// ============================================

async function startChapter(chapterId, lab) {
    if (state.isStartingChapter) {
        return;
    }
    
    setState({ isStartingChapter: true, currentLab: lab });
    
    stopTimer();
    setState({
        sessionId: null,
        currentQuestion: null,
        currentQuestionIndex: 0,
        answers: [],
        hintsUsed: 0,
        nextQuestion: null,
        quizCompleted: false
    });
    
    showLoading(true, t('loadingStartChapter'));
    
    try {
        const session = await API.startQuizSession(state.playerName, state.language, lab, state.contentLanguage);
        
        setState({
            sessionId: session.session_id,
            totalQuestions: session.total_questions,
            startTime: Date.now()
        });
        
        // Zerar progresso ao iniciar/reiniciar capítulo
        state.labsProgress[chapterId] = {
            xpEarned: 0,
            percentage: 0,
            completed: false,
            startedAt: Date.now()
        };
        
        saveProgress();
        showScreen('quiz');
        await loadQuestion(session.first_question);
        
    } catch (error) {
        console.error('❌ Erro ao iniciar quiz:', error);
        showNotification(`Erro ao iniciar capítulo: ${error.message}`, 'error', 0);
        setTimeout(() => showScreen('questMap'), QUIZ_DELAYS.startErrorReturnMs);
    } finally {
        showLoading(false);
        setState({ isStartingChapter: false });
    }
}

// ============================================
// QUIZ - LOAD QUESTION
// ============================================

function validateQuestionContract(question) {
    if (!question || !question.id || !question.title || !question.question_type) {
        return t('invalidQuestionCore');
    }
    
    if (!Number.isFinite(question.timer_seconds) || question.timer_seconds <= 0) {
        return t('invalidTimer');
    }
    
    if (question.question_type === 'multiple_choice') {
        if (!Array.isArray(question.options) || question.options.length === 0) {
            return t('invalidOptions');
        }
    }
    
    if (!['multiple_choice', 'open_answer', 'code'].includes(question.question_type)) {
        return `${t('invalidType')}: ${question.question_type}`;
    }
    
    return null;
}

async function loadQuestion(question) {
    const questionError = validateQuestionContract(question);
    if (questionError) {
        showNotification(`${t('invalidQuestionReceived')} ${questionError}`, 'error', QUIZ_DELAYS.invalidQuestionNotificationMs);
        throw new Error(questionError);
    }
    
    setState({
        currentQuestion: question,
        currentQuestionIndex: state.currentQuestionIndex + 1
    });
    
    // Atualizar header
    if (elements.questionNumber) {
        elements.questionNumber.textContent = `${t('questionLabel')} ${state.currentQuestionIndex}/${state.totalQuestions}`;
    }
    if (elements.xp) {
        elements.xp.innerHTML = `${Icons.get('trophy')} ${state.totalXP} XP`;
    }
    updatePlayerLevel(state.totalXP);
    
    // Atualizar pergunta
    if (elements.questionTitle) {
        elements.questionTitle.textContent = question.title;
    }
    if (elements.questionDescription) {
        if (!question.description || question.description.trim() === '') {
            const defaultDesc = {
                'multiple_choice': t('defaultMultipleChoice'),
                'open_answer': t('defaultOpenAnswer'),
                'code': t('defaultCode')
            };
            elements.questionDescription.innerHTML = defaultDesc[question.question_type] || '';
        } else {
            elements.questionDescription.innerHTML = formatMarkdown(question.description);
        }
    }
    
    // Limpar feedback
    if (elements.feedback) {
        elements.feedback.classList.add('hidden');
    }
    
    // Renderizar área de resposta
    renderAnswerArea(question);
    
    // Iniciar timer com callback de timeout
    startTimer(question.timer_seconds, handleQuizTimeout);
    
    // Habilitar botões
    if (elements.validateBtn) elements.validateBtn.disabled = false;
    if (elements.hintBtn) elements.hintBtn.disabled = false;
}

function renderAnswerArea(question) {
    const area = elements.answerArea;
    
    if (!area) {
        console.error('Answer area element not found');
        return;
    }
    
    area.innerHTML = '';
    
    switch(question.question_type) {
        case 'multiple_choice':
            renderMultipleChoice(question, area);
            break;
        case 'open_answer':
            renderOpenAnswer(question, area);
            break;
        case 'code':
            renderCodeEditor(question, area);
            break;
    }
}

function renderMultipleChoice(question, container) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    
    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'option-label';
        label.innerHTML = `
            <input type="radio" name="answer" value="${index}">
            <span>${escapeHTML(option)}</span>
        `;
        
        label.addEventListener('click', () => {
            document.querySelectorAll('.option-label').forEach(l => {
                l.classList.remove('selected');
                const r = l.querySelector('input[type="radio"]');
                if (r) r.checked = false;
            });
            label.classList.add('selected');
            const radio = label.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
        
        optionsDiv.appendChild(label);
    });
    
    container.appendChild(optionsDiv);
}

function renderOpenAnswer(question, container) {
    container.innerHTML = `
        <div class="open-answer-grid">
            <div>
                <label for="pk-input">Partition Key (PK):</label>
                <input id="pk-input" type="text" placeholder="Ex: EMPLOYEE#uuid..." autocomplete="off">
            </div>
            <div>
                <label for="sk-input">Sort Key (SK):</label>
                <input id="sk-input" type="text" placeholder="Ex: SUMMARY ou PLAN#..." autocomplete="off">
            </div>
            <div>
                <label for="operation">Operação DynamoDB:</label>
                <select id="operation">
                    <option value="GetItem">GetItem (buscar 1 item exato)</option>
                    <option value="Query">Query (buscar múltiplos relacionados)</option>
                    <option value="Scan">Scan (varrer tabela - evitar!)</option>
                </select>
            </div>
        </div>
    `;
}

function renderCodeEditor(question, container) {
    const languageNames = {
        'python': 'Python',
        'go': 'Go',
        'javascript': 'JavaScript'
    };
    
    const placeholders = {
        'python': `# Seu código Python (boto3)\nresponse = dynamodb.query(...)`,
        'go': `// Seu código Go (aws-sdk-go-v2)\nresponse, err := client.Query(...)`,
        'javascript': `// Seu código JavaScript (aws-sdk v3)\nconst response = await client.send(...)`
    };
    
    const languageLabel = languageNames[state.language] || languageNames.python;
    const placeholder = placeholders[state.language] || placeholders.python;
    
    container.innerHTML = `
        <div class="code-editor-container">
            <span class="language-badge">${escapeHTML(languageLabel)}</span>
            <textarea id="code-editor" placeholder="${escapeHTML(placeholder)}" spellcheck="false"></textarea>
        </div>
        <p style="margin-top: 10px; color: #666; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
            <svg viewBox="0 0 32 32" style="width: 16px; height: 16px; flex-shrink: 0;">
                <defs><linearGradient id="hint-note" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f9e27d"/><stop offset="100%" stop-color="#ffeb99"/></linearGradient></defs>
                <circle cx="16" cy="16" r="12" fill="url(#hint-note)"/>
                <path d="M16 8 Q12 12 14 16 Q10 18 12 24 Q14 20 16 22 Q18 20 20 24 Q22 18 18 16 Q20 12 16 8 Z" fill="#002740"/>
            </svg>
            <span>Dica: Você pode trocar de linguagem recomeçando o quiz.</span>
        </p>
    `;
}

// ============================================
// QUIZ - TIMEOUT HANDLER
// ============================================

/**
 * Manipula o timeout do quiz (tempo esgotado)
 * Desabilita botões e submete resposta automática
 */
async function handleQuizTimeout() {
    console.log('⏰ Tempo esgotado! Processando timeout...');
    
    // Desabilitar botões imediatamente
    if (elements.validateBtn) elements.validateBtn.disabled = true;
    if (elements.hintBtn) elements.hintBtn.disabled = true;
    disableAnswerInputs();
    
    // Mostrar notificação de timeout
    showNotification(`⏰ ${t('timeoutNotification')}`, 'warning', QUIZ_DELAYS.timeoutNotificationMs);
    
    showLoading(true, t('loadingTimeout'));
    
    try {
        // Submeter resposta vazia indicando timeout
        const result = await API.submitAnswer(
            state.sessionId,
            state.currentQuestion.id,
            '[TIMEOUT]', // Resposta especial indicando timeout
            '', // Sem código
            '', // Sem PK
            ''  // Sem SK
        );
        
        // Atualizar XP (provavelmente 0 ou negativo)
        setState({ totalXP: state.totalXP + result.xp_earned });
        if (elements.xp) elements.xp.innerHTML = `${Icons.get('trophy')} ${state.totalXP} XP`;
        updatePlayerLevel(state.totalXP);
        
        // Salvar resposta
        state.answers.push({
            question_id: state.currentQuestion.id,
            correct: false,
            xp_earned: result.xp_earned,
            answer: '[TIMEOUT]',
            timeout: true
        });
        
        // Atualizar progresso do capítulo
        updateChapterProgress();
        
        // Marcar resultado como timeout para o feedback
        result.timeout = true;
        
        // Mostrar feedback com resposta correta
        showFeedback(result, state.contentLanguage);
        
        // Salvar próxima questão
        setState({
            nextQuestion: result.next_question,
            quizCompleted: result.quiz_completed
        });
        
    } catch (error) {
        console.error('❌ Erro ao processar timeout:', error);
        showNotification(`Erro ao processar timeout: ${error.message}`, 'error', QUIZ_DELAYS.apiErrorNotificationMs);
        
        // Em caso de erro, avançar para próxima questão de qualquer forma
        setTimeout(() => {
            if (state.nextQuestion) {
                loadQuestion(state.nextQuestion);
            } else {
                finishQuiz();
            }
        }, QUIZ_DELAYS.timeoutFallbackMs);
    } finally {
        showLoading(false);
    }
}

// ============================================
// QUIZ - VALIDATE & NEXT
// ============================================

async function validateAnswer() {
    const answerData = getAnswerData();
    
    if (!answerData) {
        showNotification(t('answerRequired'), 'warning', QUIZ_DELAYS.validationWarningMs);
        return;
    }
    
    if (elements.validateBtn) elements.validateBtn.disabled = true;
    if (elements.hintBtn) elements.hintBtn.disabled = true;
    
    stopTimer();
    showLoading(true, t('loadingValidate'));
    
    try {
        const result = await API.submitAnswer(
            state.sessionId,
            state.currentQuestion.id,
            answerData.answer || null,
            answerData.code || null,
            answerData.pk || null,
            answerData.sk || null
        );
        
        // Atualizar XP
        setState({ totalXP: state.totalXP + result.xp_earned });
        if (elements.xp) elements.xp.innerHTML = `${Icons.get('trophy')} ${state.totalXP} XP`;
        updatePlayerLevel(state.totalXP);
        
        // Salvar resposta
        state.answers.push({
            question_id: state.currentQuestion.id,
            correct: result.correct,
            xp_earned: result.xp_earned,
            ...answerData
        });
        
        // Atualizar progresso do capítulo
        updateChapterProgress();
        
        // Mostrar feedback
        showFeedback(result, state.contentLanguage);
        
        // Salvar próxima questão
        setState({
            nextQuestion: result.next_question,
            quizCompleted: result.quiz_completed
        });
        
    } catch (error) {
        console.error('Erro ao validar:', error);
        showNotification(`Erro ao validar resposta: ${error.message}`, 'error', QUIZ_DELAYS.apiErrorNotificationMs);
        if (elements.validateBtn) elements.validateBtn.disabled = false;
        if (elements.hintBtn) elements.hintBtn.disabled = false;
    } finally {
        showLoading(false);
    }
}

function getAnswerData() {
    const question = state.currentQuestion;
    
    switch(question.question_type) {
        case 'multiple_choice':
            const selected = document.querySelector('input[name="answer"]:checked');
            if (!selected) return null;
            const index = parseInt(selected.value);
            const letter = String.fromCharCode(65 + index);
            return { answer: letter, answer_type: 'multiple_choice' };
            
        case 'open_answer':
            const pk = document.getElementById('pk-input').value.trim();
            const sk = document.getElementById('sk-input').value.trim();
            const operation = document.getElementById('operation').value;
            if (!pk || !sk) return null;
            return { pk, sk, operation, answer_type: 'open_answer' };
            
        case 'code':
            const code = document.getElementById('code-editor').value.trim();
            if (!code) return null;
            return { code, language: state.language, answer_type: 'practical' };
    }
}

function handleNextAction(button = null) {
    const btn = button;
    if (btn && btn.disabled) return;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<svg viewBox="0 0 32 32" class="quest-icon-inline" style="width: 16px; height: 16px; animation: spin 1s linear infinite;"><circle cx="16" cy="16" r="12" fill="none" stroke="#67d2df" stroke-width="3" stroke-dasharray="50 20"/></svg> ${t('loadingButton')}`;
    }
    
    if (state.autoAdvanceTimeout) {
        clearTimeout(state.autoAdvanceTimeout);
        setState({ autoAdvanceTimeout: null });
    }
    
    if (state.quizCompleted) {
        finishQuiz();
    } else if (state.nextQuestion) {
        loadQuestion(state.nextQuestion);
    } else {
        console.error('next_question não disponível');
        finishQuiz();
    }
}

function handleFeedbackClick(event) {
    const actionButton = event.target.closest('[data-action="next-question"]');
    if (!actionButton || !elements.feedback?.contains(actionButton)) return;
    
    event.preventDefault();
    handleNextAction(actionButton);
}

// ============================================
// QUIZ - HINT
// ============================================

async function requestHint() {
    const confirmed = await showConfirm(
        t('hintTitle'),
        t('hintConfirm')
    );
    
    if (!confirmed) return;
    
    try {
        const data = await API.getHint(state.sessionId, state.currentQuestion.id);
        
        if (data) {
            setState({
                totalXP: state.totalXP - data.xp_penalty,
                hintsUsed: state.hintsUsed + 1
            });
            if (elements.xp) elements.xp.innerHTML = `${Icons.get('trophy')} ${state.totalXP} XP`;
            updatePlayerLevel(state.totalXP);
            
            // Formatar dica com quebras de linha adequadas
            const formattedHint = `💡 ${t('hintLabel')}:\n\n${data.hint}\n\n${t('hintPenalty')}: -${data.xp_penalty} XP`;
            showNotification(formattedHint, 'hint', QUIZ_DELAYS.hintNotificationMs);
        }
    } catch (error) {
        console.error('Erro ao pedir ajuda:', error);
        showNotification(`Erro ao obter dica: ${error.message}`, 'error', QUIZ_DELAYS.apiErrorNotificationMs);
    }
}

// ============================================
// QUIZ - FINISH
// ============================================

async function finishQuiz() {
    showLoading(true, t('loadingFinish'));
    
    try {
        updateChapterProgress();
        
        const allChaptersCompleted = CHAPTERS.every(chapter => {
            const progress = state.labsProgress[chapter.id];
            return progress && progress.completed;
        });
        
        if (allChaptersCompleted) {
            // Todos os capítulos completados - redirecionar para página de conclusão
            showLoading(true, 'Preparando cerimônia de consagração...');
            
            // Salvar progresso final
            saveProgress();
            
            // Redirecionar para página de conclusão (dados são carregados do localStorage)
            setTimeout(() => {
                window.location.href = 'completion.html';
            }, QUIZ_DELAYS.completionRedirectMs);
        } else {
            showChapterCompleteNotification();
            setTimeout(() => returnToQuestMap(), QUIZ_DELAYS.chapterCompleteReturnMs);
        }
        
    } catch (error) {
        console.error('Erro ao finalizar:', error);
        showNotification(`Erro ao finalizar capítulo: ${error.message}`, 'error', QUIZ_DELAYS.finishErrorNotificationMs);
        setTimeout(() => returnToQuestMap(), QUIZ_DELAYS.finishErrorReturnMs);
    } finally {
        showLoading(false);
    }
}

function showChapterCompleteNotification() {
    const currentChapter = CHAPTERS.find(c => c.lab === state.currentLab);
    if (!currentChapter) return;
    const currentChapterView = localizeChapter(currentChapter);
    
    const progress = state.labsProgress[currentChapter.id];
    const xpEarned = progress?.xpEarned || 0;
    const totalXP = Object.values(state.labsProgress).reduce((sum, p) => sum + (p.xpEarned || 0), 0);
    const rank = getRank(totalXP);
    
    const nextChapterIndex = CHAPTERS.findIndex(c => c.id === currentChapter.id) + 1;
    const nextChapter = CHAPTERS[nextChapterIndex];
    const nextChapterView = nextChapter ? localizeChapter(nextChapter) : null;
    const nextUnlocked = nextChapter && getChapterStatus(nextChapter) === 'unlocked';
    
    const message = `
        <div class="chapter-complete-notif">
            <div class="chapter-complete-title">🎉 ${escapeHTML(t('chapterComplete'))}</div>
            <div class="chapter-complete-row">
                ${Icons.getChapter(currentChapter.icon)}
                <span>${escapeHTML(currentChapterView.title)}</span>
            </div>
            <div class="chapter-complete-row">
                ${Icons.get('xp')}
                <span>+${xpEarned} ${escapeHTML(t('xpEarned'))}</span>
            </div>
            <div class="chapter-complete-row">
                ${Icons.get('trophy')}
                <span>${escapeHTML(t('totalXP'))}: ${totalXP}</span>
            </div>
            <div class="chapter-complete-row">
                ${Icons.get('stats')}
                <span>${escapeHTML(t('rankLabel'))}: ${escapeHTML(rank.name)}</span>
            </div>
            ${nextUnlocked && nextChapterView ? `
            <div class="chapter-complete-divider"></div>
            <div class="chapter-complete-row">
                ${Icons.get('success')}
                <span>${escapeHTML(t('nextChapterUnlocked'))}</span>
            </div>
            <div class="chapter-complete-row chapter-complete-next">
                ${Icons.getChapter(nextChapter.icon)}
                <span>${escapeHTML(nextChapterView.title)}</span>
            </div>` : ''}
        </div>
    `;
    
    showRichNotification(message, 'success', QUIZ_DELAYS.chapterCompleteNotificationMs);
}

function returnToQuestMap() {
    setState({
        sessionId: null,
        currentQuestion: null,
        currentQuestionIndex: 0,
        answers: [],
        hintsUsed: 0,
        nextQuestion: null,
        quizCompleted: false,
        isStartingChapter: false
    });
    stopTimer();
    
    renderChapters();
    renderProgressTable();
    renderLevelsTable();
    updatePlayerStats();
    showScreen('questMap');
    hideNotification();
}

function displayFinalResult(result) {
    const totalTime = Math.floor((Date.now() - state.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const rank = getRank(result.total_xp);
    const safeName = escapeHTML(result.name || 'Aventureiro(a)');
    const safeLanguage = escapeHTML(getLanguageDisplay(result.language));
    const safeTotalXP = escapeHTML(result.total_xp || 0);
    const safeHintsUsed = escapeHTML(result.hints_used || state.hintsUsed);
    const safeRankIcon = escapeHTML(rank.icon);
    const safeRankName = escapeHTML(rank.name);
    const safeRankClass = escapeHTML(rank.class);
    const correctAnswers = state.answers.filter(a => a.correct).length;
    
    if (!elements.finalStats) {
        console.error('❌ final-stats element not found');
        return;
    }
    
    elements.finalStats.innerHTML = `
        <div class="stat-card">
            <h2 style="text-align: center; margin-bottom: 20px;">
                ${safeRankIcon} ${safeRankName}
            </h2>
            <div class="rank-badge rank-${safeRankClass}">
                ${safeTotalXP} XP / 1.500
            </div>
            
            <div class="stat-row">
                <span class="stat-label"><svg viewBox="0 0 32 32" class="quest-icon-inline"><circle cx="16" cy="12" r="6" fill="#67d2df"/><path d="M8 26 Q8 20 16 20 Q24 20 24 26 L8 26 Z" fill="#67d2df"/></svg> Nome</span>
                <span class="stat-value">${safeName}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${Icons.get('tool')} Linguagem</span>
                <span class="stat-value">${safeLanguage}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${Icons.get('timer')} Tempo Total</span>
                <span class="stat-value">${minutes}m ${seconds}s</span>
            </div>
            <div class="stat-row">
                <span class="stat-label"><svg viewBox="0 0 32 32" class="quest-icon-inline"><defs><linearGradient id="hint-stat" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f9e27d"/><stop offset="100%" stop-color="#ffeb99"/></linearGradient></defs><circle cx="16" cy="16" r="12" fill="url(#hint-stat)"/><path d="M16 8 Q12 12 14 16 Q10 18 12 24 Q14 20 16 22 Q18 20 20 24 Q22 18 18 16 Q20 12 16 8 Z" fill="#002740"/></svg> Ajudas Usadas</span>
                <span class="stat-value">${safeHintsUsed}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${Icons.get('success')} Acertos</span>
                <span class="stat-value">${correctAnswers} / ${escapeHTML(state.totalQuestions)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${Icons.get('stats')} Aproveitamento</span>
                <span class="stat-value">${((result.total_xp / QUIZ_RESULT_MAX_XP) * 100).toFixed(1)}%</span>
            </div>
        </div>
        
        <div class="stat-card">
            <h3>🏅 Conquistas Desbloqueadas</h3>
            ${generateAchievements(result)}
        </div>
    `;
}

function generateAchievements(result) {
    const achievements = [];
    
    if (result.total_xp >= 1400) achievements.push('🏅 Destruidor de JOINs');
    if (state.answers.some(a => a.answer_type === 'practical' && a.correct)) achievements.push('🏅 Mestre da Query Reversa');
    if (result.total_xp >= 1000) achievements.push('🏅 Herói do DynamoDB');
    if (state.hintsUsed === 0) achievements.push('🏅 Autodidata (nenhuma ajuda!)');
    
    if (achievements.length === 0) {
        return '<p style="color: #666;">Continue praticando para desbloquear conquistas!</p>';
    }
    
    return achievements.map(a => `<p>${a}</p>`).join('');
}

function updateChapterProgress() {
    const currentChapter = CHAPTERS.find(c => c.lab === state.currentLab);
    if (!currentChapter) return;
    
    const quizXP = state.answers.reduce((sum, a) => sum + (a.xp_earned || 0), 0);
    const totalXP = getChapterMaxXP(currentChapter);
    const percentage = Math.min(100, Math.round((quizXP / totalXP) * 100));
    const isCompleted = state.currentQuestionIndex >= state.totalQuestions;
    
    // Calcular acertos
    const correctAnswers = state.answers.filter(a => a.correct).length;
    
    state.labsProgress[currentChapter.id] = {
        xpEarned: quizXP,
        percentage: percentage,
        completed: isCompleted,
        correctAnswers: correctAnswers,
        totalQuestions: state.totalQuestions,
        lastUpdated: Date.now()
    };
    
    saveProgress();
}

// ============================================
// RESULT - ACTIONS
// ============================================

async function exportResult() {
    try {
        await API.exportResult(state.sessionId);
        showNotification('✅ Resultado exportado com sucesso!', 'success', QUIZ_DELAYS.exportSuccessNotificationMs);
    } catch (error) {
        console.error('Erro ao exportar:', error);
        showNotification(`Erro ao exportar resultado: ${error.message}`, 'error', QUIZ_DELAYS.apiErrorNotificationMs);
    }
}

async function restartQuiz() {
    const confirmed = await showConfirm(
        Icons.get('map') + ' Voltar ao Mapa',
        'Deseja voltar ao Mapa da Quest?'
    );
    
    if (confirmed) {
        returnToQuestMap();
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getLanguageIconSVG(lang) {
    const icons = {
        python: `<svg class="language-icon-header" id="language-icon-header" viewBox="0 0 32 32">
            <defs><linearGradient id="python-header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#001a2e;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#003d5c;stop-opacity:1" />
            </linearGradient></defs>
            <rect x="6" y="6" width="20" height="20" rx="3" fill="url(#python-header-grad)"/>
            <path d="M12 10 L16 10 Q18 10 18 12 L18 14 Q18 16 16 16 L14 16" 
                  stroke="#67d2df" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M20 22 L16 22 Q14 22 14 20 L14 18 Q14 16 16 16 L18 16" 
                  stroke="#67d2df" stroke-width="2" fill="none" stroke-linecap="round"/>
            <circle cx="13" cy="12" r="1.5" fill="#67d2df"/>
            <circle cx="19" cy="20" r="1.5" fill="#67d2df"/>
        </svg>`,
        go: `<svg class="language-icon-header" id="language-icon-header" viewBox="0 0 32 32">
            <defs><linearGradient id="go-header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#789d4a;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#558833;stop-opacity:1" />
            </linearGradient></defs>
            <rect x="6" y="6" width="20" height="20" rx="3" fill="url(#go-header-grad)"/>
            <rect x="10" y="12" width="12" height="2" rx="1" fill="#e8ebc0"/>
            <rect x="10" y="15" width="12" height="2" rx="1" fill="#e8ebc0" opacity="0.7"/>
            <rect x="10" y="18" width="12" height="2" rx="1" fill="#e8ebc0" opacity="0.5"/>
        </svg>`,
        javascript: `<svg class="language-icon-header" id="language-icon-header" viewBox="0 0 32 32">
            <defs><linearGradient id="js-header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f9e27d;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#c0a445;stop-opacity:1" />
            </linearGradient></defs>
            <rect x="6" y="6" width="20" height="20" rx="3" fill="url(#js-header-grad)"/>
            <path d="M11 12 L9 16 L11 20" stroke="#002740" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M21 12 L23 16 L21 20" stroke="#002740" stroke-width="2" fill="none" stroke-linecap="round"/>
            <circle cx="16" cy="16" r="1.5" fill="#002740"/>
        </svg>`
    };
    return icons[lang] || icons.python;
}

function getLanguageDisplay(lang) {
    const map = {
        'python': 'Python (boto3)',
        'go': 'Go (aws-sdk-go-v2)',
        'javascript': 'JavaScript (AWS SDK v3)'
    };
    return map[lang] || lang;
}

// ============================================
// GLOBAL EXPORTS (para HTML inline)
// ============================================

window.state = state;
window.Icons = Icons;
window.showScreen = showScreen;
window.enterQuestMap = enterQuestMap;
window.startChapter = startChapter;
window.toggleAccordion = toggleAccordion;
window.validateAnswer = validateAnswer;
window.handleNextAction = handleNextAction;
window.requestHint = requestHint;
window.restartQuiz = restartQuiz;
window.exportResult = exportResult;
window.displayFinalResult = displayFinalResult; // Para testes E2E

// ============================================
// INICIALIZAÇÃO (aguarda DOM estar pronto)
// ============================================

// Aguardar DOM estar completamente carregado antes de adicionar event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DynamoDB Quest - Frontend carregado!');
    console.log('🔧 Arquitetura: ES6 Modules (11 módulos)');
    console.log('Backend API:', API_URL);
    console.log('Versão:', APP_VERSION);

    // ============================================
    // EVENT LISTENERS
    // ============================================

    if (elements.enterQuestBtn) {
        elements.enterQuestBtn.addEventListener('click', enterQuestMap);
        console.log('✓ Event listener adicionado: enter-quest-btn');
    } else {
        console.warn('⚠️ Elemento não encontrado: enter-quest-btn');
    }

    if (elements.validateBtn) {
        elements.validateBtn.addEventListener('click', validateAnswer);
    }

    if (elements.hintBtn) {
        elements.hintBtn.addEventListener('click', requestHint);
    }

    if (elements.restartBtn) {
        elements.restartBtn.addEventListener('click', restartQuiz);
    }

    if (elements.exportBtn) {
        elements.exportBtn.addEventListener('click', exportResult);
    }

    if (elements.notificationClose) {
        elements.notificationClose.addEventListener('click', hideNotification);
    }

    if (elements.chaptersContainer) {
        elements.chaptersContainer.addEventListener('click', handleChapterContainerClick);
    }

    if (elements.feedback) {
        elements.feedback.addEventListener('click', handleFeedbackClick);
    }
    
    if (elements.contentLanguage) {
        elements.contentLanguage.addEventListener('change', () => {
            setState({ contentLanguage: elements.contentLanguage.value || 'en' });
            applyStaticTranslations();
        });
        // Sincronizar estado com o valor inicial do select (English por default)
        setState({ contentLanguage: elements.contentLanguage.value || 'en' });
    }

    if (elements.playerName) {
        elements.playerName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enterQuestMap();
        });
    }

    applyStaticTranslations();
    
    // Carregar metadados dos capítulos
    loadChaptersMetadata().then(() => {
        console.log('✓ Capítulos carregados e prontos!');
        
        // Verificar se deve retornar diretamente ao mapa (vindo da completion.html)
        checkReturnToMap();
    }).catch(error => {
        console.error('✗ Erro ao carregar capítulos:', error);
    });
});

/**
 * Verifica se deve retornar diretamente ao mapa de capítulos
 * Usado quando o usuário vem da tela de conclusão (completion.html)
 */
function checkReturnToMap() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('returnToMap') === 'true') {
        // Tentar restaurar progresso salvo
        const saved = localStorage.getItem('quest_progress');
        
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                if (data.playerName) {
                    // Restaurar estado do jogador
                    const restoredProgress = data.labsProgress || {};
                    const restoredXP = Object.values(restoredProgress)
                        .reduce((sum, lab) => sum + (lab.xpEarned || 0), 0);
                    setState({
                        playerName: data.playerName,
                        language: data.language || 'python',
                        contentLanguage: data.contentLanguage || 'en',
                        labsProgress: restoredProgress,
                        totalXP: restoredXP
                    });
                    
                    // Atualizar displays
                    if (elements.playerNameDisplay) {
                        elements.playerNameDisplay.textContent = data.playerName;
                    }
                    if (elements.playerLanguageDisplay) {
                        elements.playerLanguageDisplay.textContent = getLanguageDisplay(data.language || 'python');
                        
                        const languageIcon = document.getElementById('language-icon-header');
                        if (languageIcon) {
                            languageIcon.outerHTML = getLanguageIconSVG(data.language || 'python');
                        }
                    }
                    applyStaticTranslations();
                    
                    // Renderizar e mostrar mapa
                    renderChapters();
                    renderProgressTable();
                    renderLevelsTable();
                    updatePlayerStats();
                    
                    showScreen('questMap');
                    
                    // Limpar parâmetro da URL (sem recarregar)
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                    
                    console.log('🗺️ Retornando ao mapa de capítulos');
                    return;
                }
            } catch (e) {
                console.error('Erro ao restaurar progresso:', e);
            }
        }
        
        // Se não conseguiu restaurar, limpar parâmetro e ficar na tela inicial
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }
}
