"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DashboardStats, MoodEntry, BehavioralActivation } from "@/lib/types";
import {
  Activity,
  TrendingUp,
  Calendar,
  Heart,
  Plus,
  Phone,
} from "lucide-react";
import { format, isToday, parseISO } from "date-fns";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface ProgressDashboardProps {
  stats: DashboardStats;
  recentMood?: MoodEntry;
  recentActivities: BehavioralActivation[];
  onNavigateToMood: () => void;
  onNavigateToCBT: () => void;
  onNavigateToSafety: () => void;
  onNavigateToResources: () => void;
}

export function ProgressDashboard({
  stats,
  recentMood,
  recentActivities,
  onNavigateToMood,
  onNavigateToCBT,
  onNavigateToSafety,
  onNavigateToResources,
}: ProgressDashboardProps) {
  const getMoodColor = (mood: number) => {
    if (mood >= 7) return "bg-green-500";
    if (mood >= 5) return "bg-yellow-500";
    if (mood >= 3) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 8) return "Great";
    if (mood >= 6) return "Good";
    if (mood >= 4) return "Okay";
    if (mood >= 2) return "Low";
    return "Very Low";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to MindCare
        </h1>
        <p className="text-lg text-gray-600">
          Your evidence-based companion for mental health and wellness
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Current Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Entries</p>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Avg Mood</p>
                <p className="text-2xl font-bold">
                  {stats.averageMood.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{stats.completedExercises}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Mood */}
      {recentMood && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Today&apos;s Mood</span>
              <Badge className={getMoodColor(recentMood.mood)}>
                {getMoodLabel(recentMood.mood)}
              </Badge>
            </CardTitle>
            <CardDescription>
              {isToday(parseISO(recentMood.date))
                ? "Logged today"
                : `Logged on ${format(parseISO(recentMood.date), "MMM dd")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Mood</span>
                  <span>{recentMood.mood}/10</span>
                </div>
                <Progress value={recentMood.mood * 10} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Energy</p>
                  <p className="font-semibold">{recentMood.energy}/10</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sleep</p>
                  <p className="font-semibold">{recentMood.sleep}/10</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Appetite</p>
                  <p className="font-semibold">{recentMood.appetite}/10</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Social</p>
                  <p className="font-semibold">{recentMood.social}/10</p>
                </div>
              </div>

              {recentMood.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{recentMood.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Your latest behavioral activation activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.slice(0, 3).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <Badge variant={activity.completed ? "default" : "secondary"}>
                    {activity.completed ? "Completed" : "Scheduled"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access key features and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              onClick={onNavigateToMood}
            >
              <Heart className="h-6 w-6" />
              <span>Track Mood</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              onClick={onNavigateToCBT}
            >
              <Activity className="h-6 w-6" />
              <span>CBT Tools</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              onClick={onNavigateToSafety}
            >
              <Phone className="h-6 w-6" />
              <span>Safety</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              onClick={onNavigateToResources}
            >
              <Plus className="h-6 w-6" />
              <span>Resources</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Support Notice */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">
                Need Immediate Help?
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                If you&apos;re experiencing a mental health crisis, please
                contact emergency services or a crisis hotline immediately.
              </p>
              <Button
                size="sm"
                variant="destructive"
                onClick={onNavigateToSafety}
              >
                View Crisis Resources
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
