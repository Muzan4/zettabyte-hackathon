import { SKILL_KEYS, SKILL_LABELS, type Skills } from "@/lib/crew-types"

const SHORT: Record<string, string> = {
  swordsmanship: "Sword",
  gunnery: "Gunnery",
  navigation: "Nav",
  rigging: "Rigging",
  stealth: "Stealth",
  medicine: "Medicine",
}

export function SkillRadar({ skills, size = 240 }: { skills: Skills; size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 34
  const axes = SKILL_KEYS.length
  const angleFor = (i: number) => (Math.PI * 2 * i) / axes - Math.PI / 2

  const point = (i: number, r: number) => {
    const a = angleFor(i)
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const
  }

  const rings = [0.25, 0.5, 0.75, 1]

  const dataPts = SKILL_KEYS.map((k, i) => point(i, (skills[k] / 100) * radius))
  const dataPath = dataPts.map((p) => p.join(",")).join(" ")

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label="Skill proficiency radar"
      className="max-w-full"
    >
      {rings.map((r, ri) => (
        <polygon
          key={ri}
          points={SKILL_KEYS.map((_, i) => point(i, radius * r).join(",")).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.12}
          className="text-foreground"
        />
      ))}
      {SKILL_KEYS.map((_, i) => {
        const [x, y] = point(i, radius)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.12} className="text-foreground" />
      })}

      <polygon
        points={dataPath}
        fill="var(--color-primary)"
        fillOpacity={0.28}
        stroke="var(--color-primary)"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="var(--color-primary)" />
      ))}

      {SKILL_KEYS.map((k, i) => {
        const [x, y] = point(i, radius + 18)
        return (
          <text
            key={k}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[9px] font-medium uppercase tracking-wide"
          >
            <title>{SKILL_LABELS[k]}</title>
            {SHORT[k]}
          </text>
        )
      })}
    </svg>
  )
}
