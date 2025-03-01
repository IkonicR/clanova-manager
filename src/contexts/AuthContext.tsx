import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  savePlayerData: (userId: string, playerTag: string, clanTag?: string) => Promise<void>;
  saveClanMembership: (userId: string, clanTag: string, role?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("AuthProvider - Initializing");

  useEffect(() => {
    // Set up initial session and user
    const fetchSession = async () => {
      console.log("AuthProvider - Fetching session");
      const { data } = await supabase.auth.getSession();
      console.log("AuthProvider - Got session:", data.session ? "Session exists" : "No session");
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    fetchSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("AuthProvider - Auth state changed:", event);
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

  const fetchPlayerData = async (playerTag: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("getPlayerData", {
        body: { playerTag },
      });

      if (error) {
        console.error("Error fetching player data:", error);
        return { error, data: null };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Exception fetching player data:", error);
      return { error, data: null };
    }
  };

  const savePlayerData = async (userId: string, playerTag: string, clanTag?: string) => {
    try {
      const { error } = await supabase.from("player_data").insert({
        user_id: userId,
        player_tag: playerTag,
        clan_tag: clanTag || null,
      });

      if (error) {
        console.error("Error saving player data:", error);
        toast({
          title: "Error saving player data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error("Exception saving player data:", error);
      throw error;
    }
  };

  const saveClanMembership = async (userId: string, clanTag: string, role: string = "member") => {
    try {
      // Default status is 'pending', but if the role is 'leader', set status to 'accepted'
      const status = role.toLowerCase() === "leader" ? "accepted" : "pending";
      
      const { error } = await supabase.from("clan_members").insert({
        user_id: userId,
        clan_tag: clanTag,
        role: role.toLowerCase(),
        status,
      });

      if (error) {
        console.error("Error saving clan membership:", error);
        toast({
          title: "Error saving clan membership",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error("Exception saving clan membership:", error);
      throw error;
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

      // If player tag is provided, process the player data
      if (playerTag && data.user) {
        try {
          // Fetch player data from Clash of Clans API
          const playerResponse = await fetchPlayerData(playerTag);
          
          if (playerResponse.error || !playerResponse.data) {
            toast({
              title: "Error fetching player data",
              description: "Unable to find your player tag in Clash of Clans. Please check the tag and try again.",
              variant: "destructive",
            });
            // Continue with signup but without clan data
            await savePlayerData(data.user.id, playerTag);
            
            toast({
              title: "Signed up successfully",
              description: "Your account was created, but we couldn't verify your player tag.",
            });
            
            navigate("/");
            return { data, error: null };
          }
          
          const playerData = playerResponse.data;
          const clanTag = playerData.clanTag;
          const clanRole = playerData.clanRole;
          
          // Save player data including clan tag if available
          await savePlayerData(data.user.id, playerTag, clanTag);
          
          // If player is in a clan, save clan membership
          if (clanTag) {
            await saveClanMembership(data.user.id, clanTag, clanRole);
            
            if (clanRole?.toLowerCase() === "leader") {
              toast({
                title: "Signed up successfully",
                description: `Welcome to Clash Companion! You've been identified as the leader of ${playerData.clanName || clanTag}.`,
              });
            } else {
              toast({
                title: "Signed up successfully",
                description: `Your request to join clan ${playerData.clanName || clanTag} is pending approval by the clan leader.`,
              });
            }
          } else {
            toast({
              title: "Signed up successfully",
              description: "Unable to find your clan. Please join a clan or update your player tag.",
            });
          }
        } catch (error) {
          console.error("Error processing player data:", error);
          
          // Still save the basic player tag even if API processing failed
          await savePlayerData(data.user.id, playerTag);
          
          toast({
            title: "Signed up with limited data",
            description: "Your account was created, but there was an issue processing your player data.",
          });
        }
      } else {
        toast({
          title: "Signed up successfully",
          description: "Welcome to Clash Companion!",
        });
      }

      // Auto login after signup
      if (data.user) {
        navigate("/");
      }

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
      navigate("/login");
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
        savePlayerData,
        saveClanMembership,
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
