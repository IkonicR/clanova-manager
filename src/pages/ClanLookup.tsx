
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
  console.log("ClanLookup component rendering");
  const [clanTag, setClanTag] = useState("#PPLYPUJV");
  const [hasSearched, setHasSearched] = useState(false);
  
  const fetchClanData = async (tag: string) => {
    console.log("Fetching clan data for tag:", tag);
    if (!tag) return null;
    
    try {
      // For debugging purposes, use a mock response first to see if UI renders correctly
      if (process.env.NODE_ENV === "development" && !window.location.href.includes("use-real-data")) {
        console.log("Using mock clan data for development");
        return {
          name: "Mock Clan",
          tag: tag,
          clanLevel: 10,
          description: "This is a mock clan for development",
          badgeUrls: { medium: "https://api-assets.clashofclans.com/badges/200/0FVgNta-rhZv9t9A-3m-yQPCkJ5Bkn_HwvIau9YZI08.png" },
          clanPoints: 25000,
          warWins: 150,
          warWinStreak: 5,
          capitalPoints: 3000,
          members: 30
        };
      }
      
      console.log("Invoking Supabase function getclashclandata");
      const { data, error } = await supabase.functions.invoke("getclashclandata", {
        body: { clanTag: tag },
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }
      
      console.log("Clan data fetched successfully:", data);
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
    console.log("Search button clicked for clan tag:", clanTag);
    
    if (!clanTag.trim()) {
      toast.error("Please enter a clan tag");
      return;
    }
    
    setHasSearched(true);
    try {
      await refetch();
      toast.success("Clan data fetched successfully!");
    } catch (error) {
      console.error("Error during refetch:", error);
      toast.error("Failed to fetch clan data. Please try again.");
    }
  };
  
  const handleClanTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClanTag(e.target.value);
  };
  
  console.log("ClanLookup render state:", { clanData, isLoading, error, hasSearched });
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <FloatingNav />
      <div className="container px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6">Clan Lookup</h1>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow mb-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  value={clanTag}
                  onChange={handleClanTagChange}
                  placeholder="Enter Clan Tag (e.g. #PPLYPUJV)"
                  className="w-full bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
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
            <div className="bg-red-900/50 border border-red-400/30 p-4 rounded-lg text-red-200 mb-6">
              <p>Error fetching clan data. Please check the clan tag and try again.</p>
              <p className="text-xs mt-2">{String(error)}</p>
            </div>
          )}
          
          {hasSearched && isLoading && (
            <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
              <p>Fetching clan data...</p>
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
              
              <div className="bg-gray-800 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2 text-blue-300">
                  Members ({clanData.members}/50)
                </h2>
                <p className="text-sm text-gray-300">
                  This clan has {clanData.members} members out of a maximum of 50.
                </p>
              </div>
            </div>
          )}
          
          {hasSearched && !isLoading && !clanData && !error && (
            <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
              <p>No clan data found. Please try a different tag.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClanLookup;
