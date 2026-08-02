"use client"

import { Textarea } from "@/components/ui/textarea"

interface ReflectionCardProps {
  day: number
  reflection: string
  win: string
  onChange: (patch: { reflection?: string; win?: string }) => void
}

export function ReflectionCard({ day, reflection, win, onChange }: ReflectionCardProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5" aria-label="Daily reflections">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Daily reflection</h2>
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
            onChange={(event) => onChange({ win: event.target.value })}
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
            onChange={(event) => onChange({ reflection: event.target.value })}
            placeholder="What worked, what did not, and what you will change tomorrow."
            className="min-h-[144px] resize-none bg-background text-sm leading-relaxed"
          />
        </div>

        <p className="label-mono">Saved automatically to this browser</p>
      </div>
    </section>
  )
}
