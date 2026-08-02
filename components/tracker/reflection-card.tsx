"use client"

import { Textarea } from "@/components/ui/textarea"

interface ReflectionCardProps {
  day: number
  reflection: string
  win: string
  onChange: (patch: { reflection?: string; win?: string }) => void
  disabled?: boolean
}

export function ReflectionCard({ day, reflection, win, onChange, disabled = false }: ReflectionCardProps) {
  return (
    <section className="relative rounded-lg border border-border bg-card p-4 md:p-5" aria-label="Daily reflections">
      {disabled ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg animate-bounce motion-reduce:animate-none opacity-95">
            Naaaaaaahh💀
          </span>
        </div>
      ) : null}
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
            onChange={(event) => !disabled && onChange({ win: event.target.value })}
            disabled={disabled}
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
            disabled={disabled}
            placeholder="What worked, what did not, and what you will change tomorrow."
            className="min-h-[144px] resize-none bg-background text-sm leading-relaxed"
          />
        </div>

        <p className="label-mono">Saved automatically to this browser</p>
      </div>
    </section>
  )
}
