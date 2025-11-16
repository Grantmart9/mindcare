"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Brain,
  Target,
  Lightbulb,
  CheckCircle,
  Plus,
  Save,
  RotateCcw,
  Play,
  Pause,
  Timer,
  Star,
  Clock,
} from "lucide-react";

interface ThoughtRecord {
  id: string;
  situation: string;
  thoughts: string;
  emotions: string;
  behaviors: string;
  alternativeThoughts: string;
  outcome: string;
  date: string;
}

interface BreathingExerciseLog {
  id: string;
  exerciseName: string;
  duration: number;
  effectiveness: number; // 1-10 scale
  notes: string;
  date: string;
}

interface BehavioralActivation {
  id: string;
  activity: string;
  timeScheduled: string;
  timeCompleted?: string;
  difficulty: number;
  enjoyment: number;
  moodBefore: number;
  moodAfter?: number;
  completed: boolean;
  notes: string;
  date: string;
}

interface CognitiveDistortion {
  id: string;
  situation: string;
  automaticThought: string;
  distortion: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  outcome: string;
  date: string;
}

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  instructions: string[];
}

export function CBTTools() {
  const [activeTab, setActiveTab] = useState("thought-record");
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(0);

  // Debug tab changes
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
  };

  // Thought Record State
  const [thoughtRecord, setThoughtRecord] = useState<Partial<ThoughtRecord>>({
    situation: "",
    thoughts: "",
    emotions: "",
    behaviors: "",
    alternativeThoughts: "",
    outcome: "",
  });

  // Breathing Exercise Log State
  const [breathingLog, setBreathingLog] = useState<
    Partial<BreathingExerciseLog>
  >({
    exerciseName: "",
    duration: 0,
    effectiveness: 5,
    notes: "",
  });

  // Behavioral Activation State
  const [behavioralActivation, setBehavioralActivation] = useState<
    Partial<BehavioralActivation>
  >({
    activity: "",
    timeScheduled: "",
    difficulty: 5,
    enjoyment: 5,
    moodBefore: 5,
    completed: false,
    notes: "",
  });

  // Cognitive Distortion State
  const [cognitiveDistortion, setCognitiveDistortion] = useState<
    Partial<CognitiveDistortion>
  >({
    situation: "",
    automaticThought: "",
    distortion: "",
    evidenceFor: "",
    evidenceAgainst: "",
    balancedThought: "",
    outcome: "",
  });

  const [distortionLogs, setDistortionLogs] = useState<BreathingExerciseLog[]>(
    []
  );
  const [behavioralLogs, setBehavioralLogs] = useState<BehavioralActivation[]>(
    []
  );
  const [cognitiveLogs, setCognitiveLogs] = useState<CognitiveDistortion[]>([]);

  // Breathing Exercises
  const breathingExercises: BreathingExercise[] = [
    {
      id: "4-7-8",
      name: "4-7-8 Breathing",
      description:
        "A calming technique for reducing anxiety and helping you sleep",
      duration: 240, // 4 minutes
      instructions: [
        "Inhale quietly through your nose for 4 seconds",
        "Hold your breath for 7 seconds",
        "Exhale completely through your mouth for 8 seconds",
        "Repeat the cycle 4 times",
      ],
    },
    {
      id: "box-breathing",
      name: "Box Breathing",
      description: "Military technique for stress relief and focus",
      duration: 240,
      instructions: [
        "Inhale through your nose for 4 seconds",
        "Hold your breath for 4 seconds",
        "Exhale through your mouth for 4 seconds",
        "Hold your breath for 4 seconds",
        "Repeat the cycle",
      ],
    },
    {
      id: "deep-breathing",
      name: "Deep Breathing",
      description: "Simple diaphragmatic breathing for immediate relaxation",
      duration: 180,
      instructions: [
        "Place one hand on your chest and one on your belly",
        "Inhale slowly through your nose for 4 seconds",
        "Feel your belly rise while keeping chest still",
        "Exhale slowly through your mouth for 6 seconds",
        "Repeat for several minutes",
      ],
    },
  ];

  const handleSaveThoughtRecord = () => {
    if (!thoughtRecord.situation || !thoughtRecord.thoughts) {
      toast.error(
        "Please fill in at least the situation and automatic thoughts"
      );
      return;
    }

    // In a real app, this would save to a database
    toast.success("Thought record saved successfully!");
    setThoughtRecord({
      situation: "",
      thoughts: "",
      emotions: "",
      behaviors: "",
      alternativeThoughts: "",
      outcome: "",
    });
  };

  const handleSaveBreathingLog = () => {
    if (!breathingLog.exerciseName || !breathingLog.duration) {
      toast.error("Please fill in the exercise name and duration");
      return;
    }

    const newLog: BreathingExerciseLog = {
      id: Date.now().toString(),
      exerciseName: breathingLog.exerciseName!,
      duration: breathingLog.duration!,
      effectiveness: breathingLog.effectiveness || 5,
      notes: breathingLog.notes || "",
      date: new Date().toISOString(),
    };

    setDistortionLogs([newLog, ...distortionLogs]);
    toast.success("Breathing exercise logged successfully!");
    setBreathingLog({
      exerciseName: "",
      duration: 0,
      effectiveness: 5,
      notes: "",
    });
  };

  const handleSaveBehavioralActivation = () => {
    if (!behavioralActivation.activity || !behavioralActivation.timeScheduled) {
      toast.error("Please fill in the activity and scheduled time");
      return;
    }

    const newActivation: BehavioralActivation = {
      id: Date.now().toString(),
      activity: behavioralActivation.activity!,
      timeScheduled: behavioralActivation.timeScheduled!,
      difficulty: behavioralActivation.difficulty || 5,
      enjoyment: behavioralActivation.enjoyment || 5,
      moodBefore: behavioralActivation.moodBefore || 5,
      completed: behavioralActivation.completed || false,
      notes: behavioralActivation.notes || "",
      date: new Date().toISOString(),
    };

    setBehavioralLogs([newActivation, ...behavioralLogs]);
    toast.success("Behavioral activation scheduled successfully!");
    setBehavioralActivation({
      activity: "",
      timeScheduled: "",
      difficulty: 5,
      enjoyment: 5,
      moodBefore: 5,
      completed: false,
      notes: "",
    });
  };

  const handleSaveCognitiveDistortion = () => {
    if (
      !cognitiveDistortion.situation ||
      !cognitiveDistortion.automaticThought
    ) {
      toast.error("Please fill in the situation and automatic thought");
      return;
    }

    const newDistortion: CognitiveDistortion = {
      id: Date.now().toString(),
      situation: cognitiveDistortion.situation!,
      automaticThought: cognitiveDistortion.automaticThought!,
      distortion: cognitiveDistortion.distortion || "",
      evidenceFor: cognitiveDistortion.evidenceFor || "",
      evidenceAgainst: cognitiveDistortion.evidenceAgainst || "",
      balancedThought: cognitiveDistortion.balancedThought || "",
      outcome: cognitiveDistortion.outcome || "",
      date: new Date().toISOString(),
    };

    setCognitiveLogs([newDistortion, ...cognitiveLogs]);
    toast.success("Cognitive restructuring recorded successfully!");
    setCognitiveDistortion({
      situation: "",
      automaticThought: "",
      distortion: "",
      evidenceFor: "",
      evidenceAgainst: "",
      balancedThought: "",
      outcome: "",
    });
  };

  const startBreathingExercise = (exercise: BreathingExercise) => {
    setIsBreathingActive(true);
    setBreathingTimeLeft(exercise.duration);

    const timer = setInterval(() => {
      setBreathingTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsBreathingActive(false);
          toast.success("Breathing exercise completed!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 rounded-3xl blur-3xl"></div>
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="text-4xl md:text-6xl mb-4 floating-animation relative z-10"
        >
          🧠
        </motion.div>
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent relative z-10">
          CBT Tools & Exercises
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto relative z-10">
          Evidence-based Cognitive Behavioral Therapy tools to help you identify
          and change negative thought patterns
        </p>
      </motion.div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
          <TabsTrigger
            value="thought-record"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Brain className="h-4 w-4" />
            Thought Records
          </TabsTrigger>
          <TabsTrigger
            value="breathing"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Timer className="h-4 w-4" />
            Breathing
          </TabsTrigger>
          <TabsTrigger
            value="behaviors"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Target className="h-4 w-4" />
            Behaviors
          </TabsTrigger>
          <TabsTrigger
            value="cognitions"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Lightbulb className="h-4 w-4" />
            Cognitions
          </TabsTrigger>
        </TabsList>

        {/* Thought Records Tab */}
        <TabsContent value="thought-record" className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                Thought Record
              </CardTitle>
              <CardDescription>
                Challenge and reframe negative automatic thoughts using
                cognitive restructuring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="situation"
                      className="text-base font-semibold"
                    >
                      Situation/Trigger
                    </Label>
                    <Textarea
                      id="situation"
                      placeholder="What happened? Where were you? Who was there?"
                      value={thoughtRecord.situation}
                      onChange={(e) =>
                        setThoughtRecord({
                          ...thoughtRecord,
                          situation: e.target.value,
                        })
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="thoughts"
                      className="text-base font-semibold"
                    >
                      Automatic Thoughts
                    </Label>
                    <Textarea
                      id="thoughts"
                      placeholder="What thoughts went through your mind?"
                      value={thoughtRecord.thoughts}
                      onChange={(e) =>
                        setThoughtRecord({
                          ...thoughtRecord,
                          thoughts: e.target.value,
                        })
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="emotions"
                      className="text-base font-semibold"
                    >
                      Emotions & Intensity (0-100)
                    </Label>
                    <Textarea
                      id="emotions"
                      placeholder="What emotions did you feel? How intense were they?"
                      value={thoughtRecord.emotions}
                      onChange={(e) =>
                        setThoughtRecord({
                          ...thoughtRecord,
                          emotions: e.target.value,
                        })
                      }
                      className="mt-2"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="behaviors"
                      className="text-base font-semibold"
                    >
                      Behaviors/Actions
                    </Label>
                    <Textarea
                      id="behaviors"
                      placeholder="What did you do? How did you react?"
                      value={thoughtRecord.behaviors}
                      onChange={(e) =>
                        setThoughtRecord({
                          ...thoughtRecord,
                          behaviors: e.target.value,
                        })
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="alternative"
                      className="text-base font-semibold"
                    >
                      Alternative Thoughts
                    </Label>
                    <Textarea
                      id="alternative"
                      placeholder="What are some balanced, evidence-based alternatives?"
                      value={thoughtRecord.alternativeThoughts}
                      onChange={(e) =>
                        setThoughtRecord({
                          ...thoughtRecord,
                          alternativeThoughts: e.target.value,
                        })
                      }
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="outcome"
                      className="text-base font-semibold"
                    >
                      Outcome & New Emotions
                    </Label>
                    <Textarea
                      id="outcome"
                      placeholder="How do you feel now? What changed?"
                      value={thoughtRecord.outcome}
                      onChange={(e) =>
                        setThoughtRecord({
                          ...thoughtRecord,
                          outcome: e.target.value,
                        })
                      }
                      className="mt-2"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSaveThoughtRecord} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Thought Record
                </Button>
                <Button variant="outline" onClick={() => setThoughtRecord({})}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breathing Exercises Tab */}
        <TabsContent value="breathing" className="space-y-6">
          {/* Interactive Breathing Exercises */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breathingExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full card-hover-glow group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-400/5 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-300"></div>
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center justify-between">
                      <motion.span
                        className="text-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {exercise.name}
                      </motion.span>
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, -2, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Badge variant="secondary" className="breathing-circle">
                          {formatTime(exercise.duration)}
                        </Badge>
                      </motion.div>
                    </CardTitle>
                    <CardDescription>{exercise.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <motion.div
                          animate={{
                            rotate: [0, 180, 360],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          💡
                        </motion.div>
                        Instructions:
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {exercise.instructions.map((instruction, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <motion.span
                              className="text-blue-500 font-semibold"
                              whileHover={{ scale: 1.2, color: "#3b82f6" }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              {i + 1}.
                            </motion.span>
                            <motion.span
                              initial={{ opacity: 0.7 }}
                              whileHover={{ opacity: 1, x: 2 }}
                              transition={{ duration: 0.2 }}
                            >
                              {instruction}
                            </motion.span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>

                    {isBreathingActive && breathingTimeLeft > 0 ? (
                      <motion.div
                        className="text-center space-y-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="text-3xl font-bold text-blue-500"
                          animate={{
                            scale: [1, 1.1, 1],
                            textShadow: [
                              "0 0 0px rgba(59, 130, 246, 0)",
                              "0 0 20px rgba(59, 130, 246, 0.3)",
                              "0 0 0px rgba(59, 130, 246, 0)",
                            ],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {formatTime(breathingTimeLeft)}
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Progress
                            value={
                              (breathingTimeLeft / exercise.duration) * 100
                            }
                            className="h-2"
                          />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => setIsBreathingActive(false)}
                            className="w-full breathing-circle"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Stop Exercise
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0.4)",
                            "0 0 0 10px rgba(59, 130, 246, 0)",
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Button
                          onClick={() => startBreathingExercise(exercise)}
                          className="w-full"
                          disabled={isBreathingActive}
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" />
                          </motion.div>
                          Start Exercise
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Breathing Exercise Tracker Form */}
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-blue-500" />
                Log Your Breathing Exercise
              </CardTitle>
              <CardDescription>
                Track your breathing exercises and their effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="exerciseName"
                  className="text-base font-semibold"
                >
                  Exercise Type
                </Label>
                <select
                  id="exerciseName"
                  value={breathingLog.exerciseName}
                  onChange={(e) =>
                    setBreathingLog({
                      ...breathingLog,
                      exerciseName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">Select an exercise...</option>
                  {breathingExercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.name}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-base font-semibold">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="60"
                    value={breathingLog.duration || ""}
                    onChange={(e) =>
                      setBreathingLog({
                        ...breathingLog,
                        duration: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="5"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="effectiveness"
                    className="text-base font-semibold"
                  >
                    Effectiveness (1-10)
                  </Label>
                  <Input
                    id="effectiveness"
                    type="number"
                    min="1"
                    max="10"
                    value={breathingLog.effectiveness || ""}
                    onChange={(e) =>
                      setBreathingLog({
                        ...breathingLog,
                        effectiveness: parseInt(e.target.value) || 5,
                      })
                    }
                    placeholder="7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="breathingNotes"
                  className="text-base font-semibold"
                >
                  Notes & Observations
                </Label>
                <Textarea
                  id="breathingNotes"
                  value={breathingLog.notes}
                  onChange={(e) =>
                    setBreathingLog({
                      ...breathingLog,
                      notes: e.target.value,
                    })
                  }
                  placeholder="How did you feel? Any challenges or insights?"
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveBreathingLog} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Exercise Log
              </Button>
            </CardContent>
          </Card>

          {/* Exercise History */}
          {distortionLogs.length > 0 && (
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Recent Exercise Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {distortionLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{log.exerciseName}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.duration} minutes • Effectiveness:{" "}
                          {log.effectiveness}/10
                        </div>
                        {log.notes && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {log.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Behavioral Activation Tab */}
        <TabsContent value="behaviors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Behavioral Activation Form */}
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Schedule Activity
                </CardTitle>
                <CardDescription>
                  Plan and track meaningful activities to improve your mood
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activity" className="text-base font-semibold">
                    Activity
                  </Label>
                  <Input
                    id="activity"
                    value={behavioralActivation.activity}
                    onChange={(e) =>
                      setBehavioralActivation({
                        ...behavioralActivation,
                        activity: e.target.value,
                      })
                    }
                    placeholder="What activity will you do?"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="timeScheduled"
                    className="text-base font-semibold"
                  >
                    Scheduled Time
                  </Label>
                  <Input
                    id="timeScheduled"
                    type="datetime-local"
                    value={behavioralActivation.timeScheduled}
                    onChange={(e) =>
                      setBehavioralActivation({
                        ...behavioralActivation,
                        timeScheduled: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="difficulty"
                      className="text-base font-semibold"
                    >
                      Difficulty (1-10)
                    </Label>
                    <Input
                      id="difficulty"
                      type="number"
                      min="1"
                      max="10"
                      value={behavioralActivation.difficulty}
                      onChange={(e) =>
                        setBehavioralActivation({
                          ...behavioralActivation,
                          difficulty: parseInt(e.target.value) || 5,
                        })
                      }
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="moodBefore"
                      className="text-base font-semibold"
                    >
                      Mood Before (1-10)
                    </Label>
                    <Input
                      id="moodBefore"
                      type="number"
                      min="1"
                      max="10"
                      value={behavioralActivation.moodBefore}
                      onChange={(e) =>
                        setBehavioralActivation({
                          ...behavioralActivation,
                          moodBefore: parseInt(e.target.value) || 5,
                        })
                      }
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="behavioralNotes"
                    className="text-base font-semibold"
                  >
                    Notes & Goals
                  </Label>
                  <Textarea
                    id="behavioralNotes"
                    value={behavioralActivation.notes}
                    onChange={(e) =>
                      setBehavioralActivation({
                        ...behavioralActivation,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Why is this activity important? What do you hope to gain?"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSaveBehavioralActivation}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Activity
                </Button>
              </CardContent>
            </Card>

            {/* Activity Ideas */}
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Activity Ideas</CardTitle>
                <CardDescription>
                  Try these evidence-based activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Take a 20-minute walk outside",
                    "Call a friend or family member",
                    "Read a chapter of an enjoyable book",
                    "Listen to your favorite music",
                    "Try a new healthy recipe",
                    "Practice a hobby you enjoy",
                    "Write in a gratitude journal",
                    "Do some light stretching or yoga",
                    "Organize or clean a small space",
                    "Cook a meal from scratch",
                    "Write down 3 things you're grateful for",
                    "Take a nature photo and share it",
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200"
                      onClick={() => {
                        setBehavioralActivation({
                          ...behavioralActivation,
                          activity,
                        });
                        toast.success(
                          "Activity selected! Fill out the form to schedule it."
                        );
                      }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      </motion.div>
                      <span className="text-sm">{activity}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity History */}
          {behavioralLogs.length > 0 && (
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {behavioralLogs.slice(0, 5).map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        activity.completed
                          ? "bg-green-50/50 border-green-200/50"
                          : "bg-muted/50 border-muted"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {activity.activity}
                          {activity.completed && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(activity.timeScheduled).toLocaleString()} •
                          Difficulty: {activity.difficulty}/10 • Mood before:{" "}
                          {activity.moodBefore}/10
                        </div>
                        {activity.notes && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {activity.notes}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Cognitive Techniques Tab */}
        <TabsContent value="cognitions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cognitive Restructuring Form */}
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-yellow-500" />
                  Cognitive Restructuring
                </CardTitle>
                <CardDescription>
                  Challenge and reframe distorted thoughts using evidence-based
                  techniques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="situation"
                    className="text-base font-semibold"
                  >
                    Situation
                  </Label>
                  <Textarea
                    id="situation"
                    value={cognitiveDistortion.situation}
                    onChange={(e) =>
                      setCognitiveDistortion({
                        ...cognitiveDistortion,
                        situation: e.target.value,
                      })
                    }
                    placeholder="What situation triggered these thoughts?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="automaticThought"
                    className="text-base font-semibold"
                  >
                    Automatic Thought
                  </Label>
                  <Textarea
                    id="automaticThought"
                    value={cognitiveDistortion.automaticThought}
                    onChange={(e) =>
                      setCognitiveDistortion({
                        ...cognitiveDistortion,
                        automaticThought: e.target.value,
                      })
                    }
                    placeholder="What went through your mind automatically?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="distortion"
                    className="text-base font-semibold"
                  >
                    Type of Distortion
                  </Label>
                  <select
                    id="distortion"
                    value={cognitiveDistortion.distortion}
                    onChange={(e) =>
                      setCognitiveDistortion({
                        ...cognitiveDistortion,
                        distortion: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="">Select a distortion type...</option>
                    <option value="all-or-nothing">
                      All-or-Nothing Thinking
                    </option>
                    <option value="catastrophizing">Catastrophizing</option>
                    <option value="mind-reading">Mind Reading</option>
                    <option value="emotional-reasoning">
                      Emotional Reasoning
                    </option>
                    <option value="fortune-telling">Fortune Telling</option>
                    <option value="should-statements">Should Statements</option>
                    <option value="labeling">Labeling</option>
                    <option value="personalization">Personalization</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="evidenceFor"
                    className="text-base font-semibold"
                  >
                    Evidence Supporting the Thought
                  </Label>
                  <Textarea
                    id="evidenceFor"
                    value={cognitiveDistortion.evidenceFor}
                    onChange={(e) =>
                      setCognitiveDistortion({
                        ...cognitiveDistortion,
                        evidenceFor: e.target.value,
                      })
                    }
                    placeholder="What evidence supports this thought?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="evidenceAgainst"
                    className="text-base font-semibold"
                  >
                    Evidence Against the Thought
                  </Label>
                  <Textarea
                    id="evidenceAgainst"
                    value={cognitiveDistortion.evidenceAgainst}
                    onChange={(e) =>
                      setCognitiveDistortion({
                        ...cognitiveDistortion,
                        evidenceAgainst: e.target.value,
                      })
                    }
                    placeholder="What evidence contradicts this thought?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="balancedThought"
                    className="text-base font-semibold"
                  >
                    Balanced/Realistic Thought
                  </Label>
                  <Textarea
                    id="balancedThought"
                    value={cognitiveDistortion.balancedThought}
                    onChange={(e) =>
                      setCognitiveDistortion({
                        ...cognitiveDistortion,
                        balancedThought: e.target.value,
                      })
                    }
                    placeholder="What's a more balanced, realistic way to think about this?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcome" className="text-base font-semibold">
                    Outcome & New Emotions
                  </Label>
                  <Textarea
                    id="outcome"
                    value={cognitiveDistortion.outcome}
                    onChange={(e) =>
                      setCognitiveDistortion({
                        ...cognitiveDistortion,
                        outcome: e.target.value,
                      })
                    }
                    placeholder="How do you feel now? What changed after restructuring?"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleSaveCognitiveDistortion}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Cognitive Restructuring
                </Button>
              </CardContent>
            </Card>

            {/* Cognitive Resources */}
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                  CBT Resources
                </CardTitle>
                <CardDescription>
                  Common distortions and helpful questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Common Distortions */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span>🚨</span>
                      Common Cognitive Distortions
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          name: "All-or-Nothing Thinking",
                          example: "If it's not perfect, it's a failure",
                          balanced: "Progress is valuable, not just perfection",
                        },
                        {
                          name: "Catastrophizing",
                          example: "This small mistake will ruin everything",
                          balanced: "Most problems are manageable",
                        },
                        {
                          name: "Mind Reading",
                          example: "They must think I'm incompetent",
                          balanced:
                            "I can't know what others think without asking",
                        },
                        {
                          name: "Emotional Reasoning",
                          example: "I feel worthless, so I must be worthless",
                          balanced: "Feelings don't always reflect reality",
                        },
                      ].map((distortion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gradient-to-r from-red-50/30 to-green-50/30 rounded-lg border border-red-100"
                        >
                          <h5 className="font-medium text-sm mb-1">
                            {distortion.name}
                          </h5>
                          <p className="text-xs text-red-600 mb-1">
                            ❌ {distortion.example}
                          </p>
                          <p className="text-xs text-green-600">
                            ✅ {distortion.balanced}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Helpful Questions */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <span>💭</span>
                      Thought Challenging Questions
                    </h4>
                    <div className="space-y-2">
                      {[
                        "What evidence supports this thought?",
                        "What evidence contradicts this thought?",
                        "What's the worst that could happen?",
                        "What's the best that could happen?",
                        "What's most likely to happen?",
                        "How would I advise a friend in this situation?",
                        "Will this matter in 5 years?",
                        "What's another way to look at this?",
                      ].map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-2 bg-blue-50/30 rounded-lg"
                        >
                          <span className="text-blue-500 font-bold text-sm flex-shrink-0">
                            {index + 1}.
                          </span>
                          <span className="text-sm">{question}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cognitive Restructuring History */}
          {cognitiveLogs.length > 0 && (
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Recent Cognitive Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cognitiveLogs.slice(0, 3).map((work) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-lg border border-blue-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {work.distortion || "General Restructuring"}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(work.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-red-600">
                            Thought:
                          </span>{" "}
                          {work.automaticThought}
                        </div>
                        {work.balancedThought && (
                          <div>
                            <span className="font-medium text-green-600">
                              Balanced:
                            </span>{" "}
                            {work.balancedThought}
                          </div>
                        )}
                        {work.outcome && (
                          <div className="text-xs text-muted-foreground italic">
                            Outcome: {work.outcome}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
