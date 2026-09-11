"use client"

import { useEffect, useState } from "react"
import { UserPlus, X } from "lucide-react"
import type { Pirate, Role, Skills } from "@/lib/crew-types"
import { ROLES, SKILL_KEYS, SKILL_LABELS } from "@/lib/crew-types"
import { blankSkills, DEFAULT_ROLE, newPirateId } from "@/lib/crew-utils"
import { Button } from "@/components/ui/button"
import { useCrew } from "./crew-store"

const field =
  "h-9 w-full rounded-lg border border-border bg-black/20 px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"

export function AddPirateForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addPirate } = useCrew()
  const [name, setName] = useState("")
  const [epithet, setEpithet] = useState("")
  const [role, setRole] = useState<Role>(DEFAULT_ROLE)
  const [origin, setOrigin] = useState("")
  const [years, setYears] = useState(1)
  const [skills, setSkills] = useState<Skills>(blankSkills())

  useEffect(() => {
    if (open) {
      setName("")
      setEpithet("")
      setRole(DEFAULT_ROLE)
      setOrigin("")
      setYears(1)
      setSkills(blankSkills())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const pirate: Pirate = {
      id: newPirateId(),
      name: name.trim(),
      epithet: epithet.trim() || "The New Blood",
      role,
      origin: origin.trim() || "Parts Unknown",
      yearsAtSea: years,
      skills,
      vitals: { health: 85, scurvy: 10, morale: 80 },
    }
    addPirate(pirate)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Recruit a new pirate"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card/95 p-5 backdrop-blur">
          <h2 className="flex items-center gap-2 text-xl">
            <UserPlus className="size-5 text-primary" aria-hidden="true" />
            Sign the Articles
          </h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Cancel">
            <X className="size-5" />
          </Button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Name</span>
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Grace O'Malley" required />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Epithet</span>
              <input className={field} value={epithet} onChange={(e) => setEpithet(e.target.value)} placeholder="The Sea Queen" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Role</span>
              <select className={field} value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Home port</span>
              <input className={field} value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Tortuga" />
            </label>
            <label className="col-span-2 space-y-1 text-sm">
              <span className="text-muted-foreground">Years at sea: {years}</span>
              <input
                type="range"
                min={0}
                max={40}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
            </label>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-black/20 p-3">
            <span className="text-sm font-semibold text-muted-foreground">Skill proficiencies</span>
            {SKILL_KEYS.map((k) => (
              <label key={k} className="block space-y-1 text-sm">
                <span className="flex justify-between">
                  <span>{SKILL_LABELS[k]}</span>
                  <span className="tabular-nums font-semibold">{skills[k]}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skills[k]}
                  onChange={(e) => setSkills((s) => ({ ...s, [k]: Number(e.target.value) }))}
                  className="w-full accent-[var(--color-primary)]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-card/95 p-4 backdrop-blur">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="lg">
            <UserPlus className="size-4" />
            Add to crew
          </Button>
        </div>
      </form>
    </div>
  )
}
