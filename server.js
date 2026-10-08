import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database file path
const DB_FILE = './database.json';

// Initialize database
let database = {
  users: [
    {
      id: 'user-001',
      username: 'Listener',
      email: 'listener@tuneflow.com',
      avatar: 'K',
      accountType: 'Free',
      createdAt: new Date().toISOString(),
    }
  ],
  playlists: [],
  userPlaylists: {}, // userId -> [playlistIds]
};

// Load database from file
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      database = JSON.parse(data);
      console.log('✅ Database loaded from file');
    } else {
      saveDatabase();
      console.log('✅ New database created');
    }
  } catch (error) {
    console.error('❌ Error loading database:', error);
  }
}

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), 'utf8');
    console.log('💾 Database saved');
  } catch (error) {
    console.error('❌ Error saving database:', error);
  }
}

// Load database on startup
loadDatabase();

// ============ USER ENDPOINTS ============

// Get user profile
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = database.users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Update user profile
app.put('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { username, email, avatar } = req.body;
  
  const userIndex = database.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  database.users[userIndex] = {
    ...database.users[userIndex],
    username: username || database.users[userIndex].username,
    email: email || database.users[userIndex].email,
    avatar: avatar || database.users[userIndex].avatar,
  };
  
  // Save to file
  saveDatabase();
  
  res.json(database.users[userIndex]);
});

// ============ PLAYLIST ENDPOINTS ============

// Get all playlists for a user
app.get('/api/users/:userId/playlists', (req, res) => {
  const { userId } = req.params;
  const playlistIds = database.userPlaylists[userId] || [];
  const playlists = database.playlists.filter(p => playlistIds.includes(p.id));
  
  res.json({ playlists });
});

// Create new playlist
app.post('/api/users/:userId/playlists', (req, res) => {
  const { userId } = req.params;
  const { name, description, id } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }
  
  const newPlaylist = {
    id: id || uuidv4(),
    name,
    description: description || '',
    songs: [],
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  database.playlists.push(newPlaylist);
  
  if (!database.userPlaylists[userId]) {
    database.userPlaylists[userId] = [];
  }
  database.userPlaylists[userId].push(newPlaylist.id);
  
  // Save to file
  saveDatabase();
  
  res.status(201).json(newPlaylist);
});

// Get specific playlist
app.get('/api/playlists/:playlistId', (req, res) => {
  const { playlistId } = req.params;
  const playlist = database.playlists.find(p => p.id === playlistId);
  
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }
  
  res.json(playlist);
});

// Update playlist
app.put('/api/playlists/:playlistId', (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  
  const playlistIndex = database.playlists.findIndex(p => p.id === playlistId);
  
  if (playlistIndex === -1) {
    return res.status(404).json({ error: 'Playlist not found' });
  }
  
  database.playlists[playlistIndex] = {
    ...database.playlists[playlistIndex],
    name: name || database.playlists[playlistIndex].name,
    description: description !== undefined ? description : database.playlists[playlistIndex].description,
    updatedAt: new Date().toISOString(),
  };
  
  // Save to file
  saveDatabase();
  
  res.json(database.playlists[playlistIndex]);
});

// Delete playlist
app.delete('/api/playlists/:playlistId', (req, res) => {
  const { playlistId } = req.params;
  
  const playlistIndex = database.playlists.findIndex(p => p.id === playlistId);
  
  if (playlistIndex === -1) {
    return res.status(404).json({ error: 'Playlist not found' });
  }
  
  const playlist = database.playlists[playlistIndex];
  database.playlists.splice(playlistIndex, 1);
  
  // Remove from user's playlists
  Object.keys(database.userPlaylists).forEach(userId => {
    database.userPlaylists[userId] = database.userPlaylists[userId].filter(id => id !== playlistId);
  });
  
  // Save to file
  saveDatabase();
  
  res.json({ message: 'Playlist deleted', playlist });
});

// Add song to playlist
app.post('/api/playlists/:playlistId/songs', (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;
  
  const playlist = database.playlists.find(p => p.id === playlistId);
  
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }
  
  if (playlist.songs.includes(songId)) {
    return res.status(400).json({ error: 'Song already in playlist' });
  }
  
  playlist.songs.push(songId);
  playlist.updatedAt = new Date().toISOString();
  
  // Save to file
  saveDatabase();
  
  res.json(playlist);
});

// Remove song from playlist
app.delete('/api/playlists/:playlistId/songs/:songId', (req, res) => {
  const { playlistId, songId } = req.params;
  
  const playlist = database.playlists.find(p => p.id === playlistId);
  
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found' });
  }
  
  playlist.songs = playlist.songs.filter(id => id !== parseInt(songId));
  playlist.updatedAt = new Date().toISOString();
  
  // Save to file
  saveDatabase();
  
  res.json(playlist);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'TuneFlow Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 TuneFlow Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
