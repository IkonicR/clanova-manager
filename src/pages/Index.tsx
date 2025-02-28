
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

// Mock personal player stats - will be replaced with API data later
const mockPlayerStats = {
  name: "You (FirePhoenix)",
  tag: "#8UCQPJ29L",
  townHallLevel: 12,
  trophies: 4350,
  leagueId: 29000022, // Legend League
  leagueIcon: "https://api-assets.clashofclans.com/leagues/72/R6hllk5_4L__GX6kn6RlnT-0W66KDHVBf1dwoB8x6Yg.png",
  donations: 943,
  donationsReceived: 756,
  warStars: 532,
  attackWins: 38,
  defenseWins: 12,
  versusTrophies: 3850,
  achievements: {
    completedCount: 28,
    totalStars: 86,
    nextAchievement: "Wall Buster - Level 8"
  }
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
          {/* Personal Stats Section - Spans full width on all screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-3 h-full"
          >
            <div className="clan-card bg-gradient-to-br from-clan-gold/20 to-clan-dark/60 p-5">
              <h3 className="card-heading flex items-center">
                <span className="relative mr-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-clan-gold to-clan-accent blur-md opacity-50"></div>
                  <span className="relative z-10 text-clan-gold">⭐</span>
                </span>
                Personal Stats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                {/* Player Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-clan-dark to-clan-darker flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-clan-gold/20 to-clan-accent/20 opacity-50"></div>
                      <span className="text-3xl">👑</span>
                      <div className="absolute bottom-0 left-0 w-full h-6 flex items-center justify-center bg-clan-dark/80 text-xs font-bold">
                        TH{mockPlayerStats.townHallLevel}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{mockPlayerStats.name}</h4>
                    <p className="text-white/70 text-xs">{mockPlayerStats.tag}</p>
                    <div className="flex items-center mt-1">
                      <img src={mockPlayerStats.leagueIcon} alt="League" className="w-5 h-5 mr-1" />
                      <span className="text-xs text-white/90">{mockPlayerStats.trophies}</span>
                    </div>
                  </div>
                </div>
                
                {/* War Stats */}
                <div className="space-y-2">
                  <div className="text-xs text-white/70">War Stars</div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-white">{mockPlayerStats.warStars}</span>
                    <span className="text-clan-gold ml-1">⭐</span>
                  </div>
                  <div className="h-1.5 w-full bg-clan-dark rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-clan-gold to-clan-accent rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  <div className="text-xs text-white/70">Progress to 700 stars</div>
                </div>
                
                {/* Donation Stats */}
                <div className="space-y-2">
                  <div className="text-xs text-white/70">Donations</div>
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className="text-white font-semibold">{mockPlayerStats.donations}</div>
                      <div className="text-xs text-white/70">Given</div>
                    </div>
                    <div className="text-white/50">|</div>
                    <div>
                      <div className="text-white font-semibold">{mockPlayerStats.donationsReceived}</div>
                      <div className="text-xs text-white/70">Received</div>
                    </div>
                    <div className="text-white/50">|</div>
                    <div>
                      <div className="text-white font-semibold">1.25</div>
                      <div className="text-xs text-white/70">Ratio</div>
                    </div>
                  </div>
                </div>
                
                {/* Achievement Stats */}
                <div className="space-y-2">
                  <div className="text-xs text-white/70">Achievements</div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-white">{mockPlayerStats.achievements.completedCount}</span>
                    <span className="text-xs text-white/70 ml-1">completed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="text-clan-gold text-xs">★★★</div>
                    <div className="text-xs text-white/70">{mockPlayerStats.achievements.totalStars} total stars</div>
                  </div>
                  <div className="text-xs text-white/70">Next: {mockPlayerStats.achievements.nextAchievement}</div>
                </div>
              </div>
            </div>
          </motion.div>
        
          {/* Stats Overview - Spans 2 columns on medium+ screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 md:col-span-2 h-full"
          >
            <StatsOverview stats={mockClanData.stats} />
          </motion.div>
          
          {/* War Status - Tall box on the right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1 row-span-2 h-full"
          >
            <CurrentWarStatus war={mockClanData.war} />
          </motion.div>
          
          {/* Top Members - Spans 2 columns on medium+ screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1 md:col-span-2 h-full"
          >
            <TopMembers members={mockClanData.members} />
          </motion.div>
          
          {/* Additional Bento Boxes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
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
            transition={{ duration: 0.5, delay: 0.6 }}
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
            transition={{ duration: 0.5, delay: 0.7 }}
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
