
import { Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Member {
  name: string;
  tag: string;
  role: string;
  trophies: number;
  townHallLevel: number;
  donations: number;
}

interface TopMembersProps {
  members: Member[];
}

const TopMembers = ({ members }: TopMembersProps) => {
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="clan-card mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="card-heading">
          <Users className="h-5 w-5 text-clan-accent" />
          Top Members
        </div>
        <Link to="/members" className="text-sm text-clan-accent flex items-center hover:underline">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {members.slice(0, 5).map((member, index) => (
          <motion.div
            key={member.tag}
            variants={itemVariants}
            whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            className="flex items-center justify-between p-3 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-clan-accent to-clan-gold flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <p className="font-medium text-white">{member.name}</p>
                  <div className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                    TH{member.townHallLevel}
                  </div>
                </div>
                <p className="text-xs text-white/60">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <img src="/trophy.png" alt="Trophy" className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium text-white">{member.trophies}</span>
                </div>
                <p className="text-xs text-white/60">Donated: {member.donations}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TopMembers;
