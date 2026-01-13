// utils/verseDetector.js
// Auto-detect song structure (Verse, Chorus, Bridge, etc.)

/**
 * Detect repeated sections (likely chorus)
 * @param {string[]} lines - Array of lyric lines
 * @returns {object} - Detected structure
 */
export function detectSongStructure(lines) {
  if (!lines || lines.length === 0) return { sections: [], structured: [] };

  const normalizedLines = lines.map(l => l.trim().toLowerCase());
  const lineGroups = [];
  const groupSize = 2; // Compare in groups of 2 lines
  
  // Group lines
  for (let i = 0; i < lines.length; i += groupSize) {
    const group = lines.slice(i, i + groupSize);
    const normalized = normalizedLines.slice(i, i + groupSize).join('|');
    lineGroups.push({
      lines: group,
      normalized,
      startIndex: i,
      endIndex: Math.min(i + groupSize - 1, lines.length - 1)
    });
  }

  // Find repeated groups (potential chorus)
  const groupCounts = {};
  lineGroups.forEach((group, index) => {
    if (!groupCounts[group.normalized]) {
      groupCounts[group.normalized] = [];
    }
    groupCounts[group.normalized].push(index);
  });

  // Identify chorus (most repeated section with 2+ occurrences)
  let chorusPattern = null;
  let maxRepeats = 1;
  
  Object.entries(groupCounts).forEach(([pattern, indices]) => {
    if (indices.length > maxRepeats && pattern.length > 10) {
      maxRepeats = indices.length;
      chorusPattern = pattern;
    }
  });

  // Build structured output
  const sections = [];
  let verseCount = 1;
  let chorusCount = 0;
  let currentSection = null;
  let currentLines = [];

  lineGroups.forEach((group, index) => {
    const isChorus = group.normalized === chorusPattern && chorusPattern !== null;
    
    if (isChorus) {
      // Save previous section if exists
      if (currentLines.length > 0 && currentSection !== 'chorus') {
        sections.push({
          type: 'verse',
          label: `Verse ${verseCount}`,
          lines: [...currentLines]
        });
        verseCount++;
        currentLines = [];
      }
      
      // Add chorus (only first time, then reference)
      if (chorusCount === 0) {
        sections.push({
          type: 'chorus',
          label: 'Chorus',
          lines: group.lines
        });
      } else {
        sections.push({
          type: 'chorus-repeat',
          label: 'Chorus',
          lines: group.lines,
          note: '(Repeat)'
        });
      }
      chorusCount++;
      currentSection = 'chorus';
    } else {
      if (currentSection === 'chorus') {
        currentLines = [];
      }
      currentLines.push(...group.lines);
      currentSection = 'verse';
    }
  });

  // Add remaining lines as final verse
  if (currentLines.length > 0) {
    sections.push({
      type: 'verse',
      label: `Verse ${verseCount}`,
      lines: currentLines
    });
  }

  return {
    sections,
    hasChorus: chorusPattern !== null,
    chorusRepeats: maxRepeats,
    totalVerses: verseCount,
    structured: formatStructuredLyrics(sections)
  };
}

/**
 * Format sections into structured lyrics string
 */
function formatStructuredLyrics(sections) {
  return sections.map(section => {
    const header = `[${section.label}]${section.note ? ' ' + section.note : ''}`;
    const content = section.lines.join('\n');
    return `${header}\n${content}`;
  }).join('\n\n');
}

/**
 * Common chorus indicators in Tamil
 */
const chorusIndicators = [
  'அல்லேலூயா',
  'ஆமென்',
  'ஸ்தோத்திரம்',
  'துதி',
  'மகிமை',
  'ஜெய',
  'ஹல்லேலூயா'
];

/**
 * Check if a line might be chorus based on content
 */
export function mightBeChorus(line) {
  const normalizedLine = line.toLowerCase();
  return chorusIndicators.some(indicator => 
    normalizedLine.includes(indicator.toLowerCase()) || 
    line.includes(indicator)
  );
}

/**
 * Split lyrics by blank lines
 */
export function splitByBlankLines(text) {
  return text
    .split(/\n\s*\n/)
    .map(section => section.trim())
    .filter(section => section.length > 0);
}

/**
 * Manual structure parser (for pre-structured lyrics)
 * Parses: [Verse 1], [Chorus], [Bridge], etc.
 */
export function parseManualStructure(text) {
  const sectionRegex = /\[(Verse|Chorus|Bridge|Pre-Chorus|Outro|Intro|Tag)(?:\s*(\d+))?\]/gi;
  const sections = [];
  let lastIndex = 0;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    // Add content before this tag as previous section
    if (lastIndex > 0 && match.index > lastIndex) {
      const content = text.substring(lastIndex, match.index).trim();
      if (content && sections.length > 0) {
        sections[sections.length - 1].lines = content.split('\n').filter(l => l.trim());
      }
    }

    sections.push({
      type: match[1].toLowerCase(),
      label: `${match[1]}${match[2] ? ' ' + match[2] : ''}`,
      lines: []
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining content to last section
  if (sections.length > 0 && lastIndex < text.length) {
    const content = text.substring(lastIndex).trim();
    sections[sections.length - 1].lines = content.split('\n').filter(l => l.trim());
  }

  return sections;
}