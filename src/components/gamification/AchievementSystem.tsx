"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
// import { apiService } from "@/lib/services/api-service"; // Not currently used
import {
  Trophy,
  Star,
  Target,
  Flame,
  Lock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Heart,
  BookOpen,
  Users,
  Zap,
  Crown,
  Medal,
  Gift,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category:
    | "streaks"
    | "completion"
    | "social"
    | "mindfulness"
    | "progress"
    | "special";
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  requirements: {
    type:
      | "streak"
      | "completions"
      | "journals"
      | "mood_checks"
      | "social"
      | "special";
    target: number;
    timeframe?: "daily" | "weekly" | "monthly" | "all_time";
  };
  unlockedAt?: string;
  progress?: number;
}

interface UserStats {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  journalEntries: number;
  moodChecks: number;
  socialInteractions: number;
  achievementsUnlocked: number;
  totalAchievements: number;
}

interface AchievementSystemProps {
  className?: string;
  userStats?: Partial<UserStats>;
  onPointsEarned?: (points: number, reason: string) => void;
}

const ACHIEVEMENTS: Achievement[] = [
  // Streak Achievements
  {
    id: "first_streak",
    title: "Getting Started",
    description: "Complete habits for 3 days in a row",
    icon: <Flame className="h-5 w-5" />,
    category: "streaks",
    points: 50,
    rarity: "common",
    requirements: { type: "streak", target: 3 },
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: <Calendar className="h-5 w-5" />,
    category: "streaks",
    points: 100,
    rarity: "common",
    requirements: { type: "streak", target: 7 },
  },
  {
    id: "streak_master",
    title: "Streak Master",
    description: "Achieve a 30-day streak",
    icon: <Crown className="h-5 w-5" />,
    category: "streaks",
    points: 300,
    rarity: "epic",
    requirements: { type: "streak", target: 30 },
  },

  // Completion Achievements
  {
    id: "first_steps",
    title: "First Steps",
    description: "Complete your first habit",
    icon: <CheckCircle className="h-5 w-5" />,
    category: "completion",
    points: 25,
    rarity: "common",
    requirements: { type: "completions", target: 1 },
  },
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Complete 50 habits",
    icon: <Target className="h-5 w-5" />,
    category: "completion",
    points: 150,
    rarity: "rare",
    requirements: { type: "completions", target: 50 },
  },
  {
    id: "completionist",
    title: "Completionist",
    description: "Complete 200 habits",
    icon: <Medal className="h-5 w-5" />,
    category: "completion",
    points: 400,
    rarity: "epic",
    requirements: { type: "completions", target: 200 },
  },

  // Journal Achievements
  {
    id: "reflective",
    title: "Reflective",
    description: "Write 10 journal entries",
    icon: <BookOpen className="h-5 w-5" />,
    category: "mindfulness",
    points: 75,
    rarity: "common",
    requirements: { type: "journals", target: 10 },
  },
  {
    id: "mindful_writer",
    title: "Mindful Writer",
    description: "Write 50 journal entries",
    icon: <Sparkles className="h-5 w-5" />,
    category: "mindfulness",
    points: 200,
    rarity: "rare",
    requirements: { type: "journals", target: 50 },
  },

  // Mood Tracking Achievements
  {
    id: "mood_aware",
    title: "Mood Aware",
    description: "Complete 20 mood check-ins",
    icon: <Heart className="h-5 w-5" />,
    category: "progress",
    points: 100,
    rarity: "common",
    requirements: { type: "mood_checks", target: 20 },
  },
  {
    id: "emotional_intelligence",
    title: "Emotional Intelligence",
    description: "Complete 100 mood check-ins",
    icon: <TrendingUp className="h-5 w-5" />,
    category: "progress",
    points: 250,
    rarity: "rare",
    requirements: { type: "mood_checks", target: 100 },
  },

  // Social Achievements
  {
    id: "connected",
    title: "Connected",
    description: "Participate in 10 peer support interactions",
    icon: <Users className="h-5 w-5" />,
    category: "social",
    points: 125,
    rarity: "common",
    requirements: { type: "social", target: 10 },
  },

  // Special Achievements
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete habits before 8 AM for 7 days",
    icon: <Zap className="h-5 w-5" />,
    category: "special",
    points: 200,
    rarity: "rare",
    requirements: { type: "special", target: 7 },
  },
];

const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-800",
  rare: "bg-blue-100 text-blue-800",
  epic: "bg-purple-100 text-purple-800",
  legendary: "bg-yellow-100 text-yellow-800",
};

const CATEGORY_ICONS = {
  streaks: <Flame className="h-4 w-4" />,
  completion: <CheckCircle className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
  mindfulness: <BookOpen className="h-4 w-4" />,
  progress: <TrendingUp className="h-4 w-4" />,
  special: <Star className="h-4 w-4" />,
};

export function AchievementSystem({
  className,
  userStats,
  onPointsEarned,
}: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    totalPoints: 0,
    pointsToNextLevel: 100,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
    journalEntries: 0,
    moodChecks: 0,
    socialInteractions: 0,
    achievementsUnlocked: 0,
    totalAchievements: ACHIEVEMENTS.length,
    ...userStats,
  });

  const [recentUnlocks] = useState<Achievement[]>([]);

  // Load progress from localStorage (keeping for now until API is ready)
  useEffect(() => {
    const loadData = async () => {
      try {
        // For now, use localStorage as achievements aren't in the API yet
        // In a full implementation, you would call: await apiService.getUserStats()
        const savedAchievements = localStorage.getItem("mindcare-achievements");
        const savedStats = localStorage.getItem("mindcare-user-stats");

        if (savedAchievements) {
          setAchievements(JSON.parse(savedAchievements));
        }
        if (savedStats) {
          setStats((prevStats) => ({
            ...prevStats,
            ...JSON.parse(savedStats),
          }));
        }
      } catch (error) {
        console.error("Error loading achievement data:", error);
        toast.error("Failed to load achievement data");
      }
    };

    loadData();
  }, []);

  // Save progress to localStorage (keeping for now)
  useEffect(() => {
    localStorage.setItem("mindcare-achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("mindcare-user-stats", JSON.stringify(stats));
  }, [stats]);

  const calculateLevel = (points: number): number => {
    return Math.floor(points / 100) + 1;
  };

  const pointsForNextLevel = (level: number): number => {
    return level * 100;
  };

  const updateStats = useCallback(
    (newStats: Partial<UserStats>) => {
      const checkAchievements = (updatedStats: UserStats) => {
        const newlyUnlocked: Achievement[] = [];

        achievements.forEach((achievement) => {
          if (achievement.unlockedAt) return; // Already unlocked

          let currentProgress = 0;
          let shouldUnlock = false;

          switch (achievement.requirements.type) {
            case "streak":
              currentProgress = updatedStats.longestStreak;
              shouldUnlock = currentProgress >= achievement.requirements.target;
              break;
            case "completions":
              currentProgress = updatedStats.totalCompletions;
              shouldUnlock = currentProgress >= achievement.requirements.target;
              break;
            case "journals":
              currentProgress = updatedStats.journalEntries;
              shouldUnlock = currentProgress >= achievement.requirements.target;
              break;
            case "mood_checks":
              currentProgress = updatedStats.moodChecks;
              shouldUnlock = currentProgress >= achievement.requirements.target;
              break;
            case "social":
              currentProgress = updatedStats.socialInteractions;
              shouldUnlock = currentProgress >= achievement.requirements.target;
              break;
          }

          if (shouldUnlock) {
            const unlockedAchievement = {
              ...achievement,
              unlockedAt: new Date().toISOString(),
              progress: 100,
            };

            newlyUnlocked.push(unlockedAchievement);
            onPointsEarned?.(
              achievement.points,
              `Achievement: ${achievement.title}`
            );

            // Update stats
            setStats((prev) => ({
              ...prev,
              achievementsUnlocked: prev.achievementsUnlocked + 1,
              totalPoints: prev.totalPoints + achievement.points,
            }));
          }
        });

        if (newlyUnlocked.length > 0) {
          setAchievements((prev) =>
            prev.map((achievement) => {
              const unlocked = newlyUnlocked.find(
                (u) => u.id === achievement.id
              );
              return unlocked || achievement;
            })
          );

          // recentUnlocks is now managed differently

          // Show toast for each newly unlocked achievement
          newlyUnlocked.forEach((achievement) => {
            toast.success(
              `🏆 Achievement Unlocked: ${achievement.title}! Earned ${achievement.points} points!`
            );
          });
        }
      };

      const updatedStats = { ...stats, ...newStats };
      const newLevel = calculateLevel(updatedStats.totalPoints);

      if (newLevel > stats.level) {
        toast.success(`🎉 Level Up! You reached level ${newLevel}!`);
      }

      setStats({
        ...updatedStats,
        level: newLevel,
        pointsToNextLevel:
          pointsForNextLevel(newLevel) - updatedStats.totalPoints,
      });

      checkAchievements(updatedStats);
    },
    [stats, achievements, onPointsEarned]
  );

  // Simulate some initial progress for demo
  useEffect(() => {
    if (stats.totalCompletions === 0) {
      // Simulate some initial progress
      setTimeout(() => {
        updateStats({
          totalCompletions: 15,
          journalEntries: 8,
          moodChecks: 12,
          currentStreak: 5,
          longestStreak: 8,
        });
      }, 1000);
    }
  }, [stats.totalCompletions, updateStats]);

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Trophy className="h-6 w-6" />
          <span>Achievement System</span>
        </h2>
        <p className="text-muted-foreground">
          Earn points, unlock achievements, and track your progress
        </p>
      </div>

      {/* Level and Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.level}
            </div>
            <div className="text-sm text-muted-foreground">Current Level</div>
            <Progress value={stats.totalPoints % 100} className="mt-3" />
            <div className="text-xs text-muted-foreground mt-1">
              {stats.pointsToNextLevel} points to next level
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {stats.totalPoints}
            </div>
            <div className="text-sm text-muted-foreground">Total Points</div>
            <div className="flex items-center justify-center space-x-1 mt-3">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {Math.floor(stats.totalPoints / 10)} XP earned this week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {stats.achievementsUnlocked}
            </div>
            <div className="text-sm text-muted-foreground">Achievements</div>
            <div className="text-xs text-muted-foreground mt-3">
              {stats.achievementsUnlocked}/{stats.totalAchievements} unlocked
            </div>
            <Progress
              value={
                (stats.achievementsUnlocked / stats.totalAchievements) * 100
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Unlocks */}
      {recentUnlocks.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Gift className="h-5 w-5" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentUnlocks.map((achievement) => (
                <div
                  key={achievement.id}
                  className="text-center p-3 bg-white rounded-lg border"
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div className="font-medium text-sm">{achievement.title}</div>
                  <Badge
                    className={`mt-1 ${RARITY_COLORS[achievement.rarity]}`}
                  >
                    +{achievement.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Categories */}
      <Tabs defaultValue="unlocked" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge className={RARITY_COLORS[achievement.rarity]}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          +{achievement.points} points
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Unlocked{" "}
                          {format(new Date(achievement.unlockedAt!), "MMM d")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => {
              const progress = calculateProgress(achievement, stats);
              const isCloseToUnlock = progress >= 75;

              return (
                <Card
                  key={achievement.id}
                  className={`relative ${
                    isCloseToUnlock ? "border-yellow-300 bg-yellow-50" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`text-2xl ${
                          isCloseToUnlock ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3
                            className={`font-semibold ${
                              isCloseToUnlock ? "" : "opacity-60"
                            }`}
                          >
                            {achievement.title}
                          </h3>
                          <Lock
                            className={`h-4 w-4 ${
                              isCloseToUnlock
                                ? "text-yellow-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Progress: {Math.round(progress)}%
                            </span>
                            <Badge
                              className={RARITY_COLORS[achievement.rarity]}
                            >
                              +{achievement.points} pts
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {Object.entries(CATEGORY_ICONS).map(([category, icon]) => {
            const categoryAchievements = achievements.filter(
              (a) => a.category === category
            );
            const unlockedInCategory = categoryAchievements.filter(
              (a) => a.unlockedAt
            ).length;

            return (
              <Card key={category}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {icon}
                      <div>
                        <h3 className="font-semibold capitalize">{category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {unlockedInCategory}/{categoryAchievements.length}{" "}
                          unlocked
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {categoryAchievements
                          .filter((a) => a.unlockedAt)
                          .reduce((sum, a) => sum + a.points, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        points earned
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={
                      (unlockedInCategory / categoryAchievements.length) * 100
                    }
                    className="mt-3"
                  />
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Points Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Points Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalCompletions * 5}
              </div>
              <div className="text-sm text-muted-foreground">
                Habit Completions
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.journalEntries * 10}
              </div>
              <div className="text-sm text-muted-foreground">
                Journal Entries
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.moodChecks * 3}
              </div>
              <div className="text-sm text-muted-foreground">
                Mood Check-ins
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.socialInteractions * 8}
              </div>
              <div className="text-sm text-muted-foreground">
                Social Interactions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Alert>
        <Trophy className="h-4 w-4" />
        <AlertDescription>
          <strong>Gamification Tips:</strong> Consistent daily habits and
          journaling are the fastest ways to earn points and unlock
          achievements. Focus on building sustainable routines rather than
          rushing for points!
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Helper function to calculate achievement progress
function calculateProgress(achievement: Achievement, stats: UserStats): number {
  let current = 0;

  switch (achievement.requirements.type) {
    case "streak":
      current = stats.longestStreak;
      break;
    case "completions":
      current = stats.totalCompletions;
      break;
    case "journals":
      current = stats.journalEntries;
      break;
    case "mood_checks":
      current = stats.moodChecks;
      break;
    case "social":
      current = stats.socialInteractions;
      break;
    default:
      current = 0;
  }

  return Math.min((current / achievement.requirements.target) * 100, 100);
}
