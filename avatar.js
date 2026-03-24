// Quirkatar - The quirkiest avatar generator
// https://github.com/Nitty-Gritty-Design/quirkatar

// Simple PRNG
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Color palettes
const PALETTES = {
  default: [
    '#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059',
    '#FF9F1C', '#FFBF69', '#CBF3F0', '#2EC4B6', '#264653',
    '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#FFCDB2',
    '#FFB4A2', '#E5989B', '#B5838D', '#6D6875', '#8ECAE6',
    '#219EBC', '#023047', '#FFB703', '#FB8500', '#CDB4DB',
    '#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF', '#F94144',
    '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#43AA8B', '#577590'
  ],
  pastel: [
    '#FFB5E8', '#FF9CEE', '#FFCCF9', '#FCC2FF', '#F6A6FF',
    '#B28DFF', '#C5A3FF', '#D5AAFF', '#ECD4FF', '#AFCBFF',
    '#AFF8DB', '#BFFCC6', '#E7FFAC', '#FFFFD1', '#FFC9DE',
    '#FFABAB', '#FFDAC1', '#B5EAD7', '#C7CEEA', '#E2F0CB'
  ],
  neon: [
    '#FF00FF', '#00FFFF', '#FF00AA', '#AAFF00', '#00FF00',
    '#FF6600', '#0066FF', '#FFFF00', '#FF0066', '#6600FF',
    '#00FF66', '#FF3300', '#0033FF', '#FF0099', '#99FF00'
  ],
  monochrome: [
    '#1a1a1a', '#2d2d2d', '#404040', '#535353', '#666666',
    '#7a7a7a', '#8d8d8d', '#a0a0a0', '#b3b3b3', '#c6c6c6',
    '#d9d9d9', '#ececec', '#ffffff'
  ]
};

// Mood configurations
const MOODS = {
  happy: {
    eyes: ['happy', 'normal', 'wink', 'star', 'heart'],
    mouth: ['smile', 'openSmile', 'tongue', 'cat'],
    eyebrows: 'raised'
  },
  sad: {
    eyes: ['sleepy', 'normal', 'wink'],
    mouth: ['frown', 'o', 'zigzag'],
    eyebrows: 'droopy'
  },
  angry: {
    eyes: ['normal', 'cyclops', 'wink'],
    mouth: ['frown', 'teeth', 'zigzag'],
    eyebrows: 'angry'
  },
  surprised: {
    eyes: ['normal', 'cyclops', 'three', 'star'],
    mouth: ['o', 'openSmile'],
    eyebrows: 'raised'
  },
  chill: {
    eyes: ['sleepy', 'normal', 'wink', 'glasses'],
    mouth: ['smile', 'cat', 'o'],
    eyebrows: 'neutral'
  },
  random: null
};

/**
 * Generate a quirky avatar SVG
 * @param {string} seed - The seed string for deterministic generation
 * @param {Object|number} options - Options object or size (legacy)
 * @param {number} options.size - Avatar size in pixels (default: 100)
 * @param {boolean} options.square - Square avatar instead of circle (default: false)
 * @param {boolean} options.animated - Enable animations (default: true)
 * @param {string} options.mood - 'random'|'happy'|'sad'|'angry'|'surprised'|'chill' (default: 'random')
 * @param {string} options.palette - 'default'|'pastel'|'neon'|'monochrome' (default: 'default')
 * @param {boolean} options.eyebrows - Show eyebrows (default: true)
 * @returns {string} SVG string
 */
function generateAvatarSvg(seed, options = {}) {
  // Legacy support: generateAvatarSvg(seed, size, square, animated)
  if (typeof options === 'number' || typeof options === 'boolean') {
    options = {
      size: typeof options === 'number' ? options : 100,
      square: typeof options === 'boolean' ? options : false,
      animated: arguments[3] !== undefined ? arguments[3] : true
    };
  }

  const {
    size = 100,
    square = false,
    animated = true,
    mood = 'random',
    palette = 'default',
    eyebrows: showEyebrows = true
  } = options;

  const seedNum = xmur3(seed)();
  const rand = mulberry32(seedNum);

  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  // Get colors from palette
  const COLORS = PALETTES[palette] || PALETTES.default;
  const bgColor = pick(COLORS);
  let headColor = pick(COLORS);
  while (headColor === bgColor) headColor = pick(COLORS);
  let detailColor = pick(COLORS);
  while (detailColor === bgColor || detailColor === headColor) detailColor = pick(COLORS);

  // Get mood config
  const moodConfig = MOODS[mood] || MOODS.random;

  // Select features based on mood
  const headShape = pick(['circle', 'squircle', 'blob', 'triangle', 'hexagon', 'diamond', 'star', 'cloud']);
  const ears = pick(['none', 'cat', 'bear', 'bunny', 'alien', 'elf', 'robot']);
  
  // Eyes based on mood
  const allEyes = ['normal', 'happy', 'sleepy', 'cyclops', 'glasses', 'three', 'wink', 'star', 'heart'];
  const eyes = moodConfig ? pick(moodConfig.eyes) : pick(allEyes);
  
  // Mouth based on mood
  const allMouths = ['smile', 'openSmile', 'frown', 'cat', 'vampire', 'o', 'zigzag', 'tongue', 'teeth'];
  const mouth = moodConfig ? pick(moodConfig.mouth) : pick(allMouths);
  
  // Eyebrows based on mood
  const eyebrowType = moodConfig ? moodConfig.eyebrows : pick(['neutral', 'raised', 'droopy', 'angry']);
  
  const accessory = pick(['none', 'none', 'none', 'freckles', 'blush', 'mustache', 'beard']);
  const headwear = pick(['none', 'none', 'none', 'hat', 'crown', 'horns', 'headphones', 'bow']);
  const cheeks = pick(['none', 'rosy', 'dimples']);

  let svg = `<svg width="${size}" height="${size}" viewBox="0 -10 100 110" xmlns="http://www.w3.org/2000/svg">`;

  if (animated) {
    svg += `
      <style>
        @keyframes quirksBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05) translateY(-3px); }
        }
        @keyframes quirksBlink {
          0%, 94%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.01); }
        }
        @keyframes quirksTwitch {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(8deg); }
          96% { transform: rotate(-8deg); }
        }
        @keyframes quirksSmile {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px) scale(1.1); }
        }
        @keyframes quirksFrown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes quirksTalk {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.3); }
        }
        .quirks-breathe { animation: quirksBreathe 4s infinite ease-in-out; transform-origin: 50px 50px; }
        .quirks-blink { animation: quirksBlink 4s infinite; transform-origin: 50px 45px; }
        .quirks-twitch { animation: quirksTwitch 5s infinite ease-in-out; transform-origin: 50px 50px; }
        .quirks-smile { animation: quirksSmile 3s infinite ease-in-out; transform-origin: 50px 70px; }
        .quirks-frown { animation: quirksFrown 4s infinite ease-in-out; transform-origin: 50px 70px; }
        .quirks-talk { animation: quirksTalk 0.5s infinite alternate; transform-origin: 50px 70px; }
      </style>
    `;
  }

  // Background
  svg += `<rect width="100" height="100" fill="${bgColor}" rx="${square ? 0 : 50}" />`;

  // Ears
  svg += `<g class="quirks-twitch">`;
  if (ears === 'cat') {
    svg += `<polygon points="15,45 10,10 45,15" fill="${headColor}" />
            <polygon points="85,45 90,10 55,15" fill="${headColor}" />`;
  } else if (ears === 'bear') {
    svg += `<circle cx="20" cy="25" r="18" fill="${headColor}" />
            <circle cx="80" cy="25" r="18" fill="${headColor}" />`;
  } else if (ears === 'bunny') {
    svg += `<ellipse cx="30" cy="15" rx="10" ry="30" fill="${headColor}" />
            <ellipse cx="70" cy="15" rx="10" ry="30" fill="${headColor}" />`;
  } else if (ears === 'alien') {
    svg += `<line x1="30" y1="30" x2="15" y2="10" stroke="${headColor}" stroke-width="4" stroke-linecap="round" />
            <circle cx="15" cy="10" r="6" fill="${detailColor}" />
            <line x1="70" y1="30" x2="85" y2="10" stroke="${headColor}" stroke-width="4" stroke-linecap="round" />
            <circle cx="85" cy="10" r="6" fill="${detailColor}" />`;
  } else if (ears === 'elf') {
    svg += `<polygon points="15,50 5,15 35,35" fill="${headColor}" />
            <polygon points="85,50 95,15 65,35" fill="${headColor}" />`;
  } else if (ears === 'robot') {
    svg += `<rect x="10" y="35" width="10" height="25" rx="2" fill="${detailColor}" />
            <rect x="80" y="35" width="10" height="25" rx="2" fill="${detailColor}" />
            <circle cx="15" cy="40" r="2" fill="${headColor}" />
            <circle cx="85" cy="40" r="2" fill="${headColor}" />
            <circle cx="15" cy="50" r="2" fill="${headColor}" />
            <circle cx="85" cy="50" r="2" fill="${headColor}" />`;
  }
  svg += `</g>`;

  svg += `<g class="quirks-breathe">`;
  // Head
  if (headShape === 'circle') {
    svg += `<circle cx="50" cy="50" r="35" fill="${headColor}" />`;
  } else if (headShape === 'squircle') {
    svg += `<rect x="15" y="15" width="70" height="70" rx="25" fill="${headColor}" />`;
  } else if (headShape === 'blob') {
    svg += `<path d="M 50 15 C 75 15 85 35 85 50 C 85 75 70 85 50 85 C 25 85 15 70 15 50 C 15 25 25 15 50 15 Z" fill="${headColor}" />`;
  } else if (headShape === 'triangle') {
    svg += `<polygon points="50,20 85,80 15,80" fill="${headColor}" />`;
  } else if (headShape === 'hexagon') {
    svg += `<polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="${headColor}" />`;
  } else if (headShape === 'diamond') {
    svg += `<polygon points="50,10 85,50 50,90 15,50" fill="${headColor}" />`;
  } else if (headShape === 'star') {
    svg += `<polygon points="50,10 58,35 85,35 63,52 72,80 50,62 28,80 37,52 15,35 42,35" fill="${headColor}" />`;
  } else if (headShape === 'cloud') {
    svg += `<path d="M 25 60 C 10 60 10 45 25 45 C 25 30 45 25 55 35 C 65 20 90 30 85 50 C 95 55 90 70 75 70 L 25 70 C 15 70 15 60 25 60 Z" fill="${headColor}" />`;
  }

  // Eyebrows (above eyes)
  if (showEyebrows) {
    svg += `<g fill="none" stroke="#111" stroke-width="3" stroke-linecap="round">`;
    if (eyebrowType === 'raised') {
      svg += `<path d="M 25 35 Q 35 30 45 35" />
              <path d="M 55 35 Q 65 30 75 35" />`;
    } else if (eyebrowType === 'droopy') {
      svg += `<path d="M 25 35 Q 35 40 45 35" />
              <path d="M 55 35 Q 65 40 75 35" />`;
    } else if (eyebrowType === 'angry') {
      svg += `<path d="M 25 40 L 45 35" />
              <path d="M 55 35 L 75 40" />`;
    } else {
      svg += `<path d="M 25 35 L 45 35" />
              <path d="M 55 35 L 75 35" />`;
    }
    svg += `</g>`;
  }

  // Eyes
  svg += `<g class="quirks-blink">`;
  if (eyes === 'normal') {
    svg += `<circle cx="35" cy="48" r="6" fill="#111" />
            <circle cx="65" cy="48" r="6" fill="#111" />`;
  } else if (eyes === 'happy') {
    svg += `<path d="M 25 48 Q 35 38 45 48" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" />
            <path d="M 55 48 Q 65 38 75 48" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" />`;
  } else if (eyes === 'sleepy') {
    svg += `<path d="M 25 48 Q 35 58 45 48" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" />
            <path d="M 55 48 Q 65 58 75 48" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" />`;
  } else if (eyes === 'cyclops') {
    svg += `<circle cx="50" cy="45" r="14" fill="#fff" />
            <circle cx="50" cy="45" r="6" fill="#111" />`;
  } else if (eyes === 'glasses') {
    svg += `<rect x="20" y="38" width="26" height="18" rx="4" fill="none" stroke="#111" stroke-width="4" />
            <rect x="54" y="38" width="26" height="18" rx="4" fill="none" stroke="#111" stroke-width="4" />
            <line x1="46" y1="47" x2="54" y2="47" stroke="#111" stroke-width="4" />
            <circle cx="33" cy="47" r="4" fill="#111" />
            <circle cx="67" cy="47" r="4" fill="#111" />`;
  } else if (eyes === 'three') {
    svg += `<circle cx="50" cy="38" r="5" fill="#111" />
            <circle cx="30" cy="53" r="5" fill="#111" />
            <circle cx="70" cy="53" r="5" fill="#111" />`;
  } else if (eyes === 'wink') {
    svg += `<circle cx="35" cy="48" r="6" fill="#111" />
            <path d="M 55 48 Q 65 38 75 48" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" />`;
  } else if (eyes === 'star') {
    svg += `<polygon points="35,42 37,46 41,46 38,49 39,53 35,51 31,53 32,49 29,46 33,46" fill="#111" />
            <polygon points="65,42 67,46 71,46 68,49 69,53 65,51 61,53 62,49 59,46 63,46" fill="#111" />`;
  } else if (eyes === 'heart') {
    svg += `<path d="M 35 51 C 35 47 30 47 30 51 C 30 55 35 58 35 58 C 35 58 40 55 40 51 C 40 47 35 47 35 51 Z" fill="#e91e63" />
            <path d="M 65 51 C 65 47 60 47 60 51 C 60 55 65 58 65 58 C 65 58 70 55 70 51 C 70 47 65 47 65 51 Z" fill="#e91e63" />`;
  }
  svg += `</g>`;

  // Mouth
  if (mouth === 'smile') {
    svg += `<g class="quirks-smile"><path d="M 35 68 Q 50 83 65 68" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" /></g>`;
  } else if (mouth === 'openSmile') {
    svg += `<g class="quirks-talk"><path d="M 30 63 Q 50 88 70 63 Z" fill="#111" />
            <path d="M 40 73 Q 50 78 60 73 Q 50 68 40 73" fill="#ff6b6b" /></g>`;
  } else if (mouth === 'frown') {
    svg += `<g class="quirks-frown"><path d="M 35 78 Q 50 63 65 78" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" /></g>`;
  } else if (mouth === 'cat') {
    svg += `<g class="quirks-twitch"><path d="M 35 68 Q 42.5 78 50 68 Q 57.5 78 65 68" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" /></g>`;
  } else if (mouth === 'vampire') {
    svg += `<g class="quirks-smile"><path d="M 35 68 Q 50 83 65 68" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" />
            <polygon points="40,71 45,72 42.5,78" fill="#fff" />
            <polygon points="60,71 55,72 57.5,78" fill="#fff" /></g>`;
  } else if (mouth === 'o') {
    svg += `<g class="quirks-talk"><circle cx="50" cy="73" r="8" fill="#111" /></g>`;
  } else if (mouth === 'zigzag') {
    svg += `<g class="quirks-frown"><polyline points="35,68 42.5,73 50,68 57.5,73 65,68" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" /></g>`;
  } else if (mouth === 'tongue') {
    svg += `<g class="quirks-smile"><path d="M 35 68 Q 50 83 65 68" stroke="#111" stroke-width="4" stroke-linecap="round" fill="none" />
            <ellipse cx="50" cy="74" rx="6" ry="5" fill="#e91e63" /></g>`;
  } else if (mouth === 'teeth') {
    svg += `<g class="quirks-talk"><rect x="32" y="65" width="36" height="18" rx="4" fill="#111" />
            <rect x="35" y="65" width="30" height="8" fill="#fff" />
            <line x1="40" y1="65" x2="40" y2="73" stroke="#111" stroke-width="1" />
            <line x1="50" y1="65" x2="50" y2="73" stroke="#111" stroke-width="1" />
            <line x1="60" y1="65" x2="60" y2="73" stroke="#111" stroke-width="1" /></g>`;
  }

  // Accessory (face details)
  if (accessory === 'freckles') {
    svg += `<circle cx="25" cy="58" r="2" fill="#111" opacity="0.3" />
            <circle cx="30" cy="61" r="2" fill="#111" opacity="0.3" />
            <circle cx="20" cy="61" r="2" fill="#111" opacity="0.3" />
            <circle cx="75" cy="58" r="2" fill="#111" opacity="0.3" />
            <circle cx="70" cy="61" r="2" fill="#111" opacity="0.3" />
            <circle cx="80" cy="61" r="2" fill="#111" opacity="0.3" />`;
  } else if (accessory === 'blush') {
    svg += `<ellipse cx="25" cy="58" rx="8" ry="5" fill="#ff6b6b" opacity="0.5" />
            <ellipse cx="75" cy="58" rx="8" ry="5" fill="#ff6b6b" opacity="0.5" />`;
  } else if (accessory === 'mustache') {
    svg += `<path d="M 30 63 Q 50 53 70 63 Q 60 68 50 65 Q 40 68 30 63 Z" fill="#111" />`;
  } else if (accessory === 'beard') {
    svg += `<path d="M 30 68 Q 35 88 50 91 Q 65 88 70 68 Q 60 73 50 75 Q 40 73 30 68 Z" fill="${headColor}" opacity="0.8" />
            <path d="M 35 71 Q 40 81 50 83 Q 60 81 65 71" stroke="#111" stroke-width="2" fill="none" opacity="0.3" />`;
  }
  
  // Cheeks
  if (cheeks === 'rosy') {
    svg += `<circle cx="25" cy="61" r="6" fill="#ffb6c1" opacity="0.4" />
            <circle cx="75" cy="61" r="6" fill="#ffb6c1" opacity="0.4" />`;
  } else if (cheeks === 'dimples') {
    svg += `<path d="M 22 61 Q 25 65 28 61" stroke="#111" stroke-width="2" fill="none" opacity="0.3" />
            <path d="M 72 61 Q 75 65 78 61" stroke="#111" stroke-width="2" fill="none" opacity="0.3" />`;
  }
  
  svg += `</g>`;
  
  // Headwear (on top of everything)
  svg += `<g>`;
  if (headwear === 'hat') {
    svg += `<rect x="25" y="5" width="50" height="15" rx="3" fill="${detailColor}" />
            <rect x="20" y="18" width="60" height="6" rx="2" fill="${detailColor}" />`;
  } else if (headwear === 'crown') {
    svg += `<polygon points="25,22 30,5 40,15 50,2 60,15 70,5 75,22" fill="#ffd700" />
            <circle cx="30" cy="18" r="3" fill="#e74c3c" />
            <circle cx="50" cy="12" r="3" fill="#3498db" />
            <circle cx="70" cy="18" r="3" fill="#2ecc71" />`;
  } else if (headwear === 'horns') {
    svg += `<path d="M 25 30 Q 15 15 20 5" stroke="${detailColor}" stroke-width="6" fill="none" stroke-linecap="round" />
            <path d="M 75 30 Q 85 15 80 5" stroke="${detailColor}" stroke-width="6" fill="none" stroke-linecap="round" />`;
  } else if (headwear === 'headphones') {
    svg += `<path d="M 15 50 Q 15 20 50 15 Q 85 20 85 50" stroke="${detailColor}" stroke-width="6" fill="none" />
            <rect x="8" y="45" width="12" height="20" rx="4" fill="${detailColor}" />
            <rect x="80" y="45" width="12" height="20" rx="4" fill="${detailColor}" />`;
  } else if (headwear === 'bow') {
    svg += `<ellipse cx="35" cy="15" rx="12" ry="8" fill="${detailColor}" />
            <ellipse cx="65" cy="15" rx="12" ry="8" fill="${detailColor}" />
            <circle cx="50" cy="15" r="6" fill="${detailColor}" />`;
  }
  svg += `</g>`;

  svg += `</svg>`;
  return svg;
}

// Export for both ES modules and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateAvatarSvg, PALETTES, MOODS };
} else if (typeof window !== 'undefined') {
  window.generateAvatarSvg = generateAvatarSvg;
  window.PALETTES = PALETTES;
  window.MOODS = MOODS;
}
