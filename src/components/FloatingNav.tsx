
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Users, Trophy, Swords, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  {
    path: "/",
    name: "Home",
    icon: <Home className="h-5 w-5" />,
  },
  {
    path: "/members",
    name: "Members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    path: "/wars",
    name: "Wars",
    icon: <Swords className="h-5 w-5" />,
  },
  {
    path: "/trophies",
    name: "Trophies",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const FloatingNav = () => {
  const [activeTab, setActiveTab] = useState("/");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex justify-center fixed top-5 z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`px-6 py-3 glass-darker rounded-full shadow-2xl ${
          hasScrolled ? "border border-clan-accent/30" : "border border-white/10"
        }`}
      >
        <div className="flex items-center space-x-1 md:space-x-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setActiveTab(item.path)}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 md:p-3 rounded-full transition-all duration-300 ${
                  activeTab === item.path
                    ? "bg-clan-accent text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="sr-only">{item.name}</span>
              </motion.div>
              {activeTab === item.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingNav;
