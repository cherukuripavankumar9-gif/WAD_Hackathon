import { Search, Bell, User } from "lucide-react";

function Header({ search, setSearch }) {
  return (
    <header className="header">

      <div className="search-box">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search songs, artists..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="header-actions">
        <Bell size={20} />
        <User size={20} />
      </div>

    </header>
  );
}

export default Header;