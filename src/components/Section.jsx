import SongCard from "./SongCard";

function Section({ title, songs }) {
  return (
    <section className="music-section">

      <div className="section-header">
        <h2>{title}</h2>
        <button>Show all</button>
      </div>

      <div className="song-grid">

        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
          />
        ))}

      </div>

    </section>
  );
}

export default Section;