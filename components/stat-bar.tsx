import { cn } from "@/lib/utils"
import type { StatusLevel } from "@/lib/crew-utils"

const STATUS_COLOR: Record<StatusLevel, string> = {
  good: "bg-[oklch(0.72_0.15_150)]",
  warn: "bg-[oklch(0.8_0.15_80)]",
  danger: "bg-[oklch(0.62_0.2_25)]",
}

const STATUS_TEXT: Record<StatusLevel, string> = {
  good: "text-[oklch(0.82_0.14_150)]",
  warn: "text-[oklch(0.85_0.14_82)]",
  danger: "text-[oklch(0.72_0.2_25)]",
}

export function StatBar({
  label,
  value,
  status,
  suffix = "",
  className,
}: {
  label: string
  value: number
  status?: StatusLevel
  suffix?: string
  className?: string
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-semibold tabular-nums", status ? STATUS_TEXT[status] : "text-foreground")}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/30">
        <div
          className={cn("h-full rounded-full transition-all", status ? STATUS_COLOR[status] : "bg-primary")}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}
