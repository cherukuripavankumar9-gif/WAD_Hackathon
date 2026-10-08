import { Play, Pause, Heart, Clock, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { songs } from "../data/allSongs";

function Library({ playSong, currentSong, isPlaying, likedSongs, toggleLike, recentSongs }) {
  const navigate = useNavigate();
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
          <div className="playlist-card create-playlist">
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
        </div>
      </section>

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
