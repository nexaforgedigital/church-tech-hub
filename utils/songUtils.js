// utils/songUtils.js
// Shared song utilities

/**
 * Copy song lyrics as plain text
 */
export function copyAsText(song, includeTitle = true) {
  let text = '';
  
  if (includeTitle) {
    text += `${song.titleEnglish || song.title}\n`;
    if (song.artist) text += `${song.artist}\n`;
    text += '\n';
  }
  
  song.lyrics?.tamil?.forEach((line, i) => {
    text += `${line.text}\n`;
    if (song.lyrics?.transliteration?.[i]) {
      text += `${song.lyrics.transliteration[i].text}\n`;
    }
    text += '\n';
  });
  
  navigator.clipboard.writeText(text.trim());
  return text;
}

/**
 * Generate print-friendly HTML
 */
export function generatePrintHTML(song) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${song.titleEnglish || song.title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { margin-bottom: 10px; }
        .artist { color: #666; margin-bottom: 30px; }
        .line { margin-bottom: 20px; }
        .tamil { font-size: 18px; font-weight: bold; }
        .translit { font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${song.title}</h1>
      <div class="artist">${song.titleEnglish}${song.artist ? ` • ${song.artist}` : ''}</div>
      ${song.lyrics?.tamil?.map((line, i) => `
        <div class="line">
          <div class="tamil">${line.text}</div>
          ${song.lyrics?.transliteration?.[i] ? `<div class="translit">${song.lyrics.transliteration[i].text}</div>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
}

/**
 * Print song
 */
export function printSong(song) {
  const html = generatePrintHTML(song);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}

/**
 * Generate shareable link
 */
export function getShareableLink(songId) {
  return `${window.location.origin}/lyrics/${songId}`;
}

/**
 * Share song (Web Share API)
 */
export async function shareSong(song) {
  const shareData = {
    title: song.titleEnglish || song.title,
    text: `Check out this worship song: ${song.title}`,
    url: getShareableLink(song.id)
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      console.log('Share cancelled');
      return false;
    }
  } else {
    // Fallback: copy link
    navigator.clipboard.writeText(shareData.url);
    alert('Link copied to clipboard!');
    return true;
  }
}