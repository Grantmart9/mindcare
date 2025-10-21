"use client";

import { useState } from "react";
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
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  MC
                </span>
              </div>
              <h1 className="text-xl font-semibold">MindCare</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`text-sm font-medium transition-colors ${
                  currentView === "dashboard"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={handleNavigateToMood}
                className={`text-sm font-medium transition-colors ${
                  currentView === "mood"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Track Mood
              </button>
              <button
                onClick={() => setCurrentView("charts")}
                className={`text-sm font-medium transition-colors ${
                  currentView === "charts"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Insights
              </button>
              <button
                onClick={handleNavigateToCBT}
                className={`text-sm font-medium transition-colors ${
                  currentView === "cbt"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                CBT Tools
              </button>
              <button
                onClick={handleNavigateToSafety}
                className={`text-sm font-medium transition-colors ${
                  currentView === "safety"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Safety
              </button>
              <button
                onClick={handleNavigateToResources}
                className={`text-sm font-medium transition-colors ${
                  currentView === "resources"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Resources
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">CBT Tools</h2>
            <p className="text-muted-foreground">
              CBT tools and exercises coming soon...
            </p>
            <button
              onClick={() => setCurrentView("dashboard")}
              className="text-primary hover:underline"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}

        {currentView === "safety" && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Safety & Crisis Resources</h2>
            <p className="text-muted-foreground">
              Safety planning and crisis resources coming soon...
            </p>
            <button
              onClick={() => setCurrentView("dashboard")}
              className="text-primary hover:underline"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}

        {currentView === "resources" && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Educational Resources</h2>
            <p className="text-muted-foreground">
              Educational content and resources coming soon...
            </p>
            <button
              onClick={() => setCurrentView("dashboard")}
              className="text-primary hover:underline"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
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
