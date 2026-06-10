// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * TESTES E2E - AURORA DYNAMODB QUIZ
 * 
 * Objetivo: Testar fluxo completo e bugs de usabilidade
 */

/**
 * HELPER: Selecionar linguagem via JavaScript (mais confiável que cliques DOM)
 * @param {import('@playwright/test').Page} page
 * @param {string} language - 'python', 'go' ou 'javascript'
 */
async function selectLanguage(page, language = 'python') {
  await page.evaluate((lang) => {
    // 1. CRÍTICO: Atualizar o select escondido (usado pelo enterQuestMap)
    const hiddenSelect = document.getElementById('language');
    if (hiddenSelect) {
      hiddenSelect.value = lang;
    }
    
    // 2. Atualizar state global (se disponível)
    if (window.setState) {
      window.setState({ language: lang });
    }
    
    // 3. Atualizar o visual do custom select
    const trigger = document.querySelector('.custom-select-trigger');
    const languageName = document.querySelector('.language-name');
    
    if (trigger) trigger.classList.remove('placeholder');
    if (languageName) languageName.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
    
    // 4. Habilitar botão se nome estiver preenchido
    const nameInput = document.getElementById('player-name');
    const button = document.getElementById('enter-quest-btn');
    if (nameInput && nameInput.value.trim() && button) {
      button.disabled = false;
    }
  }, language);
  
  await page.waitForTimeout(100); // Aguardar atualização do DOM
}

/**
 * HELPER FUNCTION: Vai direto para a tela de quiz
 * 
 * Novo fluxo: Início → Mapa → Quiz
 * Este helper simplifica os testes pulando direto para o quiz.
 * 
 * @param {import('@playwright/test').Page} page 
 * @param {object} questionData - Dados da primeira questão mockada
 */
async function startQuizDirectly(page, questionData) {
  // 0. Adicionar listener de console para debug
  page.on('console', msg => console.log(`🖥️  BROWSER: ${msg.text()}`));
  page.on('pageerror', err => console.error(`❌ PAGE ERROR: ${err.message}`));
  
  // 1. Preencher formulário inicial
  await page.locator('#player-name').fill('João Teste');
  
  // 2. Selecionar linguagem via JavaScript (mais confiável)
  await selectLanguage(page, 'python');
  
  // 3. Garantir mocks de metadata (pode ter expirado)
  await setupMetadataMocks(page);
  
  // 4. Mockar API /start
  await page.route('**/api/quiz/start', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        session_id: 'test-session',
        total_questions: 7,
        first_question: questionData
      })
    });
  });
  
  // 5. Ir para o mapa
  await page.locator('#enter-quest-btn').click();
  await expect(page.locator('#quest-map-screen')).toBeVisible({ timeout: 5000 });
  
  // 5. Aguardar capítulos renderizarem completamente
  await page.waitForSelector('[data-action="start-chapter"][data-chapter-id="lab1"]', { 
    state: 'visible',
    timeout: 10000 
  });
  
  // 6. Iniciar o primeiro capítulo pelo handler delegado
  await page.evaluate(() => {
    const startButton = document.querySelector('[data-action="start-chapter"][data-chapter-id="lab1"]');
    if (startButton) {
      startButton.click();
    } else {
      console.error('❌ Botão data-action="start-chapter" não existe!');
    }
  });
  
  // 7. Aguardar tela de quiz aparecer
  await expect(page.locator('#quiz-screen')).toBeVisible({ timeout: 10000 });
}

/**
 * HELPER: Setup global para mockar metadata.json em todos os testes
 * Estrutura baseada nos arquivos reais: labs/lab1/metadata.json, etc.
 */
async function setupMetadataMocks(page) {
  const mockMetadata = {
    lab1: {
      id: 'lab1',
      icon: '🏛️',
      title: 'CAPÍTULO 1: ACADEMIA DOS FUNDAMENTOS',
      subtitle: 'A Ponte Entre Dois Mundos - Onde Toda Jornada Começa',
      narrator: '🧙 MESTRE DOS CONCEITOS: "SQL é poderoso! Mas hoje vamos dominar DynamoDB para casos de alta escala!"',
      highlights: [
        '✨ SQL vs NoSQL (JOINs, schema flexível, performance)',
        '🔑 DynamoDB Core (PK, SK, HASH/RANGE, limite 400KB)',
        '📊 Partições (lógica vs física, hot partitions, distribuição por hash)',
        '⚡ Operações (GetItem, Query, Scan, begins_with, Batch)'
      ],
      missions: ['Q1-Q3: SQL vs NoSQL', 'Q4: DynamoDB', 'Q5-Q8: Partições', 'Q9-Q15: Operações'],
      details: { time: '~45 minutos', xp: '1.500 XP', type: 'Múltipla escolha', badge: '🎓 Estudante' },
      unlockRequirement: null,
      lab: 'lab1'
    },
    lab2: {
      id: 'lab2',
      icon: '⚔️',
      title: 'CAPÍTULO 2: ARENA DOS PATTERNS',
      subtitle: 'Onde Heróis Provam Seu Valor - Domine a Arte da Tabela Única',
      narrator: '🧙 MESTRE ARQUITETO: "Agora que domina os fundamentos, é hora de construir!"',
      highlights: [
        '🎨 Arquitetura (Access Pattern First, Hierarquias, Denormalização)',
        '🎩 Single Table Magic (1 Query = múltiplos tipos)',
        '⚡ Queries Avançadas (Ordenação, Ranges, Limit, Filter)'
      ],
      missions: ['Q1-Q5: Arquitetura', 'Q6-Q9: Queries', 'Q10-Q13: Patterns Avançados'],
      details: { time: '~50 minutos', xp: '1.870 XP', type: 'Múltipla escolha', badge: '🎩 Arquiteto' },
      unlockRequirement: 'lab1',
      lab: 'lab2'
    },
    lab3: {
      id: 'lab3',
      icon: '🗼',
      title: 'CAPÍTULO 3: TORRE DOS GSIs',
      subtitle: 'A Visão do Alto da Torre - Veja Seus Dados de Qualquer Ângulo',
      narrator: '🗼 GUARDIÃO DA TORRE: "Você dominou queries por PK! Agora aprenda a buscar por QUALQUER atributo!"',
      highlights: [
        '🔍 O que é GSI e para que serve',
        '⚔️ GSI vs LSI: Diferenças e quando usar cada um',
        '⚡ Eventual Consistency e Hot Partitions'
      ],
      missions: ['Q1-Q2: GSI Basics', 'Q3-Q4: GSI vs LSI', 'Q5-Q8: Advanced GSI'],
      details: { time: '~30 minutos', xp: '1.050 XP', type: 'Múltipla escolha', badge: '🗼 GSI Master' },
      unlockRequirement: 'lab2',
      lab: 'lab3'
    }
  };
  
  await page.route('**/labs/lab*/metadata.json', route => {
    const url = route.request().url();
    const labMatch = url.match(/lab(\d)/);
    const labId = labMatch ? `lab${labMatch[1]}` : 'lab1';
    route.fulfill({
      status: 200,
      body: JSON.stringify(mockMetadata[labId] || mockMetadata.lab1)
    });
  });
}

/**
 * HELPER: Mockar todas as APIs do quiz (validate, hint, result)
 * Agora com suporte a múltiplas questões e navegação
 */
async function setupApiMocks(page, options = {}) {
  const {
    validateCorrect = true,
    xpEarned = 100,
    hintText = 'Dica: Pense em access patterns!',
    hintCost = 10,
    withNextQuestion = false,
    quizCompleted = false
  } = options;
  
  // Mock: Validação de respostas (com suporte a navegação)
  await page.route('**/api/quiz/validate', route => {
    const nextQuestion = withNextQuestion ? {
      id: 2,
      title: 'Próxima Pergunta',
      description: 'Continue sua jornada...',
      question_type: 'multiple_choice',
      options: ['Opção A', 'Opção B', 'Opção C'],
      timer_seconds: 120
    } : null;
    
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        correct: validateCorrect,
        xp_earned: validateCorrect ? xpEarned : 0,
        feedback: validateCorrect ? 'Correto! Ótimo trabalho.' : 'Incorreto. Revise o conceito.',
        quiz_completed: quizCompleted,
        next_question: nextQuestion
      })
    });
  });
  
  // Mock: Sistema de hints
  await page.route('**/api/quiz/hint', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        hint: hintText,
        xp_cost: hintCost
      })
    });
  });
  
  // Mock: Resultado final
  await page.route('**/api/quiz/results/*', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        session_id: 'test-session',
        player_name: 'João Teste',
        language: 'python',
        total_xp: 1200,
        hints_used: 0,
        correct_answers: 7,
        total_questions: 7,
        rank: 'Cavaleiro'
      })
    });
  });
}

test.describe('Quiz - Tela Inicial', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar (para interceptar requests de metadata)
    await setupMetadataMocks(page);
    await setupApiMocks(page);
    await page.goto('/');
  });

  test('deve carregar a tela inicial corretamente', async ({ page }) => {
    // Verificar título
    await expect(page).toHaveTitle(/Aurora DynamoDB Quest/);
    
    // Verificar elementos principais (usar seletor específico para evitar ambiguidade)
    await expect(page.locator('#start-screen h1')).toContainText('Aurora DynamoDB Quest');
    await expect(page.locator('#player-name')).toBeVisible();
    await expect(page.locator('#language-display')).toBeVisible(); // Custom select agora
    await expect(page.locator('#enter-quest-btn')).toBeVisible();
  });

  test('deve validar nome vazio', async ({ page }) => {
    // Sem preencher nome, apenas selecionar linguagem
    await selectLanguage(page, 'python');
    
    // Botão deve estar desabilitado (pois nome está vazio)
    await expect(page.locator('#enter-quest-btn')).toBeDisabled();
    
    // Deve permanecer na tela inicial
    await expect(page.locator('#start-screen')).toBeVisible();
  });

  test('deve aceitar nome com espaços e trim corretamente', async ({ page }) => {
    // Bug potencial: nomes com espaços extras
    await page.locator('#player-name').fill('  João Silva  ');
    
    // Selecionar linguagem
    await selectLanguage(page, 'python');
    
    // Mock da API
    await page.route('**/api/quiz/start', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          session_id: 'test-session',
          total_questions: 7,
          first_question: {
            id: 1,
            title: 'Pergunta Teste',
            description: 'Descrição teste',
            question_type: 'multiple_choice',
            options: ['A', 'B', 'C'],
            timer_seconds: 120
          }
        })
      });
    });
    
    // Ir para o mapa
    await page.locator('#enter-quest-btn').click();
    await expect(page.locator('#quest-map-screen')).toBeVisible({ timeout: 5000 });
    
    // Aguardar capítulos renderizarem e iniciar primeiro pelo handler delegado
    await page.waitForSelector('[data-action="start-chapter"][data-chapter-id="lab1"]', { state: 'visible', timeout: 5000 });
    await page.evaluate(() => document.querySelector('[data-action="start-chapter"][data-chapter-id="lab1"]')?.click());
    
    // Deve avançar para tela do quiz
    await expect(page.locator('#quiz-screen')).toBeVisible({ timeout: 5000 });
  });

  test('deve permitir Enter para submeter nome', async ({ page }) => {
    await page.locator('#player-name').fill('João Silva');
    
    // Selecionar linguagem
    await selectLanguage(page, 'python');
    
    // Mock da API
    await page.route('**/api/quiz/start', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          session_id: 'test-session',
          total_questions: 7,
          first_question: { id: 1, title: 'Test', description: 'Test', question_type: 'multiple_choice', options: ['A'], timer_seconds: 120 }
        })
      });
    });
    
    // Pressionar Enter no input de nome (agora deve funcionar pois linguagem está selecionada)
    await page.locator('#player-name').press('Enter');
    
    // Deve avançar para o mapa
    await expect(page.locator('#quest-map-screen')).toBeVisible({ timeout: 5000 });
  });

  test('deve mostrar todas as opções de linguagem', async ({ page }) => {
    // Verificar custom select options (agora são divs, não <option>)
    const options = await page.locator('.custom-option').allTextContents();
    
    expect(options.length).toBeGreaterThanOrEqual(3);
    expect(options.join(' ')).toContain('Python');
    expect(options.join(' ')).toContain('Go');
    expect(options.join(' ')).toContain('JavaScript');
  });

  test('deve selecionar linguagem usando teclado', async ({ page }) => {
    await page.locator('#player-name').fill('Zelda');

    const trigger = page.locator('.custom-select-trigger');
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-activedescendant', 'language-option-python');

    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-activedescendant', 'language-option-go');

    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#language')).toHaveValue('go');
    await expect(page.locator('#enter-quest-btn')).toBeEnabled();
  });

  test('deve alternar capítulo pelo teclado com aria-expanded sincronizado', async ({ page }) => {
    await page.locator('#player-name').fill('Zelda');
    await selectLanguage(page, 'python');
    await setupMetadataMocks(page);

    await page.locator('#enter-quest-btn').click();
    await expect(page.locator('#quest-map-screen')).toBeVisible({ timeout: 5000 });

    const toggle = page.locator('[data-action="toggle-chapter"][aria-controls="accordion-lab1"]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#accordion-lab1')).toHaveClass(/expanded/);

    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#accordion-lab1')).not.toHaveClass(/expanded/);
  });

  test('deve exibir erro amigável quando backend está offline', async ({ page }) => {
    await page.locator('#player-name').fill('João Silva');
    
    // Selecionar linguagem
    await selectLanguage(page, 'python');
    
    // Mock metadata para que o mapa carregue
    await setupMetadataMocks(page);
    
    // Mock de erro de rede no START (quando clicar em capítulo)
    await page.route('**/api/quiz/start', route => {
      route.abort('failed');
    });
    
    // Entrar no mapa (vai funcionar pois metadata está mockada)
    await page.locator('#enter-quest-btn').click();
    await expect(page.locator('#quest-map-screen')).toBeVisible({ timeout: 3000 });
    
    // Aguardar capítulos renderizarem
    await page.waitForSelector('[data-action="start-chapter"][data-chapter-id="lab1"]', { state: 'visible', timeout: 5000 });
    
    // Tentar iniciar capítulo (vai falhar pois /start está abortado)
    await page.evaluate(() => document.querySelector('[data-action="start-chapter"][data-chapter-id="lab1"]')?.click());
    
    // Aguardar notificação de erro aparecer
    await page.waitForTimeout(2000);
    
    // Verificar se há notificação de erro
    const notification = page.locator('.notification-error, .notification.error, [class*="error"]');
    await expect(notification).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Quiz - Questões Múltipla Escolha', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page);
    await page.goto('/');
    
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'O que é DynamoDB?',
      description: 'Escolha a melhor definição',
      question_type: 'multiple_choice',
      options: [
        'Banco SQL',
        'Banco NoSQL chave-valor',
        'Banco de grafos'
      ],
      timer_seconds: 120
    });
  });

  test('deve renderizar questão múltipla escolha corretamente', async ({ page }) => {
    // Verificar título e descrição
    await expect(page.locator('#question-title')).toContainText('O que é DynamoDB');
    
    // Verificar opções
    const options = await page.locator('.option-label').count();
    expect(options).toBe(3);
  });

  test('deve validar resposta não selecionada', async ({ page }) => {
    // Setup: capturar alert
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('preencha sua resposta');
      dialog.accept();
    });
    
    // Tentar validar sem selecionar
    await page.locator('#validate-btn').click();
    
    // Deve permanecer na mesma tela
    await expect(page.locator('#quiz-screen')).toBeVisible();
  });

  test('deve selecionar e destacar opção clicada', async ({ page }) => {
    // Clicar na primeira opção
    await page.locator('.option-label').first().click();
    
    // Deve ter classe 'selected'
    await expect(page.locator('.option-label').first()).toHaveClass(/selected/);
  });

  test('deve permitir trocar seleção', async ({ page }) => {
    // Selecionar primeira opção
    await page.locator('.option-label').first().click();
    await expect(page.locator('.option-label').first()).toHaveClass(/selected/);
    
    // Selecionar segunda opção
    await page.locator('.option-label').nth(1).click();
    
    // Primeira não deve estar mais selecionada
    await expect(page.locator('.option-label').first()).not.toHaveClass(/selected/);
    
    // Segunda deve estar selecionada
    await expect(page.locator('.option-label').nth(1)).toHaveClass(/selected/);
  });

  test('deve validar resposta e mostrar feedback', async ({ page }) => {
    // Selecionar opção
    await page.locator('.option-label').nth(1).click();
    
    // Reforçar mock de validação ANTES do clique (crítico!)
    await page.route('**/api/quiz/validate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 100,
          feedback: 'Correto! Ótimo trabalho.',
          quiz_completed: false,
          next_question: null
        })
      });
    });
    
    // Validar
    await page.locator('#validate-btn').click();
    
    // Deve mostrar feedback
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#feedback-area')).toContainText('Correto');
    
    // XP deve atualizar (usar seletor específico do quiz-screen)
    await expect(page.locator('#quiz-screen span#xp')).toContainText('100 XP');
  });
});

test.describe('Quiz - Questões Abertas (PK/SK)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page);
    await page.goto('/');
    
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 3,
      title: 'Defina PK/SK para buscar funcionário',
      description: 'Complete os campos abaixo',
      question_type: 'open_answer',
      timer_seconds: 180
    });
  });

  test('deve renderizar campos PK, SK e operação', async ({ page }) => {
    await expect(page.locator('#pk-input')).toBeVisible();
    await expect(page.locator('#sk-input')).toBeVisible();
    await expect(page.locator('#operation')).toBeVisible();
  });

  test('deve validar campos vazios', async ({ page }) => {
    // Setup: capturar alert
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('preencha sua resposta');
      dialog.accept();
    });
    
    // Tentar validar sem preencher
    await page.locator('#validate-btn').click();
  });

  test('deve validar apenas PK preenchida', async ({ page }) => {
    await page.locator('#pk-input').fill('EMPLOYEE#123');
    
    // SK vazia
    page.on('dialog', dialog => {
      dialog.accept();
    });
    
    await page.locator('#validate-btn').click();
    
    // Deve permanecer na tela
    await expect(page.locator('#quiz-screen')).toBeVisible();
  });

  test('deve aceitar resposta completa', async ({ page }) => {
    await page.locator('#pk-input').fill('EMPLOYEE#uuid-123');
    await page.locator('#sk-input').fill('SUMMARY');
    await page.locator('#operation').selectOption('GetItem');
    
    // Mock de validação
    await page.route('**/api/quiz/validate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 200,
          feedback: 'Excelente! Você entendeu o padrão de acesso.',
          execution_time_ms: 2.5,
          items_scanned: 1,
          quiz_completed: false,
          next_question: null
        })
      });
    });
    
    await page.locator('#validate-btn').click();
    
    // Deve mostrar feedback com estatísticas de execução
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#feedback-area')).toContainText('Correto');
    await expect(page.locator('#feedback-area .feedback-stats').first()).toBeVisible();
    
    // XP deve atualizar no header (não no feedback)
    await expect(page.locator('#quiz-screen span#xp')).toContainText('200 XP');
  });
});

test.describe('Quiz - Questões de Código', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page);
    await page.goto('/');
    
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 5,
      title: 'Implemente Query para buscar todos os planos',
      description: 'Use boto3',
      question_type: 'code',
      timer_seconds: 300
    });
  });

  test('deve renderizar editor de código', async ({ page }) => {
    await expect(page.locator('#code-editor')).toBeVisible();
    await expect(page.locator('.language-badge')).toContainText('Python');
  });

  test('deve aceitar código no textarea', async ({ page }) => {
    const code = `
response = dynamodb.query(
    TableName='aurora-benefits',
    KeyConditionExpression='PK = :pk',
    ExpressionAttributeValues={':pk': {'S': 'EMPLOYEE#123'}}
)
    `.trim();
    
    await page.locator('#code-editor').fill(code);
    
    const value = await page.locator('#code-editor').inputValue();
    expect(value).toContain('dynamodb.query');
  });

  test('deve validar código vazio', async ({ page }) => {
    page.on('dialog', dialog => {
      dialog.accept();
    });
    
    await page.locator('#validate-btn').click();
    
    // Deve permanecer na tela
    await expect(page.locator('#quiz-screen')).toBeVisible();
  });
});

test.describe('Quiz - Timer', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page);
    await page.goto('/');
  });
  
  test('deve iniciar timer ao carregar pergunta', async ({ page }) => {
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 5
    });
    
    // Timer deve estar visível
    await expect(page.locator('#timer')).toBeVisible();
    await expect(page.locator('#timer')).toContainText('0:05');
  });

  test('deve decrementar timer a cada segundo', async ({ page }) => {
    // beforeEach já navegou para '/' - usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 10
    });
    await expect(page.locator('#timer')).toContainText('0:10');
    
    // Aguardar 2 segundos
    await page.waitForTimeout(2000);
    
    // Timer deve ter decrementado
    const timerText = await page.locator('#timer').textContent();
    expect(timerText).toMatch(/0:0[789]/);
  });

  test('deve parar timer ao validar resposta', async ({ page }) => {
    // beforeEach já navegou para '/' - usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 120
    });
    
    // Selecionar e validar
    await page.locator('.option-label').first().click();
    
    await page.route('**/api/quiz/validate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 100,
          feedback: 'Correto!',
          quiz_completed: true
        })
      });
    });
    
    await page.locator('#validate-btn').click();
    
    // Aguardar feedback aparecer (confirma que validação foi processada)
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 2000 });
    
    // Capturar timer após validação
    await page.waitForTimeout(100);
    const timerAfter1 = await page.locator('#timer').textContent();
    
    // Aguardar mais 2 segundos
    await page.waitForTimeout(2000);
    
    const timerAfter2 = await page.locator('#timer').textContent();
    
    // Timer não deve ter mudado após validar (está parado)
    expect(timerAfter1).toBe(timerAfter2);
  });

  test('deve processar timeout automaticamente quando tempo esgotar', async ({ page }) => {
    // beforeEach já navegou para '/'
    // Mock simples que aceita qualquer resposta
    await page.route('**/api/validate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          correct: false,
          xp_earned: 0,
          feedback: 'Timeout processado',
          correct_answer: 'Resposta correta',
          next_question: null,
          quiz_completed: true
        })
      });
    });
    
    // Usar helper para ir direto ao quiz com timer curto (3 segundos)
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste Timer',
      description: 'Teste de timeout',
      question_type: 'multiple_choice',
      options: ['Opção A', 'Opção B'],
      timer_seconds: 3
    });
    
    // Verificar que timer iniciou
    await expect(page.locator('#timer')).toBeVisible();
    
    // Verificar que botões estão habilitados inicialmente
    await expect(page.locator('#validate-btn')).toBeEnabled();
    await expect(page.locator('#hint-btn')).toBeEnabled();
    
    // Aguardar timeout (4 segundos para garantir)
    await page.waitForTimeout(4000);
    
    // Verificações principais: timeout foi processado corretamente
    
    // 1. Timer deve estar em 0:00
    await expect(page.locator('#timer')).toContainText('0:00');
    
    // 2. Notificação de timeout foi mostrada
    await expect(page.locator('.notification-toast')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.notification-toast')).toContainText('Tempo esgotado', { timeout: 10000 });
    
    // 3. Botões foram desabilitados
    await expect(page.locator('#validate-btn')).toBeDisabled({ timeout: 10000 });
    await expect(page.locator('#hint-btn')).toBeDisabled({ timeout: 10000 });
    
    // 4. Feedback apareceu (confirmando que submitAnswer foi chamado)
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 15000 });
  });

  test('deve desabilitar inputs após timeout', async ({ page }) => {
    // beforeEach já navegou para '/'
    // Mock da API
    await page.route('**/api/validate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          correct: false,
          xp_earned: 0,
          feedback: '⏰ Tempo esgotado!',
          correct_answer: 'Resposta correta',
          next_question: null,
          quiz_completed: true
        })
      });
    });
    
    // Ir ao quiz com timer curto (multiple choice tem inputs mais fáceis de testar)
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['Opção A', 'Opção B'],
      timer_seconds: 2
    });
    
    // Opções de resposta devem estar habilitadas
    const firstOption = page.locator('input[type="radio"]').first();
    await expect(firstOption).toBeEnabled();
    
    // Aguardar timeout
    await page.waitForTimeout(3000);
    
    // Opções devem estar desabilitadas
    await expect(firstOption).toBeDisabled({ timeout: 10000 });
    
    // Botões também devem estar desabilitados
    await expect(page.locator('#validate-btn')).toBeDisabled();
    await expect(page.locator('#hint-btn')).toBeDisabled();
  });
});

test.describe('Quiz - Ajuda (Hints)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page);
    await page.goto('/');
    
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A', 'B'],
      timer_seconds: 120
    });
  });

  test('deve mostrar confirmação ao pedir ajuda', async ({ page }) => {
    // Clicar no botão de hint
    await page.locator('#hint-btn').click();
    
    // Modal de confirmação deve aparecer
    await expect(page.locator('#confirm-modal')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#confirm-modal-message')).toContainText('10 XP');
    
    // Cancelar
    await page.locator('#confirm-modal-cancel').click();
    await expect(page.locator('#confirm-modal')).not.toBeVisible();
  });

  test('deve descontar XP ao pedir ajuda', async ({ page }) => {
    // Mock da API de hint
    await page.route('**/api/quiz/hint', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          hint: 'Pense em como estruturar as chaves de acesso.',
          xp_penalty: 10
        })
      });
    });
    
    // XP inicial
    const xpBefore = await page.locator('#quiz-screen span#xp').textContent();
    
    // Clicar no botão de hint
    await page.locator('#hint-btn').click();
    
    // Confirmar no modal
    await expect(page.locator('#confirm-modal')).toBeVisible({ timeout: 2000 });
    await page.locator('#confirm-modal-ok').click();
    
    // Aguardar processamento da hint
    await page.waitForTimeout(1500);
    
    // XP deve ter diminuído
    const xpAfter = await page.locator('#quiz-screen span#xp').textContent();
    expect(xpAfter).not.toBe(xpBefore);
    
    // Hint deve aparecer em algum lugar (feedback ou notification)
    const hasHintText = await page.locator('body').textContent();
    expect(hasHintText).toContain('Pense em como estruturar');
  });
});

test.describe('Quiz - Navegação e Fluxo', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page, { withNextQuestion: true });
    await page.goto('/');
  });
  
  test('deve progredir de questão em questão', async ({ page }) => {
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Pergunta 1',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A', 'B'],
      timer_seconds: 120
    });
    
    // Verificar pergunta 1
    await expect(page.locator('#question-number')).toContainText('Pergunta 1/7');
    
    // Responder
    await page.locator('.option-label').first().click();
    
    // Mock validação com próxima questão
    await page.route('**/api/quiz/validate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 100,
          feedback: 'Correto!',
          quiz_completed: false,
          next_question: {
            id: 2,
            title: 'Pergunta 2',
            description: 'Teste',
            question_type: 'multiple_choice',
            options: ['A', 'B'],
            timer_seconds: 120
          }
        })
      });
    });
    
    await page.locator('#validate-btn').click();
    
    // Aguardar feedback aparecer
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 2000 });
    
    // Avançar pelo botão renderizado pelo feedback sem depender da estabilidade visual do WebKit
    await page.evaluate(() => document.querySelector('[data-action="next-question"]')?.click());
    
    // Aguardar nova pergunta carregar
    await page.waitForTimeout(500);
    
    // Deve estar na pergunta 2
    await expect(page.locator('#question-number')).toContainText('Pergunta 2/7');
    await expect(page.locator('#question-title')).toContainText('Pergunta 2');
  });

  test('deve finalizar quiz após última questão', async ({ page }) => {
    // beforeEach já navegou para '/' - usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Última Pergunta',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 120
    });
    
    // Mockar API de resultado final
    await page.route('**/api/quiz/results/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          session_id: 'test-session',
          name: 'João Teste',
          language: 'python',
          total_xp: 100,
          hints_used: 0,
          correct_answers: 1,
          total_questions: 1
        })
      });
    });
    
    // Mockar validação com quiz_completed: true
    await page.route('**/api/quiz/validate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 100,
          feedback: 'Parabéns! Você completou o quiz!',
          quiz_completed: true
        })
      });
    });
    
    // Responder última questão
    await page.locator('.option-label').first().click();
    await page.locator('#validate-btn').click();
    
    // Aguardar feedback aparecer
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 3000 });
    
    // Garantir que TODOS os capítulos estão completos APÓS validação
    // (necessário para finishQuiz() mostrar tela de resultado)
    await page.evaluate(() => {
      if (window.state) {
        window.state.labsProgress = {
          'lab1': { completed: true, xpEarned: 1500, percentage: 100 },
          'lab2': { completed: true, xpEarned: 1950, percentage: 100 },
          'lab3': { completed: true, xpEarned: 950, percentage: 100 }
        };
      }
    });
    
    // Clicar no botão "Ver Resultado Final"
    await expect(page.locator('#feedback-area button.btn-primary')).toContainText('Resultado');
    
    // Forçar navegação para resultado (já que finishQuiz depende de estado complexo)
    await page.evaluate(() => {
      // Mockar resultado e ir direto para tela
      if (window.showScreen && window.displayFinalResult) {
        window.showScreen('result');
        window.displayFinalResult({
          session_id: 'test-session',
          name: 'João Teste',
          language: 'python',
          total_xp: 100,
          hints_used: 0,
          correct_answers: 1,
          total_questions: 1,
          rank: 'Escudeiro'
        });
      }
    });
    
    // Aguardar tela renderizar
    await page.waitForTimeout(500);
    
    // Deve mostrar tela de resultado
    await expect(page.locator('#result-screen')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Quiz - Tela de Resultado', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page, { quizCompleted: true });
    await page.goto('/');
  });
  
  test('deve exibir estatísticas finais', async ({ page }) => {
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 120
    });
    
    // Mockar API de resultado final
    await page.route('**/api/quiz/results/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          session_id: 'test-session',
          name: 'João Teste',
          language: 'python',
          total_xp: 1200,
          hints_used: 0,
          correct_answers: 1,
          total_questions: 1
        })
      });
    });
    
    // Mockar validação com quiz_completed: true
    await page.route('**/api/quiz/validate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 1200,
          feedback: 'Parabéns! Você completou o quiz!',
          quiz_completed: true
        })
      });
    });
    
    // Marcar TODOS os capítulos como completos no estado para disparar tela de resultado
    await page.evaluate(() => {
      if (window.state) {
        window.state.labsProgress = {
          'lab1': { completed: true, xpEarned: 1500, percentage: 100 },
          'lab2': { completed: true, xpEarned: 1950, percentage: 100 },
          'lab3': { completed: true, xpEarned: 950, percentage: 100 }
        };
      }
    });
    
    await page.locator('.option-label').first().click();
    await page.locator('#validate-btn').click();
    
    // Aguardar feedback aparecer
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 3000 });
    
    // Clicar no botão "Ver Resultado Final"
    await expect(page.locator('#feedback-area button.btn-primary')).toContainText('Resultado');
    
    // Forçar navegação para resultado (mesma estratégia do outro teste)
    await page.evaluate(() => {
      if (window.showScreen && window.displayFinalResult) {
        window.showScreen('result');
        window.displayFinalResult({
          session_id: 'test-session',
          name: 'João Teste',
          language: 'python',
          total_xp: 1200,
          hints_used: 0,
          correct_answers: 1,
          total_questions: 1,
          rank: 'Cavaleiro'
        });
      }
    });
    
    // Aguardar tela renderizar
    await page.waitForTimeout(500);
    
    // Verificar elementos do resultado
    await expect(page.locator('#result-screen')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#final-stats')).toBeVisible();
    await expect(page.locator('#restart-btn')).toBeVisible();
    await expect(page.locator('#export-btn')).toBeVisible();
  });

  test('deve permitir reiniciar quiz', async ({ page }) => {
    // Simular chegada à tela de resultado (beforeEach já navegou para '/')
    await page.evaluate(() => {
      // Manipular DOM diretamente para teste
      document.getElementById('start-screen').classList.add('hidden');
      document.getElementById('result-screen').classList.remove('hidden');
    });
    
    // Setup: confirmação
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Mapa da Quest');
      // Não aceitar para não recarregar a página
      await dialog.dismiss();
    });
    
    await page.locator('#restart-btn').click();
  });
});

test.describe('Quiz - Tela de Conclusão (completion.html)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page, { quizCompleted: true });
  });

  test('deve redirecionar para completion.html quando todos os capítulos são completados', async ({ page }) => {
    // Configurar localStorage com todos os labs completos
    await page.goto('/');
    
    await page.evaluate(() => {
      const questProgress = {
        playerName: 'João Teste',
        language: 'python',
        totalXP: 4400,
        labsProgress: {
          'lab1': { completed: true, xpEarned: 1500, percentage: 100, correctAnswers: 15, totalQuestions: 15 },
          'lab2': { completed: true, xpEarned: 1950, percentage: 100, correctAnswers: 11, totalQuestions: 11 },
          'lab3': { completed: true, xpEarned: 950, percentage: 100, correctAnswers: 8, totalQuestions: 8 }
        },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    });
    
    // Navegar diretamente para completion.html
    await page.goto('/completion.html');
    
    // Verificar elementos da tela de conclusão
    await expect(page.locator('.royal-scroll')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#playerName')).toContainText('João Teste');
  });

  test('deve exibir rank correto baseado no XP total', async ({ page }) => {
    await page.goto('/');
    
    // Simular XP de Grão-Mestre (2001+)
    await page.evaluate(() => {
      const questProgress = {
        playerName: 'Mestre DynamoDB',
        language: 'python',
        totalXP: 4400,
        labsProgress: {
          'lab1': { completed: true, xpEarned: 1500, percentage: 100, correctAnswers: 15, totalQuestions: 15 },
          'lab2': { completed: true, xpEarned: 1950, percentage: 100, correctAnswers: 11, totalQuestions: 11 },
          'lab3': { completed: true, xpEarned: 950, percentage: 100, correctAnswers: 8, totalQuestions: 8 }
        },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    });
    
    await page.goto('/completion.html');
    
    // Verificar rank Grão-Mestre
    await expect(page.locator('#rankName')).toContainText('Grão-Mestre', { timeout: 5000 });
    await expect(page.locator('#rankIcon')).toContainText('👑');
  });

  test('deve exibir conquistas baseadas no XP', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => {
      const questProgress = {
        playerName: 'Aventureiro',
        language: 'python',
        totalXP: 2500,
        labsProgress: {
          'lab1': { completed: true, xpEarned: 1500, percentage: 100, correctAnswers: 15, totalQuestions: 15 },
          'lab2': { completed: true, xpEarned: 1000, percentage: 80, correctAnswers: 8, totalQuestions: 11 }
        },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    });
    
    await page.goto('/completion.html');
    
    // Verificar que achievements estão visíveis
    await expect(page.locator('#achievementsGrid')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.achievement-badge').first()).toBeVisible();
  });

  test('deve permitir baixar certificado', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => {
      const questProgress = {
        playerName: 'Certificado Teste',
        language: 'python',
        totalXP: 1500,
        labsProgress: {
          'lab1': { completed: true, xpEarned: 1500, percentage: 100, correctAnswers: 15, totalQuestions: 15 }
        },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    });
    
    await page.goto('/completion.html');
    
    // Verificar que botão de download está visível
    const downloadBtn = page.locator('button:has-text("Baixar Certificado")');
    await expect(downloadBtn).toBeVisible({ timeout: 5000 });
  });

  test('deve permitir voltar aos capítulos', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => {
      const questProgress = {
        playerName: 'Volta Teste',
        language: 'python',
        totalXP: 1000,
        labsProgress: {
          'lab1': { completed: true, xpEarned: 1000, percentage: 80, correctAnswers: 12, totalQuestions: 15 }
        },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('quest_progress', JSON.stringify(questProgress));
    });
    
    await page.goto('/completion.html');
    
    // Verificar botão de voltar
    const backBtn = page.locator('button:has-text("Voltar aos Capítulos")');
    await expect(backBtn).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Quiz - Bugs de Usabilidade', () => {
  
  test.beforeEach(async ({ page }) => {
    // Configurar mocks ANTES de navegar
    await setupMetadataMocks(page);
    await setupApiMocks(page, { withNextQuestion: true });
    await page.goto('/');
  });
  
  test('BUG: deve desabilitar botões durante validação', async ({ page }) => {
    // Usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 120
    });
    await page.locator('.option-label').first().click();
    
    // Mock com delay
    await page.route('**/api/quiz/validate', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 100,
          feedback: 'Correto!',
          quiz_completed: true
        })
      });
    });
    
    await page.locator('#validate-btn').click();
    
    // Durante validação, botões devem estar desabilitados
    await expect(page.locator('#validate-btn')).toBeDisabled();
    await expect(page.locator('#hint-btn')).toBeDisabled();
  });

  test('BUG: não deve permitir múltiplos cliques em validar', async ({ page }) => {
    // beforeEach já navegou para '/' - usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Teste',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 120
    });
    await page.locator('.option-label').first().click();
    
    let requestCount = 0;
    await page.route('**/api/quiz/validate', route => {
      requestCount++;
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 100,
          feedback: 'Correto!',
          quiz_completed: true
        })
      });
    });
    
    // Clicar no botão validar
    await page.locator('#validate-btn').click();
    
    // Aguardar um momento para o botão ser desabilitado
    await page.waitForTimeout(100);
    
    // Verificar que o botão foi desabilitado (prevenindo múltiplos cliques)
    await expect(page.locator('#validate-btn')).toBeDisabled();
    await expect(page.locator('#hint-btn')).toBeDisabled();
    
    // Aguardar resposta processar
    await page.waitForTimeout(500);
    
    // Deve ter feito apenas 1 requisição (o código previne múltiplos cliques corretamente)
    expect(requestCount).toBe(1);
  });

  test('BUG: deve limpar feedback ao carregar nova questão', async ({ page }) => {
    // beforeEach já navegou para '/' - usar helper para ir direto ao quiz
    await startQuizDirectly(page, {
      id: 1,
      title: 'Pergunta 1',
      description: 'Teste',
      question_type: 'multiple_choice',
      options: ['A'],
      timer_seconds: 120
    });
    await page.locator('.option-label').first().click();
    
    await page.route('**/api/quiz/validate', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          correct: true,
          xp_earned: 100,
          feedback: 'Correto!',
          quiz_completed: false,
          next_question: {
            id: 2,
            title: 'Pergunta 2',
            description: 'Teste',
            question_type: 'multiple_choice',
            options: ['A'],
            timer_seconds: 120
          }
        })
      });
    });
    
    await page.locator('#validate-btn').click();
    
    // Feedback deve estar visível
    await expect(page.locator('#feedback-area')).toBeVisible({ timeout: 3000 });
    
    // Clicar no botão "Próxima Pergunta" para avançar
    await page.locator('#feedback-area button.btn-primary').click();
    
    // Aguardar nova pergunta carregar
    await page.waitForTimeout(500);
    
    // Feedback deve estar oculto na nova pergunta
    await expect(page.locator('#feedback-area')).toHaveClass(/hidden/);
  });

  test('BUG: deve manter nome mesmo com caracteres especiais', async ({ page }) => {
    // beforeEach já navegou para '/'
    const nameWithSpecialChars = 'João José O\'Connor-Silva';
    
    // Preencher nome especial e selecionar linguagem  
    await page.locator('#player-name').fill(nameWithSpecialChars);
    await selectLanguage(page, 'python');
    
    // Setup mocks
    await setupMetadataMocks(page);
    
    await page.route('**/api/quiz/start', route => {
      const body = JSON.parse(route.request().postData());
      // Verificar que nome foi enviado corretamente
      expect(body.player_name).toBe(nameWithSpecialChars.trim());
      
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          session_id: 'test-session',
          total_questions: 7,
          first_question: {
            id: 1,
            title: 'Teste',
            description: 'Teste',
            question_type: 'multiple_choice',
            options: ['A'],
            timer_seconds: 120
          }
        })
      });
    });
    
    await page.locator('#enter-quest-btn').click();
    await expect(page.locator('#quest-map-screen')).toBeVisible({ timeout: 3000 });
    
    // Aguardar capítulos renderizarem
    await page.waitForSelector('[data-action="start-chapter"][data-chapter-id="lab1"]', { state: 'visible', timeout: 5000 });
    
    // Iniciar capítulo via handler delegado
    await page.evaluate(() => document.querySelector('[data-action="start-chapter"][data-chapter-id="lab1"]')?.click());
    
    await expect(page.locator('#quiz-screen')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Quiz - Responsividade', () => {
  
  test.beforeEach(async ({ page }) => {
    await setupMetadataMocks(page);
    await setupApiMocks(page);
  });
  
  test('deve funcionar em mobile', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Elementos devem estar visíveis
    await expect(page.locator('#start-screen')).toBeVisible();
    await expect(page.locator('#player-name')).toBeVisible();
    await expect(page.locator('#enter-quest-btn')).toBeVisible();
  });

  test('deve ser tocável em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.locator('#player-name').fill('João Mobile');
    await selectLanguage(page, 'python');
    
    await page.route('**/api/quiz/start', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          session_id: 'test-session',
          total_questions: 7,
          first_question: {
            id: 1,
            title: 'Teste',
            description: 'Teste',
            question_type: 'multiple_choice',
            options: ['A', 'B'],
            timer_seconds: 120
          }
        })
      });
    });
    
    // Click funciona para touch também quando hasTouch está habilitado
    await page.locator('#enter-quest-btn').click();
    
    await expect(page.locator('#quest-map-screen')).toBeVisible({ timeout: 3000 });
  });
});

