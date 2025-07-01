import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { Sun, Moon, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex min-h-screen max-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between bg-muted/40 backdrop-blur-md border-r border-primary/30 p-6 shadow-sm">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <AlignLeft className="text-primary" size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-mono text-primary">
              <Link to="/">DocuFlow</Link>
            </h1>
          </div>

          {/* Theme Toggle - FULL clickable */}
          <button
            onClick={toggleTheme}
            className="w-full bg-muted px-4 py-3 rounded-lg cursor-pointer flex items-center justify-between mb-8 border border-border hover:border-primary/50 hover:shadow transition-all"
            aria-label="Toggle theme"
          >
            <span className="font-mono font-semibold">Mode: {theme === 'light' ? 'Light' : 'Dark'}</span>
            {theme === 'light' ? (
              <Sun className="text-yellow-500" size={18} />
            ) : (
              <Moon className="text-blue-300" size={18} />
            )}
          </button>

          {/* Nav Links */}
          <nav className="space-y-4 font-mono">
            <Link
              to="/dashboard"
              className={`block transition ${
                location.pathname === '/dashboard'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className={`block transition ${
                location.pathname === '/upload'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Upload
            </Link>
            <Link
              to="/documents"
              className={`block transition ${
                location.pathname === '/documents'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              My Documents
            </Link>
          </nav>
        </div>

        {/* Logout Button - Full red block */}
        <Button
          variant="destructive"
          onClick={logout}
          className="w-full mt-8 font-mono cursor-pointer font-semibold text-base"
        >
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
