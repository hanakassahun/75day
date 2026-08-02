"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ALL_TASK_IDS, TASKS_PER_DAY, TOTAL_DAYS } from "@/lib/challenge-data"

const STORAGE_KEY = "challenge-75:v1"

export interface DayEntry {
  tasks: Record<string, boolean>
  reflection: string
  win: string
}

export interface ChallengeState {
  startedAt: string
  days: Record<string, DayEntry>
}

const emptyEntry: DayEntry = { tasks: {}, reflection: "", win: "" }

function createInitialState(): ChallengeState {
  return { startedAt: new Date().toISOString(), days: {} }
}

function parseState(raw: string | null): ChallengeState {
  if (!raw) return createInitialState()
  try {
    const parsed = JSON.parse(raw) as Partial<ChallengeState>
    if (!parsed || typeof parsed !== "object" || typeof parsed.days !== "object" || parsed.days === null) {
      return createInitialState()
    }
    return {
      startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : new Date().toISOString(),
      days: parsed.days as Record<string, DayEntry>,
    }
  } catch {
    return createInitialState()
  }
}

export function useChallenge() {
  const [state, setState] = useState<ChallengeState>(createInitialState)
  const [activeDay, setActiveDay] = useState(1)
  const [hydrated, setHydrated] = useState(false)

  // Load once on mount so server and client markup match on first paint.
  useEffect(() => {
    setState(parseState(window.localStorage.getItem(STORAGE_KEY)))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const getEntry = useCallback(
    (day: number): DayEntry => {
      const entry = state.days[String(day)]
      if (!entry) return emptyEntry
      return { tasks: entry.tasks ?? {}, reflection: entry.reflection ?? "", win: entry.win ?? "" }
    },
    [state.days],
  )

  const updateEntry = useCallback((day: number, patch: Partial<DayEntry>) => {
    setState((previous) => {
      const key = String(day)
      const current = previous.days[key] ?? emptyEntry
      return {
        ...previous,
        days: { ...previous.days, [key]: { ...current, ...patch } },
      }
    })
  }, [])

  const toggleTask = useCallback((day: number, taskId: string) => {
    setState((previous) => {
      const key = String(day)
      const current = previous.days[key] ?? emptyEntry
      const tasks = { ...current.tasks, [taskId]: !current.tasks[taskId] }
      return { ...previous, days: { ...previous.days, [key]: { ...current, tasks } } }
    })
  }, [])

  const setDayTasks = useCallback((day: number, taskIds: string[], value: boolean) => {
    setState((previous) => {
      const key = String(day)
      const current = previous.days[key] ?? emptyEntry
      const tasks = { ...current.tasks }
      for (const id of taskIds) tasks[id] = value
      return { ...previous, days: { ...previous.days, [key]: { ...current, tasks } } }
    })
  }, [])

  const resetAll = useCallback(() => {
    setState(createInitialState())
    setActiveDay(1)
  }, [])

  const completionByDay = useMemo(() => {
    const result: number[] = []
    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const tasks = state.days[String(day)]?.tasks ?? {}
      let done = 0
      for (const id of ALL_TASK_IDS) if (tasks[id]) done++
      result.push(done)
    }
    return result
  }, [state.days])

  const stats = useMemo(() => {
    const perfectDays = completionByDay.filter((done) => done === TASKS_PER_DAY).length
    const totalCompleted = completionByDay.reduce((sum, done) => sum + done, 0)

    let bestStreak = 0
    let running = 0
    for (const done of completionByDay) {
      if (done === TASKS_PER_DAY) {
        running++
        bestStreak = Math.max(bestStreak, running)
      } else {
        running = 0
      }
    }

    // Current streak = perfect days counted backwards from the last day with any activity.
    let lastTouched = 0
    for (let day = TOTAL_DAYS; day >= 1; day--) {
      if (completionByDay[day - 1] > 0) {
        lastTouched = day
        break
      }
    }
    let currentStreak = 0
    for (let day = lastTouched; day >= 1; day--) {
      if (completionByDay[day - 1] === TASKS_PER_DAY) currentStreak++
      else break
    }

    const daysLogged = completionByDay.filter((done) => done > 0).length
    const consistency = daysLogged === 0 ? 0 : Math.round((totalCompleted / (daysLogged * TASKS_PER_DAY)) * 100)

    return { perfectDays, totalCompleted, currentStreak, bestStreak, daysLogged, consistency }
  }, [completionByDay])

  return {
    hydrated,
    startedAt: state.startedAt,
    activeDay,
    setActiveDay,
    getEntry,
    updateEntry,
    toggleTask,
    setDayTasks,
    resetAll,
    completionByDay,
    stats,
  }
}
