import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coffee, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && !name) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);

    if (mode === 'login') {
      const { error } = await login(email, password);
      setIsLoading(false);
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    } else {
      const { error } = await signUp(email, password, name);
      setIsLoading(false);
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Account created! Welcome to Chai Sutta Bar!');
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Texture */}
      <div className="texture-overlay" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-card rounded-3xl p-8 shadow-card">
          {/* Logo */}
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-orange mb-4">
              <Coffee className="w-8 h-8 text-chai-cream" />
            </div>
            <h1 className="font-display text-3xl text-foreground">
              CHAI SUTTA BAR
            </h1>
            <p className="text-muted-foreground mt-2">
              {mode === 'login' ? 'Welcome back, chai lover!' : 'Join the chai community'}
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                variant="orange" 
                size="xl" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Login' : 'Create Account'} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.form>
          </AnimatePresence>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
