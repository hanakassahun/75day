"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const payload: Record<string, string> = { email, password }
    if (mode === "signup") payload.name = name

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Something went wrong")
      return
    }

    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">75day auth</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{mode === "login" ? "Sign in" : "Create account"}</h1>
          </div>
          <div className="grid gap-2">
            <Button variant={mode === "login" ? "secondary" : "outline"} onClick={() => setMode("login")}>Login</Button>
            <Button variant={mode === "signup" ? "secondary" : "outline"} onClick={() => setMode("signup")}>Sign Up</Button>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">Name</span>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            </label>
          ) : null}

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Email</span>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground">Password</span>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full">
            {mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  )
}
