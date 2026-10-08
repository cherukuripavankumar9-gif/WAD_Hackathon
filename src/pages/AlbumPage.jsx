import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, Heart, Clock, MoreHorizontal, ArrowLeft } from "lucide-react";
import { songs } from "../data/allSongs";

function AlbumPage({ playSong, currentSong, isPlaying, likedSongs, toggleLike, togglePlay }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const album = songs.find((s) => s.id === parseInt(id));

  if (!album) {
    return (
      <div className="content">
        <div className="empty-state">
          <h3>Album not found</h3>
          <button className="primary-button" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Get related songs from same artist or genre
  const relatedSongs = songs
    .filter((s) => s.id !== album.id && (s.artist === album.artist || s.genre === album.genre))
    .slice(0, 5);

  const albumSongs = songs.filter((s) => s.artist === album.artist);

  const isCurrent = currentSong.id === album.id;
  const isLiked = likedSongs.includes(album.id);

  return (
    <div className="content">
      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      {/* ALBUM HEADER */}
      <div className="album-header">
        <div className="album-cover">
          <img src={album.image} alt={album.title} />
        </div>
        <div className="album-info">
          <span className="album-type">SINGLE</span>
          <h1>{album.title}</h1>
          <div className="album-meta">
            <span className="artist-name">{album.artist}</span>
            <span className="separator">•</span>
            <span>{album.duration}</span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="album-controls">
        <button
          className="big-play-button"
          onClick={() => (isCurrent ? togglePlay() : playSong(album))}
        >
          {isCurrent && isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
        </button>
        <button
          className={isLiked ? "album-action-button liked" : "album-action-button"}
          onClick={() => toggleLike(album.id)}
        >
          <Heart size={32} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <button className="album-action-button">
          <MoreHorizontal size={32} />
        </button>
      </div>

      {/* TRACK LIST */}
      <div className="track-list">
        <div className="track-list-header">
          <span className="track-number">#</span>
          <span className="track-title">Title</span>
          <span className="track-duration">
            <Clock size={16} />
          </span>
        </div>
        {albumSongs.map((song, index) => {
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
                <span className="track-artist">{song.artist}</span>
              </div>
              <span className="track-duration">{song.duration}</span>
            </div>
          );
        })}
      </div>

      {/* RELATED */}
      {relatedSongs.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <h2>More by {album.artist}</h2>
              <p>You might also like</p>
            </div>
          </div>
          <div className="song-grid">
            {relatedSongs.map((song) => (
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
      </div>
    </div>
  );
}

export default AlbumPage;
