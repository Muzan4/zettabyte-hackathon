"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { Pirate } from "@/lib/crew-types"
import { INITIAL_CREW } from "@/lib/crew-data"

interface CrewContextValue {
  crew: Pirate[]
  addPirate: (p: Pirate) => void
  updatePirate: (id: string, patch: Partial<Pirate>) => void
  dischargePirate: (id: string) => void
}

const CrewContext = createContext<CrewContextValue | null>(null)

export function CrewProvider({ children }: { children: React.ReactNode }) {
  const [crew, setCrew] = useState<Pirate[]>(INITIAL_CREW)

  const addPirate = useCallback((p: Pirate) => {
    setCrew((c) => [p, ...c])
  }, [])

  const updatePirate = useCallback((id: string, patch: Partial<Pirate>) => {
    setCrew((c) => c.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const dischargePirate = useCallback((id: string) => {
    setCrew((c) => c.filter((p) => p.id !== id))
  }, [])

  const value = useMemo(
    () => ({ crew, addPirate, updatePirate, dischargePirate }),
    [crew, addPirate, updatePirate, dischargePirate],
  )

  return <CrewContext.Provider value={value}>{children}</CrewContext.Provider>
}

export function useCrew() {
  const ctx = useContext(CrewContext)
  if (!ctx) throw new Error("useCrew must be used within CrewProvider")
  return ctx
}
