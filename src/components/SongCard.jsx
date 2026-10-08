import { Play } from "lucide-react";

function SongCard({ song }) {
  return (
    <div className="song-card">

      <div className="image-container">

        <img
          src={song.image}
          alt={song.title}
        />

        <button className="play-button">
          <Play size={20} fill="white" />
        </button>

      </div>

      <h3>{song.title}</h3>

      <p>{song.artist}</p>

    </div>
  );
}

export default SongCard;
