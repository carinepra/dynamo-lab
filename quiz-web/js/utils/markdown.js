// ============================================
// MARKDOWN FORMATTER
// ============================================
// Converte markdown simples em HTML

/**
 * Formata texto markdown para HTML
 * Suporta: **bold**, `code`, ```code blocks```, bullets (•), links
 * @param {string} text - Texto em markdown
 * @returns {string} HTML formatado
 */
export function formatMarkdown(text) {
    if (!text) return '';
    
    // 1. PRIMEIRO: Proteger code blocks (guardar em um array temporário)
    const codeBlocks = [];
    let textWithPlaceholders = String(text).replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
        const sanitizedCode = escapeHTML(code.trim());
        const safeLang = /^[a-z0-9_-]+$/i.test(lang) ? lang : '';
        const langClass = safeLang ? ` class="language-${safeLang}"` : '';
        codeBlocks.push(`<pre><code${langClass}>${sanitizedCode}</code></pre>`);
        return placeholder;
    });
    
    // 2. Escapar HTML bruto antes de aplicar o markdown permitido.
    let processed = escapeHTML(textWithPlaceholders)
        // Headers (** no início da linha)
        .replace(/^\*\*(.+?)\*\*$/gm, '<strong>$1</strong>')
        // Bold (** qualquer lugar)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Inline code (`código`)
        .replace(/`([^`]+)`/g, (match, code) => `<code>${code}</code>`)
        // Bullet points
        .replace(/^• (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        // Links [texto](url)
        .replace(/\[(.+?)\]\((.+?)\)/g, (match, label, url) => {
            const safeHref = getSafeHref(url);
            return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        })
        // Limpar múltiplas quebras de linha (3+ vira 2)
        .replace(/\n{3,}/g, '\n\n')
        // Line breaks - \n\n vira <br>, \n vira espaço
        .replace(/\n\n/g, '<br>')
        .replace(/\n/g, ' ');
    
    // 3. FINAL: Restaurar code blocks (com quebras de linha preservadas!)
    codeBlocks.forEach((block, i) => {
        processed = processed.replace(`___CODE_BLOCK_${i}___`, block);
    });
    
    return processed;
}

/**
 * Escapa caracteres HTML para prevenir injeção
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
export function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function decodeHTMLEntities(text) {
    return String(text)
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function getSafeHref(url) {
    const decodedUrl = decodeHTMLEntities(url).trim();
    
    if (decodedUrl.startsWith('//')) {
        return '#';
    }
    
    if (decodedUrl.startsWith('/') || decodedUrl.startsWith('./') || decodedUrl.startsWith('../')) {
        return escapeHTML(decodedUrl);
    }
    
    try {
        const parsed = new URL(decodedUrl);
        if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
            return escapeHTML(parsed.href);
        }
    } catch (error) {
        return '#';
    }
    
    return '#';
}

/**
 * Remove todas as tags HTML de um texto
 * @param {string} html - HTML a limpar
 * @returns {string} Texto sem tags
 */
export function stripHTML(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

/**
 * Trunca texto mantendo HTML válido
 * @param {string} html - HTML a truncar
 * @param {number} maxLength - Comprimento máximo
 * @param {string} suffix - Sufixo (padrão: '...')
 * @returns {string} HTML truncado
 */
export function truncateHTML(html, maxLength = 100, suffix = '...') {
    const text = stripHTML(html);
    if (text.length <= maxLength) {
        return html;
    }
    return text.slice(0, maxLength) + suffix;
}

/**
 * Converte quebras de linha em <br>
 * @param {string} text - Texto com \n
 * @returns {string} HTML com <br>
 */
export function nl2br(text) {
    if (!text) return '';
    return escapeHTML(text).replace(/\n/g, '<br>');
}

/**
 * Converte HTML básico de volta para markdown (simplificado)
 * @param {string} html - HTML a converter
 * @returns {string} Markdown básico
 */
export function html2markdown(html) {
    if (!html) return '';
    
    return html
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<b>(.*?)<\/b>/g, '**$1**')
        .replace(/<code>(.*?)<\/code>/g, '`$1`')
        .replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```')
        .replace(/<li>(.*?)<\/li>/g, '• $1\n')
        .replace(/<ul>(.*?)<\/ul>/gs, '$1')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)')
        .replace(/<[^>]*>/g, ''); // Remove tags restantes
}

console.log('✅ Markdown module loaded');

