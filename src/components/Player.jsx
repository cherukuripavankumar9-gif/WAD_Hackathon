import {
  SkipBack,
  Play,
  SkipForward,
  Heart,
  Volume2,
} from "lucide-react";

function Player() {
  return (
    <div className="player">

      <div className="current-song">

        <div className="mini-cover"></div>

        <div>
          <h4>Midnight Drive</h4>
          <p>Nova</p>
        </div>

        <Heart size={18} />

      </div>

      <div className="player-controls">

        <div className="controls">

          <SkipBack size={20} />

          <button className="main-play">
            <Play size={20} fill="white" />
          </button>

          <SkipForward size={20} />

        </div>

        <div className="progress">

          <span>0:00</span>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="35"
          />

          <span>3:42</span>

        </div>

      </div>

      <div className="volume">

        <Volume2 size={20} />

        <input
          type="range"
          min="0"
          max="100"
          defaultValue="70"
        />

      </div>

    </div>
  );
}

export default Player;