// pages/api/songs.js
import { songs } from '../../data/songs';
import { searchSongs, sortSongsByTitle, formatSongForList } from '../../utils/songHelpers';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { search, sort, limit } = req.query;
    
    let result = [...songs];
    
    // Search if query provided
    if (search) {
      result = searchSongs(result, search);
    }
    
    // Sort (default: alphabetical by English title)
    if (sort !== 'none') {
      result = sortSongsByTitle(result);
    }
    
    // Limit results if specified
    if (limit) {
      result = result.slice(0, parseInt(limit));
    }
    
    // Return formatted list
    res.status(200).json(result);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}