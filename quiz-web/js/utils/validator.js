// ============================================
// VALIDATOR MODULE
// ============================================
// Validação de respostas do usuário

/**
 * Desabilita todos os inputs de resposta
 */
export function disableAnswerInputs() {
    setAnswerControlsDisabled(true);
    
    // Desabilitar labels de múltipla escolha (remover hover)
    const labels = document.querySelectorAll('.option-label');
    labels.forEach(label => {
        label.style.pointerEvents = 'none';
        label.style.opacity = '0.6';
    });
}

/**
 * Habilita todos os inputs de resposta
 */
export function enableAnswerInputs() {
    setAnswerControlsDisabled(false);
    
    // Habilitar labels
    const labels = document.querySelectorAll('.option-label');
    labels.forEach(label => {
        label.style.pointerEvents = '';
        label.style.opacity = '';
    });
}

function setAnswerControlsDisabled(disabled) {
    const controls = document.querySelectorAll(
        'input[name="answer"], #answer-textarea, #code-editor, #pk-input, #sk-input, #operation'
    );
    
    controls.forEach(control => {
        control.disabled = disabled;
    });
}

/**
 * Obtém a resposta do usuário da interface
 * @param {Object} question - Questão atual
 * @returns {Object} Objeto com answer, code, pk, sk conforme tipo
 */
export function getAnswerFromUI(question) {
    const answerData = {};
    const questionType = question.question_type || question.type;
    
    switch (questionType) {
        case 'multiple_choice':
            const selected = document.querySelector('input[name="answer"]:checked');
            answerData.answer = selected ? selected.value : null;
            break;
            
        case 'open_ended':
            const textarea = document.getElementById('answer-textarea');
            answerData.answer = textarea ? textarea.value.trim() : null;
            break;
            
        case 'code':
            const codeEditor = document.getElementById('code-editor');
            answerData.code = codeEditor ? codeEditor.value.trim() : null;
            break;
            
        case 'key_design':
        case 'open_answer':
            const pkInput = document.getElementById('pk-input');
            const skInput = document.getElementById('sk-input');
            const operationInput = document.getElementById('operation');
            answerData.pk = pkInput ? pkInput.value.trim() : null;
            answerData.sk = skInput ? skInput.value.trim() : null;
            answerData.operation = operationInput ? operationInput.value : null;
            break;
            
        default:
            console.warn('Tipo de questão desconhecido:', questionType);
            answerData.answer = null;
    }
    
    return answerData;
}

/**
 * Valida se a resposta está preenchida
 * @param {Object} answerData - Dados da resposta
 * @param {Object} question - Questão atual
 * @returns {boolean} true se resposta válida
 */
export function isAnswerValid(answerData, question) {
    const questionType = question.question_type || question.type;
    
    switch (questionType) {
        case 'multiple_choice':
            return !!answerData.answer;
            
        case 'open_ended':
            return !!answerData.answer && answerData.answer.length > 0;
            
        case 'code':
            return !!answerData.code && answerData.code.length > 0;
            
        case 'key_design':
        case 'open_answer':
            return !!answerData.pk && !!answerData.sk;
            
        default:
            return false;
    }
}

/**
 * Limpa todos os inputs de resposta
 */
export function clearAnswerInputs() {
    // Limpar radio buttons
    const radioInputs = document.querySelectorAll('input[name="answer"]');
    radioInputs.forEach(input => {
        input.checked = false;
    });
    
    // Limpar textarea
    const textarea = document.getElementById('answer-textarea');
    if (textarea) {
        textarea.value = '';
    }
    
    // Limpar code editor
    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
        codeEditor.value = '';
    }
    
    // Limpar PK/SK inputs
    const pkInput = document.getElementById('pk-input');
    const skInput = document.getElementById('sk-input');
    const operationInput = document.getElementById('operation');
    if (pkInput) pkInput.value = '';
    if (skInput) skInput.value = '';
    if (operationInput) operationInput.selectedIndex = 0;
}

/**
 * Valida formato de PK/SK
 * @param {string} key - Chave a validar
 * @returns {boolean} true se formato válido
 */
export function isValidDynamoDBKey(key) {
    if (!key || typeof key !== 'string') {
        return false;
    }
    
    // DynamoDB keys não podem estar vazios e devem ter <= 2048 bytes
    return key.trim().length > 0 && key.length <= 2048;
}

/**
 * Sanitiza entrada do usuário
 * @param {string} input - Input a sanitizar
 * @returns {string} Input sanitizado
 */
export function sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    // Remove scripts e tags perigosas
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .trim();
}

console.log('✅ Validator module loaded');

