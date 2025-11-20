// pages/api/songs.js

// Sample songs database (we'll replace this with real database later)
const songs = [
  {
    id: 1,
    title: "Amazing Grace",
    artist: "John Newton",
    language: "English",
    category: "Worship",
    downloads: 245,
    lyrics: {
      tamil: [
        { line: 1, text: "அற்புதமான கிருபை, எவ்வளவு இனிமையான ஒலி" },
        { line: 2, text: "என்னைப் போன்ற ஒரு அவலட்சணத்தைக் காப்பாற்றியது" },
        { line: 3, text: "நான் ஒரு காலத்தில் தொலைந்து போனேன், ஆனால் இப்போது என்னைக் கண்டுபிடித்தேன்" },
        { line: 4, text: "குருடனாக இருந்தேன், ஆனால் இப்போது பார்க்கிறேன்" }
      ],
      english: [
        { line: 1, text: "Amazing grace, how sweet the sound" },
        { line: 2, text: "That saved a wretch like me" },
        { line: 3, text: "I once was lost, but now am found" },
        { line: 4, text: "Was blind, but now I see" }
      ],
      transliteration: [
        { line: 1, text: "Arputhamaana kirupai, evvalavu inimaiyaana oli" },
        { line: 2, text: "Ennai pondra oru avalatchanaththai kaapaatriyathu" },
        { line: 3, text: "Naan oru kaalaththil tholaindhu ponaen, aanaal ippoathu ennai kandupidiththaen" },
        { line: 4, text: "Kurudanaaga irungthaen, aanaal ippoathu paarkiraen" }
      ]
    }
  },
  {
    id: 2,
    title: "கர்த்தர் என் மேய்ப்பர்",
    artist: "Traditional Tamil",
    language: "Tamil",
    category: "Praise",
    downloads: 189,
    lyrics: {
      tamil: [
        { line: 1, text: "கர்த்தர் என் மேய்ப்பர்" },
        { line: 2, text: "எனக்கு குறைவு இல்லை" },
        { line: 3, text: "புல்லுள்ள இடங்களில் என்னைப் படுக்கச் செய்வார்" },
        { line: 4, text: "அமர்ந்த தண்ணீர்கள் அருகே என்னை நடத்துவார்" }
      ],
      english: [
        { line: 1, text: "The Lord is my shepherd" },
        { line: 2, text: "I shall not want" },
        { line: 3, text: "He makes me lie down in green pastures" },
        { line: 4, text: "He leads me beside still waters" }
      ],
      transliteration: [
        { line: 1, text: "Karththar en meypar" },
        { line: 2, text: "Enakku kuraivu illai" },
        { line: 3, text: "Pullulla idangalil ennai padukka seivaar" },
        { line: 4, text: "Amarntha thanneerkal arugae ennai nadaththuvaar" }
      ]
    }
  },
  {
    id: 3,
    title: "How Great Thou Art",
    artist: "Carl Boberg",
    language: "Bilingual",
    category: "Worship",
    downloads: 312,
    lyrics: {
      tamil: [
        { line: 1, text: "என் ஆத்துமாவே, என் இரட்சகரான தேவனைப் பாடு" },
        { line: 2, text: "நீர் எவ்வளவு பெரியவர்!" },
        { line: 3, text: "நீர் எவ்வளவு பெரியவர்!" },
        { line: 4, text: "நீர் எவ்வளவு பெரியவர்!" }
      ],
      english: [
        { line: 1, text: "O Lord my God, when I in awesome wonder" },
        { line: 2, text: "Consider all the worlds Thy hands have made" },
        { line: 3, text: "I see the stars, I hear the rolling thunder" },
        { line: 4, text: "Thy power throughout the universe displayed" }
      ],
      transliteration: [
        { line: 1, text: "En aathtumaavae, en iratchakaraan daevanai paadu" },
        { line: 2, text: "Neer evvalavu periyavar!" },
        { line: 3, text: "Neer evvalavu periyavar!" },
        { line: 4, text: "Neer evvalavu periyavar!" }
      ]
    }
  },
  {
    id: 4,
    title: "என்னை தேடி வந்தார்",
    artist: "Tamil Christian Song",
    language: "Tamil",
    category: "Gospel",
    downloads: 156,
    lyrics: {
      tamil: [
        { line: 1, text: "என்னை தேடி வந்தார் இயேசு" },
        { line: 2, text: "என்னை காப்பாற்ற வந்தார்" },
        { line: 3, text: "என் பாவங்களை சுமந்தார்" },
        { line: 4, text: "என் இடத்தில் மரித்தார்" }
      ],
      english: [
        { line: 1, text: "Jesus came seeking me" },
        { line: 2, text: "He came to save me" },
        { line: 3, text: "He bore my sins" },
        { line: 4, text: "He died in my place" }
      ],
      transliteration: [
        { line: 1, text: "Ennai thaedi vanthaar Yesu" },
        { line: 2, text: "Ennai kaapaatrra vanthaar" },
        { line: 3, text: "En paavangalai sumandhaar" },
        { line: 4, text: "En idaththil mariththaar" }
      ]
    }
  },
  {
    id: 5,
    title: "Blessed Assurance",
    artist: "Fanny Crosby",
    language: "English",
    category: "Worship",
    downloads: 198,
    lyrics: {
      tamil: [
        { line: 1, text: "ஆசீர்வதிக்கப்பட்ட உறுதி, இயேசு என்னுடையவர்" },
        { line: 2, text: "தெய்வீக மகிமையின் முன்னறிவிப்பு" },
        { line: 3, text: "இரட்சிக்கப்பட்டவர், அவருடைய இரத்தத்தால்" },
        { line: 4, text: "அவருடைய ஆவியால் பிறந்தவர்" }
      ],
      english: [
        { line: 1, text: "Blessed assurance, Jesus is mine" },
        { line: 2, text: "O what a foretaste of glory divine" },
        { line: 3, text: "Heir of salvation, purchase of God" },
        { line: 4, text: "Born of His Spirit, washed in His blood" }
      ],
      transliteration: [
        { line: 1, text: "Aaseervadhikkappatta uruththi, Yesu ennudaiyavar" },
        { line: 2, text: "Dheiveega mahimayin munnarrivippu" },
        { line: 3, text: "Irachchikkappattavar, avarudhaiya iraththaththaal" },
        { line: 4, text: "Avarudhaiya aaviyaal pirandhavar" }
      ]
    }
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return all songs
    res.status(200).json(songs);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}