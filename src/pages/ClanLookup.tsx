
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import FloatingNav from "../components/FloatingNav";
import ClanHeader from "../components/ClanHeader";
import StatsOverview from "../components/StatsOverview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ClanLookup = () => {
  const [clanTag, setClanTag] = useState("#PPLYPUJV");
  
  const fetchClanData = async (tag: string) => {
    if (!tag) return null;
    
    try {
      const { data, error } = await supabase.functions.invoke("getclashclandata", {
        body: { clanTag: tag },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching clan data:", error);
      throw error;
    }
  };
  
  const { data: clanData, isLoading, error, refetch } = useQuery({
    queryKey: ["clanData", clanTag],
    queryFn: () => fetchClanData(clanTag),
    enabled: false, // Don't fetch automatically on mount
  });
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clanTag.trim()) {
      toast.error("Please enter a clan tag");
      return;
    }
    
    try {
      await refetch();
      toast.success("Clan data fetched successfully!");
    } catch (error) {
      toast.error("Failed to fetch clan data. Please try again.");
    }
  };
  
  const handleClanTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClanTag(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-clan-darker text-white">
      <FloatingNav />
      <div className="container px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6">Clan Lookup</h1>
          
          <div className="clan-card mb-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  value={clanTag}
                  onChange={handleClanTagChange}
                  placeholder="Enter Clan Tag (e.g. #PPLYPUJV)"
                  className="w-full bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-clan-accent hover:bg-clan-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {error && (
            <div className="clan-card border border-red-400/30 bg-red-900/10 text-red-400">
              <p>Error fetching clan data. Please check the clan tag and try again.</p>
            </div>
          )}
          
          {clanData && !error && (
            <div className="space-y-6">
              <ClanHeader 
                clanData={{
                  name: clanData.name,
                  tag: clanData.tag,
                  level: clanData.clanLevel,
                  description: clanData.description,
                  badgeUrl: clanData.badgeUrls.medium,
                }}
              />
              
              <StatsOverview 
                stats={{
                  trophies: clanData.clanPoints,
                  warWins: clanData.warWins,
                  warStreak: clanData.warWinStreak,
                  capitalTrophies: clanData.capitalPoints || 0,
                }}
              />
              
              <div className="clan-card">
                <h2 className="card-heading">
                  Members ({clanData.members}/50)
                </h2>
                <p className="text-sm text-white/70">
                  This clan has {clanData.members} members out of a maximum of 50.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClanLookup;
