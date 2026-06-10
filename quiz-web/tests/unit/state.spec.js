import { describe, it, expect, beforeEach } from 'vitest';
import { state, setState, resetState, updateXP } from '../../js/state.js';

describe('state.js', () => {
  describe('Estado Inicial', () => {
    it('deve ter sessionId null inicialmente', () => {
      expect(state.sessionId).toBeNull();
    });

    it('deve ter currentQuestion null inicialmente', () => {
      expect(state.currentQuestion).toBeNull();
    });

    it('deve ter currentQuestionIndex em 0', () => {
      expect(state.currentQuestionIndex).toBe(0);
    });

    it('deve ter totalQuestions definido', () => {
      expect(state.totalQuestions).toBe(7);
    });

    it('deve ter totalXP em 0', () => {
      expect(state.totalXP).toBe(0);
    });

    it('deve ter playerName vazio', () => {
      expect(state.playerName).toBe('');
    });

    it('deve ter language padrão', () => {
      expect(state.language).toBe('python');
    });

    it('deve ter timer null', () => {
      expect(state.timer).toBeNull();
    });

    it('deve ter arrays vazios', () => {
      expect(state.answers).toEqual([]);
      expect(Array.isArray(state.answers)).toBe(true);
    });

    it('deve ter labsProgress vazio', () => {
      expect(state.labsProgress).toEqual({});
    });

    it('deve ter quizCompleted false', () => {
      expect(state.quizCompleted).toBe(false);
    });
  });

  describe('setState()', () => {
    beforeEach(() => {
      // Resetar state antes de cada teste
      resetState();
    });

    it('deve atualizar propriedades do estado', () => {
      setState({ sessionId: 'test-123' });
      expect(state.sessionId).toBe('test-123');
    });

    it('deve atualizar múltiplas propriedades', () => {
      setState({ 
        sessionId: 'test-456',
        playerName: 'João Teste',
        language: 'go'
      });
      
      expect(state.sessionId).toBe('test-456');
      expect(state.playerName).toBe('João Teste');
      expect(state.language).toBe('go');
    });

    it('não deve remover propriedades existentes', () => {
      setState({ sessionId: 'test-789' });
      setState({ playerName: 'Maria Teste' });
      
      expect(state.sessionId).toBe('test-789'); // Deve manter
      expect(state.playerName).toBe('Maria Teste');
    });

    it('deve permitir atualizar totalXP', () => {
      setState({ totalXP: 100 });
      expect(state.totalXP).toBe(100);
    });

    it('deve permitir atualizar objetos complexos', () => {
      const progress = { lab1: { completed: true, xpEarned: 500 } };
      setState({ labsProgress: progress });
      expect(state.labsProgress).toEqual(progress);
    });
  });

  describe('resetState()', () => {
    beforeEach(() => {
      // Configurar state com dados
      setState({
        sessionId: 'test-reset',
        currentQuestion: { id: 1, title: 'Test' },
        currentQuestionIndex: 3,
        totalXP: 500,
        answers: [{ id: 1, correct: true }],
        hintsUsed: 2,
        quizCompleted: true
      });
    });

    it('deve resetar sessionId para null', () => {
      resetState();
      expect(state.sessionId).toBeNull();
    });

    it('deve resetar currentQuestion para null', () => {
      resetState();
      expect(state.currentQuestion).toBeNull();
    });

    it('deve resetar currentQuestionIndex para 0', () => {
      resetState();
      expect(state.currentQuestionIndex).toBe(0);
    });

    it('deve resetar totalXP para 0', () => {
      resetState();
      expect(state.totalXP).toBe(0);
    });

    it('deve resetar answers para array vazio', () => {
      resetState();
      expect(state.answers).toEqual([]);
    });

    it('deve resetar hintsUsed para 0', () => {
      resetState();
      expect(state.hintsUsed).toBe(0);
    });

    it('deve resetar quizCompleted para false', () => {
      resetState();
      expect(state.quizCompleted).toBe(false);
    });

    it('deve resetar nextQuestion para null', () => {
      resetState();
      expect(state.nextQuestion).toBeNull();
    });
  });

  describe('updateXP()', () => {
    beforeEach(() => {
      resetState();
    });

    it('deve adicionar XP corretamente', () => {
      const newXP = updateXP(100);
      expect(newXP).toBe(100);
      expect(state.totalXP).toBe(100);
    });

    it('deve acumular XP em múltiplas chamadas', () => {
      updateXP(50);
      updateXP(30);
      const finalXP = updateXP(20);
      
      expect(finalXP).toBe(100);
      expect(state.totalXP).toBe(100);
    });

    it('deve permitir subtrair XP (penalidade)', () => {
      setState({ totalXP: 100 });
      const newXP = updateXP(-10);
      
      expect(newXP).toBe(90);
      expect(state.totalXP).toBe(90);
    });

    it('não deve permitir XP negativo', () => {
      setState({ totalXP: 50 });
      const newXP = updateXP(-100);
      
      expect(newXP).toBe(0);
      expect(state.totalXP).toBe(0);
    });

    it('deve retornar XP atualizado', () => {
      setState({ totalXP: 200 });
      const result = updateXP(50);
      
      expect(result).toBe(250);
    });

    it('deve funcionar com valores decimais (arredondar)', () => {
      const newXP = updateXP(10.7);
      expect(newXP).toBe(10.7); // Permite decimais
      expect(state.totalXP).toBe(10.7);
    });
  });

  describe('Integração de Funções', () => {
    it('deve permitir workflow completo', () => {
      // Iniciar
      resetState();
      expect(state.totalXP).toBe(0);
      
      // Adicionar sessão
      setState({ sessionId: 'integration-test', playerName: 'Teste' });
      expect(state.sessionId).toBe('integration-test');
      
      // Adicionar XP
      updateXP(100);
      updateXP(50);
      expect(state.totalXP).toBe(150);
      
      // Resetar
      resetState();
      expect(state.totalXP).toBe(0);
      expect(state.sessionId).toBeNull();
    });
  });
});

