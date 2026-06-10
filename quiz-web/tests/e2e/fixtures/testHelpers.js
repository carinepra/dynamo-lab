// Helper functions reutilizáveis para testes E2E
import { mockResponses } from './mockData.js';

/**
 * Preenche a tela inicial com nome e linguagem
 */
export async function fillStartScreen(page, name = 'João Teste', language = 'python') {
  await page.locator('#player-name').fill(name);
  await page.click(`.custom-option[data-value="${language}"]`);
}

/**
 * Mock da API de início de sessão e navega para o mapa da quest
 */
export async function goToQuestMap(page, mockQuestionData) {
  await page.route('**/api/quiz/start', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(mockResponses.startSession(mockQuestionData))
    });
  });
  
  await page.locator('#enter-quest-btn').click();
  await page.waitForSelector('#quest-map-screen:not(.hidden)', { timeout: 5000 });
}

/**
 * Inicia o primeiro capítulo disponível
 */
export async function startFirstChapter(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-action="start-chapter"]', { 
    state: 'visible', 
    timeout: 10000 
  });
  await page.locator('[data-action="start-chapter"]').first().click();
  await page.waitForSelector('#quiz-screen:not(.hidden)', { timeout: 10000 });
}

/**
 * Helper completo: preenche tela inicial → vai para mapa → inicia capítulo
 */
export async function startQuizDirectly(page, questionData) {
  await fillStartScreen(page);
  await goToQuestMap(page, questionData);
  await startFirstChapter(page);
}

/**
 * Seleciona uma opção de múltipla escolha
 */
export async function selectMultipleChoiceOption(page, index = 0) {
  await page.locator('.option-label').nth(index).click();
}

/**
 * Preenche campos de questão aberta (PK/SK)
 */
export async function fillOpenAnswer(page, pk, sk, operation = 'GetItem') {
  await page.locator('#pk-input').fill(pk);
  await page.locator('#sk-input').fill(sk);
  await page.locator('#operation').selectOption(operation);
}

/**
 * Preenche código no editor
 */
export async function fillCodeEditor(page, code) {
  await page.locator('#code-editor').fill(code);
}

/**
 * Mock da validação e clica no botão validar
 */
export async function validateAnswer(page, mockResponse) {
  await page.route('**/api/quiz/validate', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(mockResponse)
    });
  });
  
  await page.locator('#validate-btn').click();
}

/**
 * Aguarda feedback aparecer
 */
export async function waitForFeedback(page, timeout = 3000) {
  await page.waitForSelector('#feedback-area:not(.hidden)', { timeout });
}

/**
 * Clica no botão de próxima pergunta
 */
export async function clickNextQuestion(page) {
  await page.locator('#feedback-area button.btn-primary').click();
}

/**
 * Mock da API de dica
 */
export async function mockHintAPI(page, hintText = 'Pense em chave primária composta') {
  await page.route('**/api/quiz/hint', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        hint: hintText,
        xp_penalty: 10
      })
    });
  });
}

/**
 * Mock da API de resultado final
 */
export async function mockResultAPI(page, resultData = mockResponses.finalResult) {
  await page.route('**/api/quiz/results/**', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(resultData)
    });
  });
}

/**
 * Simula timeout de validação (para testes de loading)
 */
export async function mockSlowValidation(page, delay = 1000, response = mockResponses.validateCorrect()) {
  await page.route('**/api/quiz/validate', async route => {
    await new Promise(resolve => setTimeout(resolve, delay));
    route.fulfill({
      status: 200,
      body: JSON.stringify(response)
    });
  });
}

/**
 * Simula erro de rede
 */
export async function mockNetworkError(page, endpoint = '**/api/quiz/**') {
  await page.route(endpoint, route => {
    route.abort('failed');
  });
}

/**
 * Verifica se elemento tem classe específica
 */
export async function hasClass(page, selector, className) {
  const classes = await page.locator(selector).getAttribute('class');
  return classes && classes.includes(className);
}

/**
 * Aguarda timer mudar
 */
export async function waitForTimerChange(page, initialValue) {
  await page.waitForFunction(
    (initial) => {
      const timer = document.getElementById('timer');
      return timer && timer.textContent !== initial;
    },
    initialValue,
    { timeout: 5000 }
  );
}

/**
 * Marca todos os capítulos como completos (para testes de resultado)
 * Estrutura: lab1, lab2, lab3 (conforme labs/metadata.json)
 */
export async function markAllChaptersComplete(page) {
  await page.evaluate(() => {
    if (window.state) {
      window.state.labsProgress = {
        'lab1': { completed: true, xpEarned: 1500, percentage: 100 },
        'lab2': { completed: true, xpEarned: 1950, percentage: 100 },
        'lab3': { completed: true, xpEarned: 950, percentage: 100 }
      };
    }
  });
}

/**
 * Configura viewport mobile
 */
export async function setMobileViewport(page) {
  await page.setViewportSize({ width: 375, height: 667 });
}

/**
 * Configura viewport tablet
 */
export async function setTabletViewport(page) {
  await page.setViewportSize({ width: 768, height: 1024 });
}

/**
 * Configura viewport desktop
 */
export async function setDesktopViewport(page) {
  await page.setViewportSize({ width: 1920, height: 1080 });
}

/**
 * Aceita/Rejeita dialogs automaticamente
 */
export function setupDialogHandler(page, accept = true) {
  page.on('dialog', async dialog => {
    if (accept) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  });
}

/**
 * Captura mensagem de dialog
 */
export async function captureDialogMessage(page) {
  return new Promise(resolve => {
    page.once('dialog', dialog => {
      resolve(dialog.message());
      dialog.dismiss();
    });
  });
}

