"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressDashboard } from "@/components/common/ProgressDashboard";
import { MoodTracker } from "@/components/mood/MoodTracker";
import { MoodChart } from "@/components/mood/MoodChart";
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
      {/* Enhanced Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b gradient-bg-primary shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 gradient-bg-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <span className="text-primary-foreground font-bold text-lg">
                  MC
                </span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                MindCare
              </h1>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-2">
              {[
                { label: "Dashboard", view: "dashboard" },
                { label: "Track Mood", view: "mood" },
                { label: "Insights", view: "charts" },
                { label: "CBT Tools", view: "cbt" },
                { label: "Safety", view: "safety" },
                { label: "Resources", view: "resources" },
              ].map((item) => (
                <motion.div
                  key={item.view}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={currentView === item.view ? "secondary" : "ghost"}
                    onClick={() =>
                      setCurrentView(item.view as typeof currentView)
                    }
                    className="rounded-full px-5 py-2 font-medium transition-all hover:scale-105 hover:shadow-md"
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
              className="md:hidden p-2 rounded-lg hover:bg-accent/20 transition-colors"
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
            className="md:hidden gradient-bg-primary border-b shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {[
                  { label: "Dashboard", view: "dashboard" },
                  { label: "Track Mood", view: "mood" },
                  { label: "Insights", view: "charts" },
                  { label: "CBT Tools", view: "cbt" },
                  { label: "Safety", view: "safety" },
                  { label: "Resources", view: "resources" },
                ].map((item, index) => (
                  <motion.div
                    key={item.view}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                    whileHover={{ scale: 1.02 }}
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
                      className="w-full justify-start rounded-lg px-4 py-3 font-medium transition-all hover:shadow-md"
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
      <main className="container mx-auto px-4 py-8 gradient-bg-secondary min-h-screen">
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

        {currentView === "cbt" && (
          <div className="text-center space-y-6 glass-effect rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CBT Tools
            </h2>
            <p className="text-muted-foreground text-lg">
              CBT tools and exercises coming soon...
            </p>
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="gradient-bg-primary hover:scale-105 transition-transform"
            >
              ← Back to Dashboard
            </Button>
          </div>
        )}

        {currentView === "safety" && (
          <div className="text-center space-y-6 glass-effect rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Safety & Crisis Resources
            </h2>
            <p className="text-muted-foreground text-lg">
              Safety planning and crisis resources coming soon...
            </p>
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="gradient-bg-primary hover:scale-105 transition-transform"
            >
              ← Back to Dashboard
            </Button>
          </div>
        )}

        {currentView === "resources" && (
          <div className="text-center space-y-6 glass-effect rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Educational Resources
            </h2>
            <p className="text-muted-foreground text-lg">
              Educational content and resources coming soon...
            </p>
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="gradient-bg-primary hover:scale-105 transition-transform"
            >
              ← Back to Dashboard
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t gradient-bg-accent mt-16">
        <div className="container mx-auto px-4 py-8">
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
