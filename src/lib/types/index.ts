// Core data types for the mental health app

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  sleep: number; // 1-10 scale
  appetite: number; // 1-10 scale
  social: number; // 1-10 scale
  notes?: string;
  triggers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ThoughtRecord {
  id: string;
  date: string;
  situation: string;
  automaticThought: string;
  emotion: string;
  intensity: number; // 1-10
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  createdAt: string;
  updatedAt: string;
}

export interface BehavioralActivation {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  completed: boolean;
  completedAt?: string;
  difficulty: number; // 1-10
  enjoyment: number; // 1-10
  notes?: string;
  createdAt: string;
}

export interface MindfulnessExercise {
  id: string;
  title: string;
  description: string;
  type: "breathing" | "body-scan" | "meditation" | "grounding";
  duration: number; // in minutes
  completed: boolean;
  completedAt?: string;
  notes?: string;
  date: string;
}

export interface CrisisResource {
  id: string;
  name: string;
  type: "hotline" | "website" | "app" | "clinic" | "therapist";
  phone?: string;
  website?: string;
  description: string;
  available24_7: boolean;
  country: string;
}

export interface EmergencyPlan {
  id: string;
  warningSigns: string[];
  copingStrategies: string[];
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  professionalContacts: Array<{
    name: string;
    phone: string;
    type: string;
  }>;
  medications?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  notifications: {
    moodReminders: boolean;
    cbtReminders: boolean;
    mindfulnessReminders: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    fontSize: "small" | "medium" | "large";
  };
  createdAt: string;
  updatedAt: string;
}

// Chart data types
export interface MoodTrend {
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  appetite: number;
  social: number;
}

export interface WeeklyStats {
  week: string;
  averageMood: number;
  totalEntries: number;
  completedExercises: number;
}

// Component prop types
export interface DashboardStats {
  currentStreak: number;
  totalEntries: number;
  averageMood: number;
  completedExercises: number;
}

export interface MoodTrackerProps {
  onMoodSubmit: (
    entry: Omit<MoodEntry, "id" | "createdAt" | "updatedAt">
  ) => void;
  latestEntry?: MoodEntry;
}

export interface ThoughtRecordProps {
  onSave: (
    record: Omit<ThoughtRecord, "id" | "createdAt" | "updatedAt">
  ) => void;
  record?: ThoughtRecord;
}

export interface BehavioralActivationProps {
  onSchedule: (
    activity: Omit<BehavioralActivation, "id" | "createdAt">
  ) => void;
  activities: BehavioralActivation[];
}

export interface MindfulnessExerciseProps {
  exercise?: MindfulnessExercise;
  onComplete: (exercise: Omit<MindfulnessExercise, "id">) => void;
}

export interface JournalEntry {
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

export interface JournalProps {
  onSave: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
  entry?: JournalEntry;
}
