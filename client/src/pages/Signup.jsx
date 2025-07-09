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

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message } = await register({ username, email, password });

      setTimeout(() => {
        if (success) {
          toast.success('✅ Account created!');
          navigate('/dashboard');
        } else {
          toast.error(`❌ ${message}`);
        }
        setLoading(false);
      }, 2000);
    } catch (err) {
      setTimeout(() => {
        toast.error('⚠️ Something went wrong.');
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <Navbar setTheme={setTheme} theme={theme} />
      <div className="flex items-center justify-center min-h-[90vh] px-4">
        <Card className="w-full max-w-md p-6 space-y-6 shadow-md border border-border bg-card">
          <h2 className="text-2xl font-semibold text-center font-mono">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
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

            <Button
              type="submit"
              className="w-full cursor-pointer text-gray-200 dark:text-black"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <span
                className=" cursor-pointer text-primary"
                onClick={() => navigate('/login')}
              >
                Log in
              </span>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}
