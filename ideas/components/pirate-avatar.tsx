import { cn } from "@/lib/utils"
import { avatarHue, initials } from "@/lib/crew-utils"

export function PirateAvatar({
  id,
  name,
  size = 44,
  className,
}: {
  id: string
  name: string
  size?: number
  className?: string
}) {
  const hue = avatarHue(id)
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-[family-name:var(--font-display)] font-semibold ring-1 ring-inset ring-white/15",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        color: `oklch(0.95 0.03 ${hue})`,
        background: `radial-gradient(circle at 30% 25%, oklch(0.55 0.12 ${hue}), oklch(0.32 0.09 ${hue}))`,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}
