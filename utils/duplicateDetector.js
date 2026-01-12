// utils/duplicateDetector.js
// Smart Duplicate Detection System

/**
 * Normalize text for comparison
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0B80-\u0BFF]/g, '') // Keep alphanumeric and Tamil
    .replace(/\s+/g, ' ');
}

/**
 * Calculate similarity between two strings (Levenshtein-based)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity score 0-1
 */
function calculateSimilarity(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  const longerLength = longer.length;
  if (longerLength === 0) return 1;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longerLength - distance) / longerLength;
}

/**
 * Levenshtein distance calculation
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

/**
 * Check if a song is a potential duplicate
 * @param {object} newSong - New song to check
 * @param {array} existingSongs - Array of existing songs
 * @param {number} threshold - Similarity threshold (0-1, default 0.8)
 * @returns {object} - { isDuplicate, matches: [{ song, similarity, matchType }] }
 */
export function checkDuplicate(newSong, existingSongs, threshold = 0.75) {
  const matches = [];
  
  for (const existing of existingSongs) {
    const matchInfo = {
      song: existing,
      similarities: {},
      matchType: null,
      overallScore: 0
    };
    
    // Check ID match (exact)
    if (newSong.id && existing.id === newSong.id) {
      matchInfo.matchType = 'exact-id';
      matchInfo.overallScore = 1;
      matches.push(matchInfo);
      continue;
    }
    
    // Check Tamil title similarity
    const tamilTitleSim = calculateSimilarity(newSong.title, existing.title);
    matchInfo.similarities.tamilTitle = tamilTitleSim;
    
    // Check English title similarity
    const englishTitleSim = calculateSimilarity(newSong.titleEnglish, existing.titleEnglish);
    matchInfo.similarities.englishTitle = englishTitleSim;
    
    // Check first line similarity (strong indicator)
    const newFirstLine = newSong.lyrics?.tamil?.[0]?.text || '';
    const existingFirstLine = existing.lyrics?.tamil?.[0]?.text || '';
    const firstLineSim = calculateSimilarity(newFirstLine, existingFirstLine);
    matchInfo.similarities.firstLine = firstLineSim;
    
    // Calculate overall score (weighted)
    matchInfo.overallScore = (
      tamilTitleSim * 0.35 +
      englishTitleSim * 0.25 +
      firstLineSim * 0.40
    );
    
    // Determine match type
    if (matchInfo.overallScore >= 0.95) {
      matchInfo.matchType = 'exact';
    } else if (matchInfo.overallScore >= threshold) {
      matchInfo.matchType = 'similar';
    } else if (tamilTitleSim >= 0.9 || firstLineSim >= 0.9) {
      matchInfo.matchType = 'partial';
      matchInfo.overallScore = Math.max(tamilTitleSim, firstLineSim);
    }
    
    if (matchInfo.matchType) {
      matches.push(matchInfo);
    }
  }
  
  // Sort by score descending
  matches.sort((a, b) => b.overallScore - a.overallScore);
  
  return {
    isDuplicate: matches.length > 0,
    matches: matches.slice(0, 5) // Top 5 matches
  };
}

/**
 * Check multiple songs for duplicates
 * @param {array} newSongs - Array of new songs
 * @param {array} existingSongs - Array of existing songs
 * @returns {array} - Array of { song, duplicateInfo }
 */
export function checkMultipleDuplicates(newSongs, existingSongs, threshold = 0.75) {
  const results = [];
  
  // Also check within new songs themselves
  const allSongsToCheck = [...existingSongs];
  
  for (let i = 0; i < newSongs.length; i++) {
    const song = newSongs[i];
    const duplicateInfo = checkDuplicate(song, allSongsToCheck, threshold);
    
    results.push({
      song,
      index: i,
      ...duplicateInfo
    });
    
    // Add to check list to detect duplicates within batch
    allSongsToCheck.push(song);
  }
  
  return results;
}

/**
 * Get duplicate check summary
 * @param {array} results - Results from checkMultipleDuplicates
 * @returns {object} - Summary statistics
 */
export function getDuplicateSummary(results) {
  const exact = results.filter(r => r.matches?.some(m => m.matchType === 'exact' || m.matchType === 'exact-id'));
  const similar = results.filter(r => r.matches?.some(m => m.matchType === 'similar') && !exact.includes(r));
  const unique = results.filter(r => !r.isDuplicate);
  
  return {
    total: results.length,
    exact: exact.length,
    similar: similar.length,
    unique: unique.length,
    duplicateRate: ((exact.length + similar.length) / results.length * 100).toFixed(1)
  };
}