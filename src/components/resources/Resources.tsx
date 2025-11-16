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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  ExternalLink,
  Star,
  Clock,
  Users,
  Heart,
  Brain,
  Lightbulb,
  Target,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "book" | "course" | "podcast";
  category: string;
  duration?: string;
  rating?: number;
  url: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface ResourceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  resources: Resource[];
}

export function Resources() {
  const [activeTab, setActiveTab] = useState("understanding-depression");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    console.log("Resources tab changed to:", value);
    setActiveTab(value);
  };

  const resourceCategories: ResourceCategory[] = [
    {
      id: "understanding-depression",
      name: "Understanding Depression",
      icon: <Brain className="h-5 w-5" />,
      description:
        "Learn about depression symptoms, causes, and what to expect",
      resources: [
        {
          id: "depression-basics",
          title: "What is Depression?",
          description:
            "A comprehensive overview of major depressive disorder, its symptoms, and how it affects daily life.",
          type: "article",
          category: "Education",
          duration: "15 min read",
          rating: 4.8,
          url: "https://www.nimh.nih.gov/health/topics/depression",
          tags: ["Symptoms", "Diagnosis", "Overview"],
          difficulty: "Beginner",
        },
        {
          id: "depression-myths",
          title: "Common Myths About Depression",
          description:
            "Debunking misconceptions and stigma surrounding mental health conditions.",
          type: "video",
          category: "Education",
          duration: "8 min",
          rating: 4.9,
          url: "https://www.youtube.com/watch?v=2T7F8JKv2Bc",
          tags: ["Myths", "Stigma", "Education"],
          difficulty: "Beginner",
        },
        {
          id: "depression-book",
          title: "Feeling Good: The New Mood Therapy",
          description:
            "The classic CBT self-help book by David D. Burns for managing depression.",
          type: "book",
          category: "Self-Help",
          rating: 4.7,
          url: "https://www.amazon.com/Feeling-Good-New-Mood-Therapy/dp/0380810336",
          tags: ["CBT", "Self-Help", "Therapy"],
          difficulty: "Intermediate",
        },
      ],
    },
    {
      id: "treatment-options",
      name: "Treatment & Recovery",
      icon: <Heart className="h-5 w-5" />,
      description: "Explore evidence-based treatments and recovery strategies",
      resources: [
        {
          id: "cbt-basics",
          title: "Cognitive Behavioral Therapy for Depression",
          description:
            "Learn how CBT helps identify and change negative thought patterns.",
          type: "course",
          category: "Therapy",
          duration: "6 weeks",
          rating: 4.6,
          url: "https://www.apa.org/topics/cbt",
          tags: ["CBT", "Therapy", "Treatment"],
          difficulty: "Intermediate",
        },
        {
          id: "medication-guide",
          title: "Antidepressant Medications: What You Need to Know",
          description:
            "Understanding different types of antidepressants and how they work.",
          type: "article",
          category: "Medical",
          duration: "12 min read",
          rating: 4.5,
          url: "https://www.nami.org/About-Mental-Illness/Treatments/Mental-Health-Medications/Antidepressants",
          tags: ["Medication", "Treatment", "Medical"],
          difficulty: "Intermediate",
        },
        {
          id: "recovery-stories",
          title: "Depression Recovery Stories",
          description:
            "Real stories from people who have overcome depression and found hope.",
          type: "video",
          category: "Inspiration",
          duration: "25 min",
          rating: 4.9,
          url: "https://www.youtube.com/watch?v=8-77mQgWX6M",
          tags: ["Recovery", "Hope", "Stories"],
          difficulty: "Beginner",
        },
      ],
    },
    {
      id: "daily-coping",
      name: "Daily Coping Strategies",
      icon: <Target className="h-5 w-5" />,
      description:
        "Practical tools and techniques for managing depression day-to-day",
      resources: [
        {
          id: "mindfulness-basics",
          title: "Mindfulness for Depression",
          description:
            "Simple mindfulness exercises to reduce anxiety and improve mood.",
          type: "course",
          category: "Mindfulness",
          duration: "4 weeks",
          rating: 4.7,
          url: "https://www.mindful.org/mindfulness-for-depression/",
          tags: ["Mindfulness", "Meditation", "Anxiety"],
          difficulty: "Beginner",
        },
        {
          id: "exercise-depression",
          title: "Exercise as Depression Treatment",
          description:
            "How physical activity can be as effective as medication for mild depression.",
          type: "article",
          category: "Lifestyle",
          duration: "10 min read",
          rating: 4.6,
          url: "https://www.healthline.com/health/depression/exercise",
          tags: ["Exercise", "Lifestyle", "Treatment"],
          difficulty: "Beginner",
        },
        {
          id: "sleep-hygiene",
          title: "Sleep and Depression: Breaking the Cycle",
          description:
            "Understanding the relationship between sleep and mood, plus practical sleep tips.",
          type: "article",
          category: "Lifestyle",
          duration: "8 min read",
          rating: 4.4,
          url: "https://www.sleepfoundation.org/mental-health/depression-and-sleep",
          tags: ["Sleep", "Lifestyle", "Health"],
          difficulty: "Beginner",
        },
      ],
    },
    {
      id: "support-networks",
      name: "Support & Community",
      icon: <Users className="h-5 w-5" />,
      description:
        "Find support groups, online communities, and professional help",
      resources: [
        {
          id: "nami-support",
          title: "NAMI Support Groups",
          description:
            "Free support groups for people with mental health conditions and their families.",
          type: "course",
          category: "Support",
          rating: 4.8,
          url: "https://www.nami.org/Support-Education/Support-Groups",
          tags: ["Support Groups", "Community", "NAMI"],
          difficulty: "Beginner",
        },
        {
          id: "online-communities",
          title: "Mental Health Online Communities",
          description:
            "Safe online spaces for connecting with others who understand your experiences.",
          type: "article",
          category: "Community",
          duration: "6 min read",
          rating: 4.3,
          url: "https://www.psychologytoday.com/us/blog/the-truth-about-exercise-addiction/202001/7-best-online-communities-mental-health-support",
          tags: ["Online", "Community", "Support"],
          difficulty: "Beginner",
        },
        {
          id: "family-guide",
          title: "Supporting Someone with Depression",
          description:
            "A guide for family and friends on how to provide meaningful support.",
          type: "article",
          category: "Family",
          duration: "14 min read",
          rating: 4.7,
          url: "https://www.nimh.nih.gov/health/publications/supporting-someone-with-depression",
          tags: ["Family", "Support", "Relationships"],
          difficulty: "Beginner",
        },
      ],
    },
  ];

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Play className="h-4 w-4" />;
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "course":
        return <Target className="h-4 w-4" />;
      case "podcast":
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Resource["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/20 via-orange-100/20 to-red-100/20 rounded-3xl blur-3xl"></div>
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, -3, 3, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-4xl md:text-6xl mb-4 floating-animation relative z-10"
        >
          📚
        </motion.div>
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent relative z-10">
          Educational Resources
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto relative z-10">
          Expand your knowledge with articles, videos, books, and courses about
          mental health, wellness, and personal growth
        </p>
      </motion.div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
          {resourceCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {resourceCategories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                {category.icon}
                {category.name}
              </h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.resources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full card-hover-glow group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5 group-hover:from-yellow-400/10 group-hover:to-orange-400/10 transition-all duration-300"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getDifficultyColor(
                            resource.difficulty
                          )}`}
                        >
                          {resource.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(resource.type)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {resource.type}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        {resource.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {resource.duration}
                          </div>
                        )}
                        {resource.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {resource.rating}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full group"
                          onClick={() => window.open(resource.url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                          {resource.type === "book"
                            ? "Get Book"
                            : resource.type === "course"
                            ? "Start Course"
                            : resource.type === "video"
                            ? "Watch Video"
                            : resource.type === "podcast"
                            ? "Listen Now"
                            : "Read Article"}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
