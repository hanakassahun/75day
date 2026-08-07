"use client"

import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TASKS_PER_DAY, TOTAL_DAYS } from "@/lib/challenge-data"
import { cn } from "@/lib/utils"

interface DaySelectorProps {
  activeDay: number
  currentActiveDay: number
  onSelect: (day: number) => void
  completionByDay: number[]
}

export function DaySelector({ activeDay, currentActiveDay, onSelect, completionByDay }: DaySelectorProps) {
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const active = strip.querySelector<HTMLButtonElement>(`[data-day="${activeDay}"]`)
    if (!active) return
    const target = active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2
    strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" })
  }, [activeDay])

  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5" aria-label="Day selector">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="label-mono">Day</span>
          <span className="font-mono text-2xl font-medium tabular-nums leading-none">
            {String(activeDay).padStart(2, "0")}
          </span>
          <span className="font-mono text-xs text-muted-foreground">/ {TOTAL_DAYS}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-9 bg-transparent"
            onClick={() => onSelect(Math.max(1, activeDay - 1))}
            disabled={activeDay === 1}
            aria-label="Previous day"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9 bg-transparent"
            onClick={() => onSelect(Math.min(TOTAL_DAYS, activeDay + 1))}
            disabled={activeDay === TOTAL_DAYS}
            aria-label="Next day"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={stripRef}
        className="mt-4 flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:thin]"
        role="tablist"
        aria-label="Challenge days"
      >
        {Array.from({ length: TOTAL_DAYS }, (_, index) => index + 1).map((day) => {
          const done = completionByDay[day - 1] ?? 0
          const isPerfect = done === TASKS_PER_DAY
          const isActive = day === activeDay
          const isToday = day === currentActiveDay
          return (
            <button
              key={day}
              type="button"
              data-day={day}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(day)}
              className={cn(
                "flex size-10 shrink-0 flex-col items-center justify-center rounded-md border font-mono text-xs tabular-nums transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : isToday
                  ? "border-emerald-400/80 bg-emerald-500/10 text-foreground shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground",
              )}
            >
              {day}
              <span
                className={cn(
                  "mt-1 h-1 w-4 rounded-full",
                  isToday
                    ? "bg-emerald-400"
                    : isPerfect
                    ? "bg-accent"
                    : done > 0
                    ? "bg-accent/40"
                    : isActive
                    ? "bg-primary-foreground/30"
                    : "bg-muted",
                )}
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
