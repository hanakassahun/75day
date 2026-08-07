"use client"

import { useEffect, useState } from "react"
import { Flame, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useChallenge } from "@/hooks/use-challenge"
import { AuthUser } from "@/hooks/use-auth"
import { ALL_TASK_IDS, CATEGORIES, TASKS_PER_DAY, TOTAL_DAYS } from "@/lib/challenge-data"
import { CategoryCard } from "./category-card"
import { ConsistencyMatrix } from "./consistency-matrix"
import { DaySelector } from "./day-selector"
import { LoadingSpinner } from "./loading-spinner"
import { ProgressRing } from "./progress-ring"
import { ReflectionCard } from "./reflection-card"
import { StatTile } from "./stat-tile"
import { ThemeToggle } from "./theme-toggle"

export function ChallengeDashboard({ user }: { user: AuthUser }) {
  const {
    hydrated,
    loadingRemote,
    activeDay,
    setActiveDay,
    getEntry,
    updateEntry,
    toggleTask,
    setDayTasks,
    resetAll,
    completionByDay,
    currentDay,
    isDayLocked,
    stats,
  } = useChallenge(user?.id)
  const selectedDay = activeDay
  const currentActiveDay = currentDay
  const isPastDay = hydrated && selectedDay < currentActiveDay
  const isToday = hydrated && selectedDay === currentActiveDay
  const isFutureDay = hydrated && selectedDay > currentActiveDay
  const [resetOpen, setResetOpen] = useState(false)

  const entry = getEntry(activeDay)
  const doneToday = ALL_TASK_IDS.filter((id) => entry.tasks[id]).length
  const percentToday = Math.round((doneToday / TASKS_PER_DAY) * 100)
  const overallPercent = Math.round((stats.totalCompleted / (TOTAL_DAYS * TASKS_PER_DAY)) * 100)
  const [totalUsers, setTotalUsers] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/community/stats')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return
        if (data && typeof data.total === 'number') setTotalUsers(data.total)
      })
      .catch(() => {
        if (!mounted) return
        setTotalUsers(null)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (loadingRemote) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <LoadingSpinner />
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-mono">75 day challenge</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance md:text-4xl">The Protocol</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Seven disciplines, twenty-eight daily reps. Check them off, write it down, repeat for seventy-five days.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3">
              <Flame className="size-4 text-accent" aria-hidden="true" />
              <span className="font-mono text-xs tabular-nums">
                {stats.currentStreak} day streak
              </span>
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="size-9 bg-transparent"
              onClick={() => setResetOpen(true)}
              aria-label="Reset challenge"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section
            className="flex flex-col items-center gap-5 rounded-lg border border-border bg-card p-5 sm:flex-row sm:gap-6 lg:col-span-2"
            aria-label="Today's progress"
          >
            <ProgressRing value={hydrated ? percentToday : 0} label="Today" />
            <div className="w-full">
              <p className="label-mono">Day {String(activeDay).padStart(2, "0")} completion</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-balance">
                {doneToday} of {TASKS_PER_DAY} tasks complete
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {percentToday === 100
                  ? "Perfect day locked in. Rest well and run it again tomorrow."
                  : percentToday >= 50
                    ? "Over halfway. Close the loop on what is left."
                    : "Pick the hardest one first and start there."}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3">
                <div>
                  <dt className="label-mono">Perfect days</dt>
                  <dd className="mt-1 font-mono text-xl tabular-nums">{stats.perfectDays}</dd>
                </div>
                <div>
                  <dt className="label-mono">Days logged</dt>
                  <dd className="mt-1 font-mono text-xl tabular-nums">{stats.daysLogged}</dd>
                </div>
                <div>
                  <dt className="label-mono">Challenge done</dt>
                  <dd className="mt-1 font-mono text-xl tabular-nums">{overallPercent}%</dd>
                </div>
              </dl>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2">
            <StatTile label="Best streak" value={stats.bestStreak} unit="days" />
            <StatTile label="Reps completed" value={stats.totalCompleted} unit={`/ ${TOTAL_DAYS * TASKS_PER_DAY}`} />
            <div className="flex items-center justify-start lg:col-span-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 text-xs text-zinc-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{totalUsers || "..."} members on the protocol</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <DaySelector activeDay={activeDay} onSelect={setActiveDay} completionByDay={completionByDay} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                day={activeDay}
                checked={entry.tasks}
                onToggle={(taskId) => toggleTask(activeDay, taskId)}
                onToggleAll={(taskIds, value) => setDayTasks(activeDay, taskIds, value)}
                disabled={hydrated ? isDayLocked(activeDay) : false}
                isPastDay={isPastDay}
                isFutureDay={isFutureDay}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <ReflectionCard
              day={activeDay}
              reflection={entry.reflection}
              win={entry.win}
              onChange={(patch) => updateEntry(activeDay, patch)}
              disabled={hydrated ? isDayLocked(activeDay) : false}
              isPastDay={isPastDay}
              isToday={isToday}
              isFutureDay={isFutureDay}
            />
            <ConsistencyMatrix
              completionByDay={completionByDay}
              activeDay={activeDay}
              onSelect={setActiveDay}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset the whole challenge?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears every checked task and reflection for all 75 days from this browser. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my progress</AlertDialogCancel>
            <AlertDialogAction
              onClick={resetAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
