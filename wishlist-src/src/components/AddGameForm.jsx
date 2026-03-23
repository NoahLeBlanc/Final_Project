import { useState, useRef } from 'react';
import { fetchCoverForGame } from '../api/steamgriddb';

const EMPTY = { gameName: '', developer: '', price: '', releaseDate: '', image: '' };

export default function AddGameForm({ onAdd }) {
  const [form, setForm]           = useState(EMPTY);
  const [error, setError]         = useState('');
  const [imgStatus, setImgStatus] = useState('idle'); // idle | loading | found | failed | manual
  const debounceRef = useRef(null);

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (error) setError('');
  };

  // Auto-fetch cover art 600ms after the user stops typing the game name
  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, gameName: value }));
    if (error) setError('');

    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setImgStatus('idle');
      setForm(f => ({ ...f, gameName: value, image: '' }));
      return;
    }

    setImgStatus('loading');
    debounceRef.current = setTimeout(async () => {
      const url = await fetchCoverForGame(value.trim());
      if (url) {
        setForm(f => ({ ...f, image: url }));
        setImgStatus('found');
      } else {
        setImgStatus('failed');
      }
    }, 600);
  };

  // If the user manually edits the image URL field, stop auto-fetching
  const handleImageChange = (e) => {
    setForm(f => ({ ...f, image: e.target.value }));
    setImgStatus('manual');
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
    setImgStatus('idle');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const statusLabel = {
    loading: { text: 'Fetching cover art…',          color: 'var(--text-muted)' },
    found:   { text: '✓ Cover art found',             color: 'var(--success)'    },
    failed:  { text: 'No art found — paste a URL below', color: 'var(--warn)'   },
    manual:  { text: 'Using custom URL',              color: 'var(--text-muted)' },
  }[imgStatus];

  return (
    <div className="panel">
      <div className="panel-header">
        <PlusCircleIcon />
        <span className="panel-title">Add Game</span>
      </div>
      <div className="panel-body">

        {/* Live cover preview */}
        {form.image && (
          <div className="cover-preview">
            <img src={form.image} alt="Cover preview" onError={e => { e.currentTarget.style.display = 'none'; }} />
          </div>
        )}

        <div className="form-row">
          <label htmlFor="addName">Game Name</label>
          <input
            id="addName"
            type="text"
            value={form.gameName}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Elden Ring"
            className={error ? 'input-error' : ''}
          />
          {error && <div className="field-error">{error}</div>}
          {statusLabel && (
            <div className="field-hint" style={{ color: statusLabel.color }}>
              {imgStatus === 'loading' && <SpinnerIcon />}
              {statusLabel.text}
            </div>
          )}
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
          <label htmlFor="addImage">
            Image URL
            {imgStatus === 'found' && <span className="label-tag">auto-filled</span>}
          </label>
          <input
            id="addImage"
            type="text"
            value={form.image}
            onChange={handleImageChange}
            onKeyDown={handleKeyDown}
            placeholder="Auto-filled, or paste your own…"
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
          disabled={imgStatus === 'loading'}
        >
          <PlusIcon />
          {imgStatus === 'loading' ? 'Fetching art…' : 'Add to Wishlist'}
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
const SpinnerIcon = () => (
  <svg className="spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
