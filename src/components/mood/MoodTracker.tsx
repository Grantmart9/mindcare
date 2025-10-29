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
  Heart,
  Zap,
  Moon,
  Utensils,
  Users,
  Plus,
  Save,
  RotateCcw,
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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Daily Mood Check-in</h2>
        <p className="text-muted-foreground">
          Track your mood and related factors to identify patterns and progress
        </p>
      </div>

      {/* Enhanced Current Mood Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Current Mood
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              How are you feeling today? (1 = Very Low, 10 = Great)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  className={`w-24 h-24 rounded-full ${getMoodColor(
                    mood
                  )} flex items-center justify-center shadow-lg`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-3xl font-bold text-white">{mood}</span>
                </motion.div>
                <Badge className="text-lg px-4 py-1.5 bg-white border border-purple-200 text-purple-600 shadow-sm">
                  {getMoodLabel(mood)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full opacity-20 h-2 top-1/2 -translate-y-1/2" />
                  <Slider
                    value={[mood]}
                    onValueChange={(value) => setMood(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full relative"
                  />
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>😔 Very Low</span>
                  <span className={`${getSliderColor(mood)}`}>{mood}/10</span>
                  <span>😁 Great</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Related Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Related Factors</CardTitle>
          <CardDescription>
            Rate these factors that can influence your mood (1 = Very Poor, 10 =
            Excellent)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Energy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Energy Level</span>
              </Label>
              <Badge variant="outline">{energy}/10</Badge>
            </div>
            <Slider
              value={[energy]}
              onValueChange={(value) => setEnergy(value[0])}
              max={10}
              min={1}
              step={1}
            />
          </div>

          {/* Sleep */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Moon className="h-4 w-4" />
                <span>Sleep Quality</span>
              </Label>
              <Badge variant="outline">{sleep}/10</Badge>
            </div>
            <Slider
              value={[sleep]}
              onValueChange={(value) => setSleep(value[0])}
              max={10}
              min={1}
              step={1}
            />
          </div>

          {/* Appetite */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Utensils className="h-4 w-4" />
                <span>Appetite</span>
              </Label>
              <Badge variant="outline">{appetite}/10</Badge>
            </div>
            <Slider
              value={[appetite]}
              onValueChange={(value) => setAppetite(value[0])}
              max={10}
              min={1}
              step={1}
            />
          </div>

          {/* Social */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Social Connection</span>
              </Label>
              <Badge variant="outline">{social}/10</Badge>
            </div>
            <Slider
              value={[social]}
              onValueChange={(value) => setSocial(value[0])}
              max={10}
              min={1}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Triggers */}
      <Card>
        <CardHeader>
          <CardTitle>Potential Triggers</CardTitle>
          <CardDescription>
            What might have influenced your mood today? (Optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="Add a trigger..."
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAddTrigger()}
            />
            <Button onClick={handleAddTrigger} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {triggers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {triggers.map((trigger) => (
                <Badge
                  key={trigger}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveTrigger(trigger)}
                >
                  {trigger} ×
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>
            Any additional thoughts or observations about today? (Optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your day? Any significant events or feelings you'd like to note?"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Last Entry Info */}
      {latestEntry && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Last entry: {format(new Date(latestEntry.date), "PPP")} at{" "}
              {format(new Date(latestEntry.date), "p")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
