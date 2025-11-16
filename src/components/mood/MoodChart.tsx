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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MoodEntry } from "@/lib/types";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  TrendingDown,
  Minus,
  Activity,
  BarChart2,
  Target,
} from "lucide-react";
import { format, parseISO, subDays } from "date-fns";

interface MoodChartProps {
  entries: MoodEntry[];
  className?: string;
}

export function MoodChart({ entries, className }: MoodChartProps) {
  // Prepare data for charts
  const chartData = entries
    .slice(0, 14)
    .reverse()
    .map((entry) => ({
      date: format(parseISO(entry.date), "MMM dd"),
      fullDate: entry.date,
      mood: entry.mood,
      energy: entry.energy,
      sleep: entry.sleep,
      appetite: entry.appetite,
      social: entry.social,
    }));

  const averageMood =
    entries.length > 0
      ? Math.round(
          (entries.reduce((sum, entry) => sum + entry.mood, 0) /
            entries.length) *
            10
        ) / 10
      : 0;

  const moodDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map((level) => ({
      level: level.toString(),
      count: entries.filter((entry) => entry.mood === level).length,
      percentage:
        Math.round(
          (entries.filter((entry) => entry.mood === level).length /
            entries.length) *
            100
        ) || 0,
    }))
    .filter((item) => item.count > 0);

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#34d399",
    "#06b6d4",
    "#60a5fa",
    "#a78bfa",
  ];

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return "#34d399"; // soft green
    if (mood >= 6) return "#6ee7b7"; // light mint
    if (mood >= 4) return "#fbbf24"; // warm amber
    if (mood >= 2) return "#fb923c"; // soft orange
    return "#f87171"; // soft red
  };

  const getTrendDirection = () => {
    if (entries.length < 2) return "neutral";
    const recent = entries.slice(0, 3);
    const older = entries.slice(3, 6);

    if (recent.length === 0) return "neutral";

    const recentAvg =
      recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderAvg =
      older.length > 0
        ? older.reduce((sum, entry) => sum + entry.mood, 0) / older.length
        : recentAvg;

    if (recentAvg > olderAvg + 0.5) return "up";
    if (recentAvg < olderAvg - 0.5) return "down";
    return "neutral";
  };

  const trend = getTrendDirection();

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Enhanced Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 via-purple-100/20 to-pink-100/20 rounded-3xl blur-3xl"></div>
        <motion.div className="text-6xl mb-4 relative z-10">📊</motion.div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm relative z-10">
          Mood Insights & Analytics
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
          Visualize your mood patterns and track your mental health journey over
          time
        </p>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardContent className="p-6 relative z-10">
              <motion.div
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`p-3 rounded-xl ${
                    trend === "up"
                      ? "bg-gradient-to-br from-green-400 to-emerald-400"
                      : trend === "down"
                      ? "bg-gradient-to-br from-red-400 to-pink-400"
                      : "bg-gradient-to-br from-blue-400 to-indigo-400"
                  }`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-6 w-6 text-white" />
                  ) : trend === "down" ? (
                    <TrendingDown className="h-6 w-6 text-white" />
                  ) : (
                    <Minus className="h-6 w-6 text-white" />
                  )}
                </motion.div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Average Mood
                  </p>
                  <motion.p
                    className={`text-3xl font-bold ${
                      trend === "up"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                        : trend === "down"
                        ? "bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {averageMood.toFixed(1)}
                  </motion.p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardContent className="p-6 relative z-10">
              <motion.div
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-3 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl"
                >
                  <Activity className="h-6 w-6 text-white" />
                </motion.div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Total Entries
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {entries.length}
                  </motion.p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardContent className="p-6 relative z-10">
              <motion.div
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl"
                >
                  <Calendar className="h-6 w-6 text-white" />
                </motion.div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">
                    This Week
                  </p>
                  <motion.p
                    className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {
                      entries.filter((entry) => {
                        const entryDate = parseISO(entry.date);
                        const weekAgo = subDays(new Date(), 7);
                        return entryDate >= weekAgo;
                      }).length
                    }
                  </motion.p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="trend" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TabsTrigger
                value="trend"
                className="flex items-center space-x-3 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Trend</span>
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TabsTrigger
                value="factors"
                className="flex items-center space-x-3 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                <BarChart2 className="h-4 w-4" />
                <span className="font-medium">Factors</span>
              </TabsTrigger>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <TabsTrigger
                value="distribution"
                className="flex items-center space-x-3 rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300"
              >
                <PieChartIcon className="h-4 w-4" />
                <span className="font-medium">Distribution</span>
              </TabsTrigger>
            </motion.div>
          </TabsList>

          <TabsContent value="trend" className="space-y-6">
            <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

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
                    📈
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Mood Trend
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                      Your mood over the last {Math.min(entries.length, 14)}{" "}
                      entries
                    </CardDescription>
                  </div>
                </motion.div>
              </CardHeader>

              <CardContent className="relative z-10">
                {chartData.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis domain={[0, 10]} stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return format(
                                parseISO(payload[0].payload.fullDate),
                                "PPP"
                              );
                            }
                            return label;
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke={getMoodColor(
                            chartData[chartData.length - 1]?.mood || 5
                          )}
                          strokeWidth={3}
                          dot={{
                            fill: getMoodColor(
                              chartData[chartData.length - 1]?.mood || 5
                            ),
                            strokeWidth: 2,
                            r: 6,
                            stroke: "#ffffff",
                          }}
                          activeDot={{
                            r: 8,
                            fill: getMoodColor(
                              chartData[chartData.length - 1]?.mood || 5
                            ),
                            stroke: "#ffffff",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    className="h-[300px] flex items-center justify-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                      </motion.div>
                      <p className="text-lg font-semibold">
                        No mood data available yet
                      </p>
                      <p className="text-sm mt-2">
                        Start tracking your mood to see trends here
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="factors" className="space-y-6">
            <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative z-10">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-3xl"
                  >
                    📊
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Related Factors
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                      Average ratings for energy, sleep, appetite, and social
                      connection
                    </CardDescription>
                  </div>
                </motion.div>
              </CardHeader>

              <CardContent className="relative z-10">
                {chartData.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={chartData.slice(-7)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis domain={[0, 10]} stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="energy"
                          fill="#fbbf24"
                          name="Energy"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="sleep"
                          fill="#a78bfa"
                          name="Sleep"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="appetite"
                          fill="#34d399"
                          name="Appetite"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="social"
                          fill="#60a5fa"
                          name="Social"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <motion.div
                    className="h-[300px] flex items-center justify-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                      </motion.div>
                      <p className="text-lg font-semibold">
                        No factor data available yet
                      </p>
                      <p className="text-sm mt-2">
                        Complete mood entries to see factor analysis
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

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
                    🥧
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Mood Distribution
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                      How often you experience different mood levels
                    </CardDescription>
                  </div>
                </motion.div>
              </CardHeader>

              <CardContent className="relative z-10">
                {moodDistribution.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={moodDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ level, percentage }) =>
                              `${level}: ${percentage}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {moodDistribution.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              border: "1px solid #e5e7eb",
                              borderRadius: "12px",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {moodDistribution.map((item, index) => (
                        <motion.div
                          key={item.level}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          className="text-center"
                        >
                          <motion.div
                            className="p-3 rounded-xl border-2 border-white/50 shadow-lg"
                            style={{
                              backgroundColor: `${
                                COLORS[index % COLORS.length]
                              }20`,
                            }}
                            whileHover={{
                              backgroundColor: `${
                                COLORS[index % COLORS.length]
                              }30`,
                              y: -2,
                            }}
                          >
                            <Badge
                              variant="outline"
                              className="w-full justify-center border-white/50 text-sm font-bold"
                              style={{
                                color: COLORS[index % COLORS.length],
                                backgroundColor: "transparent",
                              }}
                            >
                              {item.level}
                            </Badge>
                          </motion.div>
                          <motion.p
                            className="text-xs text-muted-foreground mt-2 font-medium"
                            whileHover={{ color: "#6b7280" }}
                          >
                            {item.count}{" "}
                            {item.count === 1 ? "entry" : "entries"}
                          </motion.p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="h-[300px] flex items-center justify-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-green-400" />
                      </motion.div>
                      <p className="text-lg font-semibold">
                        No distribution data available yet
                      </p>
                      <p className="text-sm mt-2">
                        Need more entries to show mood distribution
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
