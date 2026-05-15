import { motion } from "framer-motion";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200/50 p-12 overflow-hidden">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.05, 1],
                borderRadius: ["1rem", "2rem", "1rem"]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className={`aspect-square bg-primary/20 shadow-sm border border-primary/10`}
            />
          ))}
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-extrabold mb-4 tracking-tight"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-base-content/50 text-lg font-medium"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};

export default AuthImagePattern;