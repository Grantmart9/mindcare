"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { llmService } from "@/lib/services/llm-service";
import { toast } from "sonner";
import {
  Lightbulb,
  Brain,
  Heart,
  Users,
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  Loader2,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

interface MoodEntry {
  mood: number;
  date: string;
  notes?: string;
}

interface Recommendation {
  type: "activity" | "exercise" | "social" | "professional" | "self-care";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  estimatedDuration?: number;
  category?: string;
  tags?: string[];
}

interface PersonalizedRecommendationsProps {
  className?: string;
  moodHistory?: MoodEntry[];
  userPreferences?: string[];
  onRecommendationSelect?: (recommendation: Recommendation) => void;
}

const RECOMMENDATION_ICONS = {
  activity: <Target className="h-4 w-4" />,
  exercise: <Heart className="h-4 w-4" />,
  social: <Users className="h-4 w-4" />,
  professional: <BookOpen className="h-4 w-4" />,
  "self-care": <Brain className="h-4 w-4" />,
};

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

export function PersonalizedRecommendations({
  className,
  moodHistory = [],
  userPreferences = [],
  onRecommendationSelect,
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // userMood state removed as it's unused

  const generateRecommendations = useCallback(async () => {
    if (moodHistory.length === 0) return;

    setIsLoading(true);
    try {
      const result = await llmService.generatePersonalizedRecommendations(
        moodHistory,
        userPreferences
      );

      setRecommendations(result.recommendations);
      setLastUpdated(new Date());
      toast.success("Generated personalized recommendations!");
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error("Failed to generate recommendations. Please try again.");

      // Fallback recommendations
      setRecommendations([
        {
          type: "self-care",
          title: "Practice Deep Breathing",
          description:
            "Take 5 minutes to focus on slow, deep breaths. This can help reduce stress and anxiety.",
          priority: "medium",
          estimatedDuration: 5,
          category: "Mindfulness",
          tags: ["breathing", "quick", "stress-relief"],
        },
        {
          type: "activity",
          title: "Take a Short Walk",
          description:
            "A 10-minute walk outdoors can boost your mood and provide fresh perspective.",
          priority: "medium",
          estimatedDuration: 10,
          category: "Physical Activity",
          tags: ["exercise", "outdoors", "mood-boost"],
        },
        {
          type: "social",
          title: "Connect with a Friend",
          description:
            "Reach out to someone you care about for a meaningful conversation.",
          priority: "high",
          estimatedDuration: 15,
          category: "Social Connection",
          tags: ["relationships", "support", "communication"],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [moodHistory, userPreferences]);

  useEffect(() => {
    generateRecommendations();
  }, [moodHistory, userPreferences, generateRecommendations]);

  const handleRecommendationClick = (recommendation: Recommendation) => {
    onRecommendationSelect?.(recommendation);
    toast.success(`Selected: ${recommendation.title}`);
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 5;
    return (
      moodHistory.reduce((sum, entry) => sum + entry.mood, 0) /
      moodHistory.length
    );
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return "stable";
    const recent = moodHistory.slice(-3);
    const older = moodHistory.slice(-6, -3);

    if (older.length === 0) return "stable";

    const recentAvg =
      recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, entry) => sum + entry.mood, 0) / older.length;

    if (recentAvg > olderAvg + 0.5) return "improving";
    if (recentAvg < olderAvg - 0.5) return "declining";
    return "stable";
  };

  const moodTrend = getMoodTrend();
  const avgMood = getAverageMood();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Lightbulb className="h-6 w-6" />
          <span>Personalized Recommendations</span>
        </h2>
        <p className="text-muted-foreground">
          AI-powered suggestions based on your mood patterns and preferences
        </p>
      </div>

      {/* Mood Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Your Current State</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Average Mood
              </div>
              <div className="text-2xl font-bold">{avgMood.toFixed(1)}/10</div>
              <Progress value={avgMood * 10} className="mt-2" />
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Trend</div>
              <Badge variant="outline" className="capitalize">
                {moodTrend}
              </Badge>
              <div className="text-xs text-muted-foreground mt-2">
                Based on recent entries
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Data Points
              </div>
              <div className="text-2xl font-bold">{moodHistory.length}</div>
              <div className="text-xs text-muted-foreground">
                Mood entries analyzed
              </div>
            </div>
          </div>

          {lastUpdated && (
            <div className="text-center text-sm text-muted-foreground">
              Last updated: {format(lastUpdated, "MMM d, yyyy 'at' h:mm a")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Suggested Activities</span>
            </CardTitle>
            <Button
              onClick={generateRecommendations}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Analyzing your mood patterns...</span>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Add some mood entries to get personalized recommendations!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleRecommendationClick(rec)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {RECOMMENDATION_ICONS[rec.type]}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={PRIORITY_COLORS[rec.priority]}>
                            {rec.priority} priority
                          </Badge>
                          {rec.estimatedDuration && (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {rec.estimatedDuration}min
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {rec.type.replace("-", " ")}
                          </Badge>
                          {rec.category && (
                            <Badge variant="outline" className="text-xs">
                              {rec.category}
                            </Badge>
                          )}
                        </div>

                        <Button size="sm" variant="ghost">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Try This
                        </Button>
                      </div>

                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {rec.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      {recommendations.length > 0 && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>AI Insight:</strong> These recommendations are personalized
            based on your mood patterns.
            {moodTrend === "declining" &&
              " I&apos;ve focused on mood-boosting and supportive activities since your recent trend shows some challenges."}
            {moodTrend === "improving" &&
              " I&apos;ve included maintenance activities to help sustain your positive momentum."}
            {moodTrend === "stable" &&
              " I&apos;ve suggested a balanced mix of activities to support your current stability."}
          </AlertDescription>
        </Alert>
      )}

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">💡 How Recommendations Work</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • Recommendations are based on your mood history and patterns
            </li>
            <li>• Higher priority items are suggested for immediate needs</li>
            <li>
              • Duration estimates help you fit activities into your schedule
            </li>
            <li>
              • Categories help you choose based on your current energy and
              preferences
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
