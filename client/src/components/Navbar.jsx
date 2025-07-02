import { Button } from '@/components/ui/button'
import { Sun, Moon, AlignLeft } from 'lucide-react'

export default function Navbar({ theme, setTheme }) {
  const navigate = (path) => {
    window.location.href = path
  }

  return (
    <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
      <a href="/" className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <AlignLeft className="text-primary" size={20} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight font-mono text-primary">
          DocuFlow
        </h1>
      </a>

      <div className="hidden md:flex items-center gap-8 text-muted-foreground">
        <button className="text-primary transition cursor-pointer">Features</button>
        <button className="text-primary transition cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button className="text-primary transition cursor-pointer">About</button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle setTheme={setTheme} theme={theme} />
        <Button
          className="bg-primary text-black font-semibold px-5 cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          Get Started
        </Button>
      </div>
    </nav>
  )
}

function ThemeToggle({ setTheme, theme }) {
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="text-muted-foreground cursor-pointer hover:text-primary transition"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
