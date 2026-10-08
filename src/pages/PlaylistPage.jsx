import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, Heart, Plus, Trash2, Music, Clock, ArrowLeft } from "lucide-react";
import { songs as allSongs } from "../data/allSongs";

function PlaylistPage({ playSong, currentSong, isPlaying, likedSongs, toggleLike }) {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  const loadPlaylist = () => {
    const playlists = JSON.parse(localStorage.getItem("tuneflow-playlists") || "[]");
    const found = playlists.find((p) => p.id === playlistId);
    setPlaylist(found);
  };

  const addSongToPlaylist = (songId) => {
    if (!playlist) return;

    if (playlist.songs.includes(songId)) {
      alert("Song already in playlist!");
      return;
    }

    const updatedPlaylist = {
      ...playlist,
      songs: [...playlist.songs, songId],
    };

    savePlaylist(updatedPlaylist);
    setShowAddSongModal(false);
    setSearchQuery("");
  };

  const removeSongFromPlaylist = (songId) => {
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      songs: playlist.songs.filter((id) => id !== songId),
    };

    savePlaylist(updatedPlaylist);
  };

  const savePlaylist = (updatedPlaylist) => {
    const playlists = JSON.parse(localStorage.getItem("tuneflow-playlists") || "[]");
    const index = playlists.findIndex((p) => p.id === playlistId);
    if (index !== -1) {
      playlists[index] = updatedPlaylist;
      localStorage.setItem("tuneflow-playlists", JSON.stringify(playlists));
      setPlaylist(updatedPlaylist);
    }
  };

  const playAllSongs = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0]);
    }
  };

  if (!playlist) {
    return (
      <div className="content">
        <div className="empty-state" style={{ marginTop: "100px" }}>
          <Music size={60} />
          <h3>Playlist not found</h3>
          <button className="primary-button" onClick={() => navigate("/library")}>
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const playlistSongs = allSongs.filter((song) => playlist.songs.includes(song.id));
  const availableSongs = allSongs.filter((song) => !playlist.songs.includes(song.id));
  const filteredSongs = availableSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDuration = playlistSongs.reduce((acc, song) => acc + (song.duration || 180), 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="content">
      {/* Playlist Header */}
      <div className="playlist-header">
        <button className="back-button" onClick={() => navigate("/library")}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="playlist-hero">
          <div className="playlist-cover">
            <Music size={60} />
          </div>
          <div className="playlist-info">
            <span className="playlist-type">PLAYLIST</span>
            <h1>{playlist.name}</h1>
            <p>{playlist.description}</p>
            <div className="playlist-meta">
              <span>{playlistSongs.length} songs</span>
              {totalDuration > 0 && (
                <>
                  <span>•</span>
                  <span>
                    {hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="playlist-actions">
          <button
            className="primary-button"
            onClick={playAllSongs}
            disabled={playlistSongs.length === 0}
          >
            <Play size={20} fill="currentColor" />
            Play All
          </button>
          <button className="secondary-button" onClick={() => setShowAddSongModal(true)}>
            <Plus size={20} />
            Add Songs
          </button>
        </div>
      </div>

      {/* Playlist Songs */}
      {playlistSongs.length > 0 ? (
        <div className="playlist-songs">
          <div className="songs-table-header">
            <div className="col-number">#</div>
            <div className="col-title">TITLE</div>
            <div className="col-album">ALBUM</div>
            <div className="col-time">
              <Clock size={16} />
            </div>
            <div className="col-actions"></div>
          </div>
          {playlistSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              currentSong={currentSong}
              isPlaying={isPlaying}
              likedSongs={likedSongs}
              playSong={playSong}
              toggleLike={toggleLike}
              onRemove={removeSongFromPlaylist}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: "60px" }}>
          <Music size={60} />
          <h3>No songs in this playlist</h3>
          <p>Add songs to get started</p>
          <button className="primary-button" onClick={() => setShowAddSongModal(true)}>
            <Plus size={20} />
            Add Songs
          </button>
        </div>
      )}

      {/* Add Songs Modal */}
      {showAddSongModal && (
        <div className="modal-overlay" onClick={() => setShowAddSongModal(false)}>
          <div className="modal-content add-songs-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Songs to {playlist.name}</h2>
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="song-list-modal">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <div key={song.id} className="song-item-modal">
                    <img src={song.image} alt={song.title} />
                    <div className="song-item-info">
                      <strong>{song.title}</strong>
                      <span>{song.artist}</span>
                    </div>
                    <button
                      className="add-button"
                      onClick={() => addSongToPlaylist(song.id)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-search">
                  <Music size={40} />
                  <p>
                    {searchQuery
                      ? "No songs found"
                      : "All songs are already in this playlist!"}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowAddSongModal(false);
                  setSearchQuery("");
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SongRow({ song, index, currentSong, isPlaying, likedSongs, playSong, toggleLike, onRemove }) {
  const isCurrent = currentSong.id === song.id;
  const isLiked = likedSongs.includes(song.id);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`song-row ${isCurrent && isPlaying ? "playing" : ""}`}
      onClick={() => playSong(song)}
    >
      <div className="col-number">
        {isCurrent && isPlaying ? (
          <div className="playing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
      <div className="col-title">
        <img src={song.image} alt={song.title} />
        <div>
          <strong>{song.title}</strong>
          <span>{song.artist}</span>
        </div>
      </div>
      <div className="col-album">{song.album || "Single"}</div>
      <div className="col-time">{formatDuration(song.duration || 180)}</div>
      <div className="col-actions">
        <button
          className={isLiked ? "icon-button liked" : "icon-button"}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(song.id);
          }}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <button
          className="icon-button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(song.id);
          }}
          title="Remove from playlist"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default PlaylistPage;
