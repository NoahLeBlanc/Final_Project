import { useState, useEffect } from 'react';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='113'%3E%3Crect fill='%23243040' width='200' height='113'/%3E%3Ctext fill='%23556070' font-family='sans-serif' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function GameCard({ game, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    gameName:    game.gameName,
    developer:   game.developer,
    price:       game.price,
    releaseDate: game.releaseDate,
  });

  // Keep form in sync if parent data changes
  useEffect(() => {
    setForm({
      gameName:    game.gameName,
      developer:   game.developer,
      price:       game.price,
      releaseDate: game.releaseDate,
    });
  }, [game]);

  const handleSave = () => {
    if (!form.gameName.trim()) return;
    onUpdate({ ...game, ...form, releaseDate: Number(form.releaseDate) || game.releaseDate });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      gameName:    game.gameName,
      developer:   game.developer,
      price:       game.price,
      releaseDate: game.releaseDate,
    });
    setEditing(false);
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const isFree = game.price.toLowerCase() === 'free';

  return (
    <div className={`game-card${editing ? ' editing' : ''}`}>
      <div className={`card-img-wrap${editing ? ' dimmed' : ''}`}>
        <img
          src={game.image || PLACEHOLDER}
          alt={game.gameName}
          loading="lazy"
          onError={e => { e.currentTarget.src = PLACEHOLDER; }}
        />
        {!editing && (
          <div className="card-img-overlay">
            <span className={`card-price${isFree ? ' free' : ''}`}>{game.price}</span>
          </div>
        )}
      </div>

      {editing ? (
        <>
          <div className="edit-form">
            <input value={form.gameName}    onChange={set('gameName')}    placeholder="Game name" />
            <input value={form.developer}   onChange={set('developer')}   placeholder="Developer" />
            <input value={form.price}       onChange={set('price')}       placeholder="Price" />
            <input value={form.releaseDate} onChange={set('releaseDate')} placeholder="Year" type="number" min="1970" max="2030" />
          </div>
          <div className="edit-actions">
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              <CheckIcon /> Save
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="card-body">
            <div className="card-title">{game.gameName}</div>
            <div className="card-meta">
              <div className="card-meta-row">
                <PersonIcon /> {game.developer}
              </div>
              <div className="card-meta-row">
                <CalendarIcon /> {game.releaseDate}
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-warn btn-sm" onClick={() => setEditing(true)}>
              <EditIcon /> Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(game.id)}>
              <TrashIcon /> Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const CheckIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const EditIcon     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/><path d="M9 6V4h6v2"/></svg>;
const PersonIcon   = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const CalendarIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
