// Song Storage Utility
export const songStorage = {
  // Get all custom songs
  getCustomSongs: () => {
    if (typeof window === 'undefined') return [];
    const songs = localStorage.getItem('customSongs');
    return songs ? JSON.parse(songs) : [];
  },

  // Add a new custom song
  addSong: (song) => {
    const songs = songStorage.getCustomSongs();
    const newSong = {
      id: `custom-${Date.now()}`,
      ...song,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    songs.push(newSong);
    localStorage.setItem('customSongs', JSON.stringify(songs));
    return newSong;
  },

  // Update existing song
  updateSong: (id, updatedSong) => {
    const songs = songStorage.getCustomSongs();
    const index = songs.findIndex(s => s.id === id);
    if (index !== -1) {
      songs[index] = { ...songs[index], ...updatedSong };
      localStorage.setItem('customSongs', JSON.stringify(songs));
      return songs[index];
    }
    return null;
  },

  // Delete a song
  deleteSong: (id) => {
    const songs = songStorage.getCustomSongs();
    const filtered = songs.filter(s => s.id !== id);
    localStorage.setItem('customSongs', JSON.stringify(filtered));
    return filtered;
  },

  // Export all songs as JSON
  exportSongs: () => {
    const songs = songStorage.getCustomSongs();
    const dataStr = JSON.stringify(songs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `churchassist-songs-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  // Import songs from JSON
  importSongs: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          const existing = songStorage.getCustomSongs();
          const merged = [...existing, ...imported];
          localStorage.setItem('customSongs', JSON.stringify(merged));
          resolve(merged);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};