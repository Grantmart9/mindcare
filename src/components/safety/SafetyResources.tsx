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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Shield,
  Phone,
  Heart,
  AlertTriangle,
  Users,
  BookOpen,
  Plus,
  Save,
  ExternalLink,
  MapPin,
} from "lucide-react";

interface CrisisResource {
  id: string;
  name: string;
  description: string;
  phone: string;
  website?: string;
  available24_7: boolean;
  specialty: string[];
}

interface CopingStrategy {
  id: string;
  name: string;
  description: string;
  steps: string[];
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export function SafetyResources() {
  const [activeTab, setActiveTab] = useState("crisis-support");
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Close Friend",
      phone: "(555) 123-4567",
      email: "sarah.j@email.com",
    },
  ]);

  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  // Debug tab changes
  const handleTabChange = (value: string) => {
    console.log("Safety tab changed to:", value);
    setActiveTab(value);
  };

  const crisisResources: CrisisResource[] = [
    {
      id: "988",
      name: "988 Suicide & Crisis Lifeline",
      description: "Free and confidential emotional support 24/7",
      phone: "988",
      website: "https://988lifeline.org",
      available24_7: true,
      specialty: ["Suicide Prevention", "Crisis Support", "Mental Health"],
    },
    {
      id: "211",
      name: "211 Information & Referral",
      description: "Connects people with health and human services",
      phone: "211",
      website: "https://211.org",
      available24_7: true,
      specialty: ["Information", "Referral", "Community Resources"],
    },
    {
      id: "nami",
      name: "NAMI HelpLine",
      description: "Mental health information and referral service",
      phone: "1-800-950-6264",
      website: "https://nami.org",
      available24_7: true,
      specialty: ["Mental Health Education", "Support Groups", "Referral"],
    },
    {
      id: "veterans",
      name: "Veterans Crisis Line",
      description: "Confidential support for veterans in crisis",
      phone: "988 (then press 1)",
      website: "https://www.veteranscrisisline.net",
      available24_7: true,
      specialty: ["Veterans", "Military", "PTSD"],
    },
  ];

  const copingStrategies: CopingStrategy[] = [
    {
      id: "grounding",
      name: "5-4-3-2-1 Grounding Technique",
      description:
        "A mindfulness exercise to bring you back to the present moment",
      category: "Mindfulness",
      difficulty: "Easy",
      steps: [
        "Name 5 things you can see",
        "Name 4 things you can touch",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste",
      ],
    },
    {
      id: "safe-place",
      name: "Safe Place Visualization",
      description: "Imagine a peaceful, safe place to reduce anxiety",
      category: "Visualization",
      difficulty: "Easy",
      steps: [
        "Close your eyes and take deep breaths",
        "Imagine a place where you feel completely safe",
        "Notice the details: sights, sounds, smells, feelings",
        "Stay in this place for 5-10 minutes",
        "Return when you feel ready",
      ],
    },
    {
      id: "progressive-relaxation",
      name: "Progressive Muscle Relaxation",
      description: "Systematically tense and relax muscle groups",
      category: "Relaxation",
      difficulty: "Medium",
      steps: [
        "Find a quiet place to lie down or sit comfortably",
        "Start with your feet: tense for 5 seconds, then release",
        "Move up through your body: calves, thighs, abdomen, etc.",
        "Notice the difference between tension and relaxation",
        "Complete the cycle 1-2 times",
      ],
    },
  ];

  const handleAddEmergencyContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Please fill in at least name and phone number");
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship || "",
      phone: newContact.phone,
      email: newContact.email,
    };

    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ name: "", relationship: "", phone: "", email: "" });
    toast.success("Emergency contact added successfully!");
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(
      emergencyContacts.filter((contact) => contact.id !== id)
    );
    toast.success("Emergency contact removed");
  };

  const callEmergency = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 via-blue-100/20 to-purple-100/20 rounded-3xl blur-3xl"></div>
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, -2, 2, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-4xl md:text-6xl mb-4 floating-animation relative z-10"
        >
          🛡️
        </motion.div>
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent relative z-10">
          Safety & Crisis Support
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto relative z-10">
          Your safety matters. Access crisis resources, coping strategies, and
          emergency support when you need it most
        </p>
      </motion.div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
          <TabsTrigger
            value="crisis-support"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
            Crisis Support
          </TabsTrigger>
          <TabsTrigger
            value="coping-strategies"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Heart className="h-4 w-4" />
            Coping Tools
          </TabsTrigger>
          <TabsTrigger
            value="emergency-contacts"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Users className="h-4 w-4" />
            Emergency Contacts
          </TabsTrigger>
          <TabsTrigger
            value="safety-plan"
            className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
          >
            <Shield className="h-4 w-4 text-blue-500" />
            Safety Plan
          </TabsTrigger>
        </TabsList>

        {/* Crisis Support Tab */}
        <TabsContent value="crisis-support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crisisResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full card-hover-glow group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-400/5 group-hover:from-green-400/10 group-hover:to-blue-400/10 transition-all duration-300"></div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Phone className="h-5 w-5 text-green-500" />
                          </motion.div>
                          {resource.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {resource.description}
                        </CardDescription>
                      </div>
                      {resource.available24_7 && (
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 0 0 0 rgba(34, 197, 94, 0.4)",
                              "0 0 0 8px rgba(34, 197, 94, 0)",
                              "0 0 0 0 rgba(34, 197, 94, 0)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Badge className="bg-green-100 text-green-800 border-green-200 breathing-circle">
                            24/7
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <motion.span
                        className="font-mono text-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {resource.phone}
                      </motion.span>
                    </div>

                    {resource.website && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full group"
                          onClick={() =>
                            window.open(resource.website, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                          Visit Website
                        </Button>
                      </motion.div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {resource.specialty.map((spec, index) => (
                        <motion.div
                          key={spec}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                          >
                            {spec}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0.4)",
                          "0 0 0 10px rgba(239, 68, 68, 0)",
                          "0 0 0 0 rgba(239, 68, 68, 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Button
                        onClick={() => callEmergency(resource.phone)}
                        className="w-full bg-red-500 hover:bg-red-600 breathing-circle"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Crisis Warning */}
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">
                    If You&apos;re in Immediate Danger
                  </h3>
                  <p className="text-red-700 text-sm mb-3">
                    If you or someone you know is in immediate danger, call
                    emergency services (911) right away. Do not wait - help is
                    available 24/7.
                  </p>
                  <Button
                    onClick={() => callEmergency("911")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call 911 Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coping Strategies Tab */}
        <TabsContent value="coping-strategies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {copingStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <Badge
                        variant={
                          strategy.difficulty === "Easy"
                            ? "default"
                            : strategy.difficulty === "Medium"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {strategy.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{strategy.description}</CardDescription>
                    <Badge variant="outline" className="w-fit">
                      {strategy.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Steps:</h4>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {strategy.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 font-semibold flex-shrink-0">
                              {i + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency-contacts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add New Contact */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Emergency Contact
                </CardTitle>
                <CardDescription>
                  Add trusted people you can reach out to in a crisis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input
                    id="contact-name"
                    placeholder="Full name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-relationship">Relationship</Label>
                  <Input
                    id="contact-relationship"
                    placeholder="e.g., Close friend, Family member, Therapist"
                    value={newContact.relationship}
                    onChange={(e) =>
                      setNewContact({
                        ...newContact,
                        relationship: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number *</Label>
                  <Input
                    id="contact-phone"
                    placeholder="(555) 123-4567"
                    value={newContact.phone}
                    onChange={(e) =>
                      setNewContact({ ...newContact, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email (Optional)</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="email@example.com"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                  />
                </div>

                <Button onClick={handleAddEmergencyContact} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            {/* Existing Contacts */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Emergency Contacts
                </CardTitle>
                <CardDescription>
                  People you can reach out to for support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {contact.relationship}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3" />
                          <span className="text-sm font-mono">
                            {contact.phone}
                          </span>
                        </div>
                        {contact.email && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {contact.email}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => callEmergency(contact.phone)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveContact(contact.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  {emergencyContacts.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No emergency contacts added yet. Add some trusted people
                      you can reach out to.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Safety Plan Tab */}
        <TabsContent value="safety-plan" className="space-y-6">
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Personal Safety Plan
              </CardTitle>
              <CardDescription>
                Create a personalized plan for managing crises and staying safe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    Warning Signs
                  </Label>
                  <Textarea
                    placeholder="What are your early warning signs that a crisis might be coming? (e.g., sleep changes, irritability, isolation)"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    Internal Coping Strategies
                  </Label>
                  <Textarea
                    placeholder="What can you do to take care of yourself when you notice warning signs? (e.g., breathing exercises, calling a friend)"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    People You Can Contact
                  </Label>
                  <Textarea
                    placeholder="Who are the people in your support network you can reach out to?"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    Professional Help
                  </Label>
                  <Textarea
                    placeholder="What professional resources can you access? (e.g., therapist phone number, crisis hotline)"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    Safe Environment
                  </Label>
                  <Textarea
                    placeholder="What makes your environment feel safer? (e.g., removing harmful objects, going to a safe place)"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">
                    Reasons to Live
                  </Label>
                  <Textarea
                    placeholder="What are your reasons for living? What makes life worth living for you?"
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>

              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Safety Plan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
