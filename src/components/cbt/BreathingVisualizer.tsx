"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface BreathingVisualizerProps {
  exercise: {
    id: string;
    name: string;
    instructions: string[];
    duration: number;
  };
  isActive: boolean;
  onComplete: () => void;
}

export function BreathingVisualizer({
  exercise,
  isActive,
  onComplete,
}: BreathingVisualizerProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">(
    "inhale"
  );
  const [cycleCount, setCycleCount] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const runBreathingCycle = () => {
      const instructions = exercise.instructions;

      if (instructions[currentInstruction]?.includes("Inhale")) {
        setPhase("inhale");
        setTimeout(() => setPhase("hold"), 4000);
        setTimeout(() => setPhase("exhale"), 7000);
        setTimeout(() => setPhase("pause"), 11000);
        setTimeout(() => {
          setCycleCount((prev) => prev + 1);
          setCurrentInstruction((prev) => (prev + 1) % instructions.length);
        }, 14000);
      } else if (instructions[currentInstruction]?.includes("Hold")) {
        setPhase("hold");
        setTimeout(() => setPhase("exhale"), 4000);
        setTimeout(() => setPhase("pause"), 7000);
        setTimeout(() => {
          setCycleCount((prev) => prev + 1);
          setCurrentInstruction((prev) => (prev + 1) % instructions.length);
        }, 10000);
      } else if (instructions[currentInstruction]?.includes("Exhale")) {
        setPhase("exhale");
        setTimeout(() => setPhase("pause"), 8000);
        setTimeout(() => {
          setCycleCount((prev) => prev + 1);
          setCurrentInstruction((prev) => (prev + 1) % instructions.length);
        }, 10000);
      }
    };

    runBreathingCycle();
    const intervalId = setInterval(runBreathingCycle, 12000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, exercise, currentInstruction, cycleCount]);

  useEffect(() => {
    if (cycleCount >= 4 && isActive) {
      onComplete();
    }
  }, [cycleCount, isActive, onComplete]);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "pause":
        return "Pause";
      default:
        return "Ready";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "from-blue-400 to-cyan-400";
      case "hold":
        return "from-yellow-400 to-orange-400";
      case "exhale":
        return "from-green-400 to-emerald-400";
      case "pause":
        return "from-purple-400 to-pink-400";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Breathing Circle */}
        <motion.div
          className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl relative overflow-hidden`}
          animate={{
            scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 0.8 : 1,
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: phase === "inhale" ? 4 : phase === "exhale" ? 4 : 2,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full"></div>
          <motion.div
            className="absolute inset-4 bg-white/30 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <motion.div
                className="w-8 h-8 bg-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Phase Text */}
        <motion.div
          className="text-center space-y-2"
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white">{getPhaseText()}</h2>
          <p className="text-xl text-white/80">Cycle {cycleCount + 1} of 4</p>
        </motion.div>

        {/* Current Instruction */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white text-lg leading-relaxed">
            {exercise.instructions[currentInstruction] ||
              "Follow the breathing pattern"}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= cycleCount ? "bg-white" : "bg-white/30"
              }`}
              animate={{
                scale: index === cycleCount ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: index === cycleCount ? Infinity : 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
