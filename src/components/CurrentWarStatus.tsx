
import { motion } from "framer-motion";
import { Swords, Timer, Star } from "lucide-react";

interface CurrentWarStatusProps {
  war: {
    status: "notInWar" | "preparation" | "inWar" | "warEnded";
    opponent?: {
      name: string;
      tag: string;
      level: number;
      badgeUrl: string;
    };
    startTime?: string;
    endTime?: string;
    clanStars?: number;
    opponentStars?: number;
  };
}

const CurrentWarStatus = ({ war }: CurrentWarStatusProps) => {
  const getWarStatusContent = () => {
    switch (war.status) {
      case "notInWar":
        return (
          <div className="text-center py-8">
            <Swords className="h-10 w-10 text-white/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white/70">Not currently in war</h3>
            <p className="text-sm text-white/50 mt-1">Start a war to see details here</p>
          </div>
        );
      
      case "preparation":
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Timer className="h-5 w-5 text-yellow-400 mr-2" />
                War Preparation
              </h3>
              {war.startTime && (
                <div className="text-sm text-white/70">
                  Starts in <span className="text-white font-semibold">12h 30m</span>
                </div>
              )}
            </div>
            
            {war.opponent && (
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <img src={war.opponent.badgeUrl} alt="Opponent badge" className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white">{war.opponent.name}</p>
                    <p className="text-xs text-white/60">Level {war.opponent.level}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="px-3 py-1 rounded-full bg-clan-accent/20 text-clan-accent text-sm"
                >
                  Opponent
                </motion.div>
              </div>
            )}
          </div>
        );
      
      case "inWar":
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Swords className="h-5 w-5 text-red-400 mr-2" />
                War In Progress
              </h3>
              {war.endTime && (
                <div className="text-sm text-white/70">
                  Ends in <span className="text-white font-semibold">5h 45m</span>
                </div>
              )}
            </div>
            
            {war.opponent && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-white">{war.clanStars || 0}</div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      <span className="text-xs text-white/70 ml-1">Our Stars</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-white/50 text-sm">VS</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-white">{war.opponentStars || 0}</div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      <span className="text-xs text-white/70 ml-1">Their Stars</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                      <img src={war.opponent.badgeUrl} alt="Opponent badge" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-white">{war.opponent.name}</p>
                      <p className="text-xs text-white/60">Level {war.opponent.level}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-clan-accent/20 text-clan-accent text-sm">
                    Opponent
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case "warEnded":
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Swords className="h-5 w-5 text-purple-400 mr-2" />
                War Ended
              </h3>
            </div>
            
            {war.opponent && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-white">{war.clanStars || 0}</div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      <span className="text-xs text-white/70 ml-1">Our Stars</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`text-white text-xl font-bold ${
                      (war.clanStars || 0) > (war.opponentStars || 0) 
                        ? "text-green-400" 
                        : (war.clanStars || 0) < (war.opponentStars || 0)
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}>
                      {(war.clanStars || 0) > (war.opponentStars || 0) 
                        ? "VICTORY" 
                        : (war.clanStars || 0) < (war.opponentStars || 0)
                          ? "DEFEAT"
                          : "DRAW"
                      }
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-white">{war.opponentStars || 0}</div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      <span className="text-xs text-white/70 ml-1">Their Stars</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                      <img src={war.opponent.badgeUrl} alt="Opponent badge" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-white">{war.opponent.name}</p>
                      <p className="text-xs text-white/60">Level {war.opponent.level}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-clan-accent/20 text-clan-accent text-sm">
                    Opponent
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="clan-card mb-6"
    >
      <div className="card-heading">
        <Swords className="h-5 w-5 text-clan-accent" />
        Current War
      </div>
      
      {getWarStatusContent()}
    </motion.div>
  );
};

export default CurrentWarStatus;
