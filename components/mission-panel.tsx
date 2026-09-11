"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, Compass, Skull, Swords, Users } from "lucide-react"
import type { Pirate } from "@/lib/crew-types"
import { SKILL_LABELS } from "@/lib/crew-types"
import { MISSIONS, recommendParty } from "@/lib/crew-utils"
import { cn } from "@/lib/utils"
import { useCrew } from "./crew-store"
import { PirateAvatar } from "./pirate-avatar"
import { RoleBadge } from "./role-badge"

function Difficulty({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Difficulty ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skull
          key={i}
          className={cn("size-3.5", i < level ? "text-destructive" : "text-muted-foreground/30")}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

function scoreTone(v: number) {
  if (v >= 75) return "oklch(0.82 0.14 150)"
  if (v >= 60) return "oklch(0.85 0.14 82)"
  return "oklch(0.72 0.2 25)"
}

export function MissionPanel({ onOpen }: { onOpen: (p: Pirate) => void }) {
  const { crew } = useCrew()
  const [missionId, setMissionId] = useState(MISSIONS[0].id)
  const mission = MISSIONS.find((m) => m.id === missionId)!

  const rec = useMemo(() => recommendParty(crew, mission), [crew, mission])

  return (
    <section aria-label="Mission assignment engine" className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg">
          <Compass className="size-5 text-primary" aria-hidden="true" />
          Choose your raid
        </h2>
        <p className="text-sm text-muted-foreground">
          The engine ranks every hand by weighted skill fit and battle readiness, then musters the optimal boarding party.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((m) => {
          const active = m.id === missionId
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMissionId(m.id)}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-4 text-left transition",
                active
                  ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                  : "border-border bg-card/60 hover:border-primary/40",
              )}
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{m.name}</span>
                <Difficulty level={m.difficulty} />
              </div>
              <p className="text-xs text-muted-foreground">{m.blurb}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" aria-hidden="true" />
                  {m.partySize} hands
                </span>
                {Object.keys(m.weights).map((k) => (
                  <span key={k} className="rounded-full bg-secondary/60 px-2 py-0.5">
                    {SKILL_LABELS[k as keyof typeof SKILL_LABELS]}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Recommended party */}
        <div className="rounded-xl border border-border bg-card/70 p-4 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Swords className="size-4 text-primary" aria-hidden="true" />
              Recommended boarding party
            </h3>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ background: `${scoreTone(rec.avgTotal)}22`, color: scoreTone(rec.avgTotal) }}
            >
              {rec.avgTotal}% mission score
            </span>
          </div>

          <ol className="space-y-2">
            {rec.party.map((c, i) => (
              <li key={c.pirate.id}>
                <button
                  type="button"
                  onClick={() => onOpen(c.pirate)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border bg-black/20 px-3 py-2 text-left transition hover:border-primary/40"
                >
                  <span className="w-4 text-center text-xs font-semibold text-muted-foreground">{i + 1}</span>
                  <PirateAvatar id={c.pirate.id} name={c.pirate.name} size={38} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.pirate.name}</span>
                    <RoleBadge role={c.pirate.role} className="mt-0.5" />
                  </span>
                  <span className="text-right text-xs text-muted-foreground">
                    <span className="block">
                      fit <span className="font-semibold text-foreground">{c.skillFit}</span>
                    </span>
                    <span className="block">
                      ready <span className="font-semibold text-foreground">{c.readiness}</span>
                    </span>
                  </span>
                  <span className="text-lg font-semibold tabular-nums" style={{ color: scoreTone(c.total) }}>
                    {c.total}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {!rec.medicAboard && (
            <p className="mt-3 flex items-center gap-2 rounded-lg border border-[oklch(0.8_0.15_80)]/30 bg-[oklch(0.8_0.15_80)]/10 px-3 py-2 text-xs text-[oklch(0.85_0.14_82)]">
              <Skull className="size-4" aria-hidden="true" />
              No skilled medic in this party — casualties may go untended.
            </p>
          )}
        </div>

        {/* Coverage + bench */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card/70 p-4 backdrop-blur">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Party skill coverage
            </h3>
            <div className="space-y-2.5">
              {rec.coverage.map(({ skill, value }) => {
                const weighted = skill in mission.weights
                return (
                  <div key={skill} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn(weighted ? "font-semibold text-foreground" : "text-muted-foreground")}>
                        {SKILL_LABELS[skill]}
                        {weighted && <CheckCircle2 className="ml-1 inline size-3 text-primary" aria-label="mission-critical" />}
                      </span>
                      <span className="tabular-nums text-foreground/80">{value}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/30">
                      <div
                        className={cn("h-full rounded-full", weighted ? "bg-primary" : "bg-muted-foreground/50")}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {rec.bench.length > 0 && (
            <div className="rounded-xl border border-border bg-card/40 p-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Left ashore
              </h3>
              <div className="flex flex-wrap gap-2">
                {rec.bench.map((c) => (
                  <button
                    key={c.pirate.id}
                    type="button"
                    onClick={() => onOpen(c.pirate)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-black/20 py-1 pl-1 pr-3 text-xs transition hover:border-primary/40"
                    title={`${c.pirate.name} — score ${c.total}`}
                  >
                    <PirateAvatar id={c.pirate.id} name={c.pirate.name} size={24} />
                    <span className="max-w-28 truncate">{c.pirate.name}</span>
                    <span className="text-muted-foreground">{c.total}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
