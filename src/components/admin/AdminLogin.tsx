
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { session, isAdmin, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();

  console.log('AdminLogin - session:', session?.user?.email, 'isAdmin:', isAdmin, 'loading:', adminLoading);

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (session && isAdmin) {
    console.log('Redirecting to admin dashboard');
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Login successful for:', data.user?.email);
        toast({
          title: "Login successful",
          description: "Checking admin privileges...",
        });
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (resetEmail: string) => {
    try {
      // Use the current production URL instead of localhost
      const productionUrl = window.location.hostname.includes('localhost') 
        ? 'https://6e7f9caf-84a7-4cd3-a8b1-7bb52d23a5db.sandbox.lovable.dev'
        : window.location.origin;
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${productionUrl}/admin/login`,
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset sent",
          description: `A password reset link has been sent to ${resetEmail}. Check your email and click the link to reset your password.`,
        });
      }
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // Trigger password reset for temitopediana1@gmail.com
  const triggerPasswordReset = () => {
    handlePasswordReset('temitopediana1@gmail.com');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <img
              className="h-12 w-auto"
              src="/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png"
              alt="Gospool"
            />
          </div>
          <CardTitle className="text-2xl text-center font-bold text-foreground">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session && !isAdmin && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">
                You are logged in as {session.user?.email} but don't have admin privileges.
              </p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gospool.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={triggerPasswordReset}
            >
              Reset Password for temitopediana1@gmail.com
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
