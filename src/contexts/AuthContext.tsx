
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create a function to record session start
  const recordSessionStart = async (userId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          email: email,
          is_active: true
        });
        
      if (error) throw error;
    } catch (error: any) {
      console.error('Error recording session start:', error.message);
    }
  };

  // Create a function to record session end
  const recordSessionEnd = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          logout_time: new Date().toISOString(),
          is_active: false 
        })
        .eq('user_id', userId)
        .eq('is_active', true);
        
      if (error) throw error;
    } catch (error: any) {
      console.error('Error recording session end:', error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }

      // Record session start after successful login
      if (data.user) {
        await recordSessionStart(data.user.id, email);
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful",
        description: "Please check your email for verification",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Record session end before signing out
      if (user) {
        await recordSessionEnd(user.id);
      }
      
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
