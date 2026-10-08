import { useEffect, useRef, useState } from "react";
import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  Bell,
  User,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Music2,
  MoreHorizontal,
} from "lucide-react";
import "./App.css";

const songs = [
  {
    id: 1,
    title: "Midnight Drive",
    artist: "Nova",
    genre: "Chill",
    image: "https://picsum.photos/500/500?random=11",
    audio: "/songs/song1.mp3",
    duration: "3:42",
  },
  {
    id: 2,
    title: "Golden Hour",
    artist: "Luna",
    genre: "Pop",
    image: "https://picsum.photos/500/500?random=12",
    audio: "/songs/song2.mp3",
    duration: "4:05",
  },
  {
    id: 3,
    title: "Lost in Dreams",
    artist: "Aeris",
    genre: "Focus",
    image: "https://picsum.photos/500/500?random=13",
    audio: "/songs/song3.mp3",
    duration: "3:28",
  },
  {
    id: 4,
    title: "Ocean Eyes",
    artist: "Kai",
    genre: "Chill",
    image: "https://picsum.photos/500/500?random=14",
    audio: "/songs/song1.mp3",
    duration: "3:51",
  },
  {
    id: 5,
    title: "Afterglow",
    artist: "Mira",
    genre: "Pop",
    image: "https://picsum.photos/500/500?random=15",
    audio: "/songs/song2.mp3",
    duration: "4:12",
  },
  {
    id: 6,
    title: "Electric Nights",
    artist: "Zayn",
    genre: "Hip Hop",
    image: "https://picsum.photos/500/500?random=16",
    audio: "/songs/song3.mp3",
    duration: "3:35",
  },
  {
    id: 7,
    title: "Stay With Me",
    artist: "Aria",
    genre: "Pop",
    image: "https://picsum.photos/500/500?random=17",
    audio: "/songs/song1.mp3",
    duration: "4:20",
  },
  {
    id: 8,
    title: "Nightfall",
    artist: "Echo",
    genre: "Focus",
    image: "https://picsum.photos/500/500?random=18",
    audio: "/songs/song2.mp3",
    duration: "3:47",
  },
];

function App() {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem("tuneflow-liked");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentSongs, setRecentSongs] = useState([]);

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "tuneflow-liked",
      JSON.stringify(likedSongs)
    );
  }, [likedSongs]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);

    setRecentSongs((prev) => {
      const withoutCurrent = prev.filter(
        (item) => item.id !== song.id
      );

      return [song, ...withoutCurrent].slice(0, 5);
    });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleLike = (id) => {
    setLikedSongs((prev) =>
      prev.includes(id)
        ? prev.filter((songId) => songId !== id)
        : [...prev, id]
    );
  };

  const nextSong = () => {
    if (shuffle) {
      const randomIndex = Math.floor(
        Math.random() * songs.length
      );

      playSong(songs[randomIndex]);
      return;
    }

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex =
      currentIndex === songs.length - 1
        ? 0
        : currentIndex + 1;

    playSong(songs[nextIndex]);
  };

  const previousSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const previousIndex =
      currentIndex === 0
        ? songs.length - 1
        : currentIndex - 1;

    playSong(songs[previousIndex]);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 0;

    setProgress(
      duration ? (current / duration) * 100 : 0
    );
  };

  const changeProgress = (event) => {
    if (!audioRef.current) return;

    const value = Number(event.target.value);

    audioRef.current.currentTime =
      (value / 100) * audioRef.current.duration;

    setProgress(value);
  };

  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    nextSong();
  };

  const formatTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${secs}`;
  };

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      song.artist
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      song.genre === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const likedSongObjects = songs.filter((song) =>
    likedSongs.includes(song.id)
  );

  return (
    <div className="app">

      <audio
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <Music2 size={23} />
          </div>

          <span>TuneFlow</span>
        </div>

        <div className="menu-title">
          MENU
        </div>

        <nav>

          <button className="nav-item active">
            <Home size={20} />
            <span>Home</span>
          </button>

          <button className="nav-item">
            <Search size={20} />
            <span>Search</span>
          </button>

          <button className="nav-item">
            <Library size={20} />
            <span>Your Library</span>
          </button>

        </nav>

        <div className="menu-title playlist-title">
          YOUR MUSIC
        </div>

        <nav>

          <button className="nav-item">
            <Plus size={20} />
            <span>Create Playlist</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              setActiveCategory("Liked")
            }
          >
            <Heart size={20} />
            <span>Liked Songs</span>
          </button>

        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="profile-circle">
              K
            </div>

            <div>
              <strong>Listener</strong>
              <small>Free Account</small>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN */}

      <main className="main">

        {/* HEADER */}

        <header className="header">

          <div className="search-container">

            <Search size={19} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search songs, artists..."
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

          <div className="header-right">

            <button className="icon-button">
              <Bell size={20} />
            </button>

            <div className="profile">
              <div className="profile-circle">
                K
              </div>

              <span>Listener</span>
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="content">

          {/* HERO */}

          <section className="hero">

            <div className="hero-content">

              <span className="hero-label">
                YOUR DAILY MUSIC
              </span>

              <h1>
                Your Music.
                <br />
                Your Mood.
                <br />
                Your Moment.
              </h1>

              <p>
                Discover new sounds, revisit your
                favorites, and enjoy every moment.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  playSong(songs[0])
                }
              >
                <Play
                  size={18}
                  fill="currentColor"
                />
                Start Listening
              </button>

            </div>

            <div className="hero-art">

              <div className="vinyl">
                <div className="vinyl-center">
                  <Music2 size={30} />
                </div>
              </div>

            </div>

          </section>

          {/* CATEGORIES */}

          <div className="categories">

            {[
              "All",
              "Pop",
              "Hip Hop",
              "Chill",
              "Focus",
            ].map((category) => (

              <button
                key={category}
                className={
                  activeCategory === category
                    ? "category active"
                    : "category"
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>

            ))}

          </div>

          {/* SEARCH RESULTS */}

          {search && (
            <section className="section">

              <div className="section-heading">
                <div>
                  <h2>Search Results</h2>
                  <p>
                    {filteredSongs.length} results found
                  </p>
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
                  <Search size={40} />
                  <h3>No songs found</h3>
                  <p>
                    Try another song or artist.
                  </p>
                </div>
              )}

            </section>
          )}

          {/* TRENDING */}

          {!search && (
            <>

              <section className="section">

                <div className="section-heading">

                  <div>
                    <h2>Trending Now</h2>
                    <p>
                      Popular with listeners today
                    </p>
                  </div>

                  <button className="show-all">
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

              {/* MADE FOR YOU */}

              <section className="section">

                <div className="section-heading">

                  <div>
                    <h2>Made For You</h2>
                    <p>
                      Handpicked for your taste
                    </p>
                  </div>

                  <button className="show-all">
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

              {/* RECENT */}

              {recentSongs.length > 0 && (
                <section className="section">

                  <div className="section-heading">

                    <div>
                      <h2>Recently Played</h2>
                      <p>
                        Continue listening
                      </p>
                    </div>

                  </div>

                  <div className="recent-list">

                    {recentSongs.map((song) => (

                      <button
                        className="recent-item"
                        key={song.id}
                        onClick={() =>
                          playSong(song)
                        }
                      >

                        <img
                          src={song.image}
                          alt={song.title}
                        />

                        <div>
                          <strong>
                            {song.title}
                          </strong>

                          <span>
                            {song.artist}
                          </span>
                        </div>

                        <Play size={18} />

                      </button>

                    ))}

                  </div>

                </section>
              )}

              {/* LIKED */}

              {likedSongObjects.length > 0 && (
                <section className="section">

                  <div className="section-heading">

                    <div>
                      <h2>Your Favorites</h2>
                      <p>
                        Songs you love
                      </p>
                    </div>

                  </div>

                  <div className="song-grid">

                    {likedSongObjects.map((song) => (
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
              )}

            </>
          )}

        </div>

      </main>

      {/* PLAYER */}

      <footer className="player">

        <div className="now-playing">

          <img
            src={currentSong.image}
            alt={currentSong.title}
          />

          <div className="now-info">
            <strong>{currentSong.title}</strong>
            <span>{currentSong.artist}</span>
          </div>

          <button
            className={
              likedSongs.includes(currentSong.id)
                ? "heart liked"
                : "heart"
            }
            onClick={() =>
              toggleLike(currentSong.id)
            }
          >
            <Heart
              size={18}
              fill={
                likedSongs.includes(currentSong.id)
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

        </div>

        <div className="player-center">

          <div className="player-buttons">

            <button
              className={
                shuffle
                  ? "player-button active"
                  : "player-button"
              }
              onClick={() =>
                setShuffle(!shuffle)
              }
            >
              <Shuffle size={17} />
            </button>

            <button
              className="player-button"
              onClick={previousSong}
            >
              <SkipBack size={20} />
            </button>

            <button
              className="play-button"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause
                  size={21}
                  fill="currentColor"
                />
              ) : (
                <Play
                  size={21}
                  fill="currentColor"
                />
              )}
            </button>

            <button
              className="player-button"
              onClick={nextSong}
            >
              <SkipForward size={20} />
            </button>

            <button
              className={
                repeat
                  ? "player-button active"
                  : "player-button"
              }
              onClick={() =>
                setRepeat(!repeat)
              }
            >
              <Repeat size={17} />
            </button>

          </div>

          <div className="progress-container">

            <span>
              {audioRef.current
                ? formatTime(
                    audioRef.current.currentTime
                  )
                : "0:00"}
            </span>

            <input
              className="progress-bar"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={changeProgress}
            />

            <span>
              {currentSong.duration}
            </span>

          </div>

        </div>

        <div className="volume-container">

          <Volume2 size={19} />

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) =>
              setVolume(Number(e.target.value))
            }
          />

          <MoreHorizontal size={19} />

        </div>

      </footer>

    </div>
  );
}

function SongCard({
  song,
  currentSong,
  isPlaying,
  likedSongs,
  playSong,
  toggleLike,
}) {
  const isCurrent = currentSong.id === song.id;

  return (
    <div
      className={
        isCurrent && isPlaying
          ? "song-card playing"
          : "song-card"
      }
    >

      <div className="cover-container">

        <img
          src={song.image}
          alt={song.title}
        />

        <button
          className="card-play"
          onClick={() => playSong(song)}
        >
          {isCurrent && isPlaying ? (
            <Pause
              size={19}
              fill="currentColor"
            />
          ) : (
            <Play
              size={19}
              fill="currentColor"
            />
          )}
        </button>

      </div>

      <div className="song-card-info">

        <div>
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>

        <button
          className={
            likedSongs.includes(song.id)
              ? "card-heart liked"
              : "card-heart"
          }
          onClick={() =>
            toggleLike(song.id)
          }
        >
          <Heart
            size={17}
            fill={
              likedSongs.includes(song.id)
                ? "currentColor"
                : "none"
            }
          />
        </button>

      </div>

    </div>
  );
}

export default App;