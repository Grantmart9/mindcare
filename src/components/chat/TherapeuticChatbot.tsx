"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { llmService } from "@/lib/services/llm-service";
import { apiService } from "@/lib/services/api-service";
import { getEmergencyResources } from "@/lib/data/crisis-resources";
import { toast } from "sonner";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  AlertTriangle,
  Phone,
  Loader2,
  Shield,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isCrisis?: boolean;
  crisisLevel?: "none" | "low" | "moderate" | "high" | "imminent";
  crisisKeywords?: string[];
  aiAnalysis?: {
    riskDetected: boolean;
    confidence: number;
    immediateActions: string[];
  };
}

interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

interface TherapeuticChatbotProps {
  className?: string;
}

const CBT_SYSTEM_PROMPT = `You are an empathetic, evidence-based therapeutic chatbot specializing in Cognitive Behavioral Therapy (CBT) and Acceptance and Commitment Therapy (ACT). Your role is to:

1. **CBT Principles:**
   - Help identify and challenge negative thought patterns
   - Encourage evidence-based thinking
   - Guide users through cognitive restructuring
   - Focus on behavior activation and skill-building

2. **ACT Principles:**
   - Promote psychological flexibility
   - Encourage acceptance of difficult emotions
   - Help clarify personal values
   - Support committed action toward values

3. **Communication Style:**
   - Warm, empathetic, and non-judgmental
   - Professional but approachable
   - Use simple, clear language
   - Ask open-ended questions to encourage reflection

4. **Crisis Detection:**
   - Monitor for signs of suicidal ideation, self-harm, or acute crisis
   - If detected, immediately provide crisis resources and encourage professional help
   - Never provide medical advice or diagnosis

5. **Boundaries:**
   - You are not a replacement for professional therapy
   - Encourage seeking licensed mental health professionals when appropriate
   - Focus on coping skills and immediate support

Always end responses with an open-ended question to continue the conversation, unless addressing a crisis situation.`;

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end it all",
  "not worth living",
  "self harm",
  "hurt myself",
  "cut myself",
  "overdose",
  "crisis",
  "emergency",
  "help me",
  "can't go on",
  "die",
  "death",
  "hopeless",
  "worthless",
];

export function TherapeuticChatbot({ className }: TherapeuticChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm here to support you with evidence-based therapeutic techniques. I specialize in CBT and ACT approaches to help you work through difficult thoughts and feelings. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [crisisMode, setCrisisMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const detectCrisis = (text: string): boolean => {
    const lowercaseText = text.toLowerCase();
    return CRISIS_KEYWORDS.some((keyword) => lowercaseText.includes(keyword));
  };

  const analyzeCrisisWithAI = async (
    text: string
  ): Promise<{
    riskDetected: boolean;
    riskLevel: "none" | "low" | "moderate" | "high" | "imminent";
    confidence: number;
    immediateActions: string[];
    crisisKeywords: string[];
  }> => {
    try {
      return await llmService.detectSuicideRisk(text);
    } catch (error) {
      console.error("Error in AI crisis analysis:", error);
      // Fallback to keyword-based detection
      return {
        riskDetected: detectCrisis(text),
        riskLevel: detectCrisis(text) ? "moderate" : "none",
        confidence: detectCrisis(text) ? 0.8 : 0,
        immediateActions: detectCrisis(text)
          ? [
              "Contact emergency services if in immediate danger",
              "Call 988 for crisis support",
            ]
          : [],
        crisisKeywords: detectCrisis(text) ? ["crisis detected"] : [],
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    // Enhanced AI-powered crisis detection
    const crisisAnalysis = await analyzeCrisisWithAI(inputMessage);

    if (crisisAnalysis.riskDetected) {
      userMessage.isCrisis = true;
      userMessage.crisisLevel = crisisAnalysis.riskLevel;
      userMessage.crisisKeywords = crisisAnalysis.crisisKeywords;
      userMessage.aiAnalysis = {
        riskDetected: crisisAnalysis.riskDetected,
        confidence: crisisAnalysis.confidence,
        immediateActions: crisisAnalysis.immediateActions,
      };

      // Set crisis mode based on risk level
      if (
        crisisAnalysis.riskLevel === "high" ||
        crisisAnalysis.riskLevel === "imminent"
      ) {
        setCrisisMode(true);
      }
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Save user message to database
      await apiService.saveChatMessage({
        message: userMessage.content,
        timestamp: userMessage.timestamp.toISOString(),
        is_user: true,
      });

      const chatMessages: LLMMessage[] = [
        {
          role: "user",
          content: `${CBT_SYSTEM_PROMPT}\n\nRecent conversation:\n${messages
            .slice(-3)
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join("\n")}\n\nUser: ${userMessage.content}`,
        },
      ];

      const response = await llmService.generateChatResponse(chatMessages, {
        temperature: 0.7,
        maxTokens: 512,
      });

      // Save AI response to database
      await apiService.saveChatMessage({
        message: response,
        timestamp: new Date().toISOString(),
        is_user: false,
      });

      // Check if AI response also needs crisis analysis
      const responseCrisisAnalysis = await analyzeCrisisWithAI(response);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        isCrisis: crisisMode || responseCrisisAnalysis.riskDetected,
        crisisLevel: responseCrisisAnalysis.riskLevel,
        crisisKeywords: responseCrisisAnalysis.crisisKeywords,
        aiAnalysis: {
          riskDetected: responseCrisisAnalysis.riskDetected,
          confidence: responseCrisisAnalysis.confidence,
          immediateActions: responseCrisisAnalysis.immediateActions,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update crisis mode based on AI response analysis
      if (
        responseCrisisAnalysis.riskLevel === "high" ||
        responseCrisisAnalysis.riskLevel === "imminent"
      ) {
        setCrisisMode(true);
      }
    } catch (error) {
      console.error("Error generating chat response:", error);
      toast.error(
        "Sorry, I'm having trouble responding right now. Please try again."
      );

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or consider reaching out to a mental health professional or crisis hotline if you need immediate support.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`flex flex-col h-[600px] ${className}`}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Therapeutic Support Chat</span>
            {crisisMode && (
              <Badge variant="destructive" className="ml-auto">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Crisis Mode
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Enhanced Crisis Alert */}
          {crisisMode && (
            <div className="p-4 border-b space-y-3">
              <Alert className="border-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    If you&apos;re in crisis, please contact emergency services
                    (911) or the National Suicide Prevention Lifeline at 988
                    immediately.
                  </span>
                  <Button size="sm" variant="destructive" className="ml-4">
                    <Phone className="h-3 w-3 mr-1" />
                    Call 988
                  </Button>
                </AlertDescription>
              </Alert>

              {/* Crisis Resources */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Available Crisis Resources</span>
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {getEmergencyResources()
                    .slice(0, 3)
                    .map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {resource.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {resource.description}
                          </div>
                        </div>
                        {resource.phone && (
                          <Button size="sm" variant="outline" className="ml-2">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {resource.phone}
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.isCrisis
                        ? "bg-destructive/10 border border-destructive/20"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {format(message.timestamp, "HH:mm")}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  crisisMode
                    ? "Please seek immediate help from a crisis hotline..."
                    : "Share what's on your mind..."
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              This is not a replacement for professional therapy. In crisis,
              call 988 immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
