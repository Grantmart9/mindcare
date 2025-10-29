export interface LLMRequest {
  model: string;
  prompt: string;
  system?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  response: string;
  done: boolean;
  context?: number[];
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class LLMService {
  private baseUrl: string;
  private defaultModel: string;

  constructor(
    baseUrl: string = "http://100.122.221.54:11434",
    defaultModel: string = "codellama:latest"
  ) {
    // For frontend-only version, we'll use mock responses instead of API calls
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel;
  }

  async generateResponse(request: LLMRequest): Promise<string> {
    // Mock LLM response for frontend-only version
    console.log("Mock LLM call - returning sample response");

    // Return mock responses based on prompt content
    if (request.prompt?.includes("sentiment")) {
      return JSON.stringify({
        sentiment: "neutral",
        confidence: 0.7,
        emotions: ["content", "calm"],
        intensity: 0.5,
      });
    }

    if (request.prompt?.includes("depression risk")) {
      return JSON.stringify({
        riskLevel: "low",
        phq9Score: 5,
        indicators: ["mild anxiety"],
        recommendations: ["Consider mindfulness exercises"],
      });
    }

    if (request.prompt?.includes("suicide risk")) {
      return JSON.stringify({
        riskDetected: false,
        riskLevel: "none",
        confidence: 0.9,
        immediateActions: [],
        crisisKeywords: [],
      });
    }

    if (request.prompt?.includes("personalized recommendations")) {
      return JSON.stringify({
        recommendations: [
          {
            type: "self-care",
            title: "Practice Deep Breathing",
            description: "Take 5 minutes to focus on slow, deep breaths",
            priority: "medium",
            estimatedDuration: 5,
          },
        ],
      });
    }

    // Default mock response
    return "This is a mock response from the therapeutic chatbot. I'm here to help you with your mental health journey.";
  }

  async generateChatResponse(
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    // Mock chat response for frontend-only version
    console.log("Mock chat LLM call - returning sample response");

    const lastUserMessage =
      messages.filter((m) => m.role === "user").pop()?.content || "";

    // Simple mock responses based on user input
    if (
      lastUserMessage.toLowerCase().includes("sad") ||
      lastUserMessage.toLowerCase().includes("depressed")
    ) {
      return "I'm sorry you're feeling this way. It's completely normal to have difficult days. Would you like to talk about what's been bothering you? Remember that you're not alone in this.";
    }

    if (
      lastUserMessage.toLowerCase().includes("anxious") ||
      lastUserMessage.toLowerCase().includes("worried")
    ) {
      return "Anxiety can be really challenging. Try taking a few deep breaths - inhale for 4 counts, hold for 4, exhale for 4. This can help activate your body's relaxation response.";
    }

    if (lastUserMessage.toLowerCase().includes("mood")) {
      return "Tracking your mood is a great step toward understanding your emotional patterns. How have you been feeling lately? Any particular triggers or positive experiences you'd like to discuss?";
    }

    // Default supportive response
    return "Thank you for sharing that with me. I'm here to listen and support you on your mental health journey. How are you feeling right now, and what would you like to talk about?";
  }

  async checkHealth(): Promise<boolean> {
    // Mock health check for frontend-only version
    console.log("Mock LLM health check - returning true");
    return true;
  }

  async listModels(): Promise<string[]> {
    // Mock model list for frontend-only version
    console.log("Mock LLM model list - returning sample models");
    return ["codellama:latest", "llama2:latest", "mistral:latest"];
  }

  // Enhanced AI analysis methods
  async analyzeSentiment(text: string): Promise<{
    sentiment: "positive" | "neutral" | "negative";
    confidence: number;
    emotions: string[];
    intensity: number;
  }> {
    try {
      const prompt = `Analyze the sentiment and emotions in the following text. Respond with JSON format only:

Text: "${text}"

Return a JSON object with:
- sentiment: "positive", "neutral", or "negative"
- confidence: number between 0-1
- emotions: array of detected emotions (e.g., ["joy", "sadness", "anger", "fear", "anxiety"])
- intensity: number between 0-1 indicating emotional intensity

Focus on emotional language, context, and intensity indicators.`;

      const response = await this.generateResponse({
        model: this.defaultModel,
        prompt,
        temperature: 0.3,
        max_tokens: 256,
      });

      // Parse JSON response
      const result = JSON.parse(response);
      return {
        sentiment: result.sentiment || "neutral",
        confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
        emotions: Array.isArray(result.emotions) ? result.emotions : [],
        intensity: Math.max(0, Math.min(1, result.intensity || 0.5)),
      };
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return {
        sentiment: "neutral",
        confidence: 0.5,
        emotions: [],
        intensity: 0.5,
      };
    }
  }

  async assessDepressionRisk(
    text: string,
    moodScore?: number
  ): Promise<{
    riskLevel: "low" | "moderate" | "high" | "severe";
    phq9Score: number;
    indicators: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `Assess depression risk based on the following text and mood data. Use PHQ-9 criteria as reference.

Text: "${text}"
Mood Score (1-10): ${moodScore || "Not provided"}

PHQ-9 Categories (0-27 scale):
- 0-4: Minimal depression
- 5-9: Mild depression
- 10-14: Moderate depression
- 15-19: Moderately severe depression
- 20-27: Severe depression

Respond with JSON format only:
{
"riskLevel": "low|moderate|high|severe",
"phq9Score": number (0-27),
"indicators": ["specific risk indicators found"],
"recommendations": ["professional help suggestions"]
}

Consider: hopelessness, worthlessness, sleep/appetite changes, concentration issues, suicidal thoughts, etc.`;

      const response = await this.generateResponse({
        model: this.defaultModel,
        prompt,
        temperature: 0.2,
        max_tokens: 384,
      });

      const result = JSON.parse(response);
      return {
        riskLevel: result.riskLevel || "low",
        phq9Score: Math.max(0, Math.min(27, result.phq9Score || 0)),
        indicators: Array.isArray(result.indicators) ? result.indicators : [],
        recommendations: Array.isArray(result.recommendations)
          ? result.recommendations
          : [],
      };
    } catch (error) {
      console.error("Error assessing depression risk:", error);
      return {
        riskLevel: "low",
        phq9Score: 0,
        indicators: [],
        recommendations: [
          "Consider consulting with a mental health professional",
        ],
      };
    }
  }

  async detectSuicideRisk(text: string): Promise<{
    riskDetected: boolean;
    riskLevel: "none" | "low" | "moderate" | "high" | "imminent";
    confidence: number;
    immediateActions: string[];
    crisisKeywords: string[];
  }> {
    try {
      const prompt = `Analyze the following text for suicide risk indicators. Respond with JSON format only:

Text: "${text}"

Return JSON with:
- riskDetected: boolean
- riskLevel: "none", "low", "moderate", "high", or "imminent"
- confidence: number 0-1
- immediateActions: array of immediate safety recommendations
- crisisKeywords: array of specific keywords/phrases that triggered concern

Risk levels:
- none: No concerning content
- low: Vague mentions, requires monitoring
- moderate: Clear expressions of distress, some planning
- high: Specific plans, intent expressed
- imminent: Immediate danger, active crisis

Always err on the side of caution.`;

      const response = await this.generateResponse({
        model: this.defaultModel,
        prompt,
        temperature: 0.1,
        max_tokens: 256,
      });

      const result = JSON.parse(response);
      return {
        riskDetected: result.riskDetected || false,
        riskLevel: result.riskLevel || "none",
        confidence: Math.max(0, Math.min(1, result.confidence || 0)),
        immediateActions: Array.isArray(result.immediateActions)
          ? result.immediateActions
          : [],
        crisisKeywords: Array.isArray(result.crisisKeywords)
          ? result.crisisKeywords
          : [],
      };
    } catch (error) {
      console.error("Error detecting suicide risk:", error);
      return {
        riskDetected: false,
        riskLevel: "none",
        confidence: 0,
        immediateActions: [],
        crisisKeywords: [],
      };
    }
  }

  async generatePersonalizedRecommendations(
    moodHistory: Array<{ mood: number; date: string; notes?: string }>,
    preferences?: string[]
  ): Promise<{
    recommendations: Array<{
      type: "activity" | "exercise" | "social" | "professional" | "self-care";
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      estimatedDuration?: number;
    }>;
  }> {
    try {
      const recentMood = moodHistory.slice(-7); // Last 7 entries
      const avgMood =
        recentMood.reduce((sum, entry) => sum + entry.mood, 0) /
        recentMood.length;

      const prompt = `Generate personalized mental health recommendations based on mood history and preferences.

Recent mood data (last 7 days): ${JSON.stringify(recentMood)}
Average mood: ${avgMood.toFixed(1)}/10
User preferences: ${preferences?.join(", ") || "Not specified"}

Generate 3-5 personalized recommendations in JSON format:
{
"recommendations": [
 {
   "type": "activity|exercise|social|professional|self-care",
   "title": "Brief title",
   "description": "Detailed explanation",
   "priority": "low|medium|high",
   "estimatedDuration": minutes (optional)
 }
]
}

Consider:
- Current mood trends and patterns
- Evidence-based interventions (CBT, ACT, mindfulness)
- Appropriate difficulty level based on mood
- Balance of activities vs rest
- Professional help when needed`;

      const response = await this.generateResponse({
        model: this.defaultModel,
        prompt,
        temperature: 0.6,
        max_tokens: 512,
      });

      const result = JSON.parse(response);
      return {
        recommendations: Array.isArray(result.recommendations)
          ? result.recommendations
          : [],
      };
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return {
        recommendations: [
          {
            type: "self-care",
            title: "Practice Deep Breathing",
            description: "Take 5 minutes to focus on slow, deep breaths",
            priority: "medium",
            estimatedDuration: 5,
          },
        ],
      };
    }
  }
}

// Singleton instance for the app
export const llmService = new LLMService();
