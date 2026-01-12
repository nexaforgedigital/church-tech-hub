// pages/api/songs/[songId].js
import { songs } from '../../../data/songs';

export default function handler(req, res) {
  const { songId } = req.query;
  
  if (req.method === 'GET') {
    // Find song by ID (slug) or by numeric ID for backwards compatibility
    let song = songs.find(s => s.id === songId);
    
    // Fallback: try numeric ID (for old URLs)
    if (!song && !isNaN(songId)) {
      const index = parseInt(songId) - 1;
      if (index >= 0 && index < songs.length) {
        song = songs[index];
      }
    }
    
    if (song) {
      res.status(200).json(song);
    } else {
      res.status(404).json({ message: 'Song not found', songId });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}