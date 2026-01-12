// utils/tamilTransliterator.js
// Tamil to English Transliteration Engine
// Optimized for Tamil Christian Worship Songs
// With Smart Learning System Integration

import { getLearnedWords } from './learningSystem';

/**
 * Tamil Unicode Ranges:
 * - Vowels: அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ
 * - Consonants: க ங ச ஞ ட ண த ந ப ம ய ர ல வ ழ ள ற ன
 * - Vowel signs: ா ி ீ ு ூ ெ ே ை ொ ோ ௌ
 * - Pulli (virama): ்
 */

// Base consonants mapping (with inherent 'a')
const consonants = {
  'க': 'ka', 'ங': 'nga', 'ச': 'sa', 'ஞ': 'gna', 'ட': 'da',
  'ண': 'na', 'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma',
  'ய': 'ya', 'ர': 'ra', 'ல': 'la', 'வ': 'va', 'ழ': 'zha',
  'ள': 'la', 'ற': 'ra', 'ன': 'na', 'ஜ': 'ja', 'ஷ': 'sha',
  'ஸ': 'sa', 'ஹ': 'ha', 'க்ஷ': 'ksha', 'ஶ': 'sha'
};

// Pure consonants (with pulli ்)
const pureConsonants = {
  'க்': 'k', 'ங்': 'ng', 'ச்': 's', 'ஞ்': 'gn', 'ட்': 'd',
  'ண்': 'n', 'த்': 'th', 'ந்': 'n', 'ப்': 'p', 'ம்': 'm',
  'ய்': 'y', 'ர்': 'r', 'ல்': 'l', 'வ்': 'v', 'ழ்': 'zh',
  'ள்': 'l', 'ற்': 'tr', 'ன்': 'n', 'ஜ்': 'j', 'ஷ்': 'sh',
  'ஸ்': 's', 'ஹ்': 'h'
};

// Vowels (standalone)
const vowels = {
  'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u',
  'ஊ': 'oo', 'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o',
  'ஓ': 'oo', 'ஔ': 'au'
};

// Vowel signs (modifiers)
const vowelSigns = {
  'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
  'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oo',
  'ௌ': 'au', '்': ''  // Pulli removes inherent 'a'
};

// Base special words (pre-mapped for accuracy)
const baseSpecialWords = {
  // God & Jesus
  'கர்த்தர்': 'Karthar',
  'இயேசு': 'Yesu',
  'ஆண்டவர்': 'Aandavar',
  'தேவன்': 'Devan',
  'கிறிஸ்து': 'Kiristhu',
  'யேகோவா': 'Yehovaa',
  'மேசியா': 'Mesiyaa',
  'இம்மானுவேல்': 'Immanuvel',
  
  // Holy Spirit
  'ஆவி': 'Aavi',
  'பரிசுத்த': 'Parisuththa',
  'பரிசுத்தர்': 'Parisuththar',
  
  // Worship words
  'ஆமென்': 'Aameen',
  'அல்லேலூயா': 'Alleluya',
  'ஸ்தோத்திரம்': 'Sthothiram',
  'மகிமை': 'Magimai',
  'துதி': 'Thuthi',
  'ஆராதனை': 'Aaraathanai',
  'ஆராதிக்கிறேன்': 'Aaraathikkiren',
  'துதிக்கிறேன்': 'Thuthikkiren',
  'வணங்குகிறேன்': 'Vanangukiren',
  'போற்றுகிறேன்': 'Potrukiren',
  
  // Common words
  'நன்றி': 'Nandri',
  'அன்பு': 'Anbu',
  'கிருபை': 'Kirupai',
  'இரக்கம்': 'Irakkam',
  'மீட்பர்': 'Meetpar',
  'இரட்சகர்': 'Iratchagar',
  'இரட்சிப்பு': 'Iratchippu',
  'ராஜா': 'Raaja',
  'ராஜாதி': 'Raajaathi',
  'மன்னா': 'Mannaa',
  'மன்னர்': 'Mannar',
  
  // Cross & Blood
  'சிலுவை': 'Siluvai',
  'இரத்தம்': 'Iraththam',
  'இரத்தத்தால்': 'Iraththaththaal',
  
  // Life & Way
  'ஜீவன்': 'Jeevan',
  'ஜீவனுள்ள': 'Jeevanulla',
  'வழி': 'Vazhi',
  'சத்தியம்': 'Saththiyam',
  'உண்மை': 'Unmai',
  
  // Eternity
  'நித்தியம்': 'Niththiyam',
  'நித்திய': 'Niththiya',
  'பரலோகம்': 'Paralogam',
  'பரலோக': 'Paraloga',
  'ராஜ்யம்': 'Raajyam',
  
  // Blessings
  'ஆசீர்வாதம்': 'Aaseervaatham',
  'ஆசீர்வதியும்': 'Aaseervathiyum',
  
  // Prayer & Faith
  'ஜெபம்': 'Jebam',
  'ஜெபிக்கிறேன்': 'Jebikkiren',
  'விசுவாசம்': 'Visuvaasam',
  'நம்பிக்கை': 'Nambikkai',
  
  // Peace & Joy
  'சமாதானம்': 'Samaathaanam',
  'சந்தோஷம்': 'Santhosham',
  'மகிழ்ச்சி': 'Magizhchi',
  'ஆனந்தம்': 'Aanandham',
  
  // Heart & Soul
  'இருதயம்': 'Irudhayam',
  'இதயம்': 'Idhayam',
  'ஆத்துமா': 'Aaththumaa',
  'ஆத்மா': 'Aathmaa',
  'உள்ளம்': 'Ullam',
  
  // Shepherd
  'மேய்ப்பர்': 'Meypar',
  'மேய்ப்பன்': 'Meypan',
  
  // Father & Lord
  'பிதா': 'Pithaa',
  'பிதாவே': 'Pithaave',
  'தகப்பன்': 'Thagappan',
  
  // Sin & Salvation
  'பாவம்': 'Paavam',
  'பாவி': 'Paavi',
  'பாவங்கள்': 'Paavangal',
  'மீட்பு': 'Meetpu',
  
  // Power & Strength
  'வல்லமை': 'Vallamai',
  'பலம்': 'Balam',
  'சக்தி': 'Sakthi',
  
  // Glory & Praise
  'மகத்துவம்': 'Magatthuvam',
  'கனம்': 'Kanam',
  'புகழ்': 'Pugazh',
  'புகழ்ச்சி': 'Pugazhchi',
  
  // Love
  'அன்பே': 'Anbe',
  'நேசம்': 'Nesam',
  'நேசிக்கிறேன்': 'Nesikkiren',
  'பிரியம்': 'Piriyam',
  
  // Grace & Mercy
  'கருணை': 'Karunai',
  'தயவு': 'Thayavu',
  'கிருபையால்': 'Kirupaiyaal',
  
  // Name
  'நாமம்': 'Naamam',
  'நாமத்தில்': 'Naamaththil',
  'நாமத்தை': 'Naamaththai',
  
  // Pronouns - You (God)
  'உம்': 'Um',
  'உம்மை': 'Ummai',
  'உம்மையே': 'Ummaiye',
  'உமக்கு': 'Umakku',
  'உமது': 'Umathu',
  'உம்மோடு': 'Ummodu',
  
  // Pronouns - I/Me
  'என்': 'En',
  'என்னை': 'Ennai',
  'என்னையே': 'Ennaiye',
  'எனக்கு': 'Enakku',
  'எனது': 'Enathu',
  'என்னோடு': 'Ennodu',
  
  // Pronouns - We/Us
  'நம்': 'Nam',
  'நம்மை': 'Nammai',
  'நமக்கு': 'Namakku',
  'நாம்': 'Naam',
  'நாங்கள்': 'Naangal',
  'எங்கள்': 'Engal',
  'எங்களை': 'Engalai',
  
  // Common verbs
  'பாடுவேன்': 'Paaduven',
  'பாடுகிறேன்': 'Paadugiren',
  'பாடும்': 'Paadum',
  'செய்வார்': 'Seivaar',
  'செய்கிறார்': 'Seikiraar',
  'வருவார்': 'Varuvaar',
  'வந்தார்': 'Vanthaar',
  'இருக்கிறார்': 'Irukkiraar',
  'இருக்கிறேன்': 'Irukkiren',
  
  // Time
  'என்றும்': 'Endrum',
  'என்றென்றும்': 'Endrendrum',
  'எப்போதும்': 'Eppodhum',
  'இன்றும்': 'Indrum',
  'நாளும்': 'Naalum',
  
  // Common phrases
  'அல்லேலூயா': 'Alleluya',
  'ஹல்லேலூயா': 'Halleluya',
  'ஹோசன்னா': 'Hosanna',
  'ஓசன்னா': 'Osanna'
};

/**
 * Get special words (base + learned)
 * @returns {object} - Combined special words dictionary
 */
function getSpecialWords() {
  try {
    const learned = getLearnedWords();
    // Learned words take priority over base words
    return { ...baseSpecialWords, ...learned };
  } catch (error) {
    // If learning system fails, use base words only
    return baseSpecialWords;
  }
}

/**
 * Main transliteration function
 * @param {string} tamilText - Tamil text to transliterate
 * @returns {string} - Transliterated text in English letters
 */
export function transliterate(tamilText) {
  if (!tamilText) return '';
  
  let result = '';
  let text = tamilText;
  
  // Get special words (base + learned)
  const specialWords = getSpecialWords();
  
  // Sort by length (longer words first) to avoid partial replacements
  const sortedSpecialWords = Object.entries(specialWords)
    .sort((a, b) => b[0].length - a[0].length);
  
  // First, replace known special words with placeholders
  let placeholderIndex = 0;
  const placeholders = {};
  
  for (const [tamil, english] of sortedSpecialWords) {
    const regex = new RegExp(escapeRegex(tamil), 'g');
    if (text.includes(tamil)) {
      const placeholder = `__PLACEHOLDER_${placeholderIndex}__`;
      placeholders[placeholder] = english;
      text = text.replace(regex, placeholder);
      placeholderIndex++;
    }
  }
  
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1] || '';
    const twoChars = char + nextChar;
    
    // Check for placeholder
    if (char === '_' && text.substring(i).startsWith('__PLACEHOLDER_')) {
      const endIndex = text.indexOf('__', i + 14);
      if (endIndex !== -1) {
        const placeholder = text.substring(i, endIndex + 2);
        if (placeholders[placeholder]) {
          result += placeholders[placeholder];
          i = endIndex + 2;
          continue;
        }
      }
    }
    
    // Check for pure consonant (consonant + pulli)
    if (pureConsonants[twoChars]) {
      result += pureConsonants[twoChars];
      i += 2;
      continue;
    }
    
    // Check for consonant with vowel sign
    if (consonants[char]) {
      const baseConsonant = consonants[char].slice(0, -1); // Remove inherent 'a'
      
      if (vowelSigns[nextChar] !== undefined) {
        if (nextChar === '்') {
          // Pulli - pure consonant
          result += baseConsonant;
        } else {
          // Vowel sign
          result += baseConsonant + vowelSigns[nextChar];
        }
        i += 2;
        continue;
      } else {
        // Consonant with inherent 'a'
        result += consonants[char];
        i++;
        continue;
      }
    }
    
    // Check for standalone vowel
    if (vowels[char]) {
      result += vowels[char];
      i++;
      continue;
    }
    
    // Check for vowel sign at start (rare but possible)
    if (vowelSigns[char] && char !== '்') {
      result += vowelSigns[char];
      i++;
      continue;
    }
    
    // Keep spaces, punctuation, numbers as-is
    if (/[\s\d.,!?;:'"\-()@#$%^&*+=\[\]{}|\\/<>~`]/.test(char)) {
      result += char;
      i++;
      continue;
    }
    
    // English letters - keep as-is
    if (/[a-zA-Z]/.test(char)) {
      result += char;
      i++;
      continue;
    }
    
    // Unknown character - keep as-is
    result += char;
    i++;
  }
  
  // Clean up result
  result = result
    .replace(/\s+/g, ' ')           // Multiple spaces to single
    .trim();
  
  // Capitalize first letter of each sentence
  result = capitalizeFirstLetter(result);
  
  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Capitalize first letter
 */
function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Transliterate line by line
 * @param {string} tamilText - Multi-line Tamil text
 * @returns {string[]} - Array of transliterated lines
 */
export function transliterateLines(tamilText) {
  if (!tamilText) return [];
  
  return tamilText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => transliterate(line));
}

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(text) {
  if (!text) return '';
  
  // If Tamil, transliterate first
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  const englishText = hasTamil ? transliterate(text) : text;
  
  return englishText
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove special chars
    .replace(/\s+/g, '-')          // Spaces to hyphens
    .replace(/-+/g, '-')           // Multiple hyphens to single
    .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
    .substring(0, 60);             // Max 60 chars
}

/**
 * Extract title from first line of lyrics
 * @param {string} tamilLyrics - Tamil lyrics text
 * @returns {object} - { tamil, english, slug }
 */
export function extractTitle(tamilLyrics) {
  const lines = tamilLyrics.split('\n').map(l => l.trim()).filter(l => l);
  
  if (lines.length === 0) {
    return { tamil: '', english: '', slug: '' };
  }
  
  const firstLine = lines[0];
  const englishTitle = transliterate(firstLine);
  
  // Capitalize first letter of each word for title
  const titleCase = englishTitle
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return {
    tamil: firstLine,
    english: titleCase,
    slug: generateSlug(firstLine)
  };
}

/**
 * Process complete song from Tamil lyrics only
 * @param {string} tamilLyrics - Tamil lyrics (one line per row)
 * @param {string} customEnglishTitle - Optional custom English title
 * @param {string} artist - Optional artist name
 * @returns {object} - Complete song object ready for database
 */
export function processSong(tamilLyrics, customEnglishTitle = '', artist = '') {
  const lines = tamilLyrics
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  if (lines.length === 0) {
    return null;
  }
  
  // Extract or use custom title
  const titleInfo = extractTitle(tamilLyrics);
  const englishTitle = customEnglishTitle || titleInfo.english;
  const slug = generateSlug(customEnglishTitle || titleInfo.tamil);
  
  // Generate transliteration for all lines
  const transliteratedLines = lines.map(line => transliterate(line));
  
  // Create song object
  const today = new Date().toISOString().split('T')[0];
  
  return {
    id: slug,
    title: titleInfo.tamil,
    titleEnglish: englishTitle,
    artist: artist || '',
    language: 'Tamil',
    lyrics: {
      tamil: lines.map((text, i) => ({ line: i + 1, text })),
      transliteration: transliteratedLines.map((text, i) => ({ line: i + 1, text }))
    },
    lyrics_english: null,
    chords: null,
    tempo: null,
    musicalKey: null,
    timeSignature: null,
    ccliNumber: null,
    youtubeUrl: null,
    audioUrl: null,
    originalLanguage: 'Tamil',
    createdAt: today,
    updatedAt: today
  };
}

/**
 * Validate transliteration quality
 * @param {string} tamil - Tamil text
 * @param {string} transliteration - Generated transliteration
 * @returns {object} - { isGood, warnings }
 */
export function validateTransliteration(tamil, transliteration) {
  const warnings = [];
  
  if (!tamil || !transliteration) {
    return { isGood: false, warnings: ['Empty input'] };
  }
  
  // Check if transliteration is too short
  if (transliteration.length < tamil.length * 0.3) {
    warnings.push('Transliteration seems too short');
  }
  
  // Check for remaining Tamil characters
  if (/[\u0B80-\u0BFF]/.test(transliteration)) {
    warnings.push('Some Tamil characters were not transliterated');
  }
  
  // Check for too many consecutive consonants (more than 5)
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(transliteration)) {
    warnings.push('Unusual consonant cluster detected');
  }
  
  // Check for placeholder remnants
  if (transliteration.includes('__PLACEHOLDER')) {
    warnings.push('Placeholder error detected');
  }
  
  return {
    isGood: warnings.length === 0,
    warnings
  };
}

/**
 * Get count of base special words
 */
export function getBaseWordCount() {
  return Object.keys(baseSpecialWords).length;
}

/**
 * Get all base special words
 */
export function getBaseSpecialWords() {
  return { ...baseSpecialWords };
}

/**
 * Test transliteration with a sample
 */
export function testTransliteration() {
  const testCases = [
    'கர்த்தர் என் மேய்ப்பர்',
    'இயேசு என் ராஜா',
    'அல்லேலூயா துதி பாடுவோம்',
    'பரிசுத்த ஆவியே வாரும்'
  ];
  
  console.log('🧪 Testing Transliteration:');
  testCases.forEach(test => {
    console.log(`  Tamil: ${test}`);
    console.log(`  English: ${transliterate(test)}`);
    console.log('');
  });
}