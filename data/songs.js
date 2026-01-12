// data/songs.js
// ChurchAssist Song Database
// Total Songs: [UPDATE THIS COUNT]

export const songs = [
  // ========================================
  // SONG 1
  // ========================================
  {
    id: "the-lord-is-my-shepherd",
    title: "கர்த்தர் என் மேய்ப்பர்",
    titleEnglish: "The Lord is My Shepherd",
    artist: "Traditional",
    language: "Tamil",
    lyrics: {
      tamil: [
        { line: 1, text: "கர்த்தர் என் மேய்ப்பர்" },
        { line: 2, text: "எனக்கு குறைவு இல்லை" },
        { line: 3, text: "புல்லுள்ள இடங்களில்" },
        { line: 4, text: "என்னைப் படுக்கச் செய்வார்" },
        { line: 5, text: "அமர்ந்த தண்ணீர்கள் அருகே" },
        { line: 6, text: "என்னை நடத்துவார்" }
      ],
      transliteration: [
        { line: 1, text: "Karthar en meypar" },
        { line: 2, text: "Enakku kuraivu illai" },
        { line: 3, text: "Pullulla idangalil" },
        { line: 4, text: "Ennai padukka seivaar" },
        { line: 5, text: "Amarntha thanneerkal arugae" },
        { line: 6, text: "Ennai nadaththuvaar" }
      ]
    },
    // Future fields (null for now)
    lyrics_english: null,
    chords: null,
    tempo: null,
    musicalKey: null,
    timeSignature: null,
    ccliNumber: null,
    youtubeUrl: null,
    audioUrl: null,
    originalLanguage: "Tamil",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15"
  },

  // ========================================
  // SONG 2
  // ========================================
  {
    id: "amazing-grace",
    title: "அற்புதமான கிருபை",
    titleEnglish: "Amazing Grace",
    artist: "John Newton",
    language: "Tamil",
    lyrics: {
      tamil: [
        { line: 1, text: "அற்புதமான கிருபை" },
        { line: 2, text: "எவ்வளவு இனிமையான ஒலி" },
        { line: 3, text: "என்னைப் போன்ற ஒரு பாவியை" },
        { line: 4, text: "இரட்சித்தது" }
      ],
      transliteration: [
        { line: 1, text: "Arputhamaana kirupai" },
        { line: 2, text: "Evvalavu inimaiyaana oli" },
        { line: 3, text: "Ennai pondra oru paaviyai" },
        { line: 4, text: "Iratchithathu" }
      ]
    },
    lyrics_english: null,
    chords: null,
    tempo: null,
    musicalKey: null,
    timeSignature: null,
    ccliNumber: null,
    youtubeUrl: null,
    audioUrl: null,
    originalLanguage: "English",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15"
  },

  // ========================================
  // ADD MORE SONGS BELOW
  // ========================================
  
];

// Helper: Get total song count
export const getSongCount = () => songs.length;

// Helper: Get all unique artists
export const getArtists = () => {
  const artists = songs.map(s => s.artist).filter(a => a && a.trim());
  return [...new Set(artists)].sort();
};