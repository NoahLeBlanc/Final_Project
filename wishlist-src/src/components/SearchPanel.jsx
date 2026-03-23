export default function SearchPanel({ filterText, filterYear, years, onTextChange, onYearChange, onClear }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <SearchIcon />
        <span className="panel-title">Filter</span>
      </div>
      <div className="panel-body">
        <div className="form-row">
          <label htmlFor="searchText">Search name / developer</label>
          <input
            id="searchText"
            type="text"
            value={filterText}
            onChange={e => onTextChange(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="form-row">
          <label htmlFor="searchYear">Filter by year</label>
          <select
            id="searchYear"
            value={filterYear}
            onChange={e => onYearChange(e.target.value)}
          >
            <option value="">All years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-ghost btn-full" onClick={onClear}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
