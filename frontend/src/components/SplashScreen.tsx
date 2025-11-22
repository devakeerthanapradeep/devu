import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]"
    >
      <div className="text-center">
        {/* Animated Cooking Pot */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl"
          >
            🍳
          </motion.div>
          
          {/* Steam Animation */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <motion.div
              animate={{
                y: [-20, -40],
                opacity: [0.8, 0],
                scale: [1, 1.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="text-3xl"
            >
              💨
            </motion.div>
            <motion.div
              animate={{
                y: [-20, -40],
                opacity: [0.8, 0],
                scale: [1, 1.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5
              }}
              className="text-3xl absolute top-0 left-2"
            >
              💨
            </motion.div>
            <motion.div
              animate={{
                y: [-20, -40],
                opacity: [0.8, 0],
                scale: [1, 1.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1
              }}
              className="text-3xl absolute top-0 -left-2"
            >
              💨
            </motion.div>
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-[#1b4332] mb-2"
        >
          Recipe Share
        </motion.h1>

        {/* Loading Text */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#40916c] mb-8"
        >
          Preparing your kitchen...
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mb-4">
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-[#52b788] to-[#40916c] rounded-full"
            />
          </div>
        </div>

        {/* Loading Messages */}
        <motion.div
          key={progress}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-[#40916c]"
        >
          {progress <= 20 && "🥘 Gathering ingredients..."}
          {progress > 20 && progress <= 40 && "🔥 Heating up the stove..."}
          {progress > 40 && progress <= 60 && "👨‍🍳 Calling the chef..."}
          {progress > 60 && progress <= 80 && "🍽️ Setting the table..."}
          {progress > 80 && "✨ Almost ready to serve!"}
        </motion.div>

        {/* Animated Food Icons */}
        <div className="mt-8 flex justify-center gap-4">
          {['🍕', '🍔', '🍜', '🍰', '🥗'].map((emoji, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: progress > (index + 1) * 20 ? 1 : 0.3,
                scale: progress > (index + 1) * 20 ? 1 : 0.8,
              }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              className="text-3xl"
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
