
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, playerTag?: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up initial session and user
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    fetchSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${email}!`,
      });
      
      return { data, error: null };
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string, playerTag?: string) => {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      // If player tag is provided, save it to the player_data table
      if (playerTag && data.user) {
        const { error: playerDataError } = await supabase
          .from('player_data')
          .insert({
            user_id: data.user.id,
            player_tag: playerTag,
          });

        if (playerDataError) {
          toast({
            title: "Error saving player tag",
            description: playerDataError.message,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Signed up successfully",
        description: "Welcome to Clash Companion!",
      });

      return { data, error: null };
    } catch (error) {
      toast({
        title: "Error signing up",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
