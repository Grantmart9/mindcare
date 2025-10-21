"use client";

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
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp
                className={`h-4 w-4 ${
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              />
              <div>
                <p className="text-sm font-medium">Average Mood</p>
                <p className="text-2xl font-bold">{averageMood.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Entries</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">
                  {
                    entries.filter((entry) => {
                      const entryDate = parseISO(entry.date);
                      const weekAgo = subDays(new Date(), 7);
                      return entryDate >= weekAgo;
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trend" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trend" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trend</span>
          </TabsTrigger>
          <TabsTrigger value="factors" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Factors</span>
          </TabsTrigger>
          <TabsTrigger
            value="distribution"
            className="flex items-center space-x-2"
          >
            <PieChartIcon className="h-4 w-4" />
            <span>Distribution</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trend</CardTitle>
              <CardDescription>
                Your mood over the last {Math.min(entries.length, 14)} entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip
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
                        r: 4,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No mood data available yet</p>
                    <p className="text-sm">
                      Start tracking your mood to see trends here
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Related Factors</CardTitle>
              <CardDescription>
                Average ratings for energy, sleep, appetite, and social
                connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData.slice(-7)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="energy" fill="#fbbf24" name="Energy" />
                    <Bar dataKey="sleep" fill="#a78bfa" name="Sleep" />
                    <Bar dataKey="appetite" fill="#34d399" name="Appetite" />
                    <Bar dataKey="social" fill="#60a5fa" name="Social" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No factor data available yet</p>
                    <p className="text-sm">
                      Complete mood entries to see factor analysis
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>
                How often you experience different mood levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {moodDistribution.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={250}>
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {moodDistribution.map((item, index) => (
                      <div key={item.level} className="text-center">
                        <Badge
                          variant="outline"
                          className="w-full justify-center"
                          style={{
                            backgroundColor: `${
                              COLORS[index % COLORS.length]
                            }20`,
                          }}
                        >
                          {item.level}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.count} entries
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No distribution data available yet</p>
                    <p className="text-sm">
                      Need more entries to show mood distribution
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
