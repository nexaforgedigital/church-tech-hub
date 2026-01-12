// utils/songHelpers.js
// Helper functions for song management

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
};

/**
 * Create a new song object with proper structure
 * @param {object} data - Song data
 * @returns {object} - Properly formatted song object
 */
export const createSongObject = (data) => {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  return {
    // Required
    id: data.id || generateSlug(data.titleEnglish),
    title: data.title || '',
    titleEnglish: data.titleEnglish || '',
    
    // Lyrics
    lyrics: {
      tamil: data.lyrics?.tamil || [],
      transliteration: data.lyrics?.transliteration || []
    },
    
    // Optional
    artist: data.artist || '',
    language: data.language || 'Tamil',
    
    // Future expansion (null by default)
    lyrics_english: data.lyrics_english || null,
    chords: data.chords || null,
    tempo: data.tempo || null,
    musicalKey: data.musicalKey || null,
    timeSignature: data.timeSignature || null,
    ccliNumber: data.ccliNumber || null,
    youtubeUrl: data.youtubeUrl || null,
    audioUrl: data.audioUrl || null,
    originalLanguage: data.originalLanguage || 'Tamil',
    
    // System
    createdAt: data.createdAt || now,
    updatedAt: now
  };
};

/**
 * Parse lyrics from plain text (line by line)
 * @param {string} text - Lyrics text (one line per line)
 * @returns {array} - Array of {line, text} objects
 */
export const parseLyricsText = (text) => {
  if (!text || !text.trim()) return [];
  
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((text, index) => ({
      line: index + 1,
      text
    }));
};

/**
 * Search songs by query (searches English title, Tamil title, transliteration)
 * @param {array} songs - Array of song objects
 * @param {string} query - Search query
 * @returns {array} - Filtered songs
 */
export const searchSongs = (songs, query) => {
  if (!query || !query.trim()) return songs;
  
  const searchLower = query.toLowerCase().trim();
  
  return songs.filter(song => {
    // Search in English title (primary)
    if (song.titleEnglish?.toLowerCase().includes(searchLower)) return true;
    
    // Search in Tamil title
    if (song.title?.includes(query)) return true;
    
    // Search in artist
    if (song.artist?.toLowerCase().includes(searchLower)) return true;
    
    // Search in first line of transliteration
    const firstLine = song.lyrics?.transliteration?.[0]?.text?.toLowerCase();
    if (firstLine?.includes(searchLower)) return true;
    
    // Search in ID/slug
    if (song.id?.includes(searchLower)) return true;
    
    return false;
  });
};

/**
 * Sort songs alphabetically by English title
 * @param {array} songs - Array of song objects
 * @returns {array} - Sorted songs
 */
export const sortSongsByTitle = (songs) => {
  return [...songs].sort((a, b) => 
    (a.titleEnglish || a.title).localeCompare(b.titleEnglish || b.title)
  );
};

/**
 * Validate song object has required fields
 * @param {object} song - Song object to validate
 * @returns {object} - { valid: boolean, errors: string[] }
 */
export const validateSong = (song) => {
  const errors = [];
  
  if (!song.titleEnglish?.trim()) {
    errors.push('English title is required');
  }
  
  if (!song.title?.trim()) {
    errors.push('Tamil title is required');
  }
  
  if (!song.lyrics?.tamil?.length) {
    errors.push('Tamil lyrics are required');
  }
  
  if (!song.lyrics?.transliteration?.length) {
    errors.push('Transliteration is required');
  }
  
  // Check lyrics line count matches
  const tamilLines = song.lyrics?.tamil?.length || 0;
  const translitLines = song.lyrics?.transliteration?.length || 0;
  
  if (tamilLines !== translitLines) {
    errors.push(`Line count mismatch: Tamil has ${tamilLines} lines, Transliteration has ${translitLines} lines`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Format song for display in list
 * @param {object} song - Song object
 * @returns {object} - Formatted for display
 */
export const formatSongForList = (song) => ({
  id: song.id,
  title: song.title,
  titleEnglish: song.titleEnglish,
  artist: song.artist || 'Unknown',
  language: song.language,
  firstLine: song.lyrics?.tamil?.[0]?.text || '',
  firstLineTranslit: song.lyrics?.transliteration?.[0]?.text || ''
});