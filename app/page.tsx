"use client"

import { ChallengeDashboard } from "@/components/tracker/challenge-dashboard"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-center text-sm text-muted-foreground">
        Checking authentication...
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-center">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 shadow-xl shadow-black/5">
          <h1 className="text-3xl font-semibold text-foreground">Welcome to 75day</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Please sign in or create an account to save your challenge progress.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/auth"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Sign in / Sign up
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <ChallengeDashboard user={user} />
    </main>
  )
}
