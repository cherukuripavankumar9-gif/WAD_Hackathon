import { useEffect, useRef, useState } from "react";

import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Heart,
  Volume2,
  Shuffle,
  Repeat,
} from "lucide-react";

function Player({
  currentSong,
  isPlaying,
  setIsPlaying,
  nextSong,
  previousSong,
  isLiked,
  onLike,
}) {
  const audioRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.src = currentSong.audio;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume / 100;
  }, [volume]);

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

  const updateProgress = () => {
    if (!audioRef.current) return;

    const current =
      audioRef.current.currentTime;

    const duration =
      audioRef.current.duration || 0;

    setProgress(
      duration
        ? (current / duration) * 100
        : 0
    );
  };

  const changeProgress = (e) => {
    if (!audioRef.current) return;

    const value = Number(e.target.value);

    audioRef.current.currentTime =
      (value / 100) *
      audioRef.current.duration;

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

  return (
    <div className="player">

      <audio
        ref={audioRef}
        onTimeUpdate={updateProgress}
        onEnded={handleEnded}
      />

      <div className="current-song">

        <img
          className="mini-cover"
          src={currentSong.image}
          alt={currentSong.title}
        />

        <div>
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
        </div>

        <button onClick={onLike}>
          <Heart
            size={18}
            fill={isLiked ? "currentColor" : "none"}
          />
        </button>

      </div>

      <div className="player-controls">

        <div className="controls">

          <button
            className={shuffle ? "active-control" : ""}
            onClick={() => setShuffle(!shuffle)}
          >
            <Shuffle size={18} />
          </button>

          <button onClick={previousSong}>
            <SkipBack size={20} />
          </button>

          <button
            className="main-play"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause
                size={20}
                fill="black"
              />
            ) : (
              <Play
                size={20}
                fill="black"
              />
            )}
          </button>

          <button onClick={nextSong}>
            <SkipForward size={20} />
          </button>

          <button
            className={repeat ? "active-control" : ""}
            onClick={() => setRepeat(!repeat)}
          >
            <Repeat size={18} />
          </button>

        </div>

        <div className="progress">

          <span>
            {audioRef.current
              ? formatTime(
                  audioRef.current.currentTime
                )
              : "0:00"}
          </span>

          <input
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

      <div className="volume">

        <Volume2 size={20} />

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) =>
            setVolume(e.target.value)
          }
        />

      </div>

    </div>
  );
}

export default Player;