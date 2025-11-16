"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { MoodEntry } from "@/lib/types";
import {
  Zap,
  Moon,
  Utensils,
  Users,
  Plus,
  Save,
  RotateCcw,
  Star,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface MoodTrackerProps {
  latestEntry?: MoodEntry;
  onMoodSubmit?: (
    entry: Omit<MoodEntry, "id" | "createdAt" | "updatedAt">
  ) => void;
  className?: string;
}

export function MoodTracker({
  onMoodSubmit,
  latestEntry,
  className,
}: MoodTrackerProps) {
  const [mood, setMood] = useState(latestEntry?.mood || 5);
  const [energy, setEnergy] = useState(latestEntry?.energy || 5);
  const [sleep, setSleep] = useState(latestEntry?.sleep || 5);
  const [appetite, setAppetite] = useState(latestEntry?.appetite || 5);
  const [social, setSocial] = useState(latestEntry?.social || 5);
  const [notes, setNotes] = useState(latestEntry?.notes || "");
  const [triggers, setTriggers] = useState<string[]>(
    latestEntry?.triggers || []
  );
  const [newTrigger, setNewTrigger] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMoodLabel = (value: number) => {
    if (value >= 8) return "Great";
    if (value >= 6) return "Good";
    if (value >= 4) return "Okay";
    if (value >= 2) return "Low";
    return "Very Low";
  };

  const getMoodColor = (value: number) => {
    if (value >= 7) return "bg-green-500";
    if (value >= 5) return "bg-yellow-500";
    if (value >= 3) return "bg-orange-500";
    return "bg-red-500";
  };

  const getSliderColor = (value: number) => {
    if (value >= 7) return "text-green-600";
    if (value >= 5) return "text-yellow-600";
    if (value >= 3) return "text-orange-600";
    return "text-red-600";
  };

  const handleAddTrigger = () => {
    if (newTrigger.trim() && !triggers.includes(newTrigger.trim())) {
      setTriggers([...triggers, newTrigger.trim()]);
      setNewTrigger("");
    }
  };

  const handleRemoveTrigger = (triggerToRemove: string) => {
    setTriggers(triggers.filter((trigger) => trigger !== triggerToRemove));
  };

  const handleSubmit = async () => {
    if (!mood) {
      toast.error("Please select your mood level");
      return;
    }

    setIsSubmitting(true);

    try {
      const entry = {
        date: new Date().toISOString(),
        mood,
        energy,
        sleep,
        appetite,
        social,
        notes: notes.trim() || undefined,
        triggers: triggers.length > 0 ? triggers : undefined,
      };

      // Call the onMoodSubmit prop instead of apiService
      if (onMoodSubmit) {
        onMoodSubmit(entry);
      }

      toast.success("Mood entry saved successfully!");

      // Reset form for next entry
      if (!latestEntry) {
        setMood(5);
        setEnergy(5);
        setSleep(5);
        setAppetite(5);
        setSocial(5);
        setNotes("");
        setTriggers([]);
      }
    } catch (error) {
      toast.error("Failed to save mood entry. Please try again.");
      console.error("Error saving mood entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setMood(latestEntry?.mood || 5);
    setEnergy(latestEntry?.energy || 5);
    setSleep(latestEntry?.sleep || 5);
    setAppetite(latestEntry?.appetite || 5);
    setSocial(latestEntry?.social || 5);
    setNotes(latestEntry?.notes || "");
    setTriggers(latestEntry?.triggers || []);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-cyan-100/20 to-indigo-100/20 rounded-3xl blur-3xl"></div>
        <motion.div className="text-6xl mb-4 relative z-10">😊</motion.div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm relative z-10">
          Daily Mood Check-in
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed relative z-10">
          Track your mood and related factors to identify patterns and progress
        </p>
      </motion.div>

      {/* Enhanced Current Mood Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <CardHeader className="relative z-10">
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
                className="text-4xl"
              >
                🌟
              </motion.div>
              <div>
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  How are you feeling today?
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Rate your mood on a scale of 1-10 (1 = Very Low, 10 =
                  Amazing!)
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-8 relative z-10">
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${getMoodColor(
                  mood
                )} flex items-center justify-center shadow-2xl border-4 border-white/50 relative overflow-hidden`}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                  boxShadow: [
                    "0 10px 30px rgba(0,0,0,0.1)",
                    "0 20px 40px rgba(0,0,0,0.15)",
                    "0 10px 30px rgba(0,0,0,0.1)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-pulse"></div>
                <motion.span
                  className="text-4xl font-bold text-white drop-shadow-lg relative z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {mood}
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.4)",
                      "0 0 0 10px rgba(59, 130, 246, 0)",
                      "0 0 0 0 rgba(59, 130, 246, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Badge className="text-xl px-6 py-2 bg-white/90 backdrop-blur-sm border-2 border-white/50 text-foreground shadow-lg rounded-full font-semibold breathing-circle">
                    {getMoodLabel(mood)}
                  </Badge>
                </motion.div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 to-blue-400 rounded-full opacity-30 h-3 top-1/2 -translate-y-1/2 blur-sm" />
                <Slider
                  value={[mood]}
                  onValueChange={(value) => setMood(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full relative z-10"
                />
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-red-500">😔 Low</span>
                <motion.span
                  className={`text-2xl font-bold ${getSliderColor(
                    mood
                  )} bg-white/80 px-3 py-1 rounded-full shadow-md`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {mood}/10
                </motion.span>
                <span className="text-green-500">😊 Amazing!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Related Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-3xl"
              >
                ⚡
              </motion.div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Related Factors
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Rate these factors that can influence your mood (1 = Very
                  Poor, 10 = Excellent)
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            {/* Energy */}
            <motion.div
              className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-yellow-50/50 to-orange-50/50 border border-yellow-200/50 hover:border-yellow-300/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-3 font-semibold text-gray-700">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </motion.div>
                  <span>Energy Level</span>
                </Label>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-sm font-semibold">
                    {energy}/10
                  </Badge>
                </motion.div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <Slider
                  value={[energy]}
                  onValueChange={(value) => setEnergy(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </motion.div>
            </motion.div>

            {/* Sleep */}
            <motion.div
              className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-200/50 hover:border-indigo-300/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-3 font-semibold text-gray-700">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Moon className="h-5 w-5 text-indigo-600" />
                  </motion.div>
                  <span>Sleep Quality</span>
                </Label>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 text-sm font-semibold">
                    {sleep}/10
                  </Badge>
                </motion.div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Slider
                  value={[sleep]}
                  onValueChange={(value) => setSleep(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </motion.div>
            </motion.div>

            {/* Appetite */}
            <motion.div
              className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 border border-green-200/50 hover:border-green-300/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-3 font-semibold text-gray-700">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Utensils className="h-5 w-5 text-green-600" />
                  </motion.div>
                  <span>Appetite</span>
                </Label>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-sm font-semibold">
                    {appetite}/10
                  </Badge>
                </motion.div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Slider
                  value={[appetite]}
                  onValueChange={(value) => setAppetite(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </motion.div>
            </motion.div>

            {/* Social */}
            <motion.div
              className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-pink-50/50 to-rose-50/50 border border-pink-200/50 hover:border-pink-300/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-3 font-semibold text-gray-700">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Users className="h-5 w-5 text-pink-600" />
                  </motion.div>
                  <span>Social Connection</span>
                </Label>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 text-sm font-semibold">
                    {social}/10
                  </Badge>
                </motion.div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Slider
                  value={[social]}
                  onValueChange={(value) => setSocial(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Triggers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-red-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

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
                ⚠️
              </motion.div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Potential Triggers
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  What might have influenced your mood today? (Optional)
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4 relative z-10">
            <div className="flex space-x-3">
              <motion.input
                type="text"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="Add a trigger..."
                className="flex-1 px-4 py-3 border-2 border-orange-200/50 rounded-xl text-sm bg-white/50 backdrop-blur-sm focus:border-orange-400 focus:outline-none transition-all duration-300"
                onKeyPress={(e) => e.key === "Enter" && handleAddTrigger()}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddTrigger}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {triggers.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.3 }}
              >
                {triggers.map((trigger, index) => (
                  <motion.div
                    key={trigger}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      className="cursor-pointer bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 text-orange-800 border border-orange-200 px-3 py-1 text-sm font-medium transition-all duration-300"
                      onClick={() => handleRemoveTrigger(trigger)}
                    >
                      {trigger} ✕
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-effect border-0 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

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
                📝
              </motion.div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Additional Notes
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Any additional thoughts or observations about today?
                  (Optional)
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="relative z-10">
            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How was your day? Any significant events or feelings you'd like to note?"
                rows={4}
                className="w-full px-4 py-3 border-2 border-purple-200/50 rounded-xl text-sm bg-white/50 backdrop-blur-sm focus:border-purple-400 focus:outline-none transition-all duration-300 resize-none"
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex space-x-4"
      >
        <motion.div
          className="flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-300 font-semibold"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Last Entry Info */}
      {latestEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="glass-effect border-0 shadow-lg bg-gradient-to-br from-blue-50/30 to-cyan-50/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-cyan-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <CardContent className="p-6 relative z-10">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Clock className="h-5 w-5 text-blue-500" />
                </motion.div>
                <div>
                  <p className="text-sm text-blue-700 font-semibold">
                    Last Entry
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(latestEntry.date), "PPP")} at{" "}
                    {format(new Date(latestEntry.date), "p")}
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
