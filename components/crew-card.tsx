"use client"

import { Anchor, Heart, Skull, Smile } from "lucide-react"
import type { Pirate } from "@/lib/crew-types"
import {
  healthStatus,
  moraleStatus,
  overallSkill,
  readiness,
  readinessStatus,
  scurvyStatus,
} from "@/lib/crew-utils"
import { cn } from "@/lib/utils"
import { PirateAvatar } from "./pirate-avatar"
import { RoleBadge } from "./role-badge"

const DOT: Record<string, string> = {
  good: "bg-[oklch(0.72_0.15_150)]",
  warn: "bg-[oklch(0.8_0.15_80)]",
  danger: "bg-[oklch(0.62_0.2_25)]",
}

function Vital({ icon: Icon, value, status, label }: { icon: typeof Heart; value: number; status: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5" title={`${label}: ${value}`}>
      <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
      <span className="tabular-nums text-foreground/80">{value}</span>
      <span className={cn("size-1.5 rounded-full", DOT[status])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function CrewCard({ pirate, onOpen }: { pirate: Pirate; onOpen: (p: Pirate) => void }) {
  const ready = readiness(pirate)
  return (
    <button
      type="button"
      onClick={() => onOpen(pirate)}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card/70 p-4 text-left backdrop-blur transition hover:border-primary/40 hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
    >
      <div className="flex items-start gap-3">
        <PirateAvatar id={pirate.id} name={pirate.name} size={48} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold leading-tight">{pirate.name}</h3>
          <p className="truncate text-sm text-primary/90 font-[family-name:var(--font-display)]">
            “{pirate.epithet}”
          </p>
        </div>
      </div>

      <RoleBadge role={pirate.role} className="self-start" />

      <div className="flex items-center justify-between gap-2 rounded-lg bg-black/20 px-3 py-2 text-xs">
        <Vital icon={Heart} value={pirate.vitals.health} status={healthStatus(pirate.vitals.health)} label="Health" />
        <Vital icon={Skull} value={pirate.vitals.scurvy} status={scurvyStatus(pirate.vitals.scurvy)} label="Scurvy" />
        <Vital icon={Smile} value={pirate.vitals.morale} status={moraleStatus(pirate.vitals.morale)} label="Morale" />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Skill <span className="font-semibold text-foreground">{overallSkill(pirate.skills)}</span>
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 font-medium",
            readinessStatus(ready) === "good" && "text-[oklch(0.82_0.14_150)]",
            readinessStatus(ready) === "warn" && "text-[oklch(0.85_0.14_82)]",
            readinessStatus(ready) === "danger" && "text-[oklch(0.72_0.2_25)]",
          )}
        >
          <Anchor className="size-3.5" aria-hidden="true" />
          {ready}% ready
        </span>
      </div>
    </button>
  )
}
