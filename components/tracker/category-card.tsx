"use client"

import { Activity, Brain, Code, Flower2, Lock, Moon, Salad, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Category, IconName } from "@/lib/challenge-data"
import { cn } from "@/lib/utils"

const ICONS: Record<IconName, LucideIcon> = {
  code: Code,
  activity: Activity,
  salad: Salad,
  brain: Brain,
  moon: Moon,
  wallet: Wallet,
  flower: Flower2,
}

interface CategoryCardProps {
  category: Category
  day: number
  checked: Record<string, boolean>
  onToggle: (taskId: string) => void
  onToggleAll: (taskIds: string[], value: boolean) => void
  disabled?: boolean
  isPastDay?: boolean
  isFutureDay?: boolean
}

export function CategoryCard({ category, day, checked, onToggle, onToggleAll, disabled = false, isPastDay = false, isFutureDay = false }: CategoryCardProps) {
  const Icon = ICONS[category.icon]
  const taskIds = category.tasks.map((task) => task.id)
  const done = taskIds.filter((id) => checked[id]).length
  const complete = done === taskIds.length

  const isLocked = isPastDay || isFutureDay

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-lg border bg-card p-4 transition-colors",
        complete ? "border-accent" : "border-border",
        disabled ? "opacity-95" : "",
      )}
    >
      {isLocked ? (
        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Lock className="size-3" aria-hidden="true" />
          <span>Locked</span>
        </div>
      ) : null}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-md transition-colors",
              complete ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight">{category.name}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{category.summary}</p>
          </div>
        </div>
        <span className="label-mono shrink-0 tabular-nums">
          {done}/{taskIds.length}
        </span>
      </header>

      <ul className="mt-4 flex flex-col gap-1">
        {category.tasks.map((task) => {
          const inputId = `day-${day}-${task.id}`
          const isChecked = Boolean(checked[task.id])
          return (
            <li key={task.id}>
              <label
                htmlFor={inputId}
                className={cn(
                  "flex items-start gap-3 rounded-md px-2 py-2 transition-colors",
                  !disabled ? "cursor-pointer hover:bg-muted" : "",
                  isChecked && "bg-muted/60",
                )}
              >
                <Checkbox
                  id={inputId}
                  checked={isChecked}
                  disabled={disabled}
                  onCheckedChange={() => !disabled && onToggle(task.id)}
                  className="mt-0.5 data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-sm leading-snug",
                      isChecked && "text-muted-foreground line-through",
                    )}
                  >
                    {task.label}
                  </span>
                  {task.hint ? <span className="label-mono mt-0.5 block">{task.hint}</span> : null}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <footer className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="h-1 w-full max-w-[60%] overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${(done / taskIds.length) * 100}%` }}
          />
        </div>
        <button
          type="button"
          onClick={() => !disabled && onToggleAll(taskIds, !complete)}
          disabled={disabled}
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
            disabled ? "text-muted-foreground opacity-60" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {complete ? "Clear" : "All done"}
        </button>
      </footer>
    </article>
  )
}
