"use client"

import { useMemo } from "react"
import { TASKS_PER_DAY, TOTAL_DAYS } from "@/lib/challenge-data"
import { cn } from "@/lib/utils"

interface ConsistencyMatrixProps {
  completionByDay: number[]
  activeDay: number
  onSelect: (day: number) => void
}

function toneFor(done: number) {
  if (done === 0) return "bg-muted"
  const ratio = done / TASKS_PER_DAY
  if (ratio === 1) return "bg-chart-1"
  if (ratio >= 0.66) return "bg-chart-2"
  if (ratio >= 0.33) return "bg-chart-3"
  return "bg-chart-4"
}

export function ConsistencyMatrix({ completionByDay, activeDay, onSelect }: ConsistencyMatrixProps) {
  const days = useMemo(() => Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1), [])

  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5" aria-label="75 day consistency matrix">
      <div className="flex items-center justify-between">
        <h2 className="label-mono">Consistency matrix</h2>
        <span className="label-mono">75 days</span>
      </div>

      <div className="mt-4 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5">
        {days.map((day) => {
          const done = completionByDay[day - 1] ?? 0
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(day)}
              title={`Day ${day} — ${done}/${TASKS_PER_DAY} tasks`}
              aria-label={`Day ${day}, ${done} of ${TASKS_PER_DAY} tasks complete`}
              className={cn(
                "aspect-square rounded-[3px] transition-transform hover:scale-110",
                toneFor(done),
                day === activeDay && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
              )}
            />
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="label-mono">Less</span>
        <span className="size-3 rounded-[3px] bg-muted" />
        <span className="size-3 rounded-[3px] bg-chart-4" />
        <span className="size-3 rounded-[3px] bg-chart-3" />
        <span className="size-3 rounded-[3px] bg-chart-2" />
        <span className="size-3 rounded-[3px] bg-chart-1" />
        <span className="label-mono">More</span>
      </div>
    </section>
  )
}
