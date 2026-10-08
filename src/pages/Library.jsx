import { Play, Pause, Heart, Clock, Music, Plus, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { songs } from "../data/allSongs";
import { getUserPlaylists, createPlaylist, deletePlaylist } from "../services/api";

function Library({ playSong, currentSong, isPlaying, likedSongs, toggleLike, recentSongs }) {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const userId = "user-001"; // Default user ID

  // Load playlists from localStorage and API
  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    // Try loading from localStorage first
    const localPlaylists = localStorage.getItem("tuneflow-playlists");
    if (localPlaylists) {
      setPlaylists(JSON.parse(localPlaylists));
    }

    // Also try to sync with backend
    try {
      const apiPlaylists = await getUserPlaylists(userId);
      setPlaylists(apiPlaylists.playlists || []);
      localStorage.setItem("tuneflow-playlists", JSON.stringify(apiPlaylists.playlists || []));
    } catch (error) {
      console.log("Using localStorage for playlists");
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName,
      description: newPlaylistDesc || "Custom playlist",
      songs: [],
      createdAt: new Date().toISOString(),
    };

    try {
      // Try to save to backend
      await createPlaylist(userId, newPlaylist);
    } catch (error) {
      console.log("Saving to localStorage only");
    }

    // Always save to localStorage
    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem("tuneflow-playlists", JSON.stringify(updatedPlaylists));

    setNewPlaylistName("");
    setNewPlaylistDesc("");
    setShowCreateModal(false);
  };

  const handleDeletePlaylist = async (playlistId, e) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await deletePlaylist(playlistId);
    } catch (error) {
      console.log("Deleting from localStorage only");
    }

    const updatedPlaylists = playlists.filter((p) => p.id !== playlistId);
    setPlaylists(updatedPlaylists);
    localStorage.setItem("tuneflow-playlists", JSON.stringify(updatedPlaylists));
  };
  const likedSongObjects = songs.filter((song) => likedSongs.includes(song.id));

  return (
    <div className="content">
      <div className="library-header">
        <h1>Your Library</h1>
        <p>Your personal collection of music</p>
      </div>

      {/* LIKED SONGS */}
      {likedSongObjects.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <h2>
                <Heart size={24} style={{ verticalAlign: "middle", marginRight: "8px" }} />
                Liked Songs
              </h2>
              <p>{likedSongObjects.length} songs</p>
            </div>
            <button className="show-all" onClick={() => navigate("/liked")}>
              View All
            </button>
          </div>
          <div className="song-grid">
            {likedSongObjects.slice(0, 5).map((song) => (
              <SongCard
                key={song.id}
                song={song}
                currentSong={currentSong}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                playSong={playSong}
                toggleLike={toggleLike}
                onClick={() => navigate(`/album/${song.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* RECENT */}
      {recentSongs.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <h2>
                <Clock size={24} style={{ verticalAlign: "middle", marginRight: "8px" }} />
                Recently Played
              </h2>
              <p>Your listening history</p>
            </div>
          </div>
          <div className="recent-list">
            {recentSongs.map((song) => (
              <button className="recent-item" key={song.id} onClick={() => playSong(song)}>
                <img src={song.image} alt={song.title} />
                <div>
                  <strong>{song.title}</strong>
                  <span>{song.artist}</span>
                </div>
                <Play size={18} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* PLAYLISTS */}
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>
              <Music size={24} style={{ verticalAlign: "middle", marginRight: "8px" }} />
              Your Playlists
            </h2>
            <p>Create and manage your playlists</p>
          </div>
        </div>
        <div className="playlist-grid">
          <div className="playlist-card create-playlist" onClick={() => setShowCreateModal(true)}>
            <div className="playlist-plus">+</div>
            <h3>Create Playlist</h3>
          </div>
          <div className="playlist-card" onClick={() => navigate("/liked")}>
            <div className="playlist-icon liked">
              <Heart size={30} fill="white" />
            </div>
            <h3>Liked Songs</h3>
            <p>{likedSongObjects.length} songs</p>
          </div>
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="playlist-card"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              <div className="playlist-icon">
                <Music size={30} />
              </div>
              <h3>{playlist.name}</h3>
              <p>{playlist.songs?.length || 0} songs</p>
              <button
                className="playlist-delete"
                onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                title="Delete playlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CREATE PLAYLIST MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Playlist</h2>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              rows="3"
            />
            <div className="modal-buttons">
              <button className="secondary-button" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="primary-button"
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {likedSongObjects.length === 0 && recentSongs.length === 0 && (
        <div className="empty-state" style={{ marginTop: "60px" }}>
          <Music size={60} />
          <h3>Your library is empty</h3>
          <p>Start exploring music and build your collection</p>
          <button className="primary-button" onClick={() => navigate("/search")}>
            Browse Music
          </button>
        </div>
      )}
    </div>
  );
}

function SongCard({ song, currentSong, isPlaying, likedSongs, playSong, toggleLike, onClick }) {
  const isCurrent = currentSong.id === song.id;

  const handleCardClick = () => {
    playSong(song);
  };

  return (
    <div
      className={isCurrent && isPlaying ? "song-card playing" : "song-card"}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="cover-container">
        <img src={song.image} alt={song.title} draggable="false" />
        <button
          className="card-play"
          onClick={(e) => {
            e.stopPropagation();
            playSong(song);
          }}
        >
          <Play size={19} fill="currentColor" />
        </button>
      </div>
      <div className="song-card-info">
        <div>
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
        <button
          className={likedSongs.includes(song.id) ? "card-heart liked" : "card-heart"}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song.id);
          }}
        >
          <Heart size={17} fill={likedSongs.includes(song.id) ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}

export default Library;
