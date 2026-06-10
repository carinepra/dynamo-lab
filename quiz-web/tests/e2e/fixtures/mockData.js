// Mock data reutilizável para todos os testes E2E

export const mockQuestions = {
  multipleChoice: {
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
  },
  openAnswer: {
    id: 3,
    title: 'Defina PK/SK para buscar funcionário',
    description: 'Complete os campos abaixo',
    question_type: 'open_answer',
    timer_seconds: 180
  },
  codeEditor: {
    id: 5,
    title: 'Implemente Query para buscar todos os planos',
    description: 'Use boto3',
    question_type: 'code',
    timer_seconds: 300
  }
};

export const mockResponses = {
  startSession: (questionData) => ({
    session_id: 'test-session',
    total_questions: 7,
    first_question: questionData
  }),
  
  validateCorrect: (xpEarned = 100, nextQuestion = null) => ({
    correct: true,
    xp_earned: xpEarned,
    feedback: 'Correto! Ótimo trabalho.',
    quiz_completed: false,
    next_question: nextQuestion
  }),
  
  validateIncorrect: (xpEarned = 0) => ({
    correct: false,
    xp_earned: xpEarned,
    feedback: 'Incorreto. Tente novamente.',
    quiz_completed: false
  }),
  
  validateWithStats: (correct = true, xpEarned = 200) => ({
    correct,
    xp_earned: xpEarned,
    feedback: correct ? 'Excelente! Você entendeu o padrão de acesso.' : 'Incorreto.',
    execution_time_ms: 2.5,
    items_scanned: 1,
    quiz_completed: false,
    next_question: null
  }),
  
  quizCompleted: (xpEarned = 100) => ({
    correct: true,
    xp_earned: xpEarned,
    feedback: 'Parabéns! Você completou o quiz!',
    quiz_completed: true
  }),
  
  finalResult: {
    session_id: 'test-session',
    name: 'João Teste',
    language: 'python',
    total_xp: 1200,
    hints_used: 0,
    correct_answers: 7,
    total_questions: 7
  },
  
  hint: {
    hint: 'Pense em chave primária composta',
    xp_penalty: 10
  }
};

export const mockChapters = {
  lab1: {
    id: 'lab1',
    icon: '🏛️',
    title: 'CAPÍTULO 1: ACADEMIA DOS FUNDAMENTOS',
    subtitle: 'A Ponte Entre Dois Mundos - Onde Toda Jornada Começa',
    highlights: ['SQL vs NoSQL', 'DynamoDB Core', 'Partições', 'Operações'],
    missions: ['Q1-Q15: Fundamentos'],
    details: { time: '~45 minutos', xp: '1.500 XP', type: 'Múltipla escolha' },
    unlockRequirement: null,
    lab: 'lab1'
  },
  lab2: {
    id: 'lab2',
    icon: '⚔️',
    title: 'CAPÍTULO 2: ARENA DOS PATTERNS',
    subtitle: 'Onde Heróis Provam Seu Valor',
    highlights: ['Access Patterns', 'Single Table', 'Queries Avançadas'],
    missions: ['Q1-Q13: Patterns'],
    details: { time: '~50 minutos', xp: '1.870 XP', type: 'Múltipla escolha' },
    unlockRequirement: 'lab1',
    lab: 'lab2'
  },
  lab3: {
    id: 'lab3',
    icon: '🗼',
    title: 'CAPÍTULO 3: TORRE DOS GSIs',
    subtitle: 'A Visão do Alto da Torre',
    highlights: ['GSI Basics', 'GSI vs LSI', 'Eventual Consistency'],
    missions: ['Q1-Q8: GSI'],
    details: { time: '~30 minutos', xp: '1.050 XP', type: 'Múltipla escolha' },
    unlockRequirement: 'lab2',
    lab: 'lab3'
  }
};

export const mockPlayerData = {
  name: 'João Teste',
  nameWithSpaces: '  João Silva  ',
  nameWithSpecialChars: "João José O'Connor-Silva",
  languages: ['python', 'go', 'javascript']
};

