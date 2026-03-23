import { useState, useEffect } from 'react';
import GameCard from './components/GameCard';
import AddGameForm from './components/AddGameForm';
import SearchPanel from './components/SearchPanel';
import Toast from './components/Toast';
import { uid } from './utils';
import './App.css';

const STEAM_CDN = (id) => `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;

const DEFAULT_GAMES = [
  { id: uid(), gameName: 'Fallout 3',         developer: 'Bethesda Game Studios', price: '$9.99',  image: STEAM_CDN(22300),   releaseDate: 2008 },
  { id: uid(), gameName: 'Skyrim',            developer: 'Bethesda Game Studios', price: '$39.99', image: STEAM_CDN(489830),  releaseDate: 2016 },
  { id: uid(), gameName: 'In Stars and Time', developer: 'insertdisc5',           price: '$19.99', image: STEAM_CDN(1677310), releaseDate: 2023 },
  { id: uid(), gameName: 'Risk of Rain 2',    developer: 'Hopoo Games',           price: '$8.24',  image: STEAM_CDN(632360),  releaseDate: 2020 },
  { id: uid(), gameName: 'Apex Legends',      developer: 'Respawn',               price: 'FREE',   image: STEAM_CDN(1172470), releaseDate: 2020 },
  { id: uid(), gameName: 'Call of Duty',      developer: 'Treyarch / Raven',      price: '$69.99', image: STEAM_CDN(1938090), releaseDate: 2022 },
  { id: uid(), gameName: 'Terraria',          developer: 'Re-Logic',              price: '$9.99',  image: STEAM_CDN(105600),  releaseDate: 2011 },
  { id: uid(), gameName: 'SIGNALIS',          developer: 'rose-engine',           price: '$19.99', image: STEAM_CDN(1621720), releaseDate: 2022 },
  { id: uid(), gameName: 'Caves of Qud',      developer: 'Freehold Games',        price: '$29.99', image: STEAM_CDN(333640),  releaseDate: 2024 },
  { id: uid(), gameName: 'Civilization VI',   developer: 'Firaxis Games',         price: '$2.99',  image: STEAM_CDN(289070),  releaseDate: 2016 },
];

function loadGames() {
  try {
    const raw = localStorage.getItem('gameWishlist');
    if (!raw) return null;
    const games = JSON.parse(raw);
    // Migrate: if any game still has a local /gameN.jpg path, discard the cache
    // so DEFAULT_GAMES (with Steam CDN URLs) are used instead.
    const hasStale = games.some(g => g.image && g.image.match(/^\/game\d+\.jpg$/));
    if (hasStale) {
      localStorage.removeItem('gameWishlist');
      return null;
    }
    return games;
  } catch {
    return null;
  }
}

function saveGames(games) {
  try {
    localStorage.setItem('gameWishlist', JSON.stringify(games));
  } catch {
    console.warn('Could not persist games to localStorage');
  }
}

export default function App() {
  const [games, setGames]         = useState(() => loadGames() ?? DEFAULT_GAMES);
  const [filterText, setFilterText] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [toast, setToast]         = useState({ visible: false, message: '', type: 'success' });

  // Persist on every change
  useEffect(() => { saveGames(games); }, [games]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  const addGame = (game) => {
    setGames(prev => [...prev, { ...game, id: uid() }]);
    showToast(`"${game.gameName}" added to wishlist`);
  };

  const deleteGame = (id) => {
    setGames(prev => prev.filter(g => g.id !== id));
    showToast('Game removed');
  };

  const updateGame = (updated) => {
    setGames(prev => prev.map(g => g.id === updated.id ? { ...g, ...updated } : g));
    showToast('Changes saved');
  };

  const years = [...new Set(games.map(g => g.releaseDate))].sort();

  const visible = games.filter(g => {
    const matchText = !filterText ||
      g.gameName.toLowerCase().includes(filterText.toLowerCase()) ||
      g.developer.toLowerCase().includes(filterText.toLowerCase());
    const matchYear = !filterYear || String(g.releaseDate) === filterYear;
    return matchText && matchYear;
  });

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="logo">
            <StarIcon />
            Game Wishlist
          </div>
          <div className="header-count">
            <span>{games.length}</span> games saved
          </div>
        </div>
      </header>

      <main className="site-main">
        <aside className="sidebar">
          <AddGameForm onAdd={addGame} />
          <SearchPanel
            filterText={filterText}
            filterYear={filterYear}
            years={years}
            onTextChange={setFilterText}
            onYearChange={setFilterYear}
            onClear={() => { setFilterText(''); setFilterYear(''); }}
          />
        </aside>

        <section className="content">
          <div className="section-header">
            <h2 className="section-title">
              Wishlist
              <span className="badge">
                {filterText || filterYear ? `${visible.length} / ${games.length}` : games.length}
              </span>
            </h2>
          </div>

          {visible.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎮</div>
              <div className="empty-state-title">
                {games.length === 0 ? 'Your wishlist is empty' : 'No results'}
              </div>
              <div className="empty-state-sub">
                {games.length === 0
                  ? 'Add your first game using the form on the left.'
                  : 'Try adjusting your search filters.'}
              </div>
            </div>
          ) : (
            <div className="game-grid">
              {visible.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onDelete={deleteGame}
                  onUpdate={updateGame}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Toast {...toast} />
    </>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
