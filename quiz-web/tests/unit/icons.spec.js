import { describe, it, expect } from 'vitest';
import { SVG, Icons } from '../../js/icons.js';

describe('icons.js', () => {
  describe('SVG Object', () => {
    it('deve ter propriedade SVG definida', () => {
      expect(SVG).toBeDefined();
      expect(typeof SVG).toBe('object');
    });

    it('deve ter ícones principais definidos', () => {
      const requiredIcons = [
        'avail', 'prog', 'lock', 'comp', 'miss', 'time', 
        'xp', 'note', 'troph', 'stat', 'map', 'tool', 
        'succ', 'book', 'acad', 'sword', 'crys', 'crown', 'shld', 'grad'
      ];

      requiredIcons.forEach(icon => {
        expect(SVG).toHaveProperty(icon);
        expect(typeof SVG[icon]).toBe('string');
      });
    });

    it('cada SVG deve conter tag <svg>', () => {
      Object.values(SVG).forEach(svg => {
        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
      });
    });

    it('cada SVG deve ter viewBox', () => {
      Object.values(SVG).forEach(svg => {
        expect(svg).toContain('viewBox');
      });
    });

    it('SVGs devem ter classe quest-icon', () => {
      Object.values(SVG).forEach(svg => {
        const hasQuestIcon = svg.includes('quest-icon-inline') || svg.includes('quest-icon-chapter');
        expect(hasQuestIcon).toBe(true);
      });
    });
  });

  describe('Icons.get()', () => {
    it('deve retornar SVG para ícone válido', () => {
      const icon = Icons.get('timer');
      expect(icon).toBeDefined();
      expect(typeof icon).toBe('string');
      expect(icon).toContain('<svg');
    });

    it('deve retornar SVG para todos os ícones mapeados', () => {
      const icons = ['xp', 'timer', 'mission', 'note', 'trophy', 'stats', 'map', 'tool', 'locked', 'success', 'book'];
      icons.forEach(name => {
        const svg = Icons.get(name);
        expect(svg).toBeDefined();
        expect(typeof svg).toBe('string');
      });
    });

    it('deve retornar fallback para ícone inexistente', () => {
      const fallback = Icons.get('nonexistent');
      expect(fallback).toBeDefined();
      expect(fallback).toBe('⚫'); // Fallback emoji
    });

    it('deve retornar fallback para nome vazio', () => {
      const result = Icons.get('');
      expect(typeof result).toBe('string');
      expect(result).toBe('⚫');
    });
  });

  describe('Icons.getStatus()', () => {
    it('deve retornar ícone de unlocked', () => {
      const icon = Icons.getStatus('unlocked');
      expect(icon).toBeDefined();
      expect(icon).toContain('<svg');
    });

    it('deve retornar ícone de in-progress', () => {
      const icon = Icons.getStatus('in-progress');
      expect(icon).toBeDefined();
      expect(icon).toContain('<svg');
    });

    it('deve retornar ícone de locked', () => {
      const icon = Icons.getStatus('locked');
      expect(icon).toBeDefined();
      expect(icon).toContain('<svg');
    });

    it('deve retornar ícone de completed', () => {
      const icon = Icons.getStatus('completed');
      expect(icon).toBeDefined();
      expect(icon).toContain('<svg');
    });

    it('deve ter fallback para status inexistente', () => {
      const fallback = Icons.getStatus('unknown');
      expect(fallback).toBeDefined();
      expect(typeof fallback).toBe('string');
      expect(fallback).toContain('<svg'); // Deve retornar SVG.avail como fallback
    });

    it('ícones de status devem ser distintos', () => {
      const unlocked = Icons.getStatus('unlocked');
      const locked = Icons.getStatus('locked');
      const completed = Icons.getStatus('completed');
      
      expect(unlocked).not.toBe(locked);
      expect(unlocked).not.toBe(completed);
      expect(locked).not.toBe(completed);
    });
  });

  describe('Icons.getChapter()', () => {
    it('deve retornar SVG para emoji de capítulo', () => {
      const icon = Icons.getChapter('📚');
      expect(icon).toBeDefined();
      expect(typeof icon).toBe('string');
      expect(icon).toContain('<svg');
    });

    it('deve funcionar com vários emojis', () => {
      const emojis = ['🏛️', '⚔️', '🔮', '👑', '🛡️', '📚', '🎓', '🗺️'];
      emojis.forEach(emoji => {
        const icon = Icons.getChapter(emoji);
        expect(icon).toContain('<svg');
      });
    });

    it('deve ter fallback para ícone desconhecido', () => {
      const fallback = Icons.getChapter('unknown-chapter');
      expect(fallback).toBeDefined();
      expect(typeof fallback).toBe('string');
      expect(fallback).toContain('<svg'); // Deve retornar SVG.acad como fallback
    });
  });

  describe('Ícones Específicos', () => {
    it('deve ter ícone de XP', () => {
      const icon = Icons.get('xp');
      expect(icon).toBeDefined();
      expect(icon).toContain('<svg');
    });

    it('deve ter ícone de Timer', () => {
      const icon = Icons.get('timer');
      expect(icon).toBeDefined();
      expect(icon).toContain('<svg');
    });

    it('deve ter ícone de Mapa', () => {
      const icon = Icons.get('map');
      expect(icon).toBeDefined();
      expect(icon).toContain('<svg');
    });

    it('ícones diferentes devem retornar SVGs distintos', () => {
      const xp = Icons.get('xp');
      const timer = Icons.get('timer');
      const map = Icons.get('map');
      
      // Pelo menos alguns devem ser diferentes
      const allSame = (xp === timer && timer === map);
      expect(allSame).toBe(false);
    });
  });

  describe('Validação de SVG', () => {
    it('SVGs devem ter xmlns ou ser válidos', () => {
      // Alguns SVGs podem não ter xmlns explícito (é opcional em HTML5)
      Object.values(SVG).forEach(svg => {
        const isValid = svg.includes('<svg') && svg.includes('</svg>');
        expect(isValid).toBe(true);
      });
    });

    it('SVGs devem ter viewBox ou width/height', () => {
      Object.values(SVG).forEach(svg => {
        const hasSize = svg.includes('viewBox') || (svg.includes('width') && svg.includes('height'));
        expect(hasSize).toBe(true);
      });
    });

    it('SVGs não devem ter scripts maliciosos', () => {
      Object.values(SVG).forEach(svg => {
        expect(svg.toLowerCase()).not.toContain('<script');
        expect(svg.toLowerCase()).not.toContain('javascript:');
        expect(svg.toLowerCase()).not.toContain('onerror=');
      });
    });
  });

  describe('Performance', () => {
    it('deve retornar ícones rapidamente', () => {
      const start = Date.now();
      for (let i = 0; i < 100; i++) {
        Icons.get('timer');
      }
      const duration = Date.now() - start;
      
      // 100 chamadas devem levar menos de 10ms
      expect(duration).toBeLessThan(10);
    });

    it('não deve criar novos objetos a cada chamada', () => {
      const icon1 = Icons.get('book');
      const icon2 = Icons.get('book');
      
      // Deve retornar a mesma string
      expect(icon1).toBe(icon2);
    });
  });

  describe('Estrutura do Objeto SVG', () => {
    it('deve ter pelo menos 15 ícones', () => {
      const count = Object.keys(SVG).length;
      expect(count).toBeGreaterThanOrEqual(15);
    });

    it('todos os valores devem ser strings', () => {
      Object.values(SVG).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('nenhum ícone deve estar vazio', () => {
      Object.values(SVG).forEach(value => {
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });
});
