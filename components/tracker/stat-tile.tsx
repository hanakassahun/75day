interface StatTileProps {
  label: string
  value: string | number
  unit?: string
}

export function StatTile({ label, value, unit }: StatTileProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
      <span className="label-mono text-pretty">{label}</span>
      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-medium tabular-nums leading-none tracking-tight">{value}</span>
        {unit ? <span className="label-mono">{unit}</span> : null}
      </div>
    </div>
  )
}
