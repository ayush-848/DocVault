import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import Navbar from '@/components/Navbar';
import { useTheme } from 'next-themes';
import { Eye, EyeOff } from 'lucide-react';
import toast from '@/utils/toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { setTheme, theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message } = await login({ email, password });
      setTimeout(() => {
        if (success) {
          toast.success(`✅ ${message}`);
          navigate('/dashboard');
        } else {
          toast.error(`❌ ${message}`);
        }
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        toast.error(`${err.message || '⚠️ Something went wrong during login.'}`);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <Navbar setTheme={setTheme} theme={theme} />
      <div className="flex items-center justify-center min-h-[90vh] px-4">
        <Card className="w-full max-w-md p-6 space-y-6 shadow-md border border-border bg-card">
          <h2 className="text-2xl font-semibold text-center font-mono">Login to Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type="submit" className="w-full cursor-pointer text-gray-200 dark:text-black" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <span
                className="cursor-pointer text-primary"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </span>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}
