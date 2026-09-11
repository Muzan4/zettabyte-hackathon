"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, UserPlus } from "lucide-react"
import type { Pirate, Role, SkillKey } from "@/lib/crew-types"
import { ROLES, SKILL_KEYS, SKILL_LABELS } from "@/lib/crew-types"
import { overallSkill, readiness } from "@/lib/crew-utils"
import { Button } from "@/components/ui/button"
import { useCrew } from "./crew-store"
import { CrewCard } from "./crew-card"

type SortKey = "readiness" | "skill" | "name"

const selectClass =
  "h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"

export function RosterPanel({
  onOpen,
  onAdd,
}: {
  onOpen: (p: Pirate) => void
  onAdd: () => void
}) {
  const { crew } = useCrew()
  const [query, setQuery] = useState("")
  const [role, setRole] = useState<Role | "all">("all")
  const [skill, setSkill] = useState<SkillKey | "all">("all")
  const [sort, setSort] = useState<SortKey>("readiness")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = crew.filter((p) => {
      if (role !== "all" && p.role !== role) return false
      if (skill !== "all" && p.skills[skill] < 70) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.epithet.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
      )
    })
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "skill") return overallSkill(b.skills) - overallSkill(a.skills)
      return readiness(b) - readiness(a)
    })
    return list
  }, [crew, query, role, skill, sort])

  return (
    <section aria-label="Crew roster" className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3 backdrop-blur sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, epithet, role, or port…"
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            aria-label="Search crew"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
          <select className={selectClass} value={role} onChange={(e) => setRole(e.target.value as Role | "all")} aria-label="Filter by role">
            <option value="all">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select className={selectClass} value={skill} onChange={(e) => setSkill(e.target.value as SkillKey | "all")} aria-label="Filter by skill proficiency">
            <option value="all">Any skill</option>
            {SKILL_KEYS.map((k) => (
              <option key={k} value={k}>
                {SKILL_LABELS[k]} 70+
              </option>
            ))}
          </select>
          <select className={selectClass} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort crew">
            <option value="readiness">Sort: Readiness</option>
            <option value="skill">Sort: Skill</option>
            <option value="name">Sort: Name</option>
          </select>
          <Button onClick={onAdd} size="lg">
            <UserPlus className="size-4" />
            Recruit
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {crew.length} hands shown
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-muted-foreground">
          No pirates match these orders, Captain.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <CrewCard key={p.id} pirate={p} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  )
}
