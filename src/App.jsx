import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Library as LibraryIcon,
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
  VolumeX,
  Music2,
  MoreHorizontal,
} from "lucide-react";
import "./App.css";

// Pages
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Library from "./pages/Library";
import AlbumPage from "./pages/AlbumPage";
import LikedSongs from "./pages/LikedSongs";
import ProfilePage from "./pages/ProfilePage";

// Data
import { songs } from "./data/allSongs";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem("tuneflow-liked");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentSongs, setRecentSongs] = useState([]);

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

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

    const audio = audioRef.current;
    
    const handleCanPlay = () => console.log("✅ Audio can play");
    const handleLoadStart = () => console.log("⏳ Loading audio...");
    const handleLoadedData = () => console.log("📦 Audio data loaded");
    const handleError = (e) => console.error("❌ Audio error:", e);
    const handlePlay = () => console.log("▶️ Audio started playing");
    const handlePause = () => console.log("⏸️ Audio paused");

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;

    const playAudio = async () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load(); // Force reload the audio

      if (isPlaying) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Audio play failed:", error);
          setIsPlaying(false);
        }
      }
    };

    playAudio();
  }, [currentSong, isPlaying]);

  const playSong = (song) => {
    console.log("🎵 Playing:", song.title, "Audio URL:", song.audio);
    setCurrentSong(song);
    setIsPlaying(true);

    setRecentSongs((prev) => {
      const withoutCurrent = prev.filter(
        (item) => item.id !== song.id
      );

      return [song, ...withoutCurrent].slice(0, 5);
    });

    // Ensure audio actually plays after a small delay
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Playback error:", err);
          alert("Audio playback failed. Please check your internet connection or try another song.");
        });
      }
    }, 100);
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
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
    const matchesCategory = activeCategory === "All" || song.genre === activeCategory;
    return matchesCategory;
  });

  return (
    <div className="app">
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* SIDEBAR */}
      <aside className="sidebar">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <Music2 size={23} />
          </div>
          <span>TuneFlow</span>
        </Link>

        <div className="menu-title">MENU</div>

        <nav>
          <Link
            to="/"
            className={location.pathname === "/" ? "nav-item active" : "nav-item"}
          >
            <HomeIcon size={20} />
            <span>Home</span>
          </Link>

          <Link
            to="/search"
            className={location.pathname === "/search" ? "nav-item active" : "nav-item"}
          >
            <SearchIcon size={20} />
            <span>Search</span>
          </Link>

          <Link
            to="/library"
            className={location.pathname === "/library" ? "nav-item active" : "nav-item"}
          >
            <LibraryIcon size={20} />
            <span>Your Library</span>
          </Link>
        </nav>

        <div className="menu-title playlist-title">YOUR MUSIC</div>

        <nav>
          <button className="nav-item" onClick={() => alert("Create Playlist feature coming soon!")}>
            <Plus size={20} />
            <span>Create Playlist</span>
          </button>

          <Link to="/liked" className={location.pathname === "/liked" ? "nav-item active" : "nav-item"}>
            <Heart size={20} />
            <span>Liked Songs</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-profile">
            <div className="profile-circle">K</div>
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
          <div className="header-left">
            <div className="page-title">
              {location.pathname === "/" && "Home"}
              {location.pathname === "/search" && "Search"}
              {location.pathname === "/library" && "Your Library"}
              {location.pathname === "/liked" && "Liked Songs"}
              {location.pathname === "/profile" && "Profile"}
              {location.pathname.startsWith("/album") && "Album"}
            </div>
          </div>

          <div className="header-right">
            <button className="icon-button" onClick={() => alert("Notifications coming soon!")}>
              <Bell size={20} />
            </button>

            <Link to="/profile" className="profile">
              <div className="profile-circle">K</div>
              <span>Listener</span>
            </Link>
          </div>
        </header>

        {/* ROUTES */}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                playSong={playSong}
                currentSong={currentSong}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                toggleLike={toggleLike}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchPage
                playSong={playSong}
                currentSong={currentSong}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                toggleLike={toggleLike}
              />
            }
          />
          <Route
            path="/library"
            element={
              <Library
                playSong={playSong}
                currentSong={currentSong}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                toggleLike={toggleLike}
                recentSongs={recentSongs}
              />
            }
          />
          <Route
            path="/album/:id"
            element={
              <AlbumPage
                playSong={playSong}
                currentSong={currentSong}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                toggleLike={toggleLike}
                togglePlay={togglePlay}
              />
            }
          />
          <Route
            path="/liked"
            element={
              <LikedSongs
                playSong={playSong}
                currentSong={currentSong}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                toggleLike={toggleLike}
                togglePlay={togglePlay}
              />
            }
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Routes>
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

          <button 
            className="volume-icon-btn"
            onClick={toggleMute}
            type="button"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={19} />
            ) : (
              <Volume2 size={19} />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const newVolume = Number(e.target.value);
              setVolume(newVolume);
              if (newVolume > 0) setIsMuted(false);
            }}
          />

          <span className="volume-percentage">{isMuted ? 0 : volume}%</span>

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