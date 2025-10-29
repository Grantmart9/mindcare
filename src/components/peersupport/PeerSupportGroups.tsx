"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { llmService } from "@/lib/services/llm-service";
import { apiService } from "@/lib/services/api-service";
import {
  Users,
  Plus,
  MessageCircle,
  Shield,
  CheckCircle,
  Send,
  EyeOff,
  Flag,
  UserPlus,
  Settings,
  Crown,
  Loader2,
  Heart,
} from "lucide-react";
import { format } from "date-fns";

interface SupportGroup {
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
}

interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  isModerated: boolean;
  moderationReason?: string;
  isCrisis?: boolean;
  aiFlagged: boolean;
  likes: number;
  userLiked: boolean;
}

// GroupMember interface removed as it's unused

interface PeerSupportGroupsProps {
  className?: string;
  currentUserId?: string;
}

// Removed mock groups - now fetched from API

// Removed mock messages - now fetched from API

const CATEGORY_INFO: Record<string, { color: string; icon: string }> = {
  depression: { color: "bg-blue-50 text-blue-700", icon: "😔" },
  anxiety: { color: "bg-green-50 text-green-700", icon: "😰" },
  trauma: { color: "bg-purple-50 text-purple-700", icon: "💔" },
  addiction: { color: "bg-teal-50 text-teal-700", icon: "🌱" },
  general: { color: "bg-slate-50 text-slate-700", icon: "💬" },
  caregivers: { color: "bg-rose-50 text-rose-700", icon: "🤝" },
};

export function PeerSupportGroups({
  className,
  currentUserId = "current-user",
}: PeerSupportGroupsProps) {
  // currentUserId is used in createGroup and sendMessage functions
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // members state removed as it's unused
  const [showGuidelines, setShowGuidelines] = useState(false);

  const [newGroup, setNewGroup] = useState<Partial<SupportGroup>>({
    category: "general",
    isPrivate: false,
    maxMembers: 20,
    isActive: true,
    guidelines: [],
  });

  const loadGroups = async () => {
    try {
      const response = await apiService.getGroups();
      setGroups(response.groups);
    } catch (error) {
      console.error("Error loading groups:", error);
      toast.error("Failed to load groups");
    }
  };

  const loadMessages = async (groupId: string) => {
    try {
      const response = await apiService.getGroupMessages(groupId);
      setMessages(response.messages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadMessages(selectedGroup.id);
    } else {
      setMessages([]);
    }
  }, [selectedGroup]);

  // Crisis analysis is now handled by the backend API

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    setIsLoading(true);

    try {
      const response = await apiService.sendMessage(
        selectedGroup.id,
        newMessage
      );

      // Reload messages to get the new one
      await loadMessages(selectedGroup.id);
      setNewMessage("");

      if (response.flagged) {
        toast.warning(
          "Message flagged for moderation. Our support team has been notified."
        );
      } else {
        toast.success("Message sent!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }

    setIsLoading(false);
  };

  const createGroup = async () => {
    if (!newGroup.name?.trim() || !newGroup.description?.trim()) return;

    try {
      const response = await apiService.createGroup({
        name: newGroup.name,
        description: newGroup.description,
        category: newGroup.category || "general",
        isPrivate: newGroup.isPrivate || false,
        maxMembers: newGroup.maxMembers || 20,
        guidelines: newGroup.guidelines || [],
      });

      setGroups([...groups, response]);
      setNewGroup({
        category: "general",
        isPrivate: false,
        maxMembers: 20,
        isActive: true,
      });
      setShowCreateForm(false);
      toast.success("Support group created!");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      await apiService.joinGroup(groupId);
      setGroups(
        groups.map((g) =>
          g.id === groupId ? { ...g, currentMembers: g.currentMembers + 1 } : g
        )
      );
      toast.success("Joined group successfully!");
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group");
    }
  };

  // leaveGroup function removed as it's unused

  const toggleLike = (messageId: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const newLikes = msg.userLiked ? msg.likes - 1 : msg.likes + 1;
          return { ...msg, likes: newLikes, userLiked: !msg.userLiked };
        }
        return msg;
      })
    );
  };

  const reportMessage = (messageId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, isModerated: true, moderationReason: "User reported" }
          : msg
      )
    );
    toast.success("Message reported to moderators");
  };

  const filteredMessages = selectedGroup
    ? messages.filter((msg) => msg.groupId === selectedGroup.id)
    : [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Users className="h-6 w-6" />
          <span>Peer Support Groups</span>
        </h2>
        <p className="text-muted-foreground">
          Connect with others in AI-moderated support communities
        </p>
      </div>

      {/* AI Safety Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Safe Space:</strong> All groups are monitored by AI for crisis
          detection and content moderation. Our trained moderators review
          flagged content to ensure community safety.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Browse Groups */}
        <TabsContent value="browse" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Available Groups</h3>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {CATEGORY_INFO[group.category].icon}
                      </span>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge className={CATEGORY_INFO[group.category].color}>
                          {group.category}
                        </Badge>
                      </div>
                    </div>
                    {group.isPrivate && (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {group.currentMembers}/{group.maxMembers}
                        </span>
                      </span>
                      <span>
                        Created {format(new Date(group.createdAt), "MMM d")}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setSelectedGroup(group)}
                      variant="outline"
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      View Group
                    </Button>
                    <Button
                      onClick={() => joinGroup(group.id)}
                      disabled={group.currentMembers >= group.maxMembers}
                      size="sm"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Groups */}
        <TabsContent value="my-groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.slice(0, 1).map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {CATEGORY_INFO[group.category].icon}
                      </span>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge className={CATEGORY_INFO[group.category].color}>
                          {group.category}
                        </Badge>
                      </div>
                    </div>
                    <Crown className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        Members: {group.currentMembers}/{group.maxMembers}
                      </span>
                      <span className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Active</span>
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedGroup(group)}
                        variant="outline"
                        size="sm"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Messages */}
        <TabsContent value="messages" className="space-y-6">
          {!selectedGroup ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Select a Group</h3>
                <p className="text-muted-foreground">
                  Choose a support group from the Browse tab to start chatting
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Group Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => setSelectedGroup(null)}
                        variant="ghost"
                        size="sm"
                      >
                        ← Back to Groups
                      </Button>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {CATEGORY_INFO[selectedGroup.category].icon}
                        </span>
                        <div>
                          <CardTitle>{selectedGroup.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {selectedGroup.currentMembers} members
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowGuidelines(!showGuidelines)}
                    >
                      Guidelines
                    </Button>
                  </div>
                </CardHeader>

                {showGuidelines && (
                  <CardContent className="border-t">
                    <div className="space-y-2">
                      <h4 className="font-medium">Group Guidelines</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedGroup.guidelines.map((guideline, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>{guideline}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Messages */}
              <Card className="flex flex-col h-[500px]">
                <CardContent className="flex-1 p-0">
                  <div className="flex flex-col h-full">
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className="flex items-start space-x-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {message.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">
                                {message.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(message.timestamp), "h:mm a")}
                              </span>
                              {message.isCrisis && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Crisis Support
                                </Badge>
                              )}
                              {message.aiFlagged && (
                                <Badge variant="outline" className="text-xs">
                                  AI Flagged
                                </Badge>
                              )}
                            </div>

                            <p
                              className={`text-sm ${
                                message.isModerated
                                  ? "text-muted-foreground italic"
                                  : ""
                              }`}
                            >
                              {message.isModerated
                                ? "[Message under moderation]"
                                : message.content}
                            </p>

                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => toggleLike(message.id)}
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1"
                              >
                                <Heart
                                  className={`h-3 w-3 ${
                                    message.userLiked
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }`}
                                />
                                <span className="ml-1 text-xs">
                                  {message.likes}
                                </span>
                              </Button>

                              <Button
                                onClick={() => reportMessage(message.id)}
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-muted-foreground"
                              >
                                <Flag className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Share your thoughts or ask for support..."
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={isLoading || !newMessage.trim()}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Messages are monitored for safety. Crisis situations
                        will trigger immediate support resources.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Group Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Support Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  value={newGroup.name || ""}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  placeholder="e.g., Anxiety Support Circle"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newGroup.category}
                  onChange={(e) =>
                    setNewGroup({
                      ...newGroup,
                      category: e.target.value as SupportGroup["category"],
                    })
                  }
                >
                  {Object.entries(CATEGORY_INFO).map(([value, info]) => (
                    <option key={value} value={value}>
                      {info.icon}{" "}
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newGroup.description || ""}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
                placeholder="Describe the purpose of your group and what members can expect..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Members</label>
                <Input
                  type="number"
                  value={newGroup.maxMembers || 20}
                  onChange={(e) =>
                    setNewGroup({
                      ...newGroup,
                      maxMembers: parseInt(e.target.value),
                    })
                  }
                  min={5}
                  max={100}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newGroup.isPrivate || false}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, isPrivate: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="isPrivate" className="text-sm">
                  Private group (invitation only)
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={createGroup} className="flex-1">
                Create Group
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
