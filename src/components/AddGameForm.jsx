import { useState } from 'react';

const EMPTY = { gameName: '', developer: '', price: '', releaseDate: '', image: '' };

export default function AddGameForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (!form.gameName.trim()) {
      setError('Please enter a game name.');
      return;
    }
    onAdd({
      gameName:    form.gameName.trim(),
      developer:   form.developer.trim() || 'Unknown',
      price:       form.price.trim()     || 'TBD',
      releaseDate: parseInt(form.releaseDate) || new Date().getFullYear(),
      image:       form.image.trim(),
    });
    setForm(EMPTY);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <PlusCircleIcon />
        <span className="panel-title">Add Game</span>
      </div>
      <div className="panel-body">
        <div className="form-row">
          <label htmlFor="addName">Game Name</label>
          <input
            id="addName"
            type="text"
            value={form.gameName}
            onChange={set('gameName')}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Elden Ring"
            className={error ? 'input-error' : ''}
          />
          {error && <div className="field-error">{error}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="addDev">Developer</label>
          <input
            id="addDev"
            type="text"
            value={form.developer}
            onChange={set('developer')}
            onKeyDown={handleKeyDown}
            placeholder="e.g. FromSoftware"
          />
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="addPrice">Price</label>
            <input
              id="addPrice"
              type="text"
              value={form.price}
              onChange={set('price')}
              onKeyDown={handleKeyDown}
              placeholder="$29.99"
            />
          </div>
          <div className="form-row">
            <label htmlFor="addYear">Year</label>
            <input
              id="addYear"
              type="number"
              value={form.releaseDate}
              onChange={set('releaseDate')}
              onKeyDown={handleKeyDown}
              placeholder="2024"
              min="1970"
              max="2030"
            />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="addImage">Image URL (optional)</label>
          <input
            id="addImage"
            type="text"
            value={form.image}
            onChange={set('image')}
            onKeyDown={handleKeyDown}
            placeholder="https://..."
          />
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSubmit}>
          <PlusIcon /> Add to Wishlist
        </button>
      </div>
    </div>
  );
}

const PlusCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
