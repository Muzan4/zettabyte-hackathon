"use client"

import { AlertTriangle, Heart, ShieldAlert, Skull, Smile } from "lucide-react"
import type { Pirate } from "@/lib/crew-types"
import { readiness } from "@/lib/crew-utils"
import { useCrew } from "./crew-store"
import { PirateAvatar } from "./pirate-avatar"

function avg(nums: number[]) {
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0
}

function Gauge({
  icon: Icon,
  label,
  value,
  suffix = "",
  tone,
}: {
  icon: typeof Heart
  label: string
  value: number
  suffix?: string
  tone: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" style={{ color: tone }} aria-hidden="true" />
        {label}
      </div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-semibold tabular-nums" style={{ color: tone }}>
          {value}
        </span>
        <span className="mb-1 text-sm text-muted-foreground">{suffix}</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/30">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: tone }} />
      </div>
    </div>
  )
}

export function VitalsPanel({ onOpen }: { onOpen: (p: Pirate) => void }) {
  const { crew } = useCrew()

  const avgHealth = avg(crew.map((p) => p.vitals.health))
  const avgScurvy = avg(crew.map((p) => p.vitals.scurvy))
  const avgMorale = avg(crew.map((p) => p.vitals.morale))
  const avgReady = avg(crew.map((p) => readiness(p)))

  const alerts = crew
    .flatMap((p) => {
      const items: { p: Pirate; msg: string; sev: number }[] = []
      if (p.vitals.health < 50) items.push({ p, msg: `Critical wounds — ${p.vitals.health} HP`, sev: 3 })
      if (p.vitals.scurvy > 50) items.push({ p, msg: `Scurvy setting in — ${p.vitals.scurvy}/100`, sev: 3 })
      if (p.vitals.morale < 45) items.push({ p, msg: `Morale mutinous — ${p.vitals.morale}/100`, sev: 2 })
      if (readiness(p) < 55 && items.length === 0)
        items.push({ p, msg: `Unfit for high-risk duty — ${readiness(p)}% ready`, sev: 1 })
      return items
    })
    .sort((a, b) => b.sev - a.sev)

  return (
    <section aria-label="Fleet vitals dashboard" className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Gauge icon={Heart} label="Avg Health" value={avgHealth} tone="oklch(0.72 0.15 150)" />
        <Gauge icon={Skull} label="Avg Scurvy" value={avgScurvy} tone="oklch(0.68 0.19 25)" />
        <Gauge icon={Smile} label="Avg Morale" value={avgMorale} tone="oklch(0.82 0.15 82)" />
        <Gauge icon={ShieldAlert} label="Fleet Readiness" value={avgReady} suffix="%" tone="var(--color-primary)" />
      </div>

      <div className="rounded-xl border border-border bg-card/70 p-4 backdrop-blur">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <AlertTriangle className="size-4 text-[oklch(0.8_0.15_80)]" aria-hidden="true" />
          Status alerts
          {alerts.length > 0 && (
            <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-medium text-destructive">
              {alerts.length}
            </span>
          )}
        </h3>

        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            All hands fit for duty. The crew is ship-shape, Captain.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {alerts.map(({ p, msg, sev }, i) => (
              <li key={`${p.id}-${i}`}>
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border bg-black/20 px-3 py-2 text-left transition hover:border-primary/40"
                >
                  <PirateAvatar id={p.id} name={p.name} size={36} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{msg}</span>
                  </span>
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      background:
                        sev >= 3 ? "oklch(0.62 0.2 25)" : sev === 2 ? "oklch(0.8 0.15 80)" : "oklch(0.7 0.1 90)",
                    }}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
