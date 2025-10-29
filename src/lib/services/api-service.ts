export interface MoodEntry {
  id: string;
  mood: number;
  energy?: number;
  sleep?: number;
  appetite?: number;
  social?: number;
  anxiety?: number;
  notes?: string;
  emotions?: Record<string, number>;
  activities?: string[];
  date: string;
}

export interface MoodAnalytics {
  total_entries: number;
  average_mood: number;
  trend: "improving" | "declining" | "stable";
  recent_average: number;
  mood_distribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood_rating?: number;
  emotions?: Record<string, number>;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessment {
  id: string;
  depression_score: number;
  risk_level: "low" | "moderate" | "high" | "severe";
  assessment_text: string;
  factors: string[];
  recommendations: string[];
  is_escalated: boolean;
  date: string;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8000") {
    // For frontend-only version, we'll use mock data instead of API calls
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // For frontend-only version, return mock data instead of making API calls
    console.log(`Mock API call to ${endpoint} - returning mock data`);

    // Mock implementations for different endpoints
    if (endpoint === "/mood/entries") {
      return {
        entries: [
          {
            id: "1",
            mood: 7,
            energy: 6,
            sleep: 8,
            appetite: 7,
            social: 5,
            anxiety: 4,
            notes: "Feeling okay today",
            emotions: { happy: 0.7, anxious: 0.3 },
            activities: ["work", "exercise"],
            date: new Date().toISOString(),
          },
        ],
      } as T;
    }

    if (endpoint === "/mood/analytics") {
      return {
        total_entries: 10,
        average_mood: 6.5,
        trend: "stable",
        recent_average: 6.8,
        mood_distribution: {
          excellent: 2,
          good: 4,
          fair: 3,
          poor: 1,
        },
      } as T;
    }

    if (endpoint === "/journal/entries") {
      return {
        entries: [
          {
            id: "1",
            title: "Today's thoughts",
            content: "Had a productive day...",
            mood_rating: 7,
            emotions: { content: 0.8 },
            word_count: 50,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      } as T;
    }

    if (endpoint === "/health") {
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
      } as T;
    }

    // Default mock response
    return { message: "Mock response", id: "mock-id" } as T;
  }

  // Mood-related API calls
  async createMoodEntry(moodData: {
    mood: number;
    energy?: number;
    sleep?: number;
    appetite?: number;
    social?: number;
    anxiety?: number;
    notes?: string;
    emotions?: Record<string, number>;
    activities?: string[];
  }): Promise<{ message: string; id: string }> {
    return this.request("/mood/entries", {
      method: "POST",
      body: JSON.stringify(moodData),
    });
  }

  async getMoodEntries(): Promise<{ entries: MoodEntry[] }> {
    return this.request("/mood/entries");
  }

  async getMoodAnalytics(): Promise<MoodAnalytics> {
    return this.request("/mood/analytics");
  }

  // Journal-related API calls
  async createJournalEntry(journalData: {
    title?: string;
    content: string;
    mood_rating?: number;
    emotions?: Record<string, number>;
  }): Promise<{ message: string; id: string }> {
    return this.request("/journal/entries", {
      method: "POST",
      body: JSON.stringify(journalData),
    });
  }

  async getJournalEntries(): Promise<{ entries: JournalEntry[] }> {
    return this.request("/journal/entries");
  }

  // Risk assessment API calls
  async createRiskAssessment(assessmentData: {
    depression_score: number;
    risk_level: string;
    assessment_text: string;
    factors: string[];
    recommendations: string[];
    is_escalated?: boolean;
  }): Promise<{ message: string; id: string }> {
    return this.request("/risk/assessment", {
      method: "POST",
      body: JSON.stringify(assessmentData),
    });
  }

  async getRiskAssessments(): Promise<{ assessments: RiskAssessment[] }> {
    return this.request("/risk/assessments");
  }

  // Chat API calls
  async saveChatMessage(messageData: {
    message: string;
    timestamp: string;
    is_user: boolean;
  }): Promise<{ message: string; timestamp: string }> {
    return this.request("/chat/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  async getChatHistory(): Promise<{
    messages: Array<{
      id: string;
      message: string;
      timestamp: string;
      is_user: boolean;
    }>;
    total: number;
  }> {
    return this.request("/chat/history");
  }

  // Peer support API calls
  async getGroups(category?: string): Promise<{
    groups: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      isPrivate: boolean;
      maxMembers: number;
      currentMembers: number;
      createdBy: string;
      createdAt: string;
      isActive: boolean;
      guidelines: string[];
    }>;
  }> {
    const params = category ? `?category=${category}` : "";
    return this.request(`/peersupport/groups${params}`);
  }

  async createGroup(groupData: {
    name: string;
    description: string;
    category: string;
    isPrivate?: boolean;
    maxMembers?: number;
    guidelines?: string[];
  }): Promise<{
    id: string;
    name: string;
    description: string;
    category: string;
    isPrivate: boolean;
    maxMembers: number;
    currentMembers: number;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    guidelines: string[];
    message: string;
  }> {
    return this.request("/peersupport/groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    });
  }

  async joinGroup(groupId: string): Promise<{ message: string }> {
    return this.request(`/peersupport/groups/${groupId}/join`, {
      method: "POST",
    });
  }

  async getGroupMessages(groupId: string): Promise<{
    messages: Array<{
      id: string;
      groupId: string;
      userId: string;
      userName: string;
      content: string;
      timestamp: string;
      isModerated: boolean;
      moderationReason?: string;
      isCrisis: boolean;
      aiFlagged: boolean;
      likes: number;
      userLiked: boolean;
    }>;
  }> {
    return this.request(`/peersupport/groups/${groupId}/messages`);
  }

  async sendMessage(
    groupId: string,
    content: string
  ): Promise<{
    id: string;
    message: string;
    flagged: boolean;
  }> {
    return this.request(`/peersupport/groups/${groupId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request("/health");
  }
}

// Singleton instance for the app
export const apiService = new ApiService();
