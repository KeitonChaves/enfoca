// Fotos de Unsplash con IDs fijos — URLs estables sin API key
const SUBJECT_IMAGES = [
    { pattern: /python/,                         id: '1526374965328-7f61d4dc18c5' }, // code screen
    { pattern: /javascript|js\b/,                id: '1627398242454-45a1465c2479' }, // JS code
    { pattern: /java\b/,                         id: '1555099962-4182fb5a4bfa' }, // programming
    { pattern: /react|vue|angular|frontend/,     id: '1547658719-da2b51169166' }, // web dev
    { pattern: /datos|database|sql|postgres/,    id: '1558494949-ef010cbdcc31' }, // server/db
    { pattern: /machine learning|ia |inteligencia artificial|deep learning/, id: '1677442135703-1787eea5ce01' }, // AI
    { pattern: /programac|algoritmo|coding|software/, id: '1516116216624-53ad39952b49' }, // code
    { pattern: /redes|network|cloud|nube/,       id: '1558618666-fcd25c85cd64' }, // network
    { pattern: /cibersegur|security|hacking/,    id: '1550751827-4bd374c3f58b' }, // security
    { pattern: /matemat|algebra|calcul|geometr|estadis/, id: '1635070041078-e363dbe005cb' }, // math
    { pattern: /fisica/,                          id: '1451187580459-43490279c0fa' }, // physics/space
    { pattern: /quimic/,                          id: '1532187863486-abf9dbad1b69' }, // chemistry
    { pattern: /biolog|anatom/,                   id: '1530026405186-ed1f139313f3' }, // biology
    { pattern: /historia|arqueolog/,              id: '1461360370896-22624d12aa1'  }, // history
    { pattern: /geografía|geografi/,              id: '1526778548025-fa2f459cd5c1' }, // geography
    { pattern: /econom|finanz|contabil/,          id: '1611974789855-9c2a0a7236a3' }, // finance
    { pattern: /marketing|emprendim/,             id: '1557804506-669a67965ba0'  }, // marketing
    { pattern: /diseño|design|creatividad/,       id: '1561070791-2526d30994b5'  }, // design
    { pattern: /arte|pintura|escultura/,          id: '1513364776144-60967b0f800f' }, // art
    { pattern: /musica|teoria musical/,           id: '1507838153414-b4b713384a76' }, // music
    { pattern: /medicina|salud|enfermería/,       id: '1559757148-5c350d0d3c56'  }, // medicine
    { pattern: /derecho|leyes|juridic/,           id: '1589829545856-d10d557cf95f' }, // law
    { pattern: /psicolog|conducta/,               id: '1507003211169-0a1dd7228f2d' }, // psychology
    { pattern: /filosofia|etica/,                 id: '1481627834876-b7833e8f5570' }, // philosophy/books
    { pattern: /sociolog|antropolog/,             id: '1529156069898-49953e39b3ac' }, // society
    { pattern: /ingles|english|idioma|idiomas/,   id: '1546410531-bb4caa6b424d'  }, // language
    { pattern: /escritura|redacción|comunicac/,   id: '1455390582262-044cdead277a' }, // writing
    { pattern: /fotografia|foto/,                 id: '1452587925148-ce544e77e70d' }, // photography
    { pattern: /arquitectura/,                    id: '1487958449943-2429e8be8625' }, // architecture
    { pattern: /educacion|pedagogia/,             id: '1509062522246-3755977927d4' }, // education
];

// Fotos genéricas de estudio/educación como fallback rotativo
const FALLBACK_IDS = [
    '1456513080510-7bf3a84b82f8', // library books
    '1497633762265-9d179a990aa6', // studying
    '1503676260728-1c00da094a0b', // books
    '1434030216411-0b793f4b6f81', // desk study
    '1522202176988-66273c2fd55f', // team learning
    '1513475382585-d06e58bcb0e0', // open book
];

const BASE = 'https://images.unsplash.com/photo-';
const PARAMS = '?w=800&q=75&fit=crop&auto=format';

export function getPlanImage(titulo = '') {
    const lower = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');

    for (const { pattern, id } of SUBJECT_IMAGES) {
        if (pattern.test(lower)) {
            return `${BASE}${id}${PARAMS}`;
        }
    }

    // Fallback determinístico basado en el título
    const idx = Math.abs(
        [...titulo].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0x7fffffff, 0)
    ) % FALLBACK_IDS.length;

    return `${BASE}${FALLBACK_IDS[idx]}${PARAMS}`;
}

export function getPlanBgFallback(index) {
    const PALETTE = [
        'from-violet-900/60', 'from-blue-900/60', 'from-emerald-900/60',
        'from-amber-900/60',  'from-rose-900/60',  'from-cyan-900/60',
    ];
    return PALETTE[index % PALETTE.length];
}
