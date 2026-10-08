import SongCard from "./SongCard";

function Section({
  title,
  songs,
  onPlay,
  likedSongs,
  onLike,
}) {
  return (
    <section className="music-section">

      <div className="section-header">
        <h2>{title}</h2>

        <button>
          Show all
        </button>
      </div>

      <div className="song-grid">

        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onPlay={onPlay}
            isLiked={likedSongs.includes(song.id)}
            onLike={onLike}
          />
        ))}

      </div>

    </section>
  );
}

export default Section;