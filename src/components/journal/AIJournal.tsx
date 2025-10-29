"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { llmService } from "@/lib/services/llm-service";
import { toast } from "sonner";
import {
  BookOpen,
  Save,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Heart,
  Zap,
  Cloud,
  Sun,
  CloudRain,
  Star,
} from "lucide-react";
import { format } from "date-fns";

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
  moodScore?: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AIJournalProps {
  className?: string;
  onEntrySave?: (entry: JournalEntry) => void;
  existingEntry?: JournalEntry;
}

const EMOTION_ICONS: Record<string, React.ReactNode> = {
  joy: <Sun className="h-4 w-4 text-yellow-500" />,
  sadness: <CloudRain className="h-4 w-4 text-blue-500" />,
  anger: <Zap className="h-4 w-4 text-red-500" />,
  fear: <Cloud className="h-4 w-4 text-gray-500" />,
  anxiety: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  love: <Heart className="h-4 w-4 text-pink-500" />,
  excitement: <Star className="h-4 w-4 text-purple-500" />,
  calm: <CheckCircle className="h-4 w-4 text-green-500" />,
};

const SENTIMENT_COLORS = {
  positive: "bg-green-100 text-green-800 border-green-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
  negative: "bg-red-100 text-red-800 border-red-200",
};

export function AIJournal({
  className,
  onEntrySave,
  existingEntry,
}: AIJournalProps) {
  const [content, setContent] = useState(existingEntry?.content || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sentiment, setSentiment] = useState(existingEntry?.sentiment);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const isEmpty = content.trim().length === 0;

  const analyzeContent = async () => {
    if (isEmpty || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const analysis = await llmService.analyzeSentiment(content);
      setSentiment(analysis);
      setShowAnalysis(true);
      toast.success("AI analysis completed!");
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (isEmpty) return;

    setIsSaving(true);
    try {
      const entry: JournalEntry = {
        id: existingEntry?.id || Date.now().toString(),
        date: new Date().toISOString(),
        content,
        sentiment,
        wordCount,
        createdAt: existingEntry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onEntrySave?.(entry);
      toast.success(
        existingEntry ? "Journal entry updated!" : "Journal entry saved!"
      );
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getSentimentIcon = () => {
    if (!sentiment) return <Brain className="h-5 w-5" />;

    switch (sentiment.sentiment) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "negative":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSentimentLabel = () => {
    if (!sentiment) return "Not analyzed";

    const labels = {
      positive: "Positive",
      neutral: "Neutral",
      negative: "Negative",
    };

    return labels[sentiment.sentiment];
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span>AI-Enhanced Journal</span>
        </h2>
        <p className="text-muted-foreground">
          Write freely and get AI-powered insights into your emotions and
          patterns
        </p>
      </div>

      {/* Writing Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today&apos;s Journal Entry</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{wordCount} words</Badge>
              {sentiment && (
                <Badge className={SENTIMENT_COLORS[sentiment.sentiment]}>
                  {getSentimentLabel()}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Write about your thoughts, feelings, experiences, or anything you'd like to reflect on..."
            className="min-h-[200px] resize-none"
            disabled={isSaving}
          />

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={analyzeContent}
                disabled={isEmpty || isAnalyzing}
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
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>

              {content !== existingEntry?.content && (
                <Button
                  onClick={handleSave}
                  disabled={isEmpty || isSaving}
                  size="sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Entry
                    </>
                  )}
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, MMMM do, yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {showAnalysis && sentiment && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getSentimentIcon()}
              <span>AI Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sentiment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Overall Sentiment
                </div>
                <Badge className={SENTIMENT_COLORS[sentiment.sentiment]}>
                  {getSentimentLabel()}
                </Badge>
                <Progress value={sentiment.confidence * 100} className="mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(sentiment.confidence * 100)}% confidence
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Emotional Intensity
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(sentiment.intensity * 100)}%
                </div>
                <Progress value={sentiment.intensity * 100} className="mt-2" />
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  Emotions Detected
                </div>
                <div className="text-lg font-semibold">
                  {sentiment.emotions.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  different emotions
                </div>
              </div>
            </div>

            {/* Detected Emotions */}
            {sentiment.emotions.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Detected Emotions</h4>
                <div className="flex flex-wrap gap-2">
                  {sentiment.emotions.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      {EMOTION_ICONS[emotion] || <Heart className="h-4 w-4" />}
                      <span className="capitalize">{emotion}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Writing Tips */}
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Insight:</strong>{" "}
                {sentiment.sentiment === "positive" &&
                  "Your writing shows positive emotions. Consider exploring what contributed to these good feelings."}
                {sentiment.sentiment === "negative" &&
                  "Your writing expresses challenging emotions. This is a healthy way to process difficult feelings."}
                {sentiment.sentiment === "neutral" &&
                  "Your writing has a balanced tone. This suggests good emotional regulation."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">💡 Journaling Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Write about specific events, thoughts, or feelings</li>
            <li>
              • Be honest and authentic - there&apos;s no right or wrong way to
              journal
            </li>
            <li>
              • Use the AI analysis to gain insights into your emotional
              patterns
            </li>
            <li>• Review past entries to track your progress over time</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
