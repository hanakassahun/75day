"use client"

import { Lock } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ReflectionCardProps {
  day: number
  reflection: string
  win: string
  onChange: (patch: { reflection?: string; win?: string }) => void
  disabled?: boolean
  isPastDay?: boolean
}

export function ReflectionCard({ day, reflection, win, onChange, disabled = false, isPastDay = false }: ReflectionCardProps) {
  return (
    <section className="relative rounded-lg border border-border bg-card p-4 md:p-5" aria-label="Daily reflections">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Daily reflection</h2>
          {isPastDay ? (
            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Lock className="size-3" aria-hidden="true" />
              <span>Read-only</span>
            </div>
          ) : null}
        </div>
        <span className="label-mono">Day {String(day).padStart(2, "0")}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`win-${day}`} className="label-mono">
            One win today
          </label>
          <Textarea
            id={`win-${day}`}
            value={win}
            onChange={(event) => !disabled && onChange({ win: event.target.value })}
            readOnly={disabled}
            placeholder="The thing you are proudest of."
            className="min-h-[72px] resize-none bg-background text-sm leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`reflection-${day}`} className="label-mono">
            Notes, blockers, how you felt
          </label>
          <Textarea
            id={`reflection-${day}`}
            value={reflection}
            onChange={(event) => !disabled && onChange({ reflection: event.target.value })}
            readOnly={disabled}
            placeholder="What worked, what did not, and what you will change tomorrow."
            className="min-h-[144px] resize-none bg-background text-sm leading-relaxed"
          />
        </div>

        <p className="label-mono">Saved automatically to this browser</p>
      </div>
    </section>
  )
}
