"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressDashboard } from "@/components/common/ProgressDashboard";
import { MoodTracker } from "@/components/mood/MoodTracker";
import { MoodChart } from "@/components/mood/MoodChart";
import { CBTTools } from "@/components/cbt/CBTTools";
import { SafetyResources } from "@/components/safety/SafetyResources";
import { Resources } from "@/components/resources/Resources";
import { ThreeBackground } from "@/components/background/ThreeBackground";
import { Button } from "@/components/ui/button";
import { DashboardStats, MoodEntry, BehavioralActivation } from "@/lib/types";

// Sample data for demonstration
const sampleStats: DashboardStats = {
  currentStreak: 7,
  totalEntries: 45,
  averageMood: 6.2,
  completedExercises: 12,
};

const sampleMoodEntry: MoodEntry = {
  id: "1",
  date: new Date().toISOString(),
  mood: 6,
  energy: 5,
  sleep: 7,
  appetite: 6,
  social: 4,
  notes: "Feeling a bit better today after talking with a friend.",
  triggers: ["work stress"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const sampleActivities: BehavioralActivation[] = [
  {
    id: "1",
    title: "Morning Walk",
    description: "Take a 20-minute walk in the park",
    scheduledDate: new Date().toISOString(),
    completed: true,
    completedAt: new Date().toISOString(),
    difficulty: 3,
    enjoyment: 7,
    notes: "Really enjoyed the fresh air",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Call a Friend",
    description: "Reach out to Sarah for a chat",
    scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    completed: false,
    difficulty: 4,
    enjoyment: 0,
    createdAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "mood" | "charts" | "cbt" | "safety" | "resources"
  >("dashboard");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    sampleMoodEntry,
  ]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigateToMood = () => setCurrentView("mood");
  const handleNavigateToCBT = () => setCurrentView("cbt");
  const handleNavigateToSafety = () => setCurrentView("safety");
  const handleNavigateToResources = () => setCurrentView("resources");

  const handleMoodSubmit = (
    entry: Omit<MoodEntry, "id" | "createdAt" | "updatedAt">
  ) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMoodEntries([newEntry, ...moodEntries]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Enhanced Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b gradient-bg-sunset shadow-xl mood-boost-shadow w-full"
      >
        <div className="w-full px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 gradient-bg-sunset rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 uplifting-animation">
                <span className="text-primary-foreground font-bold text-xl">
                  🌟
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                MindCare
              </h1>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-3">
              {[
                { label: "🏠 Dashboard", view: "dashboard" },
                { label: "❤️ Track Mood", view: "mood" },
                { label: "📊 Insights", view: "charts" },
                { label: "🧠 CBT Tools", view: "cbt" },
                { label: "🛡️ Safety", view: "safety" },
                { label: "📚 Resources", view: "resources" },
              ].map((item, index) => (
                <motion.div
                  key={item.view}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={currentView === item.view ? "secondary" : "ghost"}
                    onClick={() =>
                      setCurrentView(item.view as typeof currentView)
                    }
                    className="rounded-full px-4 md:px-6 py-2 md:py-3 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-200/25 border-0 bg-white/10 backdrop-blur-sm text-foreground hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 text-sm md:text-base"
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-lg hover:bg-accent/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              <motion.div className="w-6 h-6 flex flex-col justify-center items-center">
                <motion.span
                  animate={
                    isMobileMenuOpen
                      ? { rotate: 45, y: 8 }
                      : { rotate: 0, y: 0 }
                  }
                  className="w-5 h-0.5 bg-foreground block mb-1 transition-colors"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-5 h-0.5 bg-foreground block mb-1"
                />
                <motion.span
                  animate={
                    isMobileMenuOpen
                      ? { rotate: -45, y: -8 }
                      : { rotate: 0, y: 0 }
                  }
                  className="w-5 h-0.5 bg-foreground block"
                />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden gradient-bg-sunset border-b shadow-xl overflow-hidden mood-boost-shadow w-full"
          >
            <div className="w-full px-4 md:px-6 py-3 md:py-4">
              <nav className="flex flex-col space-y-3">
                {[
                  { label: "🏠 Dashboard", view: "dashboard" },
                  { label: "❤️ Track Mood", view: "mood" },
                  { label: "📊 Insights", view: "charts" },
                  { label: "🧠 CBT Tools", view: "cbt" },
                  { label: "🛡️ Safety", view: "safety" },
                  { label: "📚 Resources", view: "resources" },
                ].map((item, index) => (
                  <motion.div
                    key={item.view}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={
                        currentView === item.view ? "secondary" : "ghost"
                      }
                      onClick={() => {
                        setCurrentView(item.view as typeof currentView);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start rounded-xl px-5 py-4 font-medium transition-all duration-300 hover:shadow-lg hover:bg-white/20 backdrop-blur-sm border-0 min-h-[48px] text-left"
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="w-full py-8 gradient-bg-ocean min-h-screen relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full px-4 md:px-6">
          {currentView === "dashboard" && (
            <ProgressDashboard
              stats={sampleStats}
              recentMood={sampleMoodEntry}
              recentActivities={sampleActivities}
              onNavigateToMood={handleNavigateToMood}
              onNavigateToCBT={handleNavigateToCBT}
              onNavigateToSafety={handleNavigateToSafety}
              onNavigateToResources={handleNavigateToResources}
            />
          )}

          {currentView === "mood" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Mood Tracker</h2>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("dashboard")}
                  className="text-primary hover:underline"
                >
                  ← Back to Dashboard
                </Button>
              </div>
              <MoodTracker
                onMoodSubmit={handleMoodSubmit}
                latestEntry={moodEntries[0]}
              />
            </div>
          )}

          {currentView === "charts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Mood Insights</h2>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("dashboard")}
                  className="text-primary hover:underline"
                >
                  ← Back to Dashboard
                </Button>
              </div>
              <MoodChart entries={moodEntries} />
            </div>
          )}

          {currentView === "cbt" && <CBTTools />}

          {currentView === "safety" && <SafetyResources />}

          {currentView === "resources" && <Resources />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t gradient-bg-sunset mt-16 w-full">
        <div className="w-full px-4 md:px-6 py-8 md:py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span>© 2024 MindCare</span>
              <span>•</span>
              <span>Evidence-based mental health support</span>
              <span>•</span>
              <span>Not a replacement for professional care</span>
            </div>
            <p className="text-xs text-muted-foreground">
              If you&apos;re experiencing a mental health crisis, please contact
              emergency services (911) or the National Suicide Prevention
              Lifeline (988) immediately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
