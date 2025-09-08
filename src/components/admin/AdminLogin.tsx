
import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const { session, isAdmin, isLoading: adminLoading } = useAdmin();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Check for password reset token in URL
  useEffect(() => {
    console.log('Current URL:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Check for different possible token formats
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    const token = searchParams.get('token');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    
    console.log('Token parameters:', { accessToken, refreshToken, type, token, errorCode, errorDescription });

    // Handle errors first
    if (errorCode || errorDescription) {
      console.error('Password reset error:', errorCode, errorDescription);
      toast({
        title: "Password Reset Error",
        description: errorDescription || "There was an error with your password reset link.",
        variant: "destructive",
      });
      return;
    }

    // Method 1: Direct access_token and refresh_token
    if (accessToken && refreshToken && type === 'recovery') {
      console.log('Password reset token detected - method 1 (access/refresh tokens)');
      setShowPasswordUpdate(true);
      setShowForgotPassword(false);
      
      // Set the session with the tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          console.error('Error setting session:', error);
          toast({
            title: "Session Error",
            description: "There was an error with your reset link. Please try again.",
            variant: "destructive",
          });
        } else {
          console.log('Session set successfully for password reset');
          toast({
            title: "Password Reset",
            description: "Please enter your new password below.",
          });
        }
      });
    } 
    // Method 2: Single token with type recovery
    else if (token && type === 'recovery') {
      console.log('Password reset token detected - method 2 (single token)');
      setShowPasswordUpdate(true);
      setShowForgotPassword(false);
      toast({
        title: "Password Reset",
        description: "Please enter your new password below.",
      });
    }
    // Method 3: Just type recovery (sometimes tokens are handled automatically by Supabase)
    else if (type === 'recovery') {
      console.log('Password reset token detected - method 3 (type only)');
      setShowPasswordUpdate(true);
      setShowForgotPassword(false);
      toast({
        title: "Password Reset",
        description: "Please enter your new password below.",
      });
    }

    // Listen for auth state changes (including password recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery event detected');
        setShowPasswordUpdate(true);
        setShowForgotPassword(false);
        toast({
          title: "Password Reset",
          description: "Please enter your new password below.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, toast]);

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

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResettingPassword(true);

    try {
      // Get the current origin and explicitly set the admin login path
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/admin/login`;
      
      console.log('Sending password reset email with redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
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
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "The passwords you entered don't match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated successfully",
          description: "Your password has been updated. You can now log in with your new password.",
        });
        setShowPasswordUpdate(false);
        setNewPassword('');
        setConfirmPassword('');
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      toast({
        title: "Password update failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
      return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <img
              className="h-12 w-auto"
              src="/images/Logo mark v2 dark.png"
              alt="Gospool"
            />
          </div>
          <CardTitle className="text-2xl text-center font-bold text-foreground">
            {showPasswordUpdate ? 'Set New Password' : showForgotPassword ? 'Reset Password' : 'Admin Login'}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {showPasswordUpdate 
              ? 'Enter your new password to complete the reset'
              : showForgotPassword 
                ? 'Enter your email address to receive a password reset link'
                : 'Enter your credentials to access the admin dashboard'
            }
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
          
          {showPasswordUpdate ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          ) : showForgotPassword ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder="admin@gospool.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </form>
          ) : (
            <>
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
              
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;