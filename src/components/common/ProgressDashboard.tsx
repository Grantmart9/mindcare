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
  Phone,
  Zap,
  Moon,
  Utensils,
  Users,
  CheckCircle,
  Clock,
  Target,
  Star,
} from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import { useState } from "react";

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
  const [expandedMood, setExpandedMood] = useState(false);
  const [activeFactor, setActiveFactor] = useState<string | null>(null);

  const getMoodColor = (mood: number) => {
    if (mood >= 7) return "bg-green-500";
    if (mood >= 5) return "bg-yellow-500";
    if (mood >= 3) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMoodGradient = (mood: number) => {
    if (mood >= 7) return "from-green-400 to-emerald-500";
    if (mood >= 5) return "from-yellow-400 to-orange-500";
    if (mood >= 3) return "from-orange-400 to-red-500";
    return "from-red-400 to-pink-500";
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
        className="text-center space-y-4 mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-cyan-100/20 to-indigo-100/20 rounded-3xl blur-3xl"></div>
        <motion.div className="text-6xl mb-4 relative z-10">✨</motion.div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm relative z-10">
          Welcome to MindCare
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
          Your uplifting companion for mental health and wellness 🌟
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card-hover-glow"
        >
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 group-hover:from-blue-400/10 group-hover:to-cyan-400/10 transition-all duration-300"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Activity className="h-5 w-5 text-white relative z-10" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Streak
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stats.currentStreak}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card-hover-glow"
        >
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 group-hover:from-blue-400/10 group-hover:to-cyan-400/10 transition-all duration-300"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <TrendingUp className="h-5 w-5 text-white relative z-10" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Entries
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stats.totalEntries}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card-hover-glow"
        >
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-400/5 group-hover:from-purple-400/10 group-hover:to-indigo-400/10 transition-all duration-300"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-lg relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Heart className="h-5 w-5 text-white relative z-10" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Mood
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stats.averageMood.toFixed(1)}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="card-hover-glow"
        >
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 group-hover:from-green-400/10 group-hover:to-emerald-400/10 transition-all duration-300"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="p-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Calendar className="h-5 w-5 text-white relative z-10" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {stats.completedExercises}
                  </motion.p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Today's Mood */}
      {recentMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardHeader className="relative z-10">
              <motion.div
                className="flex items-center justify-between"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-3xl"
                  >
                    😊
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Today&apos;s Mood
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {isToday(parseISO(recentMood.date))
                        ? "✨ Logged today"
                        : `📅 Logged on ${format(
                            parseISO(recentMood.date),
                            "MMM dd"
                          )}`}
                    </CardDescription>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    className={`${getMoodColor(
                      recentMood.mood
                    )} text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg`}
                  >
                    {getMoodLabel(recentMood.mood)}
                  </Badge>
                </motion.div>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* Main Mood Display */}
              <motion.div className="text-center space-y-4" layout>
                <motion.div
                  className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getMoodGradient(
                    recentMood.mood
                  )} flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden`}
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 10px 30px rgba(0,0,0,0.1)",
                      "0 20px 40px rgba(0,0,0,0.15)",
                      "0 10px 30px rgba(0,0,0,0.1)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-3xl font-bold text-white drop-shadow-lg">
                    {recentMood.mood}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse"></div>
                </motion.div>

                <Progress
                  value={recentMood.mood * 10}
                  className="h-3 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${recentMood.mood * 10}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </Progress>
              </motion.div>

              {/* Interactive Mood Factors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    key: "energy",
                    label: "Energy",
                    value: recentMood.energy,
                    icon: Zap,
                    color: "from-yellow-400 to-orange-500",
                  },
                  {
                    key: "sleep",
                    label: "Sleep",
                    value: recentMood.sleep,
                    icon: Moon,
                    color: "from-indigo-400 to-purple-500",
                  },
                  {
                    key: "appetite",
                    label: "Appetite",
                    value: recentMood.appetite,
                    icon: Utensils,
                    color: "from-green-400 to-emerald-500",
                  },
                  {
                    key: "social",
                    label: "Social",
                    value: recentMood.social,
                    icon: Users,
                    color: "from-pink-400 to-rose-500",
                  },
                ].map((factor, index) => (
                  <motion.div
                    key={factor.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onHoverStart={() => setActiveFactor(factor.key)}
                    onHoverEnd={() => setActiveFactor(null)}
                    className={`p-4 rounded-xl border-2 border-transparent bg-gradient-to-br ${factor.color} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 cursor-pointer relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center space-y-2">
                      <motion.div
                        animate={
                          activeFactor === factor.key
                            ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                        className="mx-auto"
                      >
                        <factor.icon className="h-6 w-6 text-gray-600 mx-auto" />
                      </motion.div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">
                          {factor.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {factor.value}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${factor.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.value * 10}%` }}
                            transition={{
                              duration: 1,
                              delay: 0.8 + index * 0.1,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Notes Section */}
              {recentMood.notes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 1 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-semibold text-blue-700">
                      Reflection Notes
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {recentMood.notes}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Recent Activities */}
      {recentActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardHeader className="relative z-10">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl"
                >
                  🎯
                </motion.div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Recent Activities
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Your behavioral activation journey
                  </CardDescription>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="space-y-4">
                {recentActivities.slice(0, 3).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                      activity.completed
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
                        : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={
                              activity.completed
                                ? {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 360, 0],
                                  }
                                : {}
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.completed
                                ? "bg-gradient-to-br from-green-400 to-emerald-500"
                                : "bg-gradient-to-br from-blue-400 to-cyan-500"
                            }`}
                          >
                            {activity.completed ? (
                              <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                              <Clock className="h-5 w-5 text-white" />
                            )}
                          </motion.div>

                          <div>
                            <motion.h4
                              className="font-semibold text-lg text-gray-800"
                              whileHover={{ scale: 1.05 }}
                            >
                              {activity.title}
                            </motion.h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.description}
                            </p>
                          </div>
                        </div>

                        {/* Progress Indicators */}
                        <div className="ml-13 space-y-2">
                          {activity.completed && activity.completedAt && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="flex items-center space-x-2 text-xs text-green-600"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>
                                Completed on{" "}
                                {format(
                                  new Date(activity.completedAt),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                            </motion.div>
                          )}

                          {activity.difficulty && (
                            <div className="flex items-center space-x-2">
                              <Target className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-600">
                                Difficulty:
                              </span>
                              <div className="flex space-x-1">
                                {[...Array(10)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < activity.difficulty
                                        ? "bg-orange-400"
                                        : "bg-gray-200"
                                    }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      delay: 1 + index * 0.1 + i * 0.05,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {activity.enjoyment && activity.enjoyment > 0 && (
                            <div className="flex items-center space-x-2">
                              <Star className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-600">
                                Enjoyment:
                              </span>
                              <div className="flex space-x-1">
                                {[...Array(10)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < activity.enjoyment
                                        ? "bg-yellow-400"
                                        : "bg-gray-200"
                                    }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      delay: 1.2 + index * 0.1 + i * 0.05,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {activity.notes && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: 1.5 }}
                              className="p-2 bg-white/50 rounded-lg border border-gray-100"
                            >
                              <p className="text-xs text-gray-600 italic">
                                &ldquo;{activity.notes}&rdquo;
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          variant={activity.completed ? "default" : "secondary"}
                          className={`${
                            activity.completed
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          } px-3 py-1 font-medium`}
                        >
                          {activity.completed ? "✅ Completed" : "⏳ Scheduled"}
                        </Badge>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <CardHeader className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                🚀
              </motion.div>
              <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Your gateway to mental wellness
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: "❤️",
                  label: "Track Mood",
                  description: "Log your feelings",
                  gradient: "from-pink-400 to-rose-500",
                  bgGradient: "from-pink-50 to-rose-50",
                  hoverGradient: "from-pink-100 to-rose-100",
                  borderColor: "hover:border-pink-300",
                  onClick: onNavigateToMood,
                  delay: 1.0,
                },
                {
                  icon: "🧠",
                  label: "CBT Tools",
                  description: "Therapy exercises",
                  gradient: "from-blue-400 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                  hoverGradient: "from-blue-100 to-cyan-100",
                  borderColor: "hover:border-blue-300",
                  onClick: onNavigateToCBT,
                  delay: 1.1,
                },
                {
                  icon: "🛡️",
                  label: "Safety",
                  description: "Crisis support",
                  gradient: "from-green-400 to-emerald-500",
                  bgGradient: "from-green-50 to-emerald-50",
                  hoverGradient: "from-green-100 to-emerald-100",
                  borderColor: "hover:border-green-300",
                  onClick: onNavigateToSafety,
                  delay: 1.2,
                },
                {
                  icon: "📚",
                  label: "Resources",
                  description: "Learn & grow",
                  gradient: "from-yellow-400 to-orange-500",
                  bgGradient: "from-yellow-50 to-orange-50",
                  hoverGradient: "from-yellow-100 to-orange-100",
                  borderColor: "hover:border-yellow-300",
                  onClick: onNavigateToResources,
                  delay: 1.3,
                },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: action.delay,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    rotateY: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button
                    variant="outline"
                    className={`h-auto p-6 flex-col space-y-4 rounded-2xl border-2 ${action.borderColor} bg-gradient-to-br ${action.bgGradient} hover:from-pink-100 hover:to-rose-100 transition-all duration-500 shadow-lg hover:shadow-2xl relative overflow-hidden w-full`}
                    onClick={action.onClick}
                  >
                    {/* Animated background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center space-y-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                        className="text-4xl drop-shadow-sm"
                      >
                        {action.icon}
                      </motion.div>

                      <div className="space-y-1">
                        <motion.h3
                          className="font-bold text-lg text-gray-800 group-hover:text-gray-900 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          {action.label}
                        </motion.h3>
                        <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <motion.div
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r ${action.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    />

                    <motion.div
                      className={`absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-r ${action.gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-300`}
                      animate={{
                        scale: [1, 0.8, 1],
                        rotate: [360, 180, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.3 + 1,
                      }}
                    />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Additional decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 text-center"
            >
              <div className="flex justify-center space-x-4 opacity-60">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3 italic">
                Choose your path to wellness ✨
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

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
