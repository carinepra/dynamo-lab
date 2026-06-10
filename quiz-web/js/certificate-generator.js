/**
 * Gerador de Certificado SVG - Aurora Academy Quest
 * Gera um certificado em formato SVG que pode ser convertido para PNG
 */

// Configurações de cores por rank
const RANK_COLORS = {
    escudeiro: {
        primary: '#c0a445',
        secondary: '#ddc35f',
        text: '#4a3d1a',
        border: '#886B1D',
        messageBg: 'rgba(192, 164, 69, 0.15)'
    },
    cartografo: {
        primary: '#abbdc8',
        secondary: '#d4e1e8',
        text: '#253746',
        border: '#546c7e',
        messageBg: 'rgba(171, 189, 200, 0.15)'
    },
    cavaleiro: {
        primary: '#67d2df',
        secondary: '#a8e6ec',
        text: '#002740',
        border: '#39a0ae',
        messageBg: 'rgba(103, 210, 223, 0.15)'
    },
    oraculo: {
        primary: '#a259ff',
        secondary: '#c694ff',
        text: '#ffffff',
        border: '#823cd6',
        messageBg: 'rgba(162, 89, 255, 0.15)'
    },
    'grao-mestre': {
        primary: '#002740',
        secondary: '#124666',
        text: '#f9e27d',
        border: '#67d2df',
        messageBg: 'rgba(0, 39, 64, 0.12)'
    }
};

// Logo Aurora em SVG (paths)
const AURORA_LOGO_PATHS = `
    <defs>
        <linearGradient id="aurora-mark-certificate" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#67d2df"/>
            <stop offset="0.55" stop-color="#f9e27d"/>
            <stop offset="1" stop-color="#789d4a"/>
        </linearGradient>
        <linearGradient id="aurora-glow-certificate" x1="10" y1="34" x2="38" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#67d2df" stop-opacity="0.15"/>
            <stop offset="1" stop-color="#67d2df" stop-opacity="0.75"/>
        </linearGradient>
    </defs>
    <rect x="2" y="4" width="40" height="40" rx="14" fill="#002740"/>
    <path d="M10 32C15 20 20 12 25 10C23 18 29 24 38 32" stroke="url(#aurora-mark-certificate)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13 34C20 28 27 26 36 29" stroke="url(#aurora-glow-certificate)" stroke-width="4" stroke-linecap="round"/>
    <circle cx="31" cy="14" r="2.5" fill="#f9e27d"/>
    <text x="52" y="29" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="1.5" fill="#ffffff">AURORA</text>
    <text x="54" y="41" font-family="Arial, sans-serif" font-size="8" font-weight="700" letter-spacing="4" fill="#f9e27d">LABS</text>
`;

/**
 * Quebra texto em múltiplas linhas para caber na largura
 */
function wrapText(text, maxCharsPerLine) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
            currentLine = (currentLine + ' ' + word).trim();
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) lines.push(currentLine);
    
    return lines;
}

function escapeXml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Gera o SVG do certificado
 */
export function generateCertificateSVG(data) {
    const {
        playerName = 'Aventureiro(a)',
        totalXP = 0,
        rankKey = 'escudeiro',
        rankName = 'Escudeiro',
        rankIcon = '🛡️',
        mentorName = 'Mestre',
        mentorTitle = 'Guardião',
        mentorAvatar = '🧙',
        message = '',
        chaptersCompleted = 0,
        questionsCorrect = 0,
        accuracy = 0,
        achievements = [],
        date = '',
        labels = {}
    } = data || {};

    const L = {
        xpLabel: 'PONTOS DE EXPERIÊNCIA',
        chapters: 'CAPÍTULOS',
        correct: 'ACERTOS',
        accuracy: 'PRECISÃO',
        decreeTitle: 'REINO DA AURORA LABS',
        decreeSubtitle: 'Carta de Nomeação Oficial',
        achievementsTitle: '🏆 HABILIDADES DOMINADAS',
        council: 'Conselho dos Arquitetos',
        defaultAdventurer: 'Aventureiro(a)',
        ...labels
    };
    
    // Garantir que valores interpolados não quebrem o SVG.
    const displayName = playerName && playerName.trim() ? playerName.trim() : L.defaultAdventurer;
    const safeDisplayName = escapeXml(displayName);
    const safeRankIcon = escapeXml(rankIcon);
    const safeRankName = escapeXml(rankName);
    const safeMentorAvatar = escapeXml(mentorAvatar);
    const safeMentorName = escapeXml(mentorName);
    const safeMentorTitle = escapeXml(mentorTitle);
    const safeDate = escapeXml(date);
    
    const colors = RANK_COLORS[rankKey] || RANK_COLORS.escudeiro;
    
    // Dimensões do certificado
    const width = 1200;
    const height = 700;
    
    // Quebrar mensagem em linhas
    const messageLines = wrapText(String(message).replace(/"/g, ''), 55).map(escapeXml);
    
    // Gerar badges de achievements (layout em grid que cabe no container)
    const badgeWidth = 105;
    const badgeHeight = 26;
    const badgeGap = 8;
    const containerX = 890;
    const containerStartY = 190;
    const cols = 2;
    
    const achievementBadges = achievements.map((a, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = containerX + col * (badgeWidth + badgeGap);
        const y = containerStartY + row * (badgeHeight + badgeGap);
        return `
            <rect x="${x}" y="${y}" width="${badgeWidth}" height="${badgeHeight}" rx="13" fill="#ffffff" />
            <text x="${x + badgeWidth/2}" y="${y + 17}" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="11" fill="#002740" text-anchor="middle">${escapeXml(a.icon)} ${escapeXml(a.name)}</text>
        `;
    }).join('');
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <!-- Background gradient -->
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#0a1f3d"/>
            <stop offset="30%" style="stop-color:#002740"/>
            <stop offset="60%" style="stop-color:#003d5c"/>
            <stop offset="100%" style="stop-color:#124666"/>
        </linearGradient>
        
        <!-- Card gradient -->
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#faf3e0"/>
            <stop offset="10%" style="stop-color:#f5ead3"/>
            <stop offset="50%" style="stop-color:#fff8e7"/>
            <stop offset="90%" style="stop-color:#f5ead3"/>
            <stop offset="100%" style="stop-color:#e8dcc0"/>
        </linearGradient>
        
        <!-- Rank badge gradient -->
        <linearGradient id="rankGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary}"/>
            <stop offset="100%" style="stop-color:${colors.secondary}"/>
        </linearGradient>
        
        <!-- XP gradient -->
        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a259ff"/>
            <stop offset="100%" style="stop-color:#67d2df"/>
        </linearGradient>
        
        <!-- Card border glow -->
        <linearGradient id="borderGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f9e27d;stop-opacity:0.6"/>
            <stop offset="50%" style="stop-color:#67d2df;stop-opacity:0.6"/>
            <stop offset="100%" style="stop-color:#a259ff;stop-opacity:0.6"/>
        </linearGradient>
        
        <!-- Drop shadow -->
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
    
    <!-- Stars (decorative) -->
    <circle cx="100" cy="80" r="1.5" fill="white" opacity="0.6"/>
    <circle cx="250" cy="120" r="1" fill="white" opacity="0.4"/>
    <circle cx="400" cy="60" r="1.5" fill="white" opacity="0.5"/>
    <circle cx="600" cy="90" r="1" fill="white" opacity="0.6"/>
    <circle cx="800" cy="50" r="1.5" fill="white" opacity="0.4"/>
    <circle cx="950" cy="100" r="1" fill="white" opacity="0.5"/>
    <circle cx="1100" cy="70" r="1.5" fill="white" opacity="0.6"/>
    <circle cx="150" cy="620" r="1" fill="white" opacity="0.4"/>
    <circle cx="350" cy="650" r="1.5" fill="white" opacity="0.5"/>
    <circle cx="850" cy="640" r="1" fill="white" opacity="0.6"/>
    <circle cx="1050" cy="620" r="1.5" fill="white" opacity="0.4"/>
    
    <!-- Logo Aurora Academy -->
    <g transform="translate(${width/2 - 90}, 24) scale(1)">
        ${AURORA_LOGO_PATHS}
    </g>
    <text x="${width/2}" y="88" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.9)" text-anchor="middle" letter-spacing="5" font-weight="600">ACADEMY</text>
    
    <!-- Card border glow -->
    <rect x="57" y="107" width="1086" height="486" rx="18" fill="url(#borderGlow)" filter="url(#cardShadow)" opacity="0.8"/>
    
    <!-- Main Card -->
    <rect x="60" y="110" width="1080" height="480" rx="16" fill="url(#cardGradient)"/>
    
    <!-- Decorative corners -->
    <text x="80" y="140" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="20" opacity="0.15">⚜️</text>
    <text x="1100" y="140" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="20" opacity="0.15" text-anchor="end">⚜️</text>
    <text x="80" y="570" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="20" opacity="0.15">⚜️</text>
    <text x="1100" y="570" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="20" opacity="0.15" text-anchor="end">⚜️</text>
    
    <!-- ============ LEFT COLUMN ============ -->
    
    <!-- Rank Emblem -->
    <text x="200" y="180" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="50" text-anchor="middle">${safeRankIcon}</text>
    
    <!-- Rank Badge -->
    <rect x="110" y="200" width="180" height="45" rx="22" fill="url(#rankGradient)" stroke="${colors.border}" stroke-width="2"/>
    <text x="200" y="230" font-family="Arial, sans-serif" font-size="18" fill="${colors.text}" text-anchor="middle" font-weight="700">${safeRankIcon} ${safeRankName}</text>
    
    <!-- Player Name -->
    <text x="200" y="285" font-family="Arial, sans-serif" font-size="24" fill="#002740" text-anchor="middle" font-weight="700">${safeDisplayName}</text>
    
    <!-- XP Display -->
    <text x="200" y="340" font-family="Arial, sans-serif" font-size="38" fill="url(#xpGradient)" text-anchor="middle" font-weight="800">${totalXP.toLocaleString()} XP</text>
    <text x="200" y="360" font-family="Arial, sans-serif" font-size="11" fill="#886B1D" text-anchor="middle" letter-spacing="1">${escapeXml(L.xpLabel)}</text>
    
    <!-- Stats Grid -->
    <g transform="translate(95, 380)">
        <!-- Capítulos -->
        <rect x="0" y="0" width="70" height="60" rx="8" fill="rgba(255,255,255,0.6)"/>
        <text x="35" y="30" font-family="Arial, sans-serif" font-size="22" fill="#002740" text-anchor="middle" font-weight="700">${chaptersCompleted}</text>
        <text x="35" y="48" font-family="Arial, sans-serif" font-size="9" fill="#546c7e" text-anchor="middle">${escapeXml(L.chapters)}</text>
        
        <!-- Acertos -->
        <rect x="80" y="0" width="70" height="60" rx="8" fill="rgba(255,255,255,0.6)"/>
        <text x="115" y="30" font-family="Arial, sans-serif" font-size="22" fill="#002740" text-anchor="middle" font-weight="700">${questionsCorrect}</text>
        <text x="115" y="48" font-family="Arial, sans-serif" font-size="9" fill="#546c7e" text-anchor="middle">${escapeXml(L.correct)}</text>
        
        <!-- Precisão -->
        <rect x="160" y="0" width="70" height="60" rx="8" fill="rgba(255,255,255,0.6)"/>
        <text x="195" y="30" font-family="Arial, sans-serif" font-size="22" fill="#002740" text-anchor="middle" font-weight="700">${accuracy}%</text>
        <text x="195" y="48" font-family="Arial, sans-serif" font-size="9" fill="#546c7e" text-anchor="middle">${escapeXml(L.accuracy)}</text>
    </g>
    
    <!-- ============ CENTER COLUMN ============ -->
    
    <!-- Vertical dividers -->
    <line x1="340" y1="130" x2="340" y2="570" stroke="rgba(192, 164, 69, 0.25)" stroke-width="2"/>
    <line x1="860" y1="130" x2="860" y2="570" stroke="rgba(192, 164, 69, 0.25)" stroke-width="2"/>
    
    <!-- Header -->
    <text x="600" y="160" font-family="Arial, sans-serif" font-size="16" fill="#886B1D" text-anchor="middle" font-weight="700" letter-spacing="4">${escapeXml(L.decreeTitle)}</text>
    <text x="600" y="180" font-family="Arial, sans-serif" font-size="12" fill="#a08840" text-anchor="middle" font-style="italic">${escapeXml(L.decreeSubtitle)}</text>
    
    <!-- Divider -->
    <line x1="400" y1="195" x2="800" y2="195" stroke="rgba(192, 164, 69, 0.3)" stroke-width="1"/>
    
    <!-- Wizard Message Box com borda arredondada -->
    <rect x="370" y="215" width="460" height="${140 + (messageLines.length - 3) * 22}" rx="12" fill="${colors.messageBg}" stroke="${colors.border}" stroke-width="0"/>
    <!-- Borda esquerda decorativa (arredondada) -->
    <path d="M374 215 L374 ${355 + (messageLines.length - 3) * 22} Q370 ${355 + (messageLines.length - 3) * 22} 370 ${351 + (messageLines.length - 3) * 22} L370 219 Q370 215 374 215" fill="${colors.border}"/>
    
    <!-- Mentor Avatar + Info -->
    <text x="395" y="255" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="32">${safeMentorAvatar}</text>
    <text x="435" y="248" font-family="Arial, sans-serif" font-size="18" fill="#002740" font-weight="700">${safeMentorName}</text>
    <text x="435" y="268" font-family="Arial, sans-serif" font-size="13" fill="#546c7e">${safeMentorTitle}</text>
    
    <!-- Message Text -->
    ${messageLines.map((line, i) => `
        <text x="400" y="${300 + i * 24}" font-family="Arial, sans-serif" font-size="15" fill="#253746" font-style="italic">"${i === 0 ? '' : ''}${line}${i === messageLines.length - 1 ? '"' : ''}</text>
    `).join('')}
    
    <!-- ============ RIGHT COLUMN ============ -->
    
    <!-- Achievements Section -->
    <rect x="880" y="140" width="240" height="220" rx="12" fill="rgba(192, 164, 69, 0.1)" stroke="rgba(192, 164, 69, 0.25)" stroke-width="2"/>
    <text x="1000" y="170" font-family="Arial, sans-serif" font-size="11" fill="#886B1D" text-anchor="middle" font-weight="600" letter-spacing="1">${escapeXml(L.achievementsTitle)}</text>
    
    <!-- Achievement badges -->
    ${achievementBadges}
    
    <!-- Signature Section -->
    <line x1="880" y1="360" x2="1120" y2="360" stroke="rgba(192, 164, 69, 0.3)" stroke-width="1"/>
    
    <!-- Seal -->
    <text x="1000" y="410" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="45" text-anchor="middle">🔱</text>
    
    <!-- Signature text -->
    <text x="1000" y="450" font-family="Arial, sans-serif" font-size="13" fill="#886B1D" text-anchor="middle" font-style="italic">${escapeXml(L.council)}</text>
    <text x="1000" y="470" font-family="Arial, sans-serif" font-size="11" fill="#a08840" text-anchor="middle">${safeDate}</text>
    
    <!-- Footer watermark -->
    <text x="${width/2}" y="${height - 20}" font-family="Arial, sans-serif" font-size="10" fill="rgba(255,255,255,0.4)" text-anchor="middle">Aurora Academy Quest - DynamoDB Training</text>
</svg>`;
    
    return svg;
}

/**
 * Converte SVG para PNG e faz download
 */
export async function downloadCertificateAsPNG(data, filename = 'Certificado_Aurora_Academy.png') {
    return new Promise((resolve, reject) => {
        try {
            const svgString = generateCertificateSVG(data);
            
            // Criar blob do SVG
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            // Criar imagem
            const img = new Image();
            img.onload = () => {
                // Criar canvas
                const canvas = document.createElement('canvas');
                const scale = 2; // Alta resolução
                canvas.width = 1200 * scale;
                canvas.height = 700 * scale;
                
                const ctx = canvas.getContext('2d');
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0);
                
                // Limpar URL
                URL.revokeObjectURL(url);
                
                // Download
                canvas.toBlob((blob) => {
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    URL.revokeObjectURL(link.href);
                    resolve();
                }, 'image/png', 1.0);
            };
            
            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(new Error('Erro ao carregar SVG'));
            };
            
            img.src = url;
            
        } catch (error) {
            reject(error);
        }
    });
}

