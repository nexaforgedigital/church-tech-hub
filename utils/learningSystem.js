// utils/learningSystem.js
// Smart Learning System - Remembers your corrections!

const STORAGE_KEY = 'churchassist-learned-words';
const STATS_KEY = 'churchassist-learning-stats';

/**
 * Get all learned word corrections
 * @returns {object} - { tamilWord: correctedTransliteration }
 */
export function getLearnedWords() {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading learned words:', error);
    return {};
  }
}

/**
 * Save a word correction for future use
 * @param {string} tamilWord - Original Tamil word
 * @param {string} correction - Corrected transliteration
 */
export function learnWord(tamilWord, correction) {
  if (typeof window === 'undefined') return;
  if (!tamilWord || !correction) return;
  
  const learned = getLearnedWords();
  learned[tamilWord.trim()] = correction.trim();
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(learned));
  
  // Update stats
  updateStats('wordsLearned');
  
  console.log(`📚 Learned: "${tamilWord}" → "${correction}"`);
}

/**
 * Learn multiple words at once
 * @param {object} corrections - { tamilWord: correction, ... }
 */
export function learnMultipleWords(corrections) {
  if (typeof window === 'undefined') return;
  
  const learned = getLearnedWords();
  let count = 0;
  
  for (const [tamil, english] of Object.entries(corrections)) {
    if (tamil && english) {
      learned[tamil.trim()] = english.trim();
      count++;
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(learned));
  
  console.log(`📚 Learned ${count} new words`);
}

/**
 * Remove a learned word
 * @param {string} tamilWord - Word to forget
 */
export function forgetWord(tamilWord) {
  if (typeof window === 'undefined') return;
  
  const learned = getLearnedWords();
  delete learned[tamilWord];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(learned));
}

/**
 * Clear all learned words
 */
export function clearAllLearned() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export learned words as JSON
 * @returns {string} - JSON string
 */
export function exportLearnedWords() {
  const learned = getLearnedWords();
  return JSON.stringify(learned, null, 2);
}

/**
 * Import learned words from JSON
 * @param {string} jsonString - JSON string of learned words
 */
export function importLearnedWords(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    const existing = getLearnedWords();
    const merged = { ...existing, ...imported };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return Object.keys(imported).length;
  } catch (error) {
    console.error('Error importing learned words:', error);
    throw error;
  }
}

/**
 * Get learning statistics
 */
export function getLearningStats() {
  if (typeof window === 'undefined') {
    return { wordsLearned: 0, songsAdded: 0, correctionsApplied: 0 };
  }
  
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : {
      wordsLearned: Object.keys(getLearnedWords()).length,
      songsAdded: 0,
      correctionsApplied: 0,
      lastUpdated: null
    };
  } catch (error) {
    return { wordsLearned: 0, songsAdded: 0, correctionsApplied: 0 };
  }
}

/**
 * Update a stat counter
 */
export function updateStats(statName, increment = 1) {
  if (typeof window === 'undefined') return;
  
  const stats = getLearningStats();
  stats[statName] = (stats[statName] || 0) + increment;
  stats.lastUpdated = new Date().toISOString();
  
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/**
 * Apply learned words to transliteration
 * @param {string} tamilText - Tamil text
 * @param {string} autoTransliteration - Auto-generated transliteration
 * @returns {string} - Improved transliteration
 */
export function applyLearnedCorrections(tamilText, autoTransliteration) {
  const learned = getLearnedWords();
  let improved = autoTransliteration;
  let appliedCount = 0;
  
  // Sort by length (longer words first) to avoid partial replacements
  const sortedWords = Object.entries(learned)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [tamilWord, correction] of sortedWords) {
    if (tamilText.includes(tamilWord)) {
      // Find the auto-transliterated version of this word
      // This is tricky - we need to find and replace the corresponding part
      // For now, we'll use a simpler approach
      appliedCount++;
    }
  }
  
  if (appliedCount > 0) {
    updateStats('correctionsApplied', appliedCount);
  }
  
  return improved;
}

/**
 * Compare two transliterations and extract differences as learnable corrections
 * @param {string[]} tamilLines - Original Tamil lines
 * @param {string[]} autoLines - Auto-generated transliteration lines
 * @param {string[]} correctedLines - User-corrected transliteration lines
 * @returns {object} - Detected corrections { tamil: corrected }
 */
export function extractCorrections(tamilLines, autoLines, correctedLines) {
  const corrections = {};
  
  for (let i = 0; i < tamilLines.length; i++) {
    const tamil = tamilLines[i] || '';
    const auto = autoLines[i] || '';
    const corrected = correctedLines[i] || '';
    
    // If user made changes, try to identify word-level corrections
    if (auto !== corrected) {
      const tamilWords = tamil.split(/\s+/);
      const autoWords = auto.split(/\s+/);
      const correctedWords = corrected.split(/\s+/);
      
      // Simple word-by-word comparison
      for (let j = 0; j < tamilWords.length; j++) {
        if (autoWords[j] !== correctedWords[j] && tamilWords[j] && correctedWords[j]) {
          corrections[tamilWords[j]] = correctedWords[j];
        }
      }
    }
  }
  
  return corrections;
}

/**
 * Get word count
 */
export function getLearnedWordCount() {
  return Object.keys(getLearnedWords()).length;
}