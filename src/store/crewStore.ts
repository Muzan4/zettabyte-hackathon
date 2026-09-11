import { create } from 'zustand';
import { Pirate, PirateRole, ShipState, HealthFilter, StatusEffect } from '../types';
import { LEGENDARY_PIRATES } from '../data/pirates';

interface FilterState {
  role: PirateRole | 'All';
  health: HealthFilter;
  search: string;
}

interface CrewStore {
  crew: Pirate[];
  selectedPirateId: string | null;
  filters: FilterState;
  ship: ShipState;
  plankTarget: string | null;

  // Selectors
  selectPirate: (id: string | null) => void;
  getSelectedPirate: () => Pirate | undefined;
  getFilteredCrew: () => Pirate[];

  // Crew actions
  recruitPirate: (pirate: Omit<Pirate, 'id'>) => void;
  confirmPlank: (id: string) => void;
  cancelPlank: () => void;
  walkThePlank: (id: string) => void;
  assignRole: (id: string, role: PirateRole) => void;
  feedLime: (id: string) => void;
  updateHP: (id: string, delta: number) => void;
  updateMorale: (id: string, delta: number) => void;
  addStatusEffect: (id: string, effect: StatusEffect) => void;
  removeStatusEffect: (id: string, effect: StatusEffect) => void;

  // Ship actions
  spliceMainbrace: () => void;
  updateShipMorale: (delta: number) => void;

  // Filters
  setRoleFilter: (role: PirateRole | 'All') => void;
  setHealthFilter: (health: HealthFilter) => void;
  setSearch: (search: string) => void;
}

export const useCrewStore = create<CrewStore>((set, get) => ({
  crew: LEGENDARY_PIRATES,
  selectedPirateId: LEGENDARY_PIRATES[0]?.id ?? null,
  plankTarget: null,
  filters: {
    role: 'All',
    health: 'All',
    search: '',
  },
  ship: {
    name: 'HMS Black Galleon',
    seaworthiness: 94,
    morale: 82,
    limes: 42,
    grog: 18,
    gold: 12500,
  },

  selectPirate: (id) => set({ selectedPirateId: id }),
  getSelectedPirate: () => get().crew.find((p) => p.id === get().selectedPirateId),

  getFilteredCrew: () => {
    const { crew, filters } = get();
    return crew.filter((p) => {
      if (filters.role !== 'All' && p.role !== filters.role) return false;
      if (filters.health === 'Battle-Ready' && (p.hp < 50 || p.scurvy > 50 || p.morale < 35)) return false;
      if (filters.health === 'Injured' && p.hp >= 50) return false;
      if (filters.health === 'Scurvy Warning' && p.scurvy <= 50) return false;
      if (filters.health === 'Mutiny Risk' && p.morale >= 35) return false;
      const q = filters.search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.nickname.toLowerCase().includes(q)) return false;
      return true;
    });
  },

  recruitPirate: (pirateData) => {
    const id = `recruit-${Date.now()}`;
    const newPirate: Pirate = { ...pirateData, id };
    set((s) => ({ crew: [...s.crew, newPirate], selectedPirateId: id }));
  },

  confirmPlank: (id) => set({ plankTarget: id }),
  cancelPlank: () => set({ plankTarget: null }),

  walkThePlank: (id) =>
    set((s) => ({
      crew: s.crew.filter((p) => p.id !== id),
      selectedPirateId: s.selectedPirateId === id ? (s.crew[0]?.id ?? null) : s.selectedPirateId,
      plankTarget: null,
    })),

  assignRole: (id, role) =>
    set((s) => ({ crew: s.crew.map((p) => (p.id === id ? { ...p, role } : p)) })),

  feedLime: (id) =>
    set((s) => {
      if (s.ship.limes <= 0) return s;
      return {
        ship: { ...s.ship, limes: s.ship.limes - 1 },
        crew: s.crew.map((p) => {
          if (p.id !== id) return p;
          const newScurvy = Math.max(0, p.scurvy - 35);
          const effects = newScurvy < 25
            ? p.statusEffects.filter((e) => e !== 'Scurvy' && e !== 'Bedridden')
            : p.statusEffects;
          return { ...p, scurvy: newScurvy, statusEffects: effects };
        }),
      };
    }),

  updateHP: (id, delta) =>
    set((s) => ({
      crew: s.crew.map((p) =>
        p.id === id ? { ...p, hp: Math.max(0, Math.min(100, p.hp + delta)) } : p
      ),
    })),

  updateMorale: (id, delta) =>
    set((s) => ({
      crew: s.crew.map((p) =>
        p.id === id ? { ...p, morale: Math.max(0, Math.min(100, p.morale + delta)) } : p
      ),
    })),

  addStatusEffect: (id, effect) =>
    set((s) => ({
      crew: s.crew.map((p) =>
        p.id === id && !p.statusEffects.includes(effect)
          ? { ...p, statusEffects: [...p.statusEffects, effect] }
          : p
      ),
    })),

  removeStatusEffect: (id, effect) =>
    set((s) => ({
      crew: s.crew.map((p) =>
        p.id === id
          ? { ...p, statusEffects: p.statusEffects.filter((e) => e !== effect) }
          : p
      ),
    })),

  spliceMainbrace: () =>
    set((s) => {
      if (s.ship.grog < 10) return s;
      return {
        ship: { ...s.ship, grog: s.ship.grog - 10 },
        crew: s.crew.map((p) => ({ ...p, morale: Math.min(100, p.morale + 20) })),
      };
    }),

  updateShipMorale: (delta) =>
    set((s) => ({
      ship: { ...s.ship, morale: Math.max(0, Math.min(100, s.ship.morale + delta)) },
    })),

  setRoleFilter: (role) => set((s) => ({ filters: { ...s.filters, role } })),
  setHealthFilter: (health) => set((s) => ({ filters: { ...s.filters, health } })),
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
}));
