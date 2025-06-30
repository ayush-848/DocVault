// src/components/ThemeToggle.jsx
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-between w-full px-4 py-2 bg-muted hover:bg-muted/50 border border-border rounded-md transition-colors font-mono text-sm text-muted-foreground"
    >
      <span className="text-foreground font-semibold">
        Mode: {isDark ? 'Dark' : 'Light'}
      </span>
      <span className="text-xs uppercase tracking-wide opacity-60">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
