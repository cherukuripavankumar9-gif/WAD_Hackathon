import { useState } from "react";
import { Search as SearchIcon, Play, Pause, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { songs } from "../data/allSongs";

function SearchPage({ playSong, currentSong, isPlaying, likedSongs, toggleLike }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = activeCategory === "All" || song.genre === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="content">
      {/* SEARCH HERO */}
      <div className="search-hero">
        <h1>Search</h1>
        <div className="big-search-box">
          <SearchIcon size={24} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What do you want to listen to?"
            autoFocus
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="categories">
        {["All", "Pop", "Hip Hop", "Chill", "Focus", "Rock", "Jazz"].map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "category active" : "category"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* RESULTS */}
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>{search ? "Search Results" : "Browse All"}</h2>
            <p>{filteredSongs.length} songs found</p>
          </div>
        </div>

        {filteredSongs.length > 0 ? (
          <div className="song-grid">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                currentSong={currentSong}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                playSong={playSong}
                toggleLike={toggleLike}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <SearchIcon size={40} />
            <h3>No results found</h3>
            <p>Try searching for something else</p>
          </div>
        )}
      </section>
    </div>
  );
}

function SongCard({ song, currentSong, isPlaying, likedSongs, playSong, toggleLike }) {
  const isCurrent = currentSong?.id === song.id;
  const isCurrentPlaying = isCurrent && isPlaying;

  return (
    <div
      className={isCurrentPlaying ? "song-card playing" : "song-card"}
      onClick={() => playSong(song)}
    >
      <div className="cover-container">
        <img src={song.image} alt={song.title} draggable="false" />
        <button
          className="card-play"
          onClick={(e) => {
            e.stopPropagation();
            playSong(song);
          }}
          type="button"
        >
          {isCurrentPlaying ? (
            <Pause size={19} fill="currentColor" />
          ) : (
            <Play size={19} fill="currentColor" />
          )}
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
          type="button"
        >
          <Heart size={17} fill={likedSongs.includes(song.id) ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}

export default SearchPage;
