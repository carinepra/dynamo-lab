import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  API_BASE_URL,
  API_URL,
  APP_VERSION,
  QUEST_LEVELS,
  MAX_QUESTIONS,
  HINT_XP_PENALTY,
  TIMEOUT_DURATION,
  LAB_IDS,
  QUIZ_RESULT_MAX_XP,
  DEFAULT_CHAPTER_MAX_XP,
  TRAINING_UNLOCK_ALL_CHAPTERS,
  QUIZ_DELAYS
} from '../../js/config.js';
import { formatMarkdown, nl2br } from '../../js/utils/markdown.js';

describe('config.js', () => {
  describe('Constantes', () => {
    it('deve ter API_URL definida', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
      expect(API_BASE_URL).toContain(':17091');
      expect(API_URL).toBeDefined();
      expect(typeof API_URL).toBe('string');
      expect(API_URL).toContain('http://');
      expect(API_URL).toContain(':17091/api/quiz');
      expect(API_URL).toBe(`${API_BASE_URL}/api/quiz`);
    });

    it('deve expor a versão runtime do frontend', () => {
      expect(APP_VERSION).toBe('2.1.0');
    });

    it('deve ter MAX_QUESTIONS definido corretamente', () => {
      expect(MAX_QUESTIONS).toBe(7);
    });

    it('deve ter HINT_XP_PENALTY definido corretamente', () => {
      expect(HINT_XP_PENALTY).toBe(10);
    });

    it('deve ter TIMEOUT_DURATION definido corretamente', () => {
      expect(TIMEOUT_DURATION).toBe(300); // 5 minutos
    });

    it('deve centralizar labs carregados no mapa', () => {
      expect(LAB_IDS).toEqual(['lab1', 'lab2', 'lab3']);
      expect(Object.isFrozen(LAB_IDS)).toBe(true);
    });

    it('deve centralizar XP máximo e fallback de capítulo', () => {
      expect(QUIZ_RESULT_MAX_XP).toBe(1500);
      expect(DEFAULT_CHAPTER_MAX_XP).toBe(1500);
    });

    it('deve explicitar desbloqueio livre para treinamento', () => {
      expect(TRAINING_UNLOCK_ALL_CHAPTERS).toBe(true);
    });

    it('deve centralizar delays relevantes do quiz', () => {
      expect(Object.isFrozen(QUIZ_DELAYS)).toBe(true);
      expect(QUIZ_DELAYS.validationWarningMs).toBe(3000);
      expect(QUIZ_DELAYS.completionRedirectMs).toBe(1500);
      expect(QUIZ_DELAYS.chapterCompleteReturnMs).toBe(10000);
      expect(QUIZ_DELAYS.hintNotificationMs).toBe(22000);
    });
  });

  describe('QUEST_LEVELS', () => {
    it('deve ter 5 níveis definidos', () => {
      expect(QUEST_LEVELS).toHaveLength(5);
    });

    it('cada nível deve ter estrutura correta', () => {
      QUEST_LEVELS.forEach((level) => {
        expect(level).toHaveProperty('min');
        expect(level).toHaveProperty('max');
        expect(level).toHaveProperty('name');
        expect(level).toHaveProperty('badge');
        expect(level).toHaveProperty('description');
        expect(level).toHaveProperty('icon');
        
        expect(typeof level.min).toBe('number');
        expect(typeof level.max).toBe('number');
        expect(typeof level.name).toBe('string');
        expect(typeof level.badge).toBe('string');
        expect(typeof level.description).toBe('string');
        expect(typeof level.icon).toBe('string');
      });
    });

    it('deve ter níveis em ordem crescente de XP', () => {
      for (let i = 0; i < QUEST_LEVELS.length - 1; i++) {
        expect(QUEST_LEVELS[i].max).toBeLessThan(QUEST_LEVELS[i + 1].min);
      }
    });

    it('deve ter nomes de níveis corretos', () => {
      const expectedNames = ['Escudeiro', 'Cartógrafo', 'Cavaleiro', 'Oráculo', 'Grão-Mestre'];
      const actualNames = QUEST_LEVELS.map(l => l.name);
      expect(actualNames).toEqual(expectedNames);
    });

    it('deve ter badges corretos', () => {
      const expectedBadges = ['bronze', 'silver', 'gold', 'principal', 'legend'];
      const actualBadges = QUEST_LEVELS.map(l => l.badge);
      expect(actualBadges).toEqual(expectedBadges);
    });

    it('deve ter ícones corretos', () => {
      const expectedIcons = ['shield', 'map', 'sword', 'crystal', 'crown'];
      const actualIcons = QUEST_LEVELS.map(l => l.icon);
      expect(actualIcons).toEqual(expectedIcons);
    });

    it('primeiro nível deve começar em 0 XP', () => {
      expect(QUEST_LEVELS[0].min).toBe(0);
    });

    it('último nível deve ter limite alto', () => {
      const lastLevel = QUEST_LEVELS[QUEST_LEVELS.length - 1];
      expect(lastLevel.max).toBeGreaterThanOrEqual(9999);
    });
  });

  describe('API_URL Auto-detecção', () => {
    it('deve conter localhost para ambiente de desenvolvimento', () => {
      // Em ambiente de desenvolvimento, deve usar localhost
      if (typeof window !== 'undefined' && window.location) {
        expect(API_URL).toContain('localhost');
      }
    });

    it('deve ter porta 17091 para o backend', () => {
      expect(API_URL).toContain(':17091');
    });

    it('deve ter endpoint /api/quiz', () => {
      expect(API_URL).toContain('/api/quiz');
    });
  });
});

describe('markdown.js', () => {
  it('escapa HTML bruto antes de renderizar markdown', () => {
    const html = formatMarkdown('Texto <img src=x onerror=alert(1)> **seguro**');

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img');
    expect(html).toContain('<strong>seguro</strong>');
  });

  it('bloqueia links com protocolo inseguro', () => {
    const html = formatMarkdown('Clique [aqui](javascript:alert(1))');

    expect(html).toContain('href="#"');
    expect(html).not.toContain('javascript:alert');
  });

  it('mantém links seguros', () => {
    const html = formatMarkdown('Leia [a doc](https://example.com/path?a=1&b=2)');

    expect(html).toContain('href="https://example.com/path?a=1&amp;b=2"');
    expect(html).toContain('target="_blank"');
  });

  it('bloqueia links protocol-relative', () => {
    const html = formatMarkdown('Clique [aqui](//evil.example/path)');

    expect(html).toContain('href="#"');
    expect(html).not.toContain('evil.example');
  });

  it('escapa HTML antes de converter quebras de linha', () => {
    const html = nl2br('<script>alert(1)</script>\nLinha 2');

    expect(html).toBe('&lt;script&gt;alert(1)&lt;/script&gt;<br>Linha 2');
  });
});

