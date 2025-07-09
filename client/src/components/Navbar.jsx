import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, AlignLeft, Menu, X } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ theme, setTheme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="p-2 bg-primary/10 rounded-lg">
            <AlignLeft className="text-primary" size={20} />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight font-mono text-primary">
            DocuFlow
          </h1>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-muted-foreground">
          <HashLink smooth to="/#features" className="text-primary cursor-pointer">
            Features
          </HashLink>
          <button className="text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <HashLink smooth to="/#about" className="text-primary cursor-pointer">
            About
          </HashLink>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle setTheme={setTheme} theme={theme} />
          <Button
            className="bg-primary text-gray-200 dark:text-black font-semibold px-5 cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-primary cursor-pointer"
            aria-label="Open Menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-0 z-50 flex flex-col justify-center items-center text-primary bg-gray-200 dark:bg-black ">
            {/* Close Button Top-Right */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-primary cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Menu Items */}
            <div className="flex flex-col items-center gap-6 text-xl font-mono">
              <HashLink
                smooth
                to="/#features"
                className="cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </HashLink>
              <button onClick={() => handleNavigate('/dashboard')} className="cursor-pointer">
                Dashboard
              </button>
              <HashLink
                smooth
                to="/#about"
                className="cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </HashLink>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <ThemeToggle setTheme={setTheme} theme={theme} />
              <Button
                className="bg-primary text-gray-200 dark:text-black font-semibold text-sm px-6 py-2 mt-2 cursor-pointer"
                onClick={() => handleNavigate('/signup')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ThemeToggle({ setTheme, theme }) {
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="text-muted-foreground hover:text-primary transition cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
