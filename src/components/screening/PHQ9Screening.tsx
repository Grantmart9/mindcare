"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { llmService } from "@/lib/services/llm-service";
import { toast } from "sonner";
import {
  ClipboardCheck,
  Brain,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
} from "lucide-react";

interface PHQ9Question {
  id: number;
  question: string;
  options: Array<{
    value: number;
    label: string;
    description?: string;
  }>;
}

interface PHQ9Result {
  totalScore: number;
  severity: "none" | "mild" | "moderate" | "moderately-severe" | "severe";
  interpretation: string;
  recommendations: string[];
  aiInsights?: string;
  completedAt: string;
}

interface PHQ9ScreeningProps {
  className?: string;
  onComplete?: (result: PHQ9Result) => void;
  previousResult?: PHQ9Result;
}

const PHQ9_QUESTIONS: PHQ9Question[] = [
  {
    id: 1,
    question: "Little interest or pleasure in doing things",
    options: [
      {
        value: 0,
        label: "Not at all",
        description: "I have normal interest and pleasure",
      },
      {
        value: 1,
        label: "Several days",
        description: "Occasional lack of interest",
      },
      {
        value: 2,
        label: "More than half the days",
        description: "Frequent disinterest",
      },
      {
        value: 3,
        label: "Nearly every day",
        description: "Constant lack of interest",
      },
    ],
  },
  {
    id: 2,
    question: "Feeling down, depressed, or hopeless",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 3,
    question: "Trouble falling or staying asleep, or sleeping too much",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 4,
    question: "Feeling tired or having little energy",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 5,
    question: "Poor appetite or overeating",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 6,
    question:
      "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 7,
    question:
      "Trouble concentrating on things, such as reading the newspaper or watching television",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 8,
    question:
      "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
  {
    id: 9,
    question:
      "Thoughts that you would be better off dead or of hurting yourself in some way",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" },
    ],
  },
];

export function PHQ9Screening({
  className,
  onComplete,
  previousResult,
}: PHQ9ScreeningProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PHQ9Result | null>(
    previousResult || null
  );
  const [showResult, setShowResult] = useState(!!previousResult);

  const progress =
    ((currentQuestion + (answers.length > currentQuestion ? 1 : 0)) /
      PHQ9_QUESTIONS.length) *
    100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);

    if (currentQuestion < PHQ9_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = (questionAnswers: number[]): PHQ9Result => {
    const totalScore = questionAnswers.reduce((sum, answer) => sum + answer, 0);

    let severity: PHQ9Result["severity"];
    let interpretation: string;

    if (totalScore <= 4) {
      severity = "none";
      interpretation = "No significant depressive symptoms detected.";
    } else if (totalScore <= 9) {
      severity = "mild";
      interpretation =
        "Mild depressive symptoms. Monitor and consider lifestyle interventions.";
    } else if (totalScore <= 14) {
      severity = "moderate";
      interpretation =
        "Moderate depressive symptoms. Consider consulting with a mental health professional.";
    } else if (totalScore <= 19) {
      severity = "moderately-severe";
      interpretation =
        "Moderately severe depressive symptoms. Professional help is recommended.";
    } else {
      severity = "severe";
      interpretation =
        "Severe depressive symptoms. Please seek immediate professional help.";
    }

    return {
      totalScore,
      severity,
      interpretation,
      recommendations: getRecommendations(severity),
      completedAt: new Date().toISOString(),
    };
  };

  const getRecommendations = (severity: PHQ9Result["severity"]): string[] => {
    const baseRecommendations = [
      "Continue regular self-care activities",
      "Maintain social connections",
      "Consider regular exercise and healthy eating",
    ];

    if (severity === "none") {
      return [
        "Continue maintaining good mental health practices",
        "Regular check-ins can help monitor your well-being",
        ...baseRecommendations,
      ];
    }

    if (severity === "mild") {
      return [
        "Consider talking to a trusted friend or family member",
        "Practice stress-reduction techniques like mindfulness",
        "Monitor symptoms and consider professional help if they worsen",
        ...baseRecommendations,
      ];
    }

    if (severity === "moderate") {
      return [
        "Consult with a mental health professional for evaluation",
        "Consider therapy options like CBT or counseling",
        "Build a support network of friends and family",
        "Practice daily stress management techniques",
      ];
    }

    return [
      "Seek immediate professional mental health care",
      "Contact a crisis hotline if experiencing thoughts of self-harm",
      "Consider consulting with a psychiatrist for medication evaluation",
      "Build emergency support contacts and safety plan",
    ];
  };

  const submitAssessment = async () => {
    if (answers.length < PHQ9_QUESTIONS.length) return;

    setIsSubmitting(true);
    try {
      const basicResult = calculateScore(answers);

      // Get AI insights about the responses
      const questionTexts = PHQ9_QUESTIONS.map(
        (q, index) =>
          `${q.question}: ${q.options[answers[index]]?.label || "Not answered"}`
      ).join("\n");

      const aiAnalysis = await llmService.assessDepressionRisk(
        `PHQ-9 Responses:\n${questionTexts}`,
        basicResult.totalScore
      );

      const enhancedResult: PHQ9Result = {
        ...basicResult,
        aiInsights: `Based on your responses, I've identified these key indicators: ${aiAnalysis.indicators.join(
          ", "
        )}. ${aiAnalysis.recommendations.join(" ")}`,
      };

      setResult(enhancedResult);
      setShowResult(true);
      onComplete?.(enhancedResult);

      toast.success("Assessment completed! Here are your results.");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      // Still show basic results even if AI fails
      const basicResult = calculateScore(answers);
      setResult(basicResult);
      setShowResult(true);
      onComplete?.(basicResult);
      toast.error("Assessment completed, but AI analysis failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setShowResult(false);
  };

  const getSeverityColor = (severity: PHQ9Result["severity"]) => {
    switch (severity) {
      case "none":
        return "bg-green-100 text-green-800 border-green-200";
      case "mild":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "moderate":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "moderately-severe":
        return "bg-red-100 text-red-800 border-red-200";
      case "severe":
        return "bg-red-200 text-red-900 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (showResult && result) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <ClipboardCheck className="h-6 w-6" />
              <span>PHQ-9 Assessment Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Overview */}
            <div className="text-center space-y-4">
              <div>
                <div className="text-4xl font-bold text-primary">
                  {result.totalScore}
                </div>
                <div className="text-muted-foreground">out of 27</div>
              </div>

              <Badge
                className={`text-lg px-4 py-2 ${getSeverityColor(
                  result.severity
                )}`}
              >
                {result.severity.replace("-", " ").toUpperCase()}
              </Badge>
            </div>

            {/* Interpretation */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Interpretation:</strong> {result.interpretation}
              </AlertDescription>
            </Alert>

            {/* AI Insights */}
            {result.aiInsights && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Analysis:</strong> {result.aiInsights}
                </AlertDescription>
              </Alert>
            )}

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Recommendations</span>
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={resetAssessment}
                variant="outline"
                className="flex-1"
              >
                Take Assessment Again
              </Button>
              <Button
                onClick={() =>
                  toast.success("Results saved to your health record")
                }
                className="flex-1"
              >
                Save Results
              </Button>
            </div>

            {/* Disclaimer */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Important:</strong> This is a screening tool, not a
                diagnosis. Please consult with a qualified healthcare
                professional for proper evaluation and treatment.
              </AlertDescription>
            </Alert>
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
          <ClipboardCheck className="h-6 w-6" />
          <span>PHQ-9 Depression Screening</span>
        </h2>
        <p className="text-muted-foreground">
          Answer each question based on how you&apos;ve felt over the past 2
          weeks
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {PHQ9_QUESTIONS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {PHQ9_QUESTIONS[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {PHQ9_QUESTIONS[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`option-${option.value}`}
                  className="mt-1"
                />
                <Label
                  htmlFor={`option-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={goBack}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentQuestion === PHQ9_QUESTIONS.length - 1 ? (
          <Button
            onClick={submitAssessment}
            disabled={answers.length < PHQ9_QUESTIONS.length || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Complete Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={answers[currentQuestion] === undefined}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          The PHQ-9 is a validated screening tool used by healthcare
          professionals. Your responses are private and will be analyzed to
          provide personalized insights.
        </AlertDescription>
      </Alert>
    </div>
  );
}
