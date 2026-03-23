const API_KEY = 'ef8726cde4426e2e632bcc1078a7c680';
// In dev, requests go through the Vite proxy /sgdb → steamgriddb.com/api/v2
// In production, replace BASE with the full URL and move the key server-side.
const BASE = '/sgdb';

const headers = { Authorization: `Bearer ${API_KEY}` };

/**
 * Search for a game by name, returns the first match's id + name.
 * @param {string} name
 * @returns {Promise<{ id: number, name: string } | null>}
 */
export async function searchGame(name) {
  const res = await fetch(`${BASE}/search/autocomplete/${encodeURIComponent(name)}`, { headers });
  if (!res.ok) throw new Error(`SteamGridDB search failed: ${res.status}`);
  const { data } = await res.json();
  return data?.[0] ?? null;
}

/**
 * Fetch the best grid (cover) image URL for a given SteamGridDB game id.
 * Prefers 600x900 portrait covers; falls back to whatever is available.
 * @param {number} gameId
 * @returns {Promise<string | null>}
 */
export async function getGridImage(gameId) {
  const res = await fetch(
    `${BASE}/grids/game/${gameId}?dimensions=600x900,342x482&limit=5`,
    { headers }
  );
  if (!res.ok) throw new Error(`SteamGridDB grids failed: ${res.status}`);
  const { data } = await res.json();
  return data?.[0]?.url ?? null;
}

/**
 * One-shot helper: search by name then fetch its best cover image.
 * Returns null if nothing is found rather than throwing.
 * @param {string} name
 * @returns {Promise<string | null>}
 */
export async function fetchCoverForGame(name) {
  try {
    const game = await searchGame(name);
    if (!game) return null;
    return await getGridImage(game.id);
  } catch (err) {
    console.warn('SteamGridDB error:', err.message);
    return null;
  }
}
