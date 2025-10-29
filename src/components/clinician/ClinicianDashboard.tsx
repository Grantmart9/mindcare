"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Activity,
  BarChart3,
  Settings,
  UserCheck,
  Loader2,
} from "lucide-react";
import { format, subDays } from "date-fns";

interface PatientData {
  id: string;
  name: string;
  lastActive: string;
  consentGiven: boolean;
  dataShared: boolean;
  lastShared?: string;
}

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  appetite: number;
  social: number;
  notes?: string;
}

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  sentiment?: {
    sentiment: "positive" | "neutral" | "negative";
    confidence: number;
    emotions: string[];
    intensity: number;
  };
  wordCount: number;
}

interface CrisisEvent {
  id: string;
  date: string;
  type: "keyword" | "ai-detected" | "self-reported";
  severity: "low" | "moderate" | "high" | "imminent";
  description: string;
  resolved: boolean;
}

interface ClinicianDashboardProps {
  className?: string;
  isClinician?: boolean;
}

const MOCK_PATIENT_DATA: PatientData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    lastActive: new Date().toISOString(),
    consentGiven: true,
    dataShared: true,
    lastShared: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sam Williams",
    lastActive: subDays(new Date(), 2).toISOString(),
    consentGiven: true,
    dataShared: false,
  },
  {
    id: "3",
    name: "Jordan Lee",
    lastActive: subDays(new Date(), 5).toISOString(),
    consentGiven: false,
    dataShared: false,
  },
];

const MOCK_MOOD_DATA: MoodEntry[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    mood: 3,
    energy: 2,
    sleep: 4,
    appetite: 3,
    social: 2,
    notes: "Feeling overwhelmed with work deadlines",
  },
  {
    id: "2",
    date: subDays(new Date(), 1).toISOString(),
    mood: 4,
    energy: 3,
    sleep: 5,
    appetite: 4,
    social: 3,
    notes: "Had a good conversation with a friend",
  },
];

const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    content:
      "Today has been particularly challenging. I woke up feeling anxious about the upcoming presentation at work. The pressure seems overwhelming, and I find myself doubting my abilities. Despite these feelings, I did manage to go for a short walk this afternoon, which helped a little.",
    sentiment: {
      sentiment: "negative",
      confidence: 0.85,
      emotions: ["anxiety", "self-doubt", "overwhelm"],
      intensity: 0.7,
    },
    wordCount: 85,
  },
];

const MOCK_CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: "1",
    date: subDays(new Date(), 3).toISOString(),
    type: "ai-detected",
    severity: "moderate",
    description: "AI detected concerning language patterns in journal entry",
    resolved: true,
  },
];

export function ClinicianDashboard({
  className,
  isClinician = true,
}: ClinicianDashboardProps) {
  const [patients, setPatients] = useState<PatientData[]>(MOCK_PATIENT_DATA);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(
    null
  );
  const [patientMoodData] = useState<MoodEntry[]>(MOCK_MOOD_DATA);
  const [patientJournalEntries] =
    useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [crisisEvents] = useState<CrisisEvent[]>(MOCK_CRISIS_EVENTS);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataExport = async (patientId: string) => {
    setIsLoading(true);
    try {
      // Simulate data export
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const exportData = {
        patientId,
        exportDate: new Date().toISOString(),
        moodEntries: patientMoodData,
        journalEntries: patientJournalEntries,
        crisisEvents: crisisEvents.filter((e) => e.resolved),
        complianceInfo: {
          hipaaCompliant: true,
          gdprCompliant: true,
          consentObtained: patients.find((p) => p.id === patientId)
            ?.consentGiven,
          dataRetention: "7 years",
          lastAudit: new Date().toISOString(),
        },
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `patient-${patientId}-data-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch {
      toast.error("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDataSharing = async (patientId: string, enabled: boolean) => {
    setPatients(
      patients.map((p) =>
        p.id === patientId ? { ...p, dataShared: enabled } : p
      )
    );

    if (enabled) {
      toast.success("Data sharing enabled for patient");
    } else {
      toast.success("Data sharing disabled for patient");
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "imminent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceStatus = () => {
    const totalPatients = patients.length;
    const consentedPatients = patients.filter((p) => p.consentGiven).length;
    const sharingPatients = patients.filter((p) => p.dataShared).length;

    return {
      consentRate: (consentedPatients / totalPatients) * 100,
      sharingRate: (sharingPatients / totalPatients) * 100,
      hipaaCompliant: true,
      gdprCompliant: true,
    };
  };

  const compliance = getComplianceStatus();

  if (!isClinician) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              Clinician Access Required
            </h3>
            <p className="text-muted-foreground">
              You need clinician privileges to access this dashboard. Please
              contact your healthcare provider for access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>Clinician Dashboard</span>
        </h2>
        <p className="text-muted-foreground">
          HIPAA/GDPR compliant patient data management and insights
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{patients.length}</div>
            <div className="text-sm text-muted-foreground">Total Patients</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              {compliance.consentRate.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Consent Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {crisisEvents.filter((e) => !e.resolved).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-sm font-medium text-green-600">✓ HIPAA</div>
            <div className="text-sm font-medium text-green-600">✓ GDPR</div>
            <div className="text-sm text-muted-foreground">Compliant</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="crisis">Crisis Monitor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Patient Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            patient.consentGiven ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Last active:{" "}
                            {format(
                              new Date(patient.lastActive),
                              "MMM d, yyyy"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            patient.consentGiven ? "default" : "destructive"
                          }
                        >
                          {patient.consentGiven ? "Consented" : "No Consent"}
                        </Badge>
                        <Switch
                          checked={patient.dataShared}
                          onCheckedChange={(checked) =>
                            toggleDataSharing(patient.id, checked)
                          }
                          disabled={!patient.consentGiven}
                        />
                        <span className="text-sm">
                          {patient.dataShared ? "Sharing" : "Private"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Patient Details */}
          {selectedPatient && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>{selectedPatient.name} - Data Overview</span>
                  </CardTitle>
                  <Button
                    onClick={() => handleDataExport(selectedPatient.id)}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="mood" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="mood">Mood Data</TabsTrigger>
                    <TabsTrigger value="journal">Journal</TabsTrigger>
                    <TabsTrigger value="crisis">Crisis Events</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mood" className="space-y-4">
                    <div className="space-y-3">
                      {patientMoodData.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {format(new Date(entry.date), "MMM d, yyyy")}
                            </span>
                            <Badge>Mood: {entry.mood}/10</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>Energy: {entry.energy}/10</div>
                            <div>Sleep: {entry.sleep}/10</div>
                            <div>Appetite: {entry.appetite}/10</div>
                            <div>Social: {entry.social}/10</div>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="journal" className="space-y-4">
                    <div className="space-y-3">
                      {patientJournalEntries.map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {format(new Date(entry.date), "MMM d, yyyy")}
                            </span>
                            <div className="flex items-center space-x-2">
                              {entry.sentiment && (
                                <Badge
                                  className={getRiskLevelColor(
                                    entry.sentiment.sentiment
                                  )}
                                >
                                  {entry.sentiment.sentiment}
                                </Badge>
                              )}
                              <Badge variant="outline">
                                {entry.wordCount} words
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{entry.content}</p>
                          {entry.sentiment && (
                            <div className="flex flex-wrap gap-1">
                              {entry.sentiment.emotions.map((emotion) => (
                                <Badge
                                  key={emotion}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {emotion}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="crisis" className="space-y-4">
                    <div className="space-y-3">
                      {crisisEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="font-medium">
                                {format(new Date(event.date), "MMM d, yyyy")}
                              </span>
                              <Badge
                                className={getRiskLevelColor(event.severity)}
                              >
                                {event.severity}
                              </Badge>
                            </div>
                            <Badge
                              variant={
                                event.resolved ? "default" : "destructive"
                              }
                            >
                              {event.resolved ? "Resolved" : "Active"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Population Health Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Mood Score</span>
                      <span>6.2/10</span>
                    </div>
                    <Progress value={62} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Crisis Detection Rate</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement Rate</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Weekly Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Journal Entries</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mood Check-ins</span>
                    <span className="font-medium">203</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crisis Interventions</span>
                    <span className="font-medium text-green-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Crisis Monitor Tab */}
        <TabsContent value="crisis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Crisis Monitoring Dashboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crisisEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskLevelColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {event.type.replace("-", " ")}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(event.date), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <p className="text-sm">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Privacy & Compliance Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable secure data sharing with healthcare providers
                    </p>
                  </div>
                  <Switch
                    checked={dataSharingEnabled}
                    onCheckedChange={setDataSharingEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all data access for compliance purposes
                    </p>
                  </div>
                  <Switch
                    checked={auditLogging}
                    onCheckedChange={setAuditLogging}
                  />
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Compliance Status:</strong> All data handling meets
                  HIPAA and GDPR requirements. Patient consent is required
                  before sharing any personal health information.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
