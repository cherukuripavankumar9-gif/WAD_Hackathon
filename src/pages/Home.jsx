import { Play, Pause, Search, X, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { songs } from "../data/allSongs";
import { useState } from "react";

function Home({ playSong, currentSong, isPlaying, likedSongs, toggleLike }) {
  const navigate = useNavigate();
  const [homeSearch, setHomeSearch] = useState("");

  const filteredSongs = homeSearch
    ? songs.filter(
        (song) =>
          song.title.toLowerCase().includes(homeSearch.toLowerCase()) ||
          song.artist.toLowerCase().includes(homeSearch.toLowerCase())
      )
    : songs;

  return (
    <div className="content">
      {/* HERO */}
      <section className="hero-premium">
        <div className="hero-content">
          <span className="hero-label">DISCOVER YOUR SOUND</span>
          <h1 className="hero-title">
            Premium Music
            <br />
            <span className="gradient-text">Streaming</span>
          </h1>
          <p className="hero-description">
            Immerse yourself in millions of songs. High-quality audio, personalized playlists, and
            unlimited skips.
          </p>

          {/* SEARCH BAR IN HERO */}
          <div className="hero-search">
            <Search size={22} />
            <input
              type="text"
              placeholder="Search for songs, artists, or albums..."
              value={homeSearch}
              onChange={(e) => setHomeSearch(e.target.value)}
            />
            {homeSearch && (
              <button className="clear-hero-search" onClick={() => setHomeSearch("")}>
                <X size={20} />
              </button>
            )}
          </div>

          <button className="premium-button" onClick={() => playSong(songs[0])}>
            <Play size={18} fill="currentColor" />
            Start Listening
          </button>
        </div>

        <div className="hero-visual">
          <div className="floating-disc disc-1">
            <div className="disc-inner"></div>
          </div>
          <div className="floating-disc disc-2">
            <div className="disc-inner"></div>
          </div>
          <div className="floating-disc disc-3">
            <div className="disc-inner"></div>
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS */}
      {homeSearch && (
        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Search Results</h2>
              <p>{filteredSongs.length} songs found</p>
            </div>
          </div>
          {filteredSongs.length > 0 ? (
            <div className="song-grid">
              {filteredSongs.slice(0, 10).map((song) => (
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
              <Search size={40} />
              <h3>No results found</h3>
              <p>Try searching for something else</p>
            </div>
          )}
        </section>
      )}

      {/* TRENDING */}
      {!homeSearch && (
        <>
          <section className="section">
            <div className="section-heading">
              <div>
                <h2>Trending Now</h2>
                <p>Most popular tracks today</p>
              </div>
              <button className="show-all" onClick={() => navigate("/search")}>
                Show all
              </button>
            </div>
            <div className="song-grid">
              {songs.slice(0, 5).map((song) => (
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
          </section>

          <section className="section">
            <div className="section-heading">
              <div>
                <h2>Made For You</h2>
                <p>Handpicked recommendations</p>
              </div>
              <button className="show-all" onClick={() => navigate("/search")}>
                Show all
              </button>
            </div>
            <div className="song-grid">
              {songs.slice(3, 8).map((song) => (
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
          </section>

          <section className="section">
            <div className="section-heading">
              <div>
                <h2>New Releases</h2>
                <p>Fresh tracks for you</p>
              </div>
            </div>
            <div className="song-grid">
              {songs.slice(5, 10).map((song) => (
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
          </section>
        </>
      )}
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

export default Home;
