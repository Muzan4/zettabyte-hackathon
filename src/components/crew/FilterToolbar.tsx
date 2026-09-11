import { useCrewStore } from '../../store/crewStore';
import type { PirateRole, HealthFilter } from '../../types';
import { Search, X } from 'lucide-react';

const ROLES: (PirateRole | 'All')[] = [
  'All', 'Captain', 'Quartermaster', 'Bosun',
  'Master Gunner', 'Lookout', 'Shipwright', 'Deckhand',
];

const HEALTH_FILTERS: HealthFilter[] = [
  'All', 'Battle-Ready', 'Injured', 'Scurvy Warning', 'Mutiny Risk',
];

const HEALTH_ICONS: Record<HealthFilter, string> = {
  'All': '⚓',
  'Battle-Ready': '✅',
  'Injured': '🩸',
  'Scurvy Warning': '🍋',
  'Mutiny Risk': '⚡',
};

export default function FilterToolbar() {
  const { filters, setRoleFilter, setHealthFilter, setSearch } = useCrewStore();

  return (
    <div className="filter-toolbar">
      {/* Search */}
      <div className="search-row">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or nickname..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filters.search && (
          <button className="search-clear" onClick={() => setSearch('')}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Role filter */}
      <div className="filter-section">
        <div className="filter-section-label">⚓ Role</div>
        <div className="filter-chips">
          {ROLES.map((role) => (
            <button
              key={role}
              className={`filter-chip ${filters.role === role ? 'filter-chip--active' : ''}`}
              onClick={() => setRoleFilter(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Health triage filter */}
      <div className="filter-section">
        <div className="filter-section-label">🩺 Triage</div>
        <div className="filter-chips">
          {HEALTH_FILTERS.map((hf) => (
            <button
              key={hf}
              className={`filter-chip filter-chip--health ${filters.health === hf ? 'filter-chip--active' : ''}`}
              onClick={() => setHealthFilter(hf)}
            >
              {HEALTH_ICONS[hf]} {hf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
