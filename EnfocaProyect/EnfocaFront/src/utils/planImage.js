const KEYWORD_MAP = [
    ['python',        'python programming language'],
    ['javascript',    'javascript web development code'],
    ['java',          'java programming software'],
    ['react',         'react javascript framework'],
    ['sql|postgres|database|datos', 'database sql technology'],
    ['machine learning|ia |inteligencia artificial', 'artificial intelligence machine learning'],
    ['matemat|calcul|algebra|geometr', 'mathematics blackboard equations'],
    ['fisica',        'physics science laboratory'],
    ['quimic',        'chemistry laboratory science'],
    ['biolog',        'biology science nature'],
    ['historia',      'history ancient architecture'],
    ['geograf',       'geography world map'],
    ['econom|finanz',  'economics finance business'],
    ['contabil',      'accounting finance business'],
    ['diseño|design', 'graphic design creative'],
    ['marketing',     'marketing business strategy'],
    ['ingles|english','english language book'],
    ['filosofi',      'philosophy library books'],
    ['psicolog',      'psychology mind brain'],
    ['sociolog',      'sociology society people'],
    ['derecho|leyes', 'law justice books'],
    ['medicina|medic','medicine health doctor'],
    ['arte|pintur',   'art painting creative museum'],
    ['musica',        'music instruments notes'],
    ['programac|coding','programming code computer'],
    ['redes|network', 'computer network technology'],
    ['cibersegur|security','cybersecurity technology'],
    ['cloud|nube',    'cloud computing technology'],
];

const BG_FALLBACK = [
    'from-violet-900/60', 'from-blue-900/60', 'from-emerald-900/60',
    'from-amber-900/60',  'from-rose-900/60',  'from-cyan-900/60',
];

export function getPlanImage(titulo = '') {
    const lower = titulo.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '');

    for (const [pattern, keywords] of KEYWORD_MAP) {
        if (new RegExp(pattern).test(lower)) {
            return `https://source.unsplash.com/featured/800x400?${encodeURIComponent(keywords)}`;
        }
    }
    // fallback genérico con el propio título
    const kw = lower.split(/\s+/).slice(0, 2).join(' ');
    return `https://source.unsplash.com/featured/800x400?${encodeURIComponent(kw + ' education study')}`;
}

export function getPlanBgFallback(index) {
    return BG_FALLBACK[index % BG_FALLBACK.length];
}
