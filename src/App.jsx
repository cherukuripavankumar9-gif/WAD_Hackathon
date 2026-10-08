import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Section from "./components/Section";
import Player from "./components/Player";

import { songs } from "./data/songs";

function App() {
  return (
    <div className="app">

      <Sidebar />

      <main className="main-content">

        <Header />

        <div className="content">

          <section className="hero">

            <div>
              <p>WELCOME BACK</p>

              <h1>
                Good morning 👋
              </h1>

              <p>
                Discover music that matches your mood.
              </p>

              <button className="hero-button">
                Start Listening
              </button>
            </div>

          </section>

          <Section
            title="Trending Now"
            songs={songs}
          />

          <Section
            title="Made For You"
            songs={songs.slice(1)}
          />

        </div>

      </main>

      <Player />

    </div>
  );
}

export default App;