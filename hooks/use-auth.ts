import { useEffect, useState } from "react"

export type AuthUser = { id: string; email: string; name?: string } | null

export function useAuth() {
  const [user, setUser] = useState<AuthUser | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    fetch("/api/auth")
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return
        setUser(data.user ?? null)
      })
      .catch(() => {
        if (!mounted) return
        setUser(null)
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return { user, loading, logout }
}
