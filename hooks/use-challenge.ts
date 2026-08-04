"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ALL_TASK_IDS, TASKS_PER_DAY, TOTAL_DAYS } from "@/lib/challenge-data"

const STORAGE_KEY = "challenge-75:v1"
const START_KEY = "challenge_start_date"

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

export function useChallenge(userId?: string) {
  const [state, setState] = useState<ChallengeState>(createInitialState)
  const [activeDay, setActiveDay] = useState(1)
  const [currentDay, setCurrentDay] = useState<number>(1)
  const [hydrated, setHydrated] = useState(false)
  const [loadingRemote, setLoadingRemote] = useState(false)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load once on mount and initialize persistent challenge start date.
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = parseState(raw)
    // Ensure startedAt aligns with persistent start key if present.
    const startFromStorage = window.localStorage.getItem(START_KEY)
    const start = startFromStorage ?? new Date().toISOString()
    if (!startFromStorage) window.localStorage.setItem(START_KEY, start)

    setState((prev) => ({ ...parsed, startedAt: start }))
    setHydrated(true)

    // compute current day based on start date
    const compute = () => {
      try {
        const startDate = new Date(start)
        const now = new Date()
        // floor difference in UTC days
        const diffMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        const day = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
        const clamped = Math.min(Math.max(day, 1), TOTAL_DAYS)
        setCurrentDay(clamped)
      } catch {
        setCurrentDay(1)
      }
    }

    compute()
    const t = setInterval(compute, 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const loadEntries = useCallback((entries: Array<{ day: number; reflection?: string; win?: string; tasks?: Array<{ task_id: string; completed: boolean }> }>) => {
    setState((previous) => {
      const days = { ...previous.days }

      for (const entry of entries) {
        const tasks: Record<string, boolean> = {}
        for (const task of entry.tasks ?? []) {
          tasks[task.task_id] = task.completed
        }

        days[String(entry.day)] = {
          tasks,
          reflection: entry.reflection ?? "",
          win: entry.win ?? "",
        }
      }

      return { ...previous, days }
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    setLoadingRemote(true)
    fetch("/api/reflections")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load reflections")
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) return
        loadEntries(data.map((reflection: any) => ({
          day: reflection.day ?? 0,
          reflection: reflection.content ?? "",
          win: reflection.win ?? "",
          tasks: Array.isArray(reflection.tasks)
            ? reflection.tasks.map((task: any) => ({ task_id: task.task_id, completed: task.completed }))
            : [],
        })))
      })
      .catch(() => {
        // No-op, keep local state if remote loading fails.
      })
      .finally(() => setLoadingRemote(false))
  }, [userId, loadEntries])

  const saveCurrentDay = useCallback(
    (day: number, entry: DayEntry) => {
      if (!userId) return
      fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day,
          content: entry.reflection,
          win: entry.win,
          tasks: Object.entries(entry.tasks).map(([task_id, completed]) => ({ task_id, completed })),
        }),
      })
    },
    [userId],
  )

  useEffect(() => {
    if (!hydrated || !userId) return
    const entry = state.days[String(activeDay)]
    if (!entry) return

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }

    saveTimeout.current = setTimeout(() => {
      saveCurrentDay(activeDay, entry)
    }, 700)

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current)
      }
    }
  }, [activeDay, hydrated, saveCurrentDay, state.days, userId])

  // Helper to test whether a given day is the real-world current challenge day.
  const isDayLocked = useCallback(
    (day: number) => {
      if (!hydrated) return false
      return day !== currentDay
    },
    [hydrated, currentDay],
  )

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
    loadingRemote,
    startedAt: state.startedAt,
    activeDay,
    setActiveDay,
    getEntry,
    updateEntry,
    toggleTask,
    setDayTasks,
    loadEntries,
    resetAll,
    completionByDay,
    currentDay,
    isDayLocked,
    stats,
  }
}
