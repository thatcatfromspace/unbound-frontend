import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function Login() {
  const [key, setKey] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key.trim()) {
      addToast("API Key required", "error");
      return;
    }

    login(key);
    addToast("Identity Verified. Access Granted.", "success");
    
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 ring-1 ring-primary/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Terminal className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-mono">
            COMMAND_GATEWAY
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            ENTER_ACCESS_CREDENTIALS
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-8 shadow-2xl transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-mono text-primary">
                API_KEY
              </label>
              <Input
                id="apiKey"
                type="text" // Visible for easy pasting, or password? Usually API keys are treated as secrets. I'll make it password type but maybe a toggle would be nice. Simple text for now or password. User said "Login Screen: A simple input field".
                placeholder="..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary transition-colors text-center tracking-widest"
                autoFocus
              />
            </div>
            
            <Button type="submit" className="w-full group-hover:animate-pulse">
              INITIALIZE_SESSION
            </Button>
          </form>
        </div>

        <div className="text-center text-xs text-muted-foreground font-mono opacity-50">
          SECURE_CONNECTION_ESTABLISHED_V2.0
        </div>
      </div>
    </div>
  );
}
