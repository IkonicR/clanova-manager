
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingNav from "../components/FloatingNav";
import ClanHeader from "../components/ClanHeader";
import StatsOverview from "../components/StatsOverview";
import CurrentWarStatus from "../components/CurrentWarStatus";
import TopMembers from "../components/TopMembers";
import { useToast } from "@/hooks/use-toast";

// Mock data - will be replaced with API data later
const mockClanData = {
  name: "Equidor Reborn",
  tag: "#2LJCVV928",
  level: 12,
  description: "Strong active war clan. We donate max troops and siege machines. Wars back to back. CWL Masters III.",
  badgeUrl: "https://api-assets.clashofclans.com/badges/200/lc_UDU1wIZGbNbXjtEYGPNahwcBPpS5xIZEXw9FZ6Lk.png",
  stats: {
    trophies: 32450,
    warWins: 287,
    warStreak: 5,
    capitalTrophies: 846,
  },
  war: {
    status: "inWar" as const, // Using const assertion to ensure it's a literal type
    opponent: {
      name: "Elite Warriors",
      tag: "#9PQ82YG2",
      level: 11,
      badgeUrl: "https://api-assets.clashofclans.com/badges/200/8ygykp6QDnRzxBJTIvXF1VJpb6Mq-Lk5KvQsLZ8Oh34.png",
    },
    startTime: "2023-05-15T10:00:00Z",
    endTime: "2023-05-16T10:00:00Z",
    clanStars: 28,
    opponentStars: 24,
  },
  members: [
    {
      name: "ThunderStrike",
      tag: "#2YL0V8P2C",
      role: "Leader",
      trophies: 5213,
      townHallLevel: 14,
      donations: 1854,
    },
    {
      name: "DragonSlayer",
      tag: "#9JC8V92J2",
      role: "Co-leader",
      trophies: 5102,
      townHallLevel: 14,
      donations: 1647,
    },
    {
      name: "WarMachine",
      tag: "#8UCQPJ28Y",
      role: "Co-leader",
      trophies: 4893,
      townHallLevel: 13,
      donations: 1432,
    },
    {
      name: "ElixirWizard",
      tag: "#2PRCV8PL9",
      role: "Elder",
      trophies: 4756,
      townHallLevel: 13,
      donations: 1218,
    },
    {
      name: "GoblinKing",
      tag: "#8PR29YC2L",
      role: "Elder",
      trophies: 4701,
      townHallLevel: 13,
      donations: 1156,
    },
  ],
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Clan data loaded",
        description: "Successfully retrieved clan information",
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-clan-darker">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-clan-accent to-clan-gold blur-md opacity-50"></div>
            <div className="relative w-full h-full border-t-4 border-clan-accent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-white/70 text-sm">Loading clan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clan-darker text-white pb-24">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-clan-dark to-transparent opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent opacity-30"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container px-4 pt-6 relative z-10"
      >
        {/* Clan Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ClanHeader clanData={mockClanData} />
        </motion.div>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
          {/* Stats Overview - Spans 2 columns on medium+ screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-2 h-full"
          >
            <StatsOverview stats={mockClanData.stats} />
          </motion.div>
          
          {/* War Status - Tall box on the right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 row-span-2 h-full"
          >
            <CurrentWarStatus war={mockClanData.war} />
          </motion.div>
          
          {/* Top Members - Spans 2 columns on medium+ screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1 md:col-span-2 h-full"
          >
            <TopMembers members={mockClanData.members} />
          </motion.div>
          
          {/* Additional Bento Boxes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1 h-full"
          >
            <div className="clan-card h-full bg-gradient-to-br from-purple-900/40 to-clan-dark/60">
              <h3 className="card-heading">Clan Games</h3>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-white/70 text-sm">Next clan games starts in</p>
                  <p className="text-2xl font-bold text-white mt-2">3 days 12 hours</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-1 h-full"
          >
            <div className="clan-card h-full bg-gradient-to-br from-clan-accent/30 to-clan-dark/60">
              <h3 className="card-heading">Donations</h3>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">14,320</p>
                  <p className="text-white/70 text-sm mt-1">Total this season</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="col-span-1 h-full"
          >
            <div className="clan-card h-full bg-gradient-to-br from-cyan-800/40 to-clan-dark/60">
              <h3 className="card-heading">Clan Capital</h3>
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">Capital Peak</p>
                  <p className="text-white/70 text-sm mt-1">Level 7</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <FloatingNav />
    </div>
  );
};

export default Index;
