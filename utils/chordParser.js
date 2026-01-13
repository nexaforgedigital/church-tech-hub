// utils/chordParser.js
// Parse and extract chords from lyrics

/**
 * Valid chord patterns
 */
const chordPattern = /\[([A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?(?:\d+)?(?:\/[A-G][#b]?)?)\]/g;

/**
 * Parse lyrics with inline chords like [G]கர்த்தர் [D]என்
 * @param {string} text - Lyrics with chords
 * @returns {object} - { cleanLyrics, chords }
 */
export function parseChords(text) {
  if (!text) return { cleanLyrics: '', chords: [], lines: [] };

  const lines = text.split('\n');
  const parsedLines = [];
  const allChords = [];

  lines.forEach((line, lineIndex) => {
    const lineChords = [];
    let cleanLine = line;
    let match;
    let offset = 0;

    // Find all chords in this line
    const tempPattern = new RegExp(chordPattern.source, 'g');
    while ((match = tempPattern.exec(line)) !== null) {
      const chord = match[1];
      const originalPosition = match.index;
      const adjustedPosition = originalPosition - offset;

      lineChords.push({
        chord,
        position: adjustedPosition,
        line: lineIndex + 1
      });

      allChords.push({
        chord,
        position: adjustedPosition,
        line: lineIndex + 1
      });

      offset += match[0].length;
    }

    // Remove chord brackets from line
    cleanLine = line.replace(chordPattern, '');

    parsedLines.push({
      text: cleanLine.trim(),
      chords: lineChords
    });
  });

  return {
    cleanLyrics: parsedLines.map(l => l.text).join('\n'),
    chords: allChords,
    lines: parsedLines
  };
}

/**
 * Add chords back to clean lyrics
 * @param {string} cleanLyrics - Lyrics without chords
 * @param {array} chords - Array of chord objects
 * @returns {string} - Lyrics with chords
 */
export function addChordsToLyrics(cleanLyrics, chords) {
  if (!chords || chords.length === 0) return cleanLyrics;

  const lines = cleanLyrics.split('\n');
  const result = [];

  lines.forEach((line, lineIndex) => {
    const lineChords = chords.filter(c => c.line === lineIndex + 1);
    
    if (lineChords.length === 0) {
      result.push(line);
      return;
    }

    // Sort by position (descending) to insert from end
    lineChords.sort((a, b) => b.position - a.position);

    let modifiedLine = line;
    lineChords.forEach(chord => {
      const pos = Math.min(chord.position, modifiedLine.length);
      modifiedLine = modifiedLine.slice(0, pos) + `[${chord.chord}]` + modifiedLine.slice(pos);
    });

    result.push(modifiedLine);
  });

  return result.join('\n');
}

/**
 * Transpose chord by semitones
 * @param {string} chord - Original chord (e.g., "G", "Am", "F#m")
 * @param {number} semitones - Number of semitones to transpose
 * @returns {string} - Transposed chord
 */
export function transposeChord(chord, semitones) {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatToSharp = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };

  // Extract root note and suffix
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;

  let [, root, suffix] = match;
  
  // Convert flat to sharp
  if (flatToSharp[root]) {
    root = flatToSharp[root];
  }

  // Find current index
  const currentIndex = notes.indexOf(root);
  if (currentIndex === -1) return chord;

  // Calculate new index
  const newIndex = (currentIndex + semitones + 12) % 12;
  const newRoot = notes[newIndex];

  return newRoot + suffix;
}

/**
 * Transpose all chords in text
 * @param {string} text - Lyrics with chords
 * @param {number} semitones - Semitones to transpose
 * @returns {string} - Transposed lyrics
 */
export function transposeAll(text, semitones) {
  return text.replace(chordPattern, (match, chord) => {
    return `[${transposeChord(chord, semitones)}]`;
  });
}

/**
 * Get all unique chords from text
 * @param {string} text - Lyrics with chords
 * @returns {string[]} - Array of unique chords
 */
export function getUniqueChords(text) {
  const chords = [];
  let match;
  const pattern = new RegExp(chordPattern.source, 'g');
  
  while ((match = pattern.exec(text)) !== null) {
    if (!chords.includes(match[1])) {
      chords.push(match[1]);
    }
  }

  return chords;
}

/**
 * Format chord chart (chords above lyrics)
 * @param {array} lines - Parsed lines with chords
 * @returns {string} - Formatted chord chart
 */
export function formatChordChart(lines) {
  const result = [];

  lines.forEach(line => {
    if (line.chords.length > 0) {
      // Create chord line
      let chordLine = ' '.repeat(line.text.length + 10);
      line.chords.forEach(c => {
        const pos = Math.min(c.position, chordLine.length - c.chord.length);
        chordLine = chordLine.slice(0, pos) + c.chord + chordLine.slice(pos + c.chord.length);
      });
      result.push(chordLine.trimEnd());
    }
    result.push(line.text);
  });

  return result.join('\n');
}