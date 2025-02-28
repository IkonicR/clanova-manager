
import { Trophy, Swords, Shield, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface StatsOverviewProps {
  stats: {
    trophies: number;
    warWins: number;
    warStreak: number;
    capitalTrophies: number;
  };
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const statItems = [
    {
      label: "Trophies",
      value: stats.trophies,
      icon: Trophy,
      color: "text-clan-gold",
      bgColor: "bg-clan-gold/10",
    },
    {
      label: "War Wins",
      value: stats.warWins,
      icon: Swords,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: "War Streak",
      value: stats.warStreak,
      icon: Shield,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Capital Trophies",
      value: stats.capitalTrophies,
      icon: Medal,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      {statItems.map((item) => (
        <motion.div
          key={item.label}
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="clan-card flex flex-col items-center justify-center py-4"
        >
          <div className={`p-2 rounded-full ${item.bgColor} mb-2`}>
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
          <p className="text-xs text-white/70">{item.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsOverview;
