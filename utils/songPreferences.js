const FAVORITES_KEY = 'churchassist-favorites';
const RECENT_KEY = 'churchassist-recent';
const MAX_RECENT = 20;

export const songPreferences = {
  // Favorites
  getFavorites: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  },

  addFavorite: (songId) => {
    const favorites = songPreferences.getFavorites();
    if (!favorites.includes(songId)) {
      favorites.unshift(songId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    return favorites;
  },

  removeFavorite: (songId) => {
    let favorites = songPreferences.getFavorites();
    favorites = favorites.filter(id => id !== songId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  },

  isFavorite: (songId) => {
    const favorites = songPreferences.getFavorites();
    return favorites.includes(songId);
  },

  // Recently Used
  getRecent: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  },

  addRecent: (song) => {
    let recent = songPreferences.getRecent();
    // Remove if already exists
    recent = recent.filter(s => s.id !== song.id);
    // Add to front
    recent.unshift({
      id: song.id,
      title: song.title,
      artist: song.artist,
      timestamp: Date.now()
    });
    // Keep only MAX_RECENT
    recent = recent.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    return recent;
  },

  clearRecent: () => {
    localStorage.setItem(RECENT_KEY, JSON.stringify([]));
    return [];
  }
};