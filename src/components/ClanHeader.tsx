
import { motion } from "framer-motion";

interface ClanHeaderProps {
  clanData: {
    name: string;
    tag: string;
    level: number;
    description: string;
    badgeUrl: string;
  };
}

const ClanHeader = ({ clanData }: ClanHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="clan-card mb-6"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-clan-accent to-clan-gold blur-lg opacity-30 animate-pulse"></div>
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-clan-accent">
            <img 
              src={clanData.badgeUrl} 
              alt={`${clanData.name} badge`} 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">{clanData.name}</h1>
            <div className="clan-badge bg-clan-dark text-clan-accent">
              {clanData.tag}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="clan-badge bg-clan-accent/20 text-clan-accent">
              Level {clanData.level}
            </div>
          </div>
          
          <p className="text-sm text-white/70 line-clamp-2">
            {clanData.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ClanHeader;
