"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { llmService } from "@/lib/services/llm-service";
import {
  apiService,
  MoodEntry as ApiMoodEntry,
  MoodAnalytics as MoodAnalyticsData,
} from "@/lib/services/api-service";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Lightbulb,
  Calendar,
  Target,
  Activity,
  Heart,
  Zap,
  Moon,
  Users,
  CheckCircle,
  Loader2,
  RefreshCw,
  Eye,
  Filter,
} from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy?: number;
  sleep?: number;
  appetite?: number;
  social?: number;
  anxiety?: number;
  notes?: string;
  emotions?: Record<string, number>;
  activities?: string[];
}

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  sentiment?: {
    sentiment: "positive" | "neutral" | "negative";
    confidence: number;
    emotions: string[];
    intensity: number;
  };
  wordCount: number;
}

interface AnalyticsInsight {
  type: "trend" | "pattern" | "correlation" | "prediction" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: "low" | "medium" | "high";
}

interface MoodAnalyticsProps {
  className?: string;
  moodHistory?: MoodEntry[];
  journalEntries?: JournalEntry[];
  onInsightAction?: (insight: AnalyticsInsight) => void;
}

// Mock data removed - now using real API data

const FACTOR_LABELS = {
  mood: "Overall Mood",
  energy: "Energy Level",
  sleep: "Sleep Quality",
  appetite: "Appetite",
  social: "Social Connection",
};

const FACTOR_ICONS = {
  mood: <Heart className="h-4 w-4" />,
  energy: <Zap className="h-4 w-4" />,
  sleep: <Moon className="h-4 w-4" />,
  appetite: <Target className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
};

export function MoodAnalytics({
  className,
  moodHistory: initialMoodHistory = [],
  journalEntries: initialJournalEntries = [],
  onInsightAction,
}: MoodAnalyticsProps) {
  const [moodHistory, setMoodHistory] =
    useState<ApiMoodEntry[]>(initialMoodHistory);
  const [journalEntries] = useState(initialJournalEntries); // Currently not used in API mode
  const [analytics] = useState<MoodAnalyticsData | null>(null); // Currently not used in API mode
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const [selectedFactor, setSelectedFactor] =
    useState<keyof typeof FACTOR_LABELS>("mood");

  // Load real data from API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [moodResponse, analyticsResponse] = await Promise.all([
        apiService.getMoodEntries(),
        apiService.getMoodAnalytics(),
      ]);

      // Convert API mood entries to component format
      const convertedMoodHistory: MoodEntry[] = moodResponse.entries.map(
        (entry) => ({
          id: entry.id,
          date: entry.date,
          mood: entry.mood,
          energy: entry.energy || 5,
          sleep: entry.sleep || 5,
          appetite: 5, // Not in API yet
          social: 5, // Not in API yet
          notes: entry.notes,
          triggers: [], // Not in API yet
        })
      );

      setMoodHistory(convertedMoodHistory);
      // Analytics data loaded but not currently used in UI
    } catch (error) {
      console.error("Error loading mood data:", error);
      toast.error("Failed to load mood data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getMoodTrend = useCallback((): string => {
    if (moodHistory.length < 2) return "not enough data";

    const recent = moodHistory.slice(0, 3);
    const older = moodHistory.slice(3, 6);

    if (older.length === 0) return "stable";

    const recentAvg =
      recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, entry) => sum + entry.mood, 0) / older.length;

    if (recentAvg > olderAvg + 0.5) return "improved";
    if (recentAvg < olderAvg - 0.5) return "declined";
    return "remained stable";
  }, [moodHistory]);

  const generateInsights = useCallback(async () => {
    if (moodHistory.length < 3) return;

    setIsAnalyzing(true);
    try {
      // Generate AI-powered insights
      const moodData = moodHistory.slice(0, 14); // Last 2 weeks
      const avgMood =
        moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;

      // Create a comprehensive prompt for AI analysis
      const prompt = `Analyze this mood data and provide insights:

Recent mood entries (last 7 days): ${JSON.stringify(moodHistory.slice(0, 7))}
Average mood: ${avgMood.toFixed(1)}/10

Please provide 4-6 key insights in JSON format:
{
  "insights": [
    {
      "type": "trend|pattern|correlation|prediction|recommendation",
      "title": "Brief title",
      "description": "Detailed explanation",
      "confidence": 0.0-1.0,
      "actionable": true/false,
      "priority": "low|medium|high"
    }
  ]
}

Focus on:
- Mood trends and patterns
- Correlations between factors (sleep, energy, social, etc.)
- Trigger identification
- Progress indicators
- Personalized recommendations`;

      const response = await llmService.generateResponse({
        model: "codellama:latest",
        prompt,
        temperature: 0.3,
        max_tokens: 512,
      });

      const result = JSON.parse(response);
      const aiInsights = result.insights || [];

      // Add some default insights if AI doesn't provide enough
      const defaultInsights: AnalyticsInsight[] = [
        {
          type: "trend",
          title: "Mood Trend Analysis",
          description: `Your mood has ${getMoodTrend()} over the past week with an average of ${avgMood.toFixed(
            1
          )}/10.`,
          confidence: 0.9,
          actionable: false,
          priority: "medium",
        },
        {
          type: "correlation",
          title: "Sleep-Mood Connection",
          description:
            "Better sleep quality appears to correlate with improved mood. Consider prioritizing sleep hygiene.",
          confidence: 0.75,
          actionable: true,
          priority: "high",
        },
      ];

      setInsights([...aiInsights, ...defaultInsights.slice(0, 2)]);
      toast.success("AI insights generated!");
    } catch (error) {
      console.error("Error generating insights:", error);
      toast.error("Failed to generate insights. Using default analysis.");

      // Fallback insights
      setInsights([
        {
          type: "trend",
          title: "Mood Trend Analysis",
          description: `Your mood has ${getMoodTrend()} over the past week.`,
          confidence: 0.8,
          actionable: false,
          priority: "medium",
        },
        {
          type: "recommendation",
          title: "Continue Tracking",
          description:
            "Keep logging your mood daily to identify more patterns and triggers.",
          confidence: 0.9,
          actionable: true,
          priority: "low",
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [moodHistory, getMoodTrend]);

  useEffect(() => {
    generateInsights();
  }, [moodHistory, generateInsights]);

  const getAverageScore = (factor: keyof typeof FACTOR_LABELS): number => {
    if (moodHistory.length === 0) return 0;

    const values = moodHistory
      .map((entry) => {
        switch (factor) {
          case "mood":
            return entry.mood;
          case "energy":
            return entry.energy || 5;
          case "sleep":
            return entry.sleep || 5;
          case "appetite":
            return entry.appetite || 5;
          case "social":
            return entry.social || 5;
          default:
            return 5;
        }
      })
      .filter((val) => val !== undefined);

    return values.length > 0
      ? values.reduce((sum, val) => sum + val, 0) / values.length
      : 0;
  };

  const getWeeklyData = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return daysInWeek.map((day) => {
      const dayStr = day.toISOString().split("T")[0];
      const entry = moodHistory.find((e) => e.date.startsWith(dayStr));
      return {
        date: format(day, "EEE"),
        mood: entry?.mood || 0,
        energy: entry?.energy || 0,
        sleep: entry?.sleep || 0,
        appetite: entry?.appetite || 0,
        social: entry?.social || 0,
      };
    });
  };

  const weeklyData = getWeeklyData();
  const trend = getMoodTrend();

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Mood Analytics</span>
          </h2>
          <p className="text-muted-foreground">Loading your mood data...</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Fetching mood entries and analytics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <span>Mood Analytics</span>
        </h2>
        <p className="text-muted-foreground">
          AI-powered insights into your mood patterns and progress
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <select
                  value={timeRange}
                  onChange={(e) =>
                    setTimeRange(e.target.value as typeof timeRange)
                  }
                  className="p-2 border rounded-md text-sm"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <select
                  value={selectedFactor}
                  onChange={(e) =>
                    setSelectedFactor(
                      e.target.value as keyof typeof FACTOR_LABELS
                    )
                  }
                  className="p-2 border rounded-md text-sm"
                >
                  {Object.entries(FACTOR_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={generateInsights}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Insights
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(FACTOR_LABELS).map(([key, label]) => {
          const average = getAverageScore(key as keyof typeof FACTOR_LABELS);
          const icon = FACTOR_ICONS[key as keyof typeof FACTOR_ICONS];

          return (
            <Card key={key}>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  {icon}
                </div>
                <div className="text-xl font-bold">{average.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
                <Progress value={average * 10} className="mt-2 h-1" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Weekly Mood Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Simple bar chart visualization */}
                <div className="grid grid-cols-7 gap-2">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        {day.date}
                      </div>
                      <div className="relative">
                        <div
                          className="bg-primary rounded-t-sm mx-auto transition-all duration-300 hover:opacity-80"
                          style={{
                            width: "20px",
                            height: `${(day.mood / 10) * 80}px`,
                          }}
                        />
                        <div className="text-xs font-medium mt-1">
                          {day.mood}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Trend Summary
                  </div>
                  <div className="font-medium">
                    Your mood has {trend} over the past week
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Factor Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Factor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(FACTOR_LABELS).map(([key, label]) => {
                  const values = moodHistory.map(
                    (entry) => entry[key as keyof MoodEntry] as number
                  );
                  const avg =
                    values.reduce((sum, val) => sum + val, 0) / values.length;
                  const max = Math.max(...values);
                  const min = Math.min(...values);

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{label}</span>
                        <Badge variant="outline">
                          Avg: {avg.toFixed(1)} | Range: {min}-{max}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(avg / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Common Triggers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "work stress",
                    "poor sleep",
                    "social connection",
                    "exercise",
                  ].map((trigger) => {
                    // For now, use activities as triggers since triggers aren't in API yet
                    const count = moodHistory.filter((entry) =>
                      entry.activities?.includes(trigger)
                    ).length;

                    if (count === 0) return null;

                    return (
                      <div
                        key={trigger}
                        className="flex items-center justify-between"
                      >
                        <span className="capitalize">
                          {trigger.replace("_", " ")}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress
                            value={(count / moodHistory.length) * 100}
                            className="w-20"
                          />
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Best & Worst Days</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodHistory
                    .sort((a, b) => b.mood - a.mood)
                    .slice(0, 3)
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">
                            {format(new Date(entry.date), "EEEE, MMM d")}
                          </div>
                          {entry.notes && (
                            <div className="text-sm text-muted-foreground">
                              {entry.notes}
                            </div>
                          )}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {entry.mood}/10
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {isAnalyzing ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Analyzing your mood patterns with AI...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    insight.priority === "high"
                      ? "border-red-200 bg-red-50"
                      : insight.priority === "medium"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {insight.type === "recommendation" && (
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                        )}
                        {insight.type === "pattern" && (
                          <Target className="h-5 w-5 text-purple-600" />
                        )}
                        {insight.type === "trend" && (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        )}
                        {insight.type === "correlation" && (
                          <Activity className="h-5 w-5 text-orange-600" />
                        )}
                        {insight.type === "prediction" && (
                          <Eye className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(insight.confidence * 100)}% confidence
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {insight.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge
                            className={`text-xs ${
                              insight.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : insight.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {insight.priority} priority
                          </Badge>

                          {insight.actionable && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onInsightAction?.(insight)}
                            >
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {insights.length === 0 && !isAnalyzing && (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Not Enough Data</h3>
                <p className="text-muted-foreground mb-4">
                  Add more mood entries to generate AI-powered insights
                </p>
                <Button onClick={generateInsights} variant="outline">
                  Try Analysis Anyway
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Consistency Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Logging Streak</span>
                      <span>{moodHistory.length} days</span>
                    </div>
                    <Progress
                      value={Math.min((moodHistory.length / 30) * 100, 100)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Journal Integration</span>
                      <span>{journalEntries.length} entries</span>
                    </div>
                    <Progress
                      value={Math.min((journalEntries.length / 20) * 100, 100)}
                    />
                  </div>

                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Overall Progress
                    </div>
                    <div className="text-lg font-bold">
                      {Math.round(
                        ((moodHistory.length + journalEntries.length) / 50) *
                          100
                      )}
                      %
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Achievement Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Mood Tracking</span>
                    <Badge>{moodHistory.length}/100</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Journal Writing</span>
                    <Badge>{journalEntries.length}/50</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Pattern Recognition</span>
                    <Badge
                      variant={insights.length > 0 ? "default" : "outline"}
                    >
                      {insights.length > 0 ? "Active" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Summary */}
      {insights.length > 0 && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>AI Summary:</strong> Based on your mood patterns, I&apos;ve
            identified {insights.length} key insights.
            {trend === "improved" &&
              " Your mood shows positive improvement - keep up the good work!"}
            {trend === "declined" &&
              " I've detected some challenges in your recent mood patterns. Consider the recommendations above."}
            {trend === "remained stable" &&
              " Your mood has been consistent. This stability is a good foundation for growth."}
          </AlertDescription>
        </Alert>
      )}

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">📊 Analytics Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Track your mood daily for the most accurate insights</li>
            <li>• Include notes about significant events or triggers</li>
            <li>• Review patterns weekly to identify what affects your mood</li>
            <li>
              • Use insights to make small, positive changes to your routine
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
