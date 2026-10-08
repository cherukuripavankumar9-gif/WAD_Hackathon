const API_BASE_URL = '/api';

// ============ USER API ============

export const getUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
};

// ============ PLAYLIST API ============

export const getUserPlaylists = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/playlists`);
  if (!response.ok) throw new Error('Failed to fetch playlists');
  return response.json();
};

export const createPlaylist = async (userId, playlistData) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playlistData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create playlist');
  }
  return response.json();
};

export const getPlaylist = async (playlistId) => {
  const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`);
  if (!response.ok) throw new Error('Failed to fetch playlist');
  return response.json();
};

export const updatePlaylist = async (playlistId, playlistData) => {
  const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playlistData),
  });
  if (!response.ok) throw new Error('Failed to update playlist');
  return response.json();
};

export const deletePlaylist = async (playlistId) => {
  const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete playlist');
  return response.json();
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ songId }),
  });
  if (!response.ok) throw new Error('Failed to add song to playlist');
  return response.json();
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs/${songId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove song from playlist');
  return response.json();
};
