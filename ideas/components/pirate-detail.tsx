"use client"

import { useEffect } from "react"
import { Heart, Skull, Smile, Trash2, X } from "lucide-react"
import type { Pirate, Vitals } from "@/lib/crew-types"
import { SKILL_KEYS, SKILL_LABELS } from "@/lib/crew-types"
import {
  healthStatus,
  moraleStatus,
  overallSkill,
  readiness,
  readinessStatus,
  scurvyStatus,
} from "@/lib/crew-utils"
import { Button } from "@/components/ui/button"
import { useCrew } from "./crew-store"
import { PirateAvatar } from "./pirate-avatar"
import { RoleBadge } from "./role-badge"
import { SkillRadar } from "./skill-radar"
import { StatBar } from "./stat-bar"

const READY_TEXT: Record<string, string> = {
  good: "text-[oklch(0.82_0.14_150)]",
  warn: "text-[oklch(0.85_0.14_82)]",
  danger: "text-[oklch(0.72_0.2_25)]",
}

function VitalSlider({
  label,
  icon: Icon,
  value,
  onChange,
  hint,
}: {
  label: string
  icon: typeof Heart
  value: number
  onChange: (v: number) => void
  hint: string
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-foreground/90">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          {label}
        </span>
        <span className="tabular-nums font-semibold">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-primary)]"
        aria-label={`${label} — ${hint}`}
      />
    </label>
  )
}

export function PirateDetail({ pirate, onClose }: { pirate: Pirate | null; onClose: () => void }) {
  const { updatePirate, dischargePirate } = useCrew()

  useEffect(() => {
    if (!pirate) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [pirate, onClose])

  if (!pirate) return null

  const setVital = (patch: Partial<Vitals>) =>
    updatePirate(pirate.id, { vitals: { ...pirate.vitals, ...patch } })

  const ready = readiness(pirate)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${pirate.name} dossier`}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card/95 p-5 backdrop-blur">
          <div className="flex items-center gap-4">
            <PirateAvatar id={pirate.id} name={pirate.name} size={60} />
            <div>
              <h2 className="text-2xl leading-tight">{pirate.name}</h2>
              <p className="text-primary font-[family-name:var(--font-display)]">“{pirate.epithet}”</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <RoleBadge role={pirate.role} />
                <span>{pirate.origin}</span>
                <span aria-hidden="true">•</span>
                <span>{pirate.yearsAtSea} yrs at sea</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dossier">
            <X className="size-5" />
          </Button>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-3">
            <h3 className="self-start text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Skill Matrix
            </h3>
            <SkillRadar skills={pirate.skills} size={260} />
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
              {SKILL_KEYS.map((k) => (
                <StatBar key={k} label={SKILL_LABELS[k]} value={pirate.skills[k]} />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-lg border border-border bg-black/20 px-4 py-3">
              <span className="text-sm text-muted-foreground">Overall skill</span>
              <span className="text-lg font-semibold">{overallSkill(pirate.skills)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-black/20 px-4 py-3">
              <span className="text-sm text-muted-foreground">Battle readiness</span>
              <span className={`text-lg font-semibold ${READY_TEXT[readinessStatus(ready)]}`}>{ready}%</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Vitals — adjust after each skirmish
              </h3>
              <VitalSlider
                label="Health HP"
                icon={Heart}
                value={pirate.vitals.health}
                onChange={(v) => setVital({ health: v })}
                hint="higher is better"
              />
              <VitalSlider
                label="Scurvy level"
                icon={Skull}
                value={pirate.vitals.scurvy}
                onChange={(v) => setVital({ scurvy: v })}
                hint="higher is worse"
              />
              <VitalSlider
                label="Morale"
                icon={Smile}
                value={pirate.vitals.morale}
                onChange={(v) => setVital({ morale: v })}
                hint="higher is better"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <StatBar label="Health" value={pirate.vitals.health} status={healthStatus(pirate.vitals.health)} />
              <StatBar label="Scurvy" value={pirate.vitals.scurvy} status={scurvyStatus(pirate.vitals.scurvy)} />
              <StatBar label="Morale" value={pirate.vitals.morale} status={moraleStatus(pirate.vitals.morale)} />
            </div>

            <Button
              variant="outline"
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                dischargePirate(pirate.id)
                onClose()
              }}
            >
              <Trash2 className="size-4" />
              Discharge from crew
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
