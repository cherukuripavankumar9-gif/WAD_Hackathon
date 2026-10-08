import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        🎵 TuneFlow
      </div>

      <nav>
        <button>
          <Home size={20} />
          Home
        </button>

        <button>
          <Search size={20} />
          Search
        </button>

        <button>
          <Library size={20} />
          Your Library
        </button>
      </nav>

      <div className="playlist-section">

        <h3>Your Playlists</h3>

        <button>
          <Plus size={20} />
          Create Playlist
        </button>

        <button>
          <Heart size={20} />
          Liked Songs
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;