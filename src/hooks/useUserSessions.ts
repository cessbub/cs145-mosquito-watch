
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

export interface UserSession {
  id: string;
  user_id: string;
  email: string;
  login_time: string;
  logout_time: string | null;
  created_at: string;
  is_active: boolean;
  // Computed properties
  duration?: string;
  login_time_formatted?: string;
  logout_time_formatted?: string;
}

interface SessionFilters {
  active?: boolean | null;
  email?: string | null;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  } | null;
}

export const useUserSessions = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SessionFilters>({});

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('user_sessions')
        .select('*')
        .order('login_time', { ascending: false });
      
      // Apply filters if they exist
      if (filters.active !== undefined && filters.active !== null) {
        query = query.eq('is_active', filters.active);
      }
      
      if (filters.email) {
        query = query.ilike('email', `%${filters.email}%`);
      }
      
      if (filters.dateRange?.from) {
        query = query.gte('login_time', filters.dateRange.from.toISOString());
      }
      
      if (filters.dateRange?.to) {
        query = query.lte('login_time', filters.dateRange.to.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process data to add computed properties
      const processedData = data.map(session => {
        const loginDate = new Date(session.login_time);
        const logoutDate = session.logout_time ? new Date(session.logout_time) : null;
        
        // Calculate duration
        let duration = '';
        if (session.is_active) {
          duration = `Active (${formatDistanceToNow(loginDate)})`;
        } else if (logoutDate) {
          const durationMs = logoutDate.getTime() - loginDate.getTime();
          const durationMinutes = Math.floor(durationMs / (1000 * 60));
          const hours = Math.floor(durationMinutes / 60);
          const minutes = durationMinutes % 60;
          duration = `${hours}h ${minutes}m`;
        }
        
        return {
          ...session,
          duration,
          login_time_formatted: loginDate.toLocaleString(),
          logout_time_formatted: logoutDate ? logoutDate.toLocaleString() : '-'
        };
      });
      
      setSessions(processedData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Set up real-time subscription for active sessions
  useEffect(() => {
    fetchSessions();
    
    // Subscribe to changes
    const channel = supabase
      .channel('user_sessions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_sessions' },
        () => {
          // Refetch whenever there's a change
          fetchSessions();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);
  
  return {
    sessions,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchSessions
  };
};
