// ============================================
// API MODULE - AURORA LABS DYNAMODB QUIZ
// ============================================
// Centraliza todas as chamadas HTTP ao backend

import { API_BASE_URL, API_URL } from './config.js';

/**
 * Timeout padrão para requisições (60 segundos para garantir que timeouts sejam processados)
 */
const DEFAULT_TIMEOUT = 60000;

/**
 * Cria um AbortController com timeout automático
 * @param {number} timeout - Tempo em milissegundos
 * @returns {AbortController} Controller para cancelar requisição
 */
function createTimeoutController(timeout = DEFAULT_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    controller.clearTimeout = () => clearTimeout(timeoutId);
    
    // Limpar timeout quando a requisição terminar
    controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));
    
    return controller;
}

async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
    const controller = createTimeoutController(timeout);
    
    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } finally {
        controller.clearTimeout();
    }
}

/**
 * Tratamento centralizado de erros da API
 * @param {Response} response - Response do fetch
 * @returns {Promise<Response>} Response se OK
 * @throws {Error} Erro formatado se não OK
 */
async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        
        try {
            const errorData = await response.json();
            if (errorData.error || errorData.message) {
                errorMessage = errorData.error || errorData.message;
            }
        } catch {
            // Se não conseguir parsear JSON, usar mensagem padrão
            try {
                errorMessage = await response.text();
            } catch {
                // Manter mensagem original
            }
        }
        
        throw new Error(errorMessage);
    }
    
    return response;
}

/**
 * Inicia uma nova sessão de quiz
 * @param {string} playerName - Nome do jogador
 * @param {string} language - Linguagem escolhida (python, go, javascript)
 * @param {string} lab - ID do laboratório (lab1, lab2, etc)
 * @param {string} contentLanguage - Idioma do conteúdo (pt-BR, en)
 * @returns {Promise<Object>} Dados da sessão iniciada
 */
export async function startQuizSession(playerName, language, lab, contentLanguage = 'pt-BR') {
    const response = await fetchWithTimeout(`${API_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player_name: playerName,
            language: language,
            lab: lab,
            content_language: contentLanguage
        })
    });
    
    await handleResponse(response);
    return response.json();
}

/**
 * Busca a próxima questão do quiz
 * @param {number} questionIndex - Índice da questão (1-based)
 * @returns {Promise<Object>} Dados da próxima questão
 */
export async function fetchNextQuestion(questionIndex) {
    const response = await fetchWithTimeout(`${API_URL}/question/${questionIndex}`);
    
    await handleResponse(response);
    return response.json();
}

/**
 * Valida a resposta do usuário
 * @param {string} sessionId - ID da sessão
 * @param {string} questionId - ID da questão
 * @param {string} answer - Resposta (A, B, C, D ou texto)
 * @param {string} code - Código (para questões de código)
 * @param {string} pk - Partition Key (para questões abertas)
 * @param {string} sk - Sort Key (para questões abertas)
 * @returns {Promise<Object>} Resultado da validação
 */
export async function submitAnswer(sessionId, questionId, answer = null, code = null, pk = null, sk = null) {
    const response = await fetchWithTimeout(`${API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            session_id: sessionId,
            question_id: questionId,
            answer: answer,
            code: code,
            pk: pk,
            sk: sk,
            attempt: 1 // TODO: controlar tentativas
        })
    });
    
    await handleResponse(response);
    return response.json();
}

/**
 * Solicita uma dica para a questão atual
 * @param {string} sessionId - ID da sessão
 * @param {string} questionId - ID da questão
 * @returns {Promise<Object>} Dica e penalidade de XP
 */
export async function getHint(sessionId, questionId) {
    const response = await fetchWithTimeout(`${API_URL}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            session_id: sessionId,
            question_id: questionId
        })
    });
    
    await handleResponse(response);
    return response.json();
}

/**
 * Busca o resultado final do quiz
 * @param {string} sessionId - ID da sessão
 * @returns {Promise<Object>} Resultado completo do quiz
 */
export async function fetchQuizResult(sessionId) {
    const response = await fetchWithTimeout(`${API_URL}/results/${sessionId}`);
    
    await handleResponse(response);
    return response.json();
}

/**
 * Exporta o resultado do quiz em formato para download
 * @param {string} sessionId - ID da sessão
 * @returns {Promise<Blob>} Blob do arquivo para download
 */
export async function exportQuizResult(sessionId) {
    const response = await fetchWithTimeout(`${API_URL}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            session_id: sessionId
        })
    });
    
    await handleResponse(response);
    return response.blob();
}

/**
 * Verifica a saúde da API
 * @returns {Promise<boolean>} true se API está respondendo
 */
export async function healthCheck() {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
        return response.ok;
    } catch (error) {
        console.error('Health check falhou:', error);
        return false;
    }
}

console.log('✅ API module loaded - Backend:', API_URL);

