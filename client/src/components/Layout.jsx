import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';
import { Sun, Moon, AlignLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from '@/utils/toast';

export default function Layout() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      toast.success('✅ Logged out successfully!');
      navigate('/login');
      setLoading(false);
    }, 2000);
  };

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-6 pt-20 md:pt-6">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <AlignLeft className="text-primary" size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-mono text-primary">
            <Link to="/" onClick={() => setMobileOpen(false)}>DocuFlow</Link>
          </h1>
        </div>

        {/* Theme Toggle */}
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
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/upload', label: 'Upload' },
            { to: '/documents', label: 'My Documents' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`block transition ${
                location.pathname === to
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        disabled={loading}
        className="w-full mt-8 font-mono cursor-pointer font-semibold text-base"
      >
        {loading ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen max-h-screen bg-background text-foreground relative">
      {/* Desktop Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between bg-muted/40 backdrop-blur-md border-r border-primary/30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle (Hamburger / X) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm">
          <aside className="fixed left-0 top-0 w-64 h-full bg-background border-r border-border shadow-md z-50 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
