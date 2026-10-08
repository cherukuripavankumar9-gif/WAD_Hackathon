import { Heart, Play, Pause, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { songs } from "../data/allSongs";

function LikedSongs({ playSong, currentSong, isPlaying, likedSongs, toggleLike, togglePlay }) {
  const navigate = useNavigate();
  const likedSongObjects = songs.filter((song) => likedSongs.includes(song.id));

  return (
    <div className="content">
      {/* LIKED HEADER */}
      <div className="liked-header">
        <div className="liked-icon">
          <Heart size={60} fill="white" />
        </div>
        <div className="liked-info">
          <span className="playlist-type">PLAYLIST</span>
          <h1>Liked Songs</h1>
          <p>{likedSongObjects.length} songs</p>
        </div>
      </div>

      {likedSongObjects.length > 0 ? (
        <>
          {/* CONTROLS */}
          <div className="album-controls">
            <button
              className="big-play-button"
              onClick={() =>
                currentSong && likedSongs.includes(currentSong.id)
                  ? togglePlay()
                  : playSong(likedSongObjects[0])
              }
            >
              {isPlaying && likedSongs.includes(currentSong.id) ? (
                <Pause size={28} fill="white" />
              ) : (
                <Play size={28} fill="white" />
              )}
            </button>
          </div>

          {/* TRACK LIST */}
          <div className="track-list">
            <div className="track-list-header">
              <span className="track-number">#</span>
              <span className="track-title">Title</span>
              <span className="track-artist">Artist</span>
              <span className="track-duration">
                <Clock size={16} />
              </span>
            </div>
            {likedSongObjects.map((song, index) => {
              const isCurrentTrack = currentSong.id === song.id;
              return (
                <div
                  key={song.id}
                  className={isCurrentTrack ? "track-item active" : "track-item"}
                  onClick={() => playSong(song)}
                >
                  <span className="track-number">
                    {isCurrentTrack && isPlaying ? <Play size={14} fill="currentColor" /> : index + 1}
                  </span>
                  <div className="track-info">
                    <span className="track-name">{song.title}</span>
                  </div>
                  <span className="track-artist-col">{song.artist}</span>
                  <div className="track-actions">
                    <button
                      className="track-heart liked"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song.id);
                      }}
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                    <span className="track-duration">{song.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-state" style={{ marginTop: "80px" }}>
          <Heart size={60} />
          <h3>No liked songs yet</h3>
          <p>Songs you like will appear here</p>
          <button className="primary-button" onClick={() => navigate("/search")}>
            Find Songs
          </button>
        </div>
      )}
    </div>
  );
}

export default LikedSongs;
