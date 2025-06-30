import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input} from '@/components/ui/input';
import { Card} from '@/components/ui/card';
import { Button} from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const success=await login({ email, password });
    console.log(success); // Debugging line to check response structure
    if(success){
      navigate('/dashboard'); 
    }
  } catch (err) {
    alert('Login failed');
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Card>
    </div>
  );
}
