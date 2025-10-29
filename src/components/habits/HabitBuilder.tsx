"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
// import { apiService } from "@/lib/services/api-service"; // Not currently used
import {
  Target,
  Plus,
  Calendar,
  CheckCircle,
  Circle,
  Flame,
  TrendingUp,
  Bell,
  Edit,
  Trash2,
  Award,
  Zap,
} from "lucide-react";
import { isToday, startOfWeek, endOfWeek } from "date-fns";

interface Habit {
  id: string;
  title: string;
  description?: string;
  category:
    | "health"
    | "mindfulness"
    | "social"
    | "productivity"
    | "exercise"
    | "other";
  frequency: "daily" | "weekly" | "custom";
  targetDays?: number[]; // For custom frequency (0-6 for Sunday-Saturday)
  reminderTime?: string;
  createdAt: string;
  isActive: boolean;
}

interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  notes?: string;
  mood?: number; // Optional mood rating for the activity
}

interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  thisWeekCompletions: number;
}

interface HabitBuilderProps {
  className?: string;
  onHabitComplete?: (habitId: string, entry: HabitEntry) => void;
}

const HABIT_CATEGORIES = [
  { value: "health", label: "Health & Nutrition", icon: "🏥" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "social", label: "Social Connection", icon: "👥" },
  { value: "productivity", label: "Productivity", icon: "⚡" },
  { value: "exercise", label: "Exercise & Fitness", icon: "💪" },
  { value: "other", label: "Other", icon: "📌" },
];

const HABIT_TEMPLATES = [
  {
    title: "Morning Meditation",
    description: "Start your day with 10 minutes of mindfulness meditation",
    category: "mindfulness" as const,
    frequency: "daily" as const,
    reminderTime: "08:00",
  },
  {
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for each day",
    category: "mindfulness" as const,
    frequency: "daily" as const,
    reminderTime: "20:00",
  },
  {
    title: "Physical Exercise",
    description: "Get moving with any form of exercise you enjoy",
    category: "exercise" as const,
    frequency: "daily" as const,
    reminderTime: "07:00",
  },
  {
    title: "Social Connection",
    description: "Reach out to a friend or family member",
    category: "social" as const,
    frequency: "weekly" as const,
  },
];

export function HabitBuilder({
  className,
  onHabitComplete,
}: HabitBuilderProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    category: "other",
    frequency: "daily",
    isActive: true,
  });

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // For now, we'll use localStorage as habits aren't in the API yet
        // In a full implementation, you would call: await apiService.getHabits()
        const savedHabits = localStorage.getItem("mindcare-habits");
        const savedEntries = localStorage.getItem("mindcare-habit-entries");

        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
        if (savedEntries) {
          setEntries(JSON.parse(savedEntries));
        }
      } catch (error) {
        console.error("Error loading habit data:", error);
        toast.error("Failed to load habit data");
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever habits or entries change (keeping for now)
  useEffect(() => {
    localStorage.setItem("mindcare-habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("mindcare-habit-entries", JSON.stringify(entries));
  }, [entries]);

  const createHabit = () => {
    if (!newHabit.title?.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit.title,
      description: newHabit.description,
      category: newHabit.category || "other",
      frequency: newHabit.frequency || "daily",
      targetDays: newHabit.targetDays,
      reminderTime: newHabit.reminderTime,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setHabits([...habits, habit]);
    setNewHabit({ category: "other", frequency: "daily", isActive: true });
    setShowAddForm(false);
    toast.success("New habit created!");
  };

  const updateHabit = (habit: Habit) => {
    setHabits(habits.map((h) => (h.id === habit.id ? habit : h)));
    setEditingHabit(null);
    toast.success("Habit updated!");
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId));
    setEntries(entries.filter((e) => e.habitId !== habitId));
    toast.success("Habit deleted");
  };

  const toggleHabitCompletion = (habitId: string, date?: string) => {
    const targetDate = date || new Date().toISOString().split("T")[0];
    const existingEntry = entries.find(
      (e) => e.habitId === habitId && e.date === targetDate
    );

    if (existingEntry) {
      // Update existing entry
      const updatedEntries = entries.map((e) =>
        e.id === existingEntry.id ? { ...e, completed: !e.completed } : e
      );
      setEntries(updatedEntries);

      if (existingEntry.completed) {
        toast.success("Habit marked as incomplete");
      } else {
        toast.success("Habit completed! 🎉");
        onHabitComplete?.(habitId, { ...existingEntry, completed: true });
      }
    } else {
      // Create new entry
      const entry: HabitEntry = {
        id: Date.now().toString(),
        habitId,
        date: targetDate,
        completed: true,
        notes: "",
      };

      setEntries([...entries, entry]);
      toast.success("Habit completed! 🎉");
      onHabitComplete?.(habitId, entry);
    }
  };

  const getHabitStats = (habitId: string): HabitStats => {
    const habitEntries = entries.filter((e) => e.habitId === habitId);
    const completedEntries = habitEntries.filter((e) => e.completed);

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const dayEntry = habitEntries.find((e) => e.date === dateStr);

      if (dayEntry?.completed) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedEntries = habitEntries.sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    for (const entry of sortedEntries) {
      if (entry.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate this week's completions
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const thisWeekEntries = habitEntries.filter((e) => {
      const entryDate = new Date(e.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    return {
      currentStreak,
      longestStreak,
      totalCompletions: completedEntries.length,
      completionRate:
        habitEntries.length > 0
          ? (completedEntries.length / habitEntries.length) * 100
          : 0,
      thisWeekCompletions: thisWeekEntries.filter((e) => e.completed).length,
    };
  };

  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    return entries.some(
      (e) => e.habitId === habitId && e.date === today && e.completed
    );
  };

  const shouldShowHabitToday = (habit: Habit) => {
    if (!habit.isActive) return false;

    const today = new Date().getDay(); // 0 = Sunday

    switch (habit.frequency) {
      case "daily":
        return true;
      case "weekly":
        return true; // Show all weekly habits, user can choose when to complete
      case "custom":
        return habit.targetDays?.includes(today) || false;
      default:
        return true;
    }
  };

  const activeHabits = habits.filter(shouldShowHabitToday);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Target className="h-6 w-6" />
          <span>Habit Builder</span>
        </h2>
        <p className="text-muted-foreground">
          Build positive habits with AI-powered nudges and progress tracking
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">
              {activeHabits.reduce(
                (sum, habit) => sum + getHabitStats(habit.id).currentStreak,
                0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Current Streaks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              {
                entries.filter((e) => isToday(new Date(e.date)) && e.completed)
                  .length
              }
            </div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{activeHabits.length}</div>
            <div className="text-sm text-muted-foreground">Active Habits</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {Math.round(
                activeHabits.reduce(
                  (sum, habit) => sum + getHabitStats(habit.id).completionRate,
                  0
                ) / Math.max(activeHabits.length, 1)
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Today&apos;s Habits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today&apos;s Habits</span>
            </CardTitle>
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeHabits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active habits for today.</p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                className="mt-4"
              >
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeHabits.map((habit) => {
                const stats = getHabitStats(habit.id);
                const completedToday = isHabitCompletedToday(habit.id);

                return (
                  <div
                    key={habit.id}
                    className={`border rounded-lg p-4 ${
                      completedToday
                        ? "bg-green-50 border-green-200"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Button
                          onClick={() => toggleHabitCompletion(habit.id)}
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto"
                        >
                          {completedToday ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground" />
                          )}
                        </Button>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3
                              className={`font-semibold ${
                                completedToday
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {habit.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {
                                HABIT_CATEGORIES.find(
                                  (cat) => cat.value === habit.category
                                )?.icon
                              }
                            </Badge>
                          </div>

                          {habit.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {habit.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Flame className="h-3 w-3" />
                              <span>{stats.currentStreak} day streak</span>
                            </span>
                            <span>
                              {stats.completionRate.toFixed(0)}% success rate
                            </span>
                            {habit.reminderTime && (
                              <span className="flex items-center space-x-1">
                                <Bell className="h-3 w-3" />
                                <span>{habit.reminderTime}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => setEditingHabit(habit)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteHabit(habit.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Habit Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Habit Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HABIT_TEMPLATES.map((template, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setNewHabit(template);
                  setShowAddForm(true);
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">
                    {
                      HABIT_CATEGORIES.find(
                        (cat) => cat.value === template.category
                      )?.icon
                    }
                  </span>
                  <h4 className="font-medium">{template.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    {template.frequency}
                  </Badge>
                  {template.reminderTime && (
                    <span className="text-xs text-muted-foreground">
                      {template.reminderTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Habit Form */}
      {(showAddForm || editingHabit) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingHabit ? "Edit Habit" : "Create New Habit"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Habit Title</Label>
                <Input
                  id="title"
                  value={editingHabit?.title || newHabit.title || ""}
                  onChange={(e) =>
                    editingHabit
                      ? setEditingHabit({
                          ...editingHabit,
                          title: e.target.value,
                        })
                      : setNewHabit({ ...newHabit, title: e.target.value })
                  }
                  placeholder="e.g., Morning meditation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingHabit?.category || newHabit.category}
                  onValueChange={(value) =>
                    editingHabit
                      ? setEditingHabit({
                          ...editingHabit,
                          category: value as Habit["category"],
                        })
                      : setNewHabit({
                          ...newHabit,
                          category: value as Habit["category"],
                        })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HABIT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={editingHabit?.description || newHabit.description || ""}
                onChange={(e) =>
                  editingHabit
                    ? setEditingHabit({
                        ...editingHabit,
                        description: e.target.value,
                      })
                    : setNewHabit({ ...newHabit, description: e.target.value })
                }
                placeholder="Describe your habit and why it's important to you..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={editingHabit?.frequency || newHabit.frequency}
                  onValueChange={(value) =>
                    editingHabit
                      ? setEditingHabit({
                          ...editingHabit,
                          frequency: value as Habit["frequency"],
                        })
                      : setNewHabit({
                          ...newHabit,
                          frequency: value as Habit["frequency"],
                        })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder">Reminder Time (Optional)</Label>
                <Input
                  id="reminder"
                  type="time"
                  value={
                    editingHabit?.reminderTime || newHabit.reminderTime || ""
                  }
                  onChange={(e) =>
                    editingHabit
                      ? setEditingHabit({
                          ...editingHabit,
                          reminderTime: e.target.value,
                        })
                      : setNewHabit({
                          ...newHabit,
                          reminderTime: e.target.value,
                        })
                  }
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  if (editingHabit) {
                    updateHabit(editingHabit);
                  } else {
                    createHabit();
                  }
                }}
                className="flex-1"
              >
                {editingHabit ? "Update Habit" : "Create Habit"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingHabit(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Alert>
        <Target className="h-4 w-4" />
        <AlertDescription>
          <strong>Habit Building Tips:</strong> Start small and be consistent.
          Focus on building one or two habits at a time, and remember that
          streaks are built one day at a time!
        </AlertDescription>
      </Alert>
    </div>
  );
}
