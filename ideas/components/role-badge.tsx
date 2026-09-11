import { Anchor, Bomb, Crown, Eye, Hammer, Scale, Waves, type LucideIcon } from "lucide-react"
import type { Role } from "@/lib/crew-types"
import { cn } from "@/lib/utils"

export const ROLE_ICON: Record<Role, LucideIcon> = {
  Captain: Crown,
  Quartermaster: Scale,
  Bosun: Anchor,
  "Master Gunner": Bomb,
  Lookout: Eye,
  Shipwright: Hammer,
  Deckhand: Waves,
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const Icon = ROLE_ICON[role]
  const isCaptain = role === "Captain"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        isCaptain
          ? "border-primary/50 bg-primary/15 text-primary"
          : "border-border bg-secondary/60 text-foreground/80",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {role}
    </span>
  )
}
