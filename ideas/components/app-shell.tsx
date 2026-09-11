"use client"

import { useState } from "react"
import { Compass, HeartPulse, Ship, Users } from "lucide-react"
import type { Pirate } from "@/lib/crew-types"
import { cn } from "@/lib/utils"
import { useCrew } from "./crew-store"
import { readiness } from "@/lib/crew-utils"
import { RosterPanel } from "./roster-panel"
import { VitalsPanel } from "./vitals-panel"
import { MissionPanel } from "./mission-panel"
import { PirateDetail } from "./pirate-detail"
import { AddPirateForm } from "./add-pirate-form"

type Tab = "roster" | "vitals" | "missions"

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "roster", label: "Roster", icon: Users },
  { id: "vitals", label: "Vitals", icon: HeartPulse },
  { id: "missions", label: "Missions", icon: Compass },
]

function avg(nums: number[]) {
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0
}

export function AppShell() {
  const { crew } = useCrew()
  const [tab, setTab] = useState<Tab>("roster")
  const [selected, setSelected] = useState<Pirate | null>(null)
  const [adding, setAdding] = useState(false)

  // keep the selected dossier in sync with edits from the store
  const liveSelected = selected ? (crew.find((p) => p.id === selected.id) ?? null) : null

  const fleetReady = avg(crew.map((p) => readiness(p)))

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
            <Ship className="size-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl leading-none sm:text-3xl">Black Compass</h1>
            <p className="mt-1 text-sm text-muted-foreground">Crew Command &amp; Boarding Party Console</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Hands aboard</p>
            <p className="text-2xl font-semibold tabular-nums">{crew.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Fleet readiness</p>
            <p
              className="text-2xl font-semibold tabular-nums"
              style={{
                color:
                  fleetReady >= 75
                    ? "oklch(0.82 0.14 150)"
                    : fleetReady >= 55
                      ? "oklch(0.85 0.14 82)"
                      : "oklch(0.72 0.2 25)",
              }}
            >
              {fleetReady}%
            </p>
          </div>
        </div>
      </header>

      <nav className="sticky top-2 z-30 mt-4 flex gap-1 rounded-xl border border-border bg-card/80 p-1 backdrop-blur" aria-label="Sections">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-current={tab === id}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              tab === id
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <main className="mt-6">
        {tab === "roster" && <RosterPanel onOpen={setSelected} onAdd={() => setAdding(true)} />}
        {tab === "vitals" && <VitalsPanel onOpen={setSelected} />}
        {tab === "missions" && <MissionPanel onOpen={setSelected} />}
      </main>

      <PirateDetail pirate={liveSelected} onClose={() => setSelected(null)} />
      <AddPirateForm open={adding} onClose={() => setAdding(false)} />
    </div>
  )
}
