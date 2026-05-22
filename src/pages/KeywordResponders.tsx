import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Instagram,
  Facebook,
  Plus,
  Search,
  Zap,
  ShieldCheck,
  Hash,
  Sparkles,
  Trash2,
  Power,
  Activity,
  Cpu,
  ArrowUpRight,
  Command,
  Clapperboard,
  Image as ImageIcon,
  PlayCircle,
  X,
  History,
  MessageSquare,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  NotebookText,
  UserCheck,
  Inbox,
  AlertCircle,
  FileSearch,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import Templates from "./Templates";

type Platform = "Instagram" | "Facebook";
type Status = "Active" | "Draft" | "Paused";

interface KeywordResponder {
  id: string;
  platform: Platform;
  keywords: string[];
  responseTemplates?: string[];
  randomizeTemplates?: boolean;
  autoLike?: boolean;
  publicReply?: boolean;
  publicReplyTemplate?: string;
  status: Status;
  triggerCount: number;
  lastTriggered: string;
  createdAt: string;
  scope: "All" | "Posts";
  targetedPostIds?: string[];
  internalNotes?: string;
  verificationStatus: "Verified" | "Pending" | "Draft";
  updatedBy?: {
    name: string;
    avatar: string;
    timestamp: string;
  };
  successRate?: number;
  conversionRate?: number;
  avgLatency?: number;
}

interface UnmatchedQuery {
  id: string;
  text: string;
  user: string;
  timestamp: string;
  platform: "Instagram" | "Facebook";
  frequency: number;
}

interface ResponderHistory {
  id: string;
  user: string;
  userAvatar?: string;
  platform: Platform;
  message: string;
  keyword: string;
  reply: string;
  timestamp: string;
  date: string;
  type: "AI" | "Static";
  feedback?: "Positive" | "Negative" | null;
}

const mockHistory: ResponderHistory[] = [
  {
    id: "h1",
    user: "sarah_j",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    platform: "Instagram",
    message: "Hey, what is the PRICE for the monthly plan?",
    keyword: "PRICE",
    reply:
      "Our monthly plan starts at $29/month. You can explore all tiers at neural.hub/pricing.",
    timestamp: "2 mins ago",
    date: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    type: "AI",
    feedback: "Positive",
  },
  {
    id: "h2",
    user: "mike_dev",
    userAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    platform: "Facebook",
    message: "WHERE are you guys located? Thanks!",
    keyword: "LOCATION",
    reply:
      "We are located at 123 Neural St, Matrix City! Feel free to drop by.",
    timestamp: "15 mins ago",
    date: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: "Static",
    feedback: null,
  },
  {
    id: "h3",
    user: "tech_guru",
    userAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    platform: "Instagram",
    message: "How can I JOIN the beta program?",
    keyword: "JOIN",
    reply:
      "To join our Beta program, simply head over to beta.neural.hub and fill out the application!",
    timestamp: "42 mins ago",
    date: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    type: "AI",
    feedback: "Negative",
  },
  {
    id: "h4",
    user: "creative_bee",
    userAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    platform: "Instagram",
    message: "What is the COST for enterprise?",
    keyword: "COST",
    reply:
      "For enterprise solutions, we offer tailored pricing. Our sales team will contact you shortly!",
    timestamp: "1 hour ago",
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: "AI",
    feedback: null,
  },
  {
    id: "h5",
    user: "alex_marketing",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    platform: "Instagram",
    message: "Can the AI helper send a PDF catalog or GUIDE?",
    keyword: "GUIDE",
    reply: "Beep boop, current system does not catalog. Check help section.",
    timestamp: "2 hours ago",
    date: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    type: "AI",
    feedback: "Negative",
  },
  {
    id: "h6",
    user: "julia_style",
    userAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    platform: "Facebook",
    message: "Do you offer a DISCOUNT code?",
    keyword: "DISCOUNT",
    reply: "Yes! Use code NEURAL10 for 10% off your first month at checkout.",
    timestamp: "3 hours ago",
    date: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    type: "Static",
    feedback: "Positive",
  },
  {
    id: "h7",
    user: "rob_builder",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    platform: "Instagram",
    message: "Is there a DEMO workspace I can play with?",
    keyword: "DEMO",
    reply:
      "Our system demo is offline today. Please register at neural.hub/demo.",
    timestamp: "5 hours ago",
    date: new Date(Date.now() - 300 * 60 * 1000).toISOString(),
    type: "Static",
    feedback: "Negative",
  },
];

const mockPosts = [
  {
    id: "p1",
    platform: "Instagram",
    type: "Reel",
    title: "Summer Collection Launch",
    likes: 1240,
    comments: 45,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  },
  {
    id: "p2",
    platform: "Instagram",
    type: "Post",
    title: "Why Neural AI is the future",
    likes: 890,
    comments: 12,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop",
  },
  {
    id: "p3",
    platform: "Facebook",
    type: "Post",
    title: "Weekend Promo: 50% OFF",
    likes: 450,
    comments: 89,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop",
  },
  {
    id: "p4",
    platform: "Instagram",
    type: "Reel",
    title: "Behind the scenes at the Hub",
    likes: 2300,
    comments: 120,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop",
  },
  {
    id: "p5",
    platform: "Instagram",
    type: "Post",
    title: "New Features Roadmap 2024",
    likes: 670,
    comments: 34,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
  },
  {
    id: "p6",
    platform: "Facebook",
    type: "Reel",
    title: "Customer Success Story: Zenith",
    likes: 1560,
    comments: 67,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop",
  },
  {
    id: "p7",
    platform: "Instagram",
    type: "Post",
    title: "Holiday Spirit at Neural",
    likes: 420,
    comments: 12,
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=200&h=200&fit=crop",
  },
  {
    id: "p8",
    platform: "Facebook",
    type: "Post",
    title: "Join our Beta Program",
    likes: 890,
    comments: 154,
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop",
  },
  {
    id: "p9",
    platform: "Instagram",
    type: "Reel",
    title: "AI Tips: Optimization",
    likes: 3100,
    comments: 89,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop",
  },
  {
    id: "p10",
    platform: "Instagram",
    type: "Post",
    title: "Meet the Team: Alex",
    likes: 340,
    comments: 5,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
  },
  {
    id: "p11",
    platform: "Facebook",
    type: "Reel",
    title: "Neural Hub Office Tour",
    likes: 780,
    comments: 23,
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=200&fit=crop",
  },
  {
    id: "p12",
    platform: "Instagram",
    type: "Post",
    title: "Flash Sale: 24 Hours Only",
    likes: 2100,
    comments: 340,
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop",
  },
];

export default function KeywordResponders() {
  const [responders, setResponders] = useState<KeywordResponder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingResponderId, setEditingResponderId] = useState<string | null>(
    null,
  );
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mainPlatformFilter, setMainPlatformFilter] = useState<
    "All" | "Instagram" | "Facebook"
  >("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [responseTypeFilter, setResponseTypeFilter] = useState<
    "All" | "Static" | "AI"
  >("All");
  const [hoveredTriggerId, setHoveredTriggerId] = useState<string | null>(null);

  // Creation State
  const [newPlatform, setNewPlatform] = useState<Platform>("Instagram");
  const [newKeywords, setNewKeywords] = useState("");
  const [newStatus, setNewStatus] = useState<Status>("Active");
  const [newResponseTemplates, setNewResponseTemplates] = useState<
    { id: string; text: string }[]
  >([{ id: Math.random().toString(36).substr(2, 9), text: "" }]);
  const [newRandomizeTemplates, setNewRandomizeTemplates] = useState(true);
  const [newAutoLike, setNewAutoLike] = useState(false);
  const [newPublicReply, setNewPublicReply] = useState(false);
  const [newPublicReplyText, setNewPublicReplyText] = useState("");
  const [newScope, setNewScope] = useState<"All" | "Posts">("All");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [postSearchQuery, setPostSearchQuery] = useState("");
  const [postSelectionPage, setPostSelectionPage] = useState(1);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [postTargetMethod, setPostTargetMethod] = useState<
    "gallery" | "manual"
  >("gallery");
  const [manualPostIds, setManualPostIds] = useState("");

  // Sandbox Simulator State
  const [sandboxPostId, setSandboxPostId] = useState<string>("p1");
  const [sandboxPostIdMode, setSandboxPostIdMode] = useState<
    "select" | "custom"
  >("select");
  const [sandboxCustomPostId, setSandboxCustomPostId] =
    useState<string>("custom_post_777");
  const [sandboxPlatform, setSandboxPlatform] = useState<Platform>("Instagram");
  const [sandboxMessage, setSandboxMessage] = useState<string>(
    "Hey, what is the price for this collection?",
  );
  const [sandboxTrace, setSandboxTrace] = useState<{
    totalScanned: number;
    platformMatches: number;
    keywordMatches: number;
    scopeMatches: number;
    rulesEvaluated: {
      ruleId: string;
      keywords: string[];
      platform: string;
      scope: string;
      matched: boolean;
      reasons: string[];
    }[];
  } | null>(null);
  const [sandboxResults, setSandboxResults] = useState<{
    status: "success" | "no-match" | "idle";
    matchedRule?: KeywordResponder;
    dispatchedReply?: string;
    logText?: string;
  }>({ status: "idle" });
  const [isSandboxProcessing, setIsSandboxProcessing] = useState(false);
  const [sandboxToast, setSandboxToast] = useState<string | null>(null);

  // Dynamic memo of all custom (non-mockPosts) post IDs targeted by active/paused responders.
  const customTargetedPostIds = React.useMemo(() => {
    const idsWithPlatform: { id: string; platform: Platform }[] = [];
    const seen = new Set<string>();
    responders.forEach((r) => {
      if (r.scope === "Posts" && r.targetedPostIds) {
        r.targetedPostIds.forEach((id) => {
          if (!mockPosts.some((p) => p.id === id) && !seen.has(id)) {
            seen.add(id);
            idsWithPlatform.push({ id, platform: r.platform });
          }
        });
      }
    });
    return idsWithPlatform;
  }, [responders]);

  // Robust post details retriever for simulator view
  const getPostDetails = React.useCallback((id: string) => {
    const mockPost = mockPosts.find((p) => p.id === id);
    if (mockPost) {
      return {
        id,
        platform: mockPost.platform as Platform,
        type: mockPost.type,
        title: mockPost.title,
        image: mockPost.image,
        isCustom: false,
      };
    }
    // Check if it's custom and targeted in existing responders
    const customMatch = responders.find(
      (r) => r.scope === "Posts" && r.targetedPostIds?.includes(id)
    );
    if (customMatch) {
      return {
        id,
        platform: customMatch.platform as Platform,
        type: "Custom Targeted",
        title: `Custom Targeted ID: "${id}"`,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
        isCustom: true,
      };
    }
    // Deep fallback
    return {
      id,
      platform: sandboxPlatform as Platform,
      type: "External/Manual ID",
      title: `Custom Manual Target ID: "${id}"`,
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
      isCustom: true,
    };
  }, [responders, sandboxPlatform]);

  // Get all trigger tags for the currently selected/entered post and platform
  const getRelevantKeywordsForPost = React.useCallback((id: string, platform: Platform) => {
    const kws: string[] = [];
    responders.forEach((r) => {
      if (r.status === "Active" && r.platform === platform) {
        if (r.scope === "All" || (r.scope === "Posts" && r.targetedPostIds?.includes(id))) {
          r.keywords.forEach((kw) => {
            if (!kws.includes(kw)) {
              kws.push(kw);
            }
          });
        }
      }
    });
    return kws;
  }, [responders]);

  const validateKeywords = useCallback(
    (
      value: string,
      scopeToTest?: "All" | "Posts",
      postsToTest?: string[],
      platformToTest?: "Instagram" | "Facebook",
    ) => {
      if (!value.trim()) {
        setKeywordError(null);
        return true;
      }

      const keywords = value
        .split(",")
        .map((k) => k.trim().toUpperCase())
        .filter((k) => k);

      if (keywords.length === 0) {
        setKeywordError(null);
        return true;
      }

      const testScope = scopeToTest !== undefined ? scopeToTest : newScope;
      const testPosts = postsToTest !== undefined ? postsToTest : selectedPosts;
      const testPlatform =
        platformToTest !== undefined ? platformToTest : newPlatform;

      for (const kw of keywords) {
        if (kw.length < 2) {
          setKeywordError(`Keyword "${kw}" is too short (min 2 characters).`);
          return false;
        }
        if (!/^[A-Z0-9_-]+$/.test(kw)) {
          setKeywordError(
            `Keyword "${kw}" has invalid characters. Use letters, numbers, underscores, and hyphens.`,
          );
          return false;
        }

        // Check for duplicates across other responders on the same platform
        const duplicateResponders = responders.filter(
          (r) =>
            r.platform === testPlatform &&
            r.id !== editingResponderId &&
            r.keywords.some((rk) => rk.toUpperCase() === kw),
        );

        for (const r of duplicateResponders) {
          // Overlap Check 1: Global overlapping Global
          if (testScope === "All" && r.scope === "All") {
            setKeywordError(
              `"${kw}" is already used in another global (All Posts) responder on ${testPlatform}.`,
            );
            return false;
          }

          // Overlap Check 2: Global vs Specific Posts
          if (testScope === "All" && r.scope === "Posts") {
            const firstPostId = r.targetedPostIds?.[0];
            const postName = firstPostId
              ? mockPosts.find((p) => p.id === firstPostId)?.title ||
                firstPostId
              : "specific posts";
            setKeywordError(
              `"${kw}" is already used in a specific-post responder targeting "${postName}" on ${testPlatform}. This conflicts with a global All Posts target.`,
            );
            return false;
          }

          // Overlap Check 3: Specific Posts vs Global
          if (testScope === "Posts" && r.scope === "All") {
            setKeywordError(
              `"${kw}" is already used in a global (All Posts) responder on ${testPlatform}. This conflicts with your post-specific target.`,
            );
            return false;
          }

          // Overlap Check 4: Both are post-specific and target the same post(s)
          if (testScope === "Posts" && r.scope === "Posts") {
            const common = testPosts.filter((pId) =>
              r.targetedPostIds?.includes(pId),
            );
            if (common.length > 0) {
              const conflictingPost =
                mockPosts.find((p) => p.id === common[0])?.title || common[0];
              setKeywordError(
                `"${kw}" is already used in another responder targeting the same post: "${conflictingPost}" on ${testPlatform}.`,
              );
              return false;
            }
          }
        }

        // Check for duplicates within the current input (within the same responder)
        const selfDuplicateCount = keywords.filter((k) => k === kw).length;
        if (selfDuplicateCount > 1) {
          setKeywordError(`"${kw}" is repeated in your list.`);
          return false;
        }
      }

      setKeywordError(null);
      return true;
    },
    [newScope, selectedPosts, newPlatform, responders, editingResponderId],
  );

  // Real-time automatic validation triggered on state changes
  useEffect(() => {
    validateKeywords(newKeywords);
  }, [newKeywords, validateKeywords]);

  // Dynamic keyword analysis list
  const keywordInsights = React.useMemo(() => {
    if (!newKeywords.trim()) return [];
    const keywords = newKeywords
      .split(",")
      .map((k) => k.trim().toUpperCase())
      .filter((k) => k);
    const insights: {
      type: "success" | "warning" | "info";
      keyword: string;
      text: string;
    }[] = [];

    for (const kw of keywords) {
      // Find rules on the SAME platform having this keyword
      const matches = responders.filter(
        (r) =>
          r.platform === newPlatform &&
          r.id !== editingResponderId &&
          r.keywords.some((rk) => rk.toUpperCase() === kw),
      );

      if (matches.length === 0) {
        insights.push({
          type: "success",
          keyword: kw,
          text: `Unique Trigger: "${kw}" is completely fresh. Excellent choice!`,
        });
        continue;
      }

      for (const r of matches) {
        if (newScope === "Posts" && r.scope === "Posts") {
          const common = selectedPosts.filter((pId) =>
            r.targetedPostIds?.includes(pId),
          );
          if (common.length === 0) {
            insights.push({
              type: "success",
              keyword: kw,
              text: `Disjoint Reuse: "${kw}" is already configured for other posts. Fully authorized! This will trigger a customized response for this specific group of posts.`,
            });
          } else {
            insights.push({
              type: "warning",
              keyword: kw,
              text: `Conflict Overlap: Shares "${kw}" with another rule targeting the same post(s).`,
            });
          }
        } else if (newScope === "Posts" && r.scope === "All") {
          insights.push({
            type: "info",
            keyword: kw,
            text: `Post Specific Override: Your specific post targets override the global fallback reply for "${kw}".`,
          });
        } else if (newScope === "All" && r.scope === "Posts") {
          insights.push({
            type: "info",
            keyword: kw,
            text: `Fallback Backup: This will act as the global default workspace fallback for "${kw}".`,
          });
        } else if (newScope === "All" && r.scope === "All") {
          insights.push({
            type: "warning",
            keyword: kw,
            text: `Ambiguous Trigger: Multiple global rules are listening to "${kw}" simultaneously.`,
          });
        }
      }
    }
    return insights;
  }, [
    newKeywords,
    newScope,
    selectedPosts,
    responders,
    editingResponderId,
    newPlatform,
  ]);

  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [postPlatformFilter, setPostPlatformFilter] = useState<
    "All" | "Instagram" | "Facebook"
  >("All");
  const [postTypeFilter, setPostTypeFilter] = useState<"All" | "Post" | "Reel">(
    "All",
  );
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // History Sort State
  const [historySortField, setHistorySortField] = useState<
    "timestamp" | "user" | "type" | "feedback"
  >("timestamp");
  const [historySortOrder, setHistorySortOrder] = useState<"asc" | "desc">(
    "desc",
  );
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Rules" | "History" | "Unmatched">(
    "Rules",
  );
  const [selectedResponderIds, setSelectedResponderIds] = useState<string[]>(
    [],
  );
  const [historyLogs, setHistoryLogs] =
    useState<ResponderHistory[]>(mockHistory);
  const [historyTypeFilter, setHistoryTypeFilter] = useState<
    "All" | "AI" | "Static"
  >("All");
  const [historyFeedbackFilter, setHistoryFeedbackFilter] = useState<
    "All" | "Positive" | "Negative" | "Unrated"
  >("All");
  const [showDiscoveryPanel, setShowDiscoveryPanel] = useState(false);
  const [unmatchedQueries, setUnmatchedQueries] = useState<UnmatchedQuery[]>([
    {
      id: "u1",
      text: "How do I upgrade?",
      user: "@jenna_marketing",
      timestamp: "5 mins ago",
      platform: "Instagram",
      frequency: 12,
    },
    {
      id: "u2",
      text: "Do you have a free trial?",
      user: "@brian_dev",
      timestamp: "12 mins ago",
      platform: "Instagram",
      frequency: 45,
    },
    {
      id: "u3",
      text: "Is there a mobile app?",
      user: "@tech_guy",
      timestamp: "1 hour ago",
      platform: "Facebook",
      frequency: 18,
    },
    {
      id: "u4",
      text: "Can I pay with crypto?",
      user: "@early_adopter",
      timestamp: "3 hours ago",
      platform: "Instagram",
      frequency: 8,
    },
  ]);
  const [fromUnmatchedQueryId, setFromUnmatchedQueryId] = useState<string | null>(null);

  const postsPerPage = 6;

  const [liveStream, setLiveStream] = useState([
    {
      user: "alex_matrix",
      msg: "Price check: what is the PRICE?",
      time: "0s",
      kw: "PRICE",
      color: "indigo",
    },
    {
      user: "neo_coder",
      msg: "LOCATION please",
      time: "12s",
      kw: "LOCATION",
      color: "emerald",
    },
  ]);

  useEffect(() => {
    if (activeTab !== "Rules") return;

    const interval = setInterval(() => {
      const users = ["nexus_user", "cyber_punk", "data_drifter", "neural_node"];
      const keywords = ["PRICE", "LOCATION", "JOIN", "HELP"];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomKw = keywords[Math.floor(Math.random() * keywords.length)];

      const newEntry = {
        user: randomUser,
        msg: `Found match for ${randomKw}!`,
        time: "Just now",
        kw: randomKw,
        color: "indigo",
      };

      setLiveStream((prev) => [newEntry, ...prev].slice(0, 5));
    }, 8000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const sortedHistory = React.useMemo(() => {
    return [...historyLogs]
      .filter((log) => {
        if (historyTypeFilter !== "All" && log.type !== historyTypeFilter)
          return false;
        if (historyFeedbackFilter !== "All") {
          if (
            historyFeedbackFilter === "Positive" &&
            log.feedback !== "Positive"
          )
            return false;
          if (
            historyFeedbackFilter === "Negative" &&
            log.feedback !== "Negative"
          )
            return false;
          if (
            historyFeedbackFilter === "Unrated" &&
            log.feedback !== null &&
            log.feedback !== undefined
          )
            return false;
        }
        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (historySortField === "timestamp") {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (historySortField === "user") {
          comparison = a.user.localeCompare(b.user);
        } else if (historySortField === "type") {
          comparison = a.type.localeCompare(b.type);
        } else if (historySortField === "feedback") {
          comparison = (a.feedback || "").localeCompare(b.feedback || "");
        }
        return historySortOrder === "asc" ? comparison : -comparison;
      });
  }, [
    historyLogs,
    historySortField,
    historySortOrder,
    historyTypeFilter,
    historyFeedbackFilter,
  ]);

  const filteredPosts = React.useMemo(() => {
    return mockPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(postSearchQuery.toLowerCase()) &&
        (postPlatformFilter === "All" ||
          post.platform === postPlatformFilter) &&
        (postTypeFilter === "All" || post.type === postTypeFilter) &&
        (!showSelectedOnly || selectedPosts.includes(post.id)),
    );
  }, [
    postSearchQuery,
    postPlatformFilter,
    postTypeFilter,
    showSelectedOnly,
    selectedPosts,
  ]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const pagedPosts = filteredPosts.slice(
    (postSelectionPage - 1) * postsPerPage,
    postSelectionPage * postsPerPage,
  );

  const moveTemplate = (index: number, direction: "up" | "down") => {
    const next = [...newResponseTemplates];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;

    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setNewResponseTemplates(next);
  };

  useEffect(() => {
    // Reset pagination when search or filters change
    setPostSelectionPage(1);
  }, [postSearchQuery, postPlatformFilter, postTypeFilter, showSelectedOnly]);

  useEffect(() => {
    // Simulate fetching responders
    const timer = setTimeout(() => {
      setResponders([
        {
          id: "1",
          platform: "Instagram",
          keywords: ["PRICE", "COST", "HOW MUCH"],
          responseTemplates: [
            "Our monthly plan starts at $29. Check it out at neural.hub/pricing",
          ],
          status: "Active",
          triggerCount: 842,
          lastTriggered: "12 mins ago",
          createdAt: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          scope: "All",
          verificationStatus: "Verified",
          internalNotes:
            "Primary pricing responder. Linked to Q2 marketing campaign.",
          updatedBy: {
            name: "Sarah Chen",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            timestamp: "2 hours ago",
          },
          successRate: 99.1,
          conversionRate: 18.4,
          avgLatency: 0.68,
        },
        {
          id: "2",
          platform: "Facebook",
          keywords: ["LOCATION", "WHERE"],
          responseTemplates: [
            "We are located at 123 Neural St, Matrix City!",
            "Find us at 123 Neural St! Open 24/7.",
          ],
          status: "Active",
          triggerCount: 156,
          lastTriggered: "1 hour ago",
          createdAt: new Date(
            Date.now() - 45 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          scope: "Posts",
          verificationStatus: "Verified",
          targetedPostIds: ["p3"],
          internalNotes:
            "Main office location. Update if we move to the new HQ in July.",
          updatedBy: {
            name: "Mike Ross",
            avatar:
              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
            timestamp: "1 day ago",
          },
          successRate: 98.4,
          conversionRate: 12.1,
          avgLatency: 0.82,
        },
        {
          id: "3",
          platform: "Instagram",
          keywords: ["JOIN", "SIGNUP"],
          responseTemplates: ["Join our beta at beta.neural.hub!"],
          status: "Paused",
          triggerCount: 45,
          lastTriggered: "2 days ago",
          createdAt: new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          scope: "All",
          verificationStatus: "Pending",
          internalNotes:
            "Paused while wait for new landing page. Target: Monday.",
          updatedBy: {
            name: "Alex Rivera",
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
            timestamp: "3 days ago",
          },
          successRate: 95.3,
          conversionRate: 24.5,
          avgLatency: 1.12,
        },
      ]);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = responders.filter((r) => {
    const matchesSearch = r.keywords.some((k) =>
      k.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const matchesPlatform =
      mainPlatformFilter === "All" || r.platform === mainPlatformFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const togglePost = (id: string) => {
    setSelectedPosts((prev) => {
      const next = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];
      validateKeywords(newKeywords, newScope, next);
      return next;
    });
  };

  const linkManualIds = (manualIdsString: string) => {
    const parsed = manualIdsString
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (parsed.length > 0) {
      setSelectedPosts((prev) => [...new Set([...prev, ...parsed])]);
    }
  };

  const handleCreate = () => {
    setKeywordError(null);

    if (!newKeywords.trim()) {
      setKeywordError("Keywords are required.");
      return;
    }

    if (!validateKeywords(newKeywords)) {
      return;
    }

    const keywords = newKeywords
      .split(",")
      .map((k) => k.trim().toUpperCase())
      .filter((k) => k);

    if (newResponseTemplates.every((t) => !t.text.trim())) {
      setKeywordError("At least one static response variation is required.");
      return;
    }

    const finalTemplates = newResponseTemplates
      .map((t) => t.text.trim())
      .filter((t) => t);

    if (editingResponderId) {
      setResponders((prev) =>
        prev.map((r) =>
          r.id === editingResponderId
            ? {
                ...r,
                platform: newPlatform,
                keywords: keywords,
                responseTemplates: finalTemplates,
                randomizeTemplates: newRandomizeTemplates,
                autoLike: newAutoLike,
                publicReply: newPublicReply,
                publicReplyTemplate: newPublicReply
                  ? newPublicReplyText
                  : undefined,
                status: newStatus,
                createdAt: r.createdAt,
                scope: newScope,
                targetedPostIds:
                  newScope === "Posts" ? selectedPosts : undefined,
              }
            : r,
        ),
      );
    } else {
      const newResponder: KeywordResponder = {
        id: Math.random().toString(36).substr(2, 9),
        platform: newPlatform,
        keywords: keywords,
        responseTemplates: finalTemplates,
        randomizeTemplates: newRandomizeTemplates,
        status: newStatus,
        triggerCount: 0,
        lastTriggered: "Just now",
        createdAt: new Date().toISOString(),
        scope: newScope,
        targetedPostIds: newScope === "Posts" ? selectedPosts : undefined,
        verificationStatus: "Verified",
        successRate: 100.0,
        conversionRate: 0.0,
        avgLatency: 0.22,
      };
      setResponders((prev) => [newResponder, ...prev]);
    }

    setIsAdding(false);
    setEditingResponderId(null);
    setSelectedTemplateName(null);

    // If we came from an unmatched query flow, remove it from the list
    if (fromUnmatchedQueryId) {
      setUnmatchedQueries((prev) => prev.filter((q) => q.id !== fromUnmatchedQueryId));
      setFromUnmatchedQueryId(null);
    }

    // Reset state
    setNewPlatform("Instagram");
    setNewKeywords("");
    setNewStatus("Active");
    setNewResponseTemplates([
      { id: Math.random().toString(36).substr(2, 9), text: "" },
    ]);
    setNewRandomizeTemplates(true);
    setNewAutoLike(false);
    setNewPublicReply(false);
    setNewPublicReplyText("");
    setNewScope("All");
    setPostSearchQuery("");
    setSelectedPosts([]);
    setKeywordError(null);
  };

  const handleEdit = (responder: KeywordResponder) => {
    setEditingResponderId(responder.id);
    setNewPlatform(responder.platform);
    setNewKeywords(responder.keywords.join(", "));
    setNewStatus(responder.status);
    setNewResponseTemplates(
      responder.responseTemplates && responder.responseTemplates.length > 0
        ? responder.responseTemplates.map((t) => ({
            id: Math.random().toString(36).substr(2, 9),
            text: t,
          }))
        : [{ id: Math.random().toString(36).substr(2, 9), text: "" }],
    );
    setNewRandomizeTemplates(responder.randomizeTemplates !== false);
    setNewAutoLike(responder.autoLike || false);
    setNewPublicReply(responder.publicReply || false);
    setNewPublicReplyText(responder.publicReplyTemplate || "");
    setNewScope(responder.scope);
    setSelectedPosts(responder.targetedPostIds || []);
    setIsAdding(true);
  };

  const handleBulkPause = () => {
    setResponders((prev) =>
      prev.map((r) => {
        if (selectedResponderIds.includes(r.id)) {
          return {
            ...r,
            status: r.status === "Active" ? "Paused" : "Active",
          };
        }
        return r;
      }),
    );
    setSelectedResponderIds([]);
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the ${selectedResponderIds.length} selected automations?`,
      )
    ) {
      setResponders((prev) =>
        prev.filter((r) => !selectedResponderIds.includes(r.id)),
      );
      setSelectedResponderIds([]);
    }
  };

  const handleBulkExport = () => {
    const selectedResponders = responders.filter((r) =>
      selectedResponderIds.includes(r.id),
    );
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(selectedResponders, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `socialflow_automations_export.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSimulateRouting = () => {
    if (!sandboxMessage.trim()) return;

    setIsSandboxProcessing(true);
    setSandboxResults({ status: "idle" });
    setSandboxTrace(null);

    setTimeout(() => {
      const msgUpper = sandboxMessage.toUpperCase();
      const finalPostId =
        sandboxPostIdMode === "select" ? sandboxPostId : sandboxCustomPostId.trim();
      const postDetails = getPostDetails(finalPostId);
      const postPlatform = postDetails.platform;

      // Filter only active responders
      const activeResponders = responders.filter((r) => r.status === "Active");

      const traceRules: any[] = [];
      let platformMatches = 0;
      let keywordMatches = 0;
      let scopeMatches = 0;

      const eligibleResponders = activeResponders.filter((r) => {
        const reasons: string[] = [];
        let matched = true;

        // 1. Platform Check
        const isPlatformMatch = r.platform === postPlatform;
        if (isPlatformMatch) {
          platformMatches++;
        } else {
          matched = false;
          reasons.push(
            `Platform mismatch: rule is configured for "${r.platform}" but simulator comment is on "${postPlatform}".`,
          );
        }

        // 2. Keyword Check with robust word boundaries and symbol character protection
        const hasMatchingKeyword = r.keywords.some((kw) => {
          const cleanedKw = kw.trim().toUpperCase();
          if (!cleanedKw) return false;

          // Escape special regex chars
          const escaped = cleanedKw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

          // Boundary context pattern (works for hashtags or alphabetic words)
          const patternStr =
            (/^[A-Z0-9]/i.test(cleanedKw) ? '\\b' : '(?:^|\\s)') +
            escaped +
            (/[A-Z0-9]$/i.test(cleanedKw) ? '\\b' : '(?:$|\\s)');
          try {
            const regex = new RegExp(patternStr, "i");
            return regex.test(msgUpper) || msgUpper.includes(cleanedKw);
          } catch (e) {
            return msgUpper.includes(cleanedKw);
          }
        });

        if (hasMatchingKeyword) {
          keywordMatches++;
        } else {
          matched = false;
          reasons.push(
            `Keywords [${r.keywords.join(", ")}] not matched with Comment text.`,
          );
        }

        // 3. Scope / Post Target Check
        let isScopeMatch = false;
        if (r.scope === "All") {
          isScopeMatch = true;
          scopeMatches++;
        } else if (r.scope === "Posts") {
          isScopeMatch = r.targetedPostIds?.includes(finalPostId) || false;
          if (isScopeMatch) {
            scopeMatches++;
          } else {
            matched = false;
            reasons.push(
              `Post ID boundary mismatch: rule targets specific posts but does not target "${finalPostId}".`,
            );
          }
        }

        if (matched) {
          reasons.push(
            "Passed platform context, keyword triggers, and scope filters!",
          );
        }

        traceRules.push({
          ruleId: r.id,
          keywords: r.keywords,
          platform: r.platform,
          scope: r.scope,
          matched,
          reasons,
        });

        return matched;
      });

      // Save diagnostic trace log
      setSandboxTrace({
        totalScanned: activeResponders.length,
        platformMatches,
        keywordMatches,
        scopeMatches,
        rulesEvaluated: traceRules,
      });

      if (eligibleResponders.length === 0) {
        const postName = postDetails.isCustom
          ? `Custom Post ID: "${finalPostId}"`
          : `Post: "${postDetails.title}"`;

        setSandboxResults({
          status: "no-match",
          logText: `Comment query received on ${postPlatform} but no active matching keyword rule was triggered for ${postName}. Routing query to Unmatched inbox.`,
        });

        // Dynamically append or increment unmatched comments in the actual inbox
        setUnmatchedQueries((prev) => {
          const checkText = sandboxMessage.trim();
          const existingIndex = prev.findIndex(
            (q) => q.text.trim().toLowerCase() === checkText.toLowerCase() && q.platform === postPlatform
          );
          if (existingIndex !== -1) {
            return prev.map((q, idx) =>
              idx === existingIndex
                ? { ...q, frequency: q.frequency + 1, timestamp: "Just now" }
                : q
            );
          } else {
            const newUnmatched: UnmatchedQuery = {
              id: `u-sim-${Math.random().toString(36).substr(2, 5)}`,
              text: checkText,
              user: `@test_unmatched_${Math.floor(100 + Math.random() * 900)}`,
              timestamp: "Just now",
              platform: postPlatform as Platform,
              frequency: 1,
            };
            return [newUnmatched, ...prev];
          }
        });

        setSandboxToast("⚠️ No rule match. Logged to Unmatched log.");
        setTimeout(() => setSandboxToast(null), 3000);
        setIsSandboxProcessing(false);
        return;
      }

      // Prioritize "Posts" (Specific) over "All" (Global)
      eligibleResponders.sort((a, b) => {
        if (a.scope === "Posts" && b.scope === "All") return -1;
        if (a.scope === "All" && b.scope === "Posts") return 1;
        return 0;
      });

      const chosenRule = eligibleResponders[0];
      const templates = chosenRule.responseTemplates || [
        "Thank you for reaching out!",
      ];
      const pickedResponse =
        chosenRule.randomizeTemplates !== false
          ? templates[Math.floor(Math.random() * templates.length)]
          : templates[chosenRule.triggerCount % templates.length];

      setSandboxResults({
        status: "success",
        matchedRule: chosenRule,
        dispatchedReply: pickedResponse,
        logText: `Dispatched matching intent rule #${chosenRule.keywords[0]} via ${chosenRule.scope} post filters.`,
      });

      // Add simulated action to History Log state automatically to link systems
      const newHistoryLog = {
        id: `h-sim-${Math.random().toString(36).substr(2, 5)}`,
        user: "sandbox_tester",
        userAvatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        platform: chosenRule.platform,
        message: sandboxMessage,
        keyword: chosenRule.keywords[0],
        reply: pickedResponse,
        timestamp: "Just now",
        date: new Date().toISOString(),
        type: (chosenRule.verificationStatus === "Verified"
          ? "Static"
          : "AI") as "Static" | "AI",
        feedback: null as "Positive" | "Negative" | null,
      };

      setHistoryLogs((prev) => [newHistoryLog, ...prev]);

      // Update the trigger count on the matched rule
      setResponders((prev) =>
        prev.map((r) =>
          r.id === chosenRule.id
            ? {
                ...r,
                triggerCount: r.triggerCount + 1,
                lastTriggered: "Just now",
              }
            : r,
        ),
      );

      setSandboxToast("🚀 DM Auto-Trigger Despatched!");
      setTimeout(() => setSandboxToast(null), 3000);
      setIsSandboxProcessing(false);
    }, 800);
  };

  const handleAddRuleFromUnmatched = (q: UnmatchedQuery) => {
    let suggestedKeywords = "";
    let suggestedReply = "";

    if (q.text.toLowerCase().includes("upgrade")) {
      suggestedKeywords = "UPGRADE, RENEW, PRO";
      suggestedReply =
        "Ready to elevate to Pro? Check out our awesome benefits here: neural.hub/pricing";
    } else if (
      q.text.toLowerCase().includes("trial") ||
      q.text.toLowerCase().includes("free")
    ) {
      suggestedKeywords = "TRIAL, FREE, ACCESS";
      suggestedReply =
        "We offer a 14-day fully featured free trial at neural.hub/signup! No credit card required.";
    } else if (
      q.text.toLowerCase().includes("mobile") ||
      q.text.toLowerCase().includes("app")
    ) {
      suggestedKeywords = "APP, MOBILE, IOS, ANDROID";
      suggestedReply =
        "The Neural Hub mobile app is available on both App Store and Google Play! Download here: neural.hub/apps";
    } else if (
      q.text.toLowerCase().includes("crypto") ||
      q.text.toLowerCase().includes("pay")
    ) {
      suggestedKeywords = "PAY, CRYPTO, BITCOIN";
      suggestedReply =
        "We support payment via major credit cards, PayPal, and Bitcoin/Ethereum payments on checkout!";
    } else {
      suggestedKeywords = q.text
        .toUpperCase()
        .replace(/[^A-Z\s]/g, "")
        .split(" ")
        .filter((w) => w.length > 2)
        .slice(0, 2)
        .join(", ");
      suggestedReply = `Thank you for your inquiry about "${q.text}"! We will get back to you immediately.`;
    }

    setNewPlatform(q.platform);
    setNewKeywords(suggestedKeywords);
    setNewResponseTemplates([
      { id: Math.random().toString(36).substr(2, 9), text: suggestedReply },
    ]);
    setNewScope("All");
    setFromUnmatchedQueryId(q.id);
    setIsAdding(true);
  };

  const handleCreateFromSuggestion = (keywords: string, reply: string) => {
    setNewPlatform("Instagram");
    setNewKeywords(keywords);
    setNewResponseTemplates([
      { id: Math.random().toString(36).substr(2, 9), text: reply },
    ]);
    setNewScope("All");
    setNewStatus("Active");
    setIsAdding(true);
    setShowDiscoveryPanel(false);
  };

  const toggleHistoryFeedback = (
    logId: string,
    rating: "Positive" | "Negative",
  ) => {
    setHistoryLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          return {
            ...log,
            feedback: log.feedback === rating ? null : rating,
          };
        }
        return log;
      }),
    );
  };

  const handleFixResponder = (log: ResponderHistory) => {
    // Search for existing responder with that keyword
    const matched = responders.find((r) =>
      r.keywords.some((kw) => kw.toLowerCase() === log.keyword.toLowerCase()),
    );

    if (matched) {
      // Edit the existing responder
      handleEdit(matched);
    } else {
      // Open clean creator with prefilled information based on the history log
      setNewPlatform(log.platform);
      setNewKeywords(log.keyword);
      setNewResponseTemplates([
        { id: Math.random().toString(36).substr(2, 9), text: log.reply },
      ]);
      setNewScope("All");
      setNewStatus("Active");
      setEditingResponderId(null);
      setSelectedPosts([]);
      setNewAutoLike(false);
      setNewPublicReply(false);
      setNewPublicReplyText("");
      setIsAdding(true);
    }

    // Switch to Rules tab
    setActiveTab("Rules");

    // Scroll smoothly to top so user sees the editor form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-12 pb-20 matrix-bg min-h-screen">
      <AnimatePresence>
        {showTemplates && (
          <Templates
            onClose={() => setShowTemplates(false)}
            onSelect={(template) => {
              setShowTemplates(false);
              setIsAdding(true);

              if (template.id === "SCRATCH") {
                setSelectedTemplateName("Start from Scratch");
                setNewPlatform("Instagram");
                setNewKeywords("");
                setNewResponseTemplates([
                  { id: Math.random().toString(36).substr(2, 9), text: "" },
                ]);
                setNewAutoLike(false);
                setNewPublicReply(false);
                setNewPublicReplyText("");
                setNewScope("All");
                setSelectedPosts([]);
                return;
              }

              setSelectedTemplateName(template.title);
              setNewScope(template.trigger === "Comment" ? "Posts" : "All");

              // Seed with better data based on template type and goal:
              let keywords = "AUTO";
              let responses: string[] = [
                "Thank you for contacting us! We will reply shortly.",
              ];
              let autoLike = false;
              let publicReply = false;
              let publicReplyText = "";

              // Refine based on general template goal
              if (template.goal === "Grow") {
                keywords = "GROW, FOLLOW, SHARE, GIVEAWAY";
                responses = [
                  "To enter the giveaway and grow with us, make sure to follow @social_flow and tag 2 friends in our latest post! 🚀",
                  "Thanks for supporting! Share this to your story and get an exclusive bonus instantly. Here is your access link: [LINK]",
                ];
                autoLike = true;
                publicReply = true;
                publicReplyText =
                  "Awesome! DM sent to confirm your giveaway entry. 📩";
              } else if (template.goal === "Engage") {
                keywords = "HELLO, HELP, CHAT, HI";
                responses = [
                  "Hi there! 🤖 I am your AI automated virtual assistant. How can I help you today?",
                  "Hello! Thanks for reaching out to us. Let us know how we can support your business goals!",
                ];
                autoLike = false;
                publicReply = false;
              } else if (template.goal === "Drive") {
                keywords = "PRICE, LINK, WEBPAGE, COST";
                responses = [
                  "Check out our pricing page for more details: neural.hub/pricing",
                  "Here is the link you requested: neural.hub/dashboard 🚀",
                ];
                autoLike = true;
                publicReply = true;
                publicReplyText =
                  "Sent you a DM with the active link! Check your message request box 📩";
              }

              // Refine with specific template details
              if (template.id === "1") {
                // DM Auto-Reply (Goal: Drive, Trigger: Comment)
                keywords = "PRICE, COST, HOW MUCH, PRICING";
                responses = [
                  "Our packages start at just $29/mo. View our complete pricing and features here: neural.hub/pricing",
                  "Here is the pricing breakdown you requested: starter plan starts at $29, pro plan at $79. Link: [LINK]",
                ];
                autoLike = true;
                publicReply = true;
                publicReplyText =
                  "Just sent you our pricing details directly to your messages! 📩";
              } else if (template.id === "2") {
                // Story Reply (Goal: Drive, Trigger: Story)
                keywords = "STORY, COOL, LOVE, WOW";
                responses = [
                  "Thanks for viewing our stories! Here is a little surprise just for you: neural.hub/promo 🎁",
                  "So glad you tuned in to our latest story updates! Stay tuned for more. 🚀",
                ];
                autoLike = false;
                publicReply = false;
              } else if (template.id === "3") {
                // Inbox Manager (Goal: Engage, Trigger: DM)
                keywords = "HELLO, HI, START, SUPPORT";
                responses = [
                  "Hello! Welcome to our automated workspace inbox. How can we help you today?",
                  "Hi! Thanks for the message. Our agent is here. Tell us what setup you want to manage.",
                ];
                autoLike = false;
                publicReply = false;
              } else if (template.id === "6") {
                // AI Chat Bot (Goal: Engage, Trigger: DM)
                keywords = "AI, BOT, ASSIST, SMART";
                responses = [
                  "Hello! I am your AI automation virtual assistant. I can answer any questions and route you to resources.",
                  "AI engine online! 🤖 Ask me about configuration steps, pricing modules, or triggers!",
                ];
                autoLike = false;
                publicReply = false;
              } else if (template.id === "7") {
                // Comment Reply (Goal: Drive, Trigger: Comment)
                keywords = "INFO, DETAILS, PLAYBOOK, SAMPLE";
                responses = [
                  "I am sending the requested details and free playbook directly to your DMs right now! 🤖",
                  "Details dispatched! Please check your message request box for the full tutorial guide link.",
                ];
                autoLike = true;
                publicReply = true;
                publicReplyText =
                  "Just sent the details to your DMs! Check your inbox 📩";
              } else if (template.id === "8") {
                // Link Sender (Goal: Drive, Trigger: DM)
                keywords = "LINK, WEBSITE, WEBPAGE, PORTAL";
                responses = [
                  "Here is the direct link you requested: neural.hub/dashboard 🚀",
                  "Access our main portal and view our live integrations: neural.hub/portal",
                ];
                autoLike = false;
                publicReply = false;
              }

              setNewKeywords(keywords);
              setNewResponseTemplates(
                responses.map((text) => ({
                  id: Math.random().toString(36).substr(2, 9),
                  text,
                })),
              );
              setNewAutoLike(autoLike);
              setNewPublicReply(publicReply);
              setNewPublicReplyText(publicReplyText);
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">
            Matrix Protocol
          </p>
          <h1 className="text-4xl font-black text-[var(--ink)] tracking-tight italic">
            Automations
          </h1>
          <p className="text-[var(--ink-muted)] text-sm font-medium">
            Automatic DMs based on keyword triggers on Instagram and Facebook.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {selectedResponderIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-6 py-4 rounded-[1.5rem] flex items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                    {selectedResponderIds.length}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                    Selected
                  </span>
                </div>
                <div className="h-4 w-px bg-indigo-200 dark:bg-indigo-500/30" />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBulkPause}
                    className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 hover:scale-105 active:scale-95 transition-all"
                  >
                    Pause/Resume
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="text-[9px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-800 hover:scale-105 active:scale-95 transition-all"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleBulkExport}
                    className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 hover:scale-105 active:scale-95 transition-all"
                  >
                    Export JSON
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setShowTemplates(true)}
            className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-3"
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-8 border-b border-[var(--border)]">
        {(["Rules", "Unmatched", "History"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab
                ? "text-indigo-600"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
            )}
          >
            <div className="flex items-center gap-2">
              {tab === "Rules" && <Zap className="w-3.5 h-3.5" />}
              {tab === "Unmatched" && <Inbox className="w-3.5 h-3.5" />}
              {tab === "History" && <History className="w-3.5 h-3.5" />}
              {tab}
              {tab === "Unmatched" && (
                <span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                  4
                </span>
              )}
            </div>
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>
      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {activeTab === "Rules" && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-10 mt-10"
          >
            {/* Left: Filter & List */}
            <div className="xl:col-span-8 space-y-8">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="relative group flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)] group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[2rem] pl-16 pr-6 py-5 text-sm font-bold tracking-tight focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-[var(--ink-muted)] shadow-sm text-[var(--ink)]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-widest ml-4">
                        Platform
                      </p>
                      <div className="flex bg-[var(--card)] p-1 rounded-[1.2rem] border border-[var(--border)] shadow-sm">
                        {(["All", "Instagram", "Facebook"] as const).map(
                          (platform) => (
                            <button
                              key={platform}
                              onClick={() => setMainPlatformFilter(platform)}
                              className={cn(
                                "px-4 py-2 rounded-[0.8rem] text-[9px] font-black uppercase tracking-widest transition-all min-w-[80px]",
                                mainPlatformFilter === platform
                                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                  : "text-[var(--ink-muted)] hover:text-indigo-500",
                              )}
                            >
                              {platform}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-widest ml-4">
                        Status
                      </p>
                      <div className="flex bg-[var(--card)] p-1 rounded-[1.2rem] border border-[var(--border)] shadow-sm">
                        {(["All", "Active", "Paused", "Draft"] as const).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => setStatusFilter(status)}
                              className={cn(
                                "px-4 py-2 rounded-[0.8rem] text-[9px] font-black uppercase tracking-widest transition-all min-w-[80px]",
                                statusFilter === status
                                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                  : "text-[var(--ink-muted)] hover:text-indigo-500",
                              )}
                            >
                              {status}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((r, idx) => {
                    const isIg = r.platform === "Instagram";
                    const platformTextColor = isIg
                      ? "text-pink-600 dark:text-pink-400"
                      : "text-blue-600 dark:text-blue-400";
                    const platformGlowBg = isIg
                      ? "bg-pink-500/10"
                      : "bg-blue-500/10";
                    const platformBorderColor = isIg
                      ? "border-pink-500/20"
                      : "border-blue-500/20";
                    const platformBarGradient = isIg
                      ? "bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500"
                      : "bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500";
                    const platformIconFillColor = isIg
                      ? "text-pink-500"
                      : "text-blue-500";
                    const triggerStrength =
                      r.triggerCount > 500
                        ? 4
                        : r.triggerCount > 100
                          ? 3
                          : r.triggerCount > 10
                            ? 2
                            : 1;

                    return (
                      <React.Fragment key={r.id}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "neural-card flex flex-col md:flex-row md:items-center justify-between gap-8 group border-l-4 transition-all duration-500",
                            r.status === "Active"
                              ? "border-l-emerald-500 dark:border-l-emerald-600 shadow-sm"
                              : r.status === "Paused"
                                ? "border-l-amber-500 dark:border-l-amber-600 opacity-80"
                                : "border-l-slate-400 dark:border-l-slate-500"
                          )}
                        >
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() =>
                                setSelectedResponderIds((prev) =>
                                  prev.includes(r.id)
                                    ? prev.filter((id) => id !== r.id)
                                    : [...prev, r.id],
                                )
                              }
                              className={cn(
                                "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center shrink-0",
                                selectedResponderIds.includes(r.id)
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "border-[var(--border)] group-hover:border-indigo-400",
                              )}
                            >
                              {selectedResponderIds.includes(r.id) && (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </button>

                            <div
                              className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 duration-500",
                                isIg
                                  ? "bg-gradient-to-tr from-pink-500 to-rose-400 text-white"
                                  : "bg-blue-600 text-white",
                              )}
                            >
                              {isIg ? (
                                <Instagram className="w-8 h-8" />
                              ) : (
                                <Facebook className="w-8 h-8" />
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                                  <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.div
                                      key={r.status}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full ring-4 ring-offset-2 absolute",
                                        r.status === "Active"
                                          ? "bg-emerald-500 ring-emerald-500/20"
                                          : r.status === "Paused"
                                            ? "bg-amber-500 ring-amber-500/20"
                                            : "bg-slate-300 ring-slate-100",
                                      )}
                                    />
                                  </AnimatePresence>
                                </div>
                                <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.2em]">
                                  {r.scope === "All"
                                    ? "All Posts"
                                    : `${r.targetedPostIds?.length || 0} Specific Posts`}
                                </span>

                                <div
                                  className={cn(
                                    "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm",
                                    isIg
                                      ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                                  )}
                                >
                                  {isIg ? (
                                    <Instagram className="w-2.5 h-2.5" />
                                  ) : (
                                    <Facebook className="w-2.5 h-2.5" />
                                  )}
                                  <span>
                                    {isIg ? "IG Engine" : "FB Service"}
                                  </span>
                                </div>

                                {r.verificationStatus && (
                                  <div
                                    className={cn(
                                      "px-2 py-0.5 rounded-md flex items-center gap-1",
                                      r.verificationStatus === "Verified"
                                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                                    )}
                                  >
                                    {r.verificationStatus === "Verified" ? (
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                    ) : (
                                      <AlertCircle className="w-2.5 h-2.5" />
                                    )}
                                    <span className="text-[8px] font-black uppercase tracking-widest">
                                      {r.verificationStatus}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {r.keywords.map((kw) => (
                                  <div
                                    key={kw}
                                    className="bg-[var(--bg)] border border-[var(--border)] px-3 py-1.5 rounded-xl flex items-center gap-2"
                                  >
                                    <Hash className="w-3 h-3 text-[var(--ink-muted)]" />
                                    <span className="text-[10px] font-black text-[var(--ink)] tracking-tight">
                                      {kw}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[10px] text-[var(--ink-muted)] font-medium italic line-clamp-1 max-w-[300px]">
                                  {r.responseTemplates &&
                                  r.responseTemplates.length > 1
                                    ? `${r.responseTemplates.length} variations (e.g. "${r.responseTemplates[0]}")`
                                    : `"${r.responseTemplates?.[0] || ""}"`}
                                </p>
                                {r.responseTemplates && r.responseTemplates.length > 1 && (
                                  <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest rounded-full border shrink-0",
                                    r.randomizeTemplates !== false
                                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
                                      : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
                                  )}>
                                    {r.randomizeTemplates !== false ? "Randomized" : "Sequential"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 lg:gap-8 border-t md:border-t-0 pt-6 md:pt-0 border-[var(--border)] overflow-x-auto">
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-6 lg:gap-8">
                              {/* Success Quality Indicator */}
                              <div className="text-center md:text-right min-w-[70px]">
                                <div
                                  className={cn(
                                    "flex items-center md:justify-end gap-1 mb-1",
                                    platformTextColor,
                                  )}
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                                    Success
                                  </span>
                                </div>
                                <p
                                  className={cn(
                                    "text-base font-black tracking-tighter leading-none italic",
                                    platformTextColor,
                                  )}
                                >
                                  {r.successRate !== undefined
                                    ? `${r.successRate}%`
                                    : "100%"}
                                </p>
                                <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2.5 overflow-hidden md:ml-auto">
                                  <div
                                    className={cn(
                                      "h-full rounded-full",
                                      platformBarGradient,
                                    )}
                                    style={{
                                      width: `${r.successRate !== undefined ? r.successRate : 100}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Dispatch Speed/Latency */}
                              <div className="text-center md:text-right min-w-[70px]">
                                <div
                                  className={cn(
                                    "flex items-center md:justify-end gap-1 mb-1",
                                    platformTextColor,
                                  )}
                                >
                                  <Activity className="w-2.5 h-2.5" />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                                    Latency
                                  </span>
                                </div>
                                <p className="text-sm font-black text-[var(--ink)] tracking-tighter leading-none font-mono">
                                  {r.avgLatency !== undefined
                                    ? `${r.avgLatency}s`
                                    : "0.22s"}
                                </p>
                                <p className="text-[7.5px] text-[var(--ink-muted)] font-black uppercase tracking-wider mt-1.5 scale-90 origin-right">
                                  Speed
                                </p>
                              </div>

                              {/* Click Through Rate Metric */}
                              <div className="text-center md:text-right min-w-[70px]">
                                <div
                                  className={cn(
                                    "flex items-center md:justify-end gap-1 mb-1",
                                    platformTextColor,
                                  )}
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                                    CTR
                                  </span>
                                </div>
                                <p className="text-sm font-black text-[var(--ink)] tracking-tighter leading-none font-mono">
                                  {r.conversionRate !== undefined
                                    ? `${r.conversionRate}%`
                                    : "0%"}
                                </p>
                                <p className="text-[7.5px] text-[var(--ink-muted)] font-black uppercase tracking-wider mt-1.5 scale-90 origin-right">
                                  Engagement
                                </p>
                              </div>

                              {/* Total Triggers column and Sparkline */}
                              <div
                                className="text-center md:text-right relative min-w-[75px]"
                                onMouseEnter={() => setHoveredTriggerId(r.id)}
                                onMouseLeave={() => setHoveredTriggerId(null)}
                              >
                                <div
                                  className={cn(
                                    "flex items-center md:justify-end gap-1 mb-1",
                                    platformTextColor,
                                  )}
                                >
                                  <Zap className="w-2.5 h-2.5 animate-bounce" />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                                    Volume
                                  </span>
                                </div>
                                <p className="text-xl font-black text-[var(--ink)] tracking-tighter italic leading-none cursor-help mb-1">
                                  {r.triggerCount}
                                </p>

                                {/* 4-bar sparkline signal indicator */}
                                <div className="flex items-end gap-0.5 h-2 mt-1.5 md:justify-end">
                                  {[1, 2, 3, 4].map((bar) => (
                                    <div
                                      key={bar}
                                      className={cn(
                                        "w-0.5 rounded-full transition-all duration-300",
                                        bar === 1
                                          ? "h-1"
                                          : bar === 2
                                            ? "h-1.5"
                                            : bar === 3
                                              ? "h-2"
                                              : "h-2.5",
                                        bar <= triggerStrength
                                          ? isIg
                                            ? "bg-gradient-to-t from-pink-500 to-rose-500"
                                            : "bg-gradient-to-t from-blue-600 to-indigo-500"
                                          : "bg-slate-200 dark:bg-slate-800",
                                      )}
                                    />
                                  ))}
                                </div>

                                <AnimatePresence>
                                  {hoveredTriggerId === r.id && (
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        scale: 0.95,
                                        y: 10,
                                      }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                      className="absolute bottom-full mb-4 right-0 bg-[#0f172a] border border-white/10 p-5 rounded-[2rem] shadow-2xl z-50 w-60 text-left pointer-events-none backdrop-blur-xl"
                                    >
                                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                                        <span
                                          className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                                            platformTextColor,
                                          )}
                                        >
                                          {isIg ? (
                                            <Instagram className="w-3.5 h-3.5" />
                                          ) : (
                                            <Facebook className="w-3.5 h-3.5" />
                                          )}
                                          {isIg
                                            ? "Instagram Audit"
                                            : "Facebook Audit"}
                                        </span>
                                        <div
                                          className={cn(
                                            "px-2 py-0.5 rounded-md",
                                            platformGlowBg,
                                          )}
                                        >
                                          <span
                                            className={cn(
                                              "text-[8px] font-black uppercase tracking-widest",
                                              platformTextColor,
                                            )}
                                          >
                                            Active
                                          </span>
                                        </div>
                                      </div>

                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between group/stat">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                            Trigger Volume
                                          </span>
                                          <span className="text-[11px] font-black text-slate-200 font-mono">
                                            {r.triggerCount} runs
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between group/stat">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                            Daily Avg Runs
                                          </span>
                                          <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[11px] font-black text-emerald-400 font-mono">
                                              {(
                                                r.triggerCount /
                                                Math.max(
                                                  1,
                                                  (new Date().getTime() -
                                                    new Date(
                                                      r.createdAt || Date.now(),
                                                    ).getTime()) /
                                                    (1000 * 60 * 60 * 24),
                                                )
                                              ).toFixed(1)}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between group/stat">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                            Delivery Rate
                                          </span>
                                          <span className="text-[11px] font-black text-slate-200 font-mono">
                                            {r.successRate !== undefined
                                              ? `${r.successRate}%`
                                              : "100%"}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between group/stat">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                            Avg Response Time
                                          </span>
                                          <span className="text-[11px] font-black text-slate-200 font-mono">
                                            {r.avgLatency !== undefined
                                              ? `${r.avgLatency}s`
                                              : "0.22s"}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between group/stat">
                                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                            Engagement / CTR
                                          </span>
                                          <span className="text-[11px] font-black text-slate-200 font-mono">
                                            {r.conversionRate !== undefined
                                              ? `${r.conversionRate}%`
                                              : "0%"}
                                          </span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                          <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold italic">
                                            <History className="w-3 h-3 text-indigo-400/50" />
                                            Last trigger: {r.lastTriggered}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="absolute -bottom-1 right-8 w-2 h-2 bg-[#0f172a] rotate-45 border-r border-b border-white/10" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="text-center md:text-right min-w-[80px]">
                                <div className="flex items-center md:justify-end gap-1.5 text-[var(--ink-muted)] mb-2">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span className="text-[8px] font-black uppercase tracking-widest">
                                    Status
                                  </span>
                                </div>
                                <div className="flex md:justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setResponders((prev) =>
                                        prev.map((item) =>
                                          item.id === r.id
                                            ? {
                                                ...item,
                                                status: item.status === "Active" ? "Paused" : "Active",
                                              }
                                            : item
                                        )
                                      );
                                      setSandboxToast(`Rule #${r.id} is now ${r.status === "Active" ? "Paused" : "Active"}`);
                                      setTimeout(() => setSandboxToast(null), 2500);
                                    }}
                                    className="focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-full select-none"
                                    title="Click to toggle Status"
                                  >
                                    <AnimatePresence mode="popLayout" initial={false}>
                                      <motion.span
                                        key={r.status}
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        className={cn(
                                          "px-3 py-1 bg-white hover:bg-slate-50/50 dark:bg-slate-900/50 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm border cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200",
                                          r.status === "Active"
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:border-emerald-500/10"
                                            : r.status === "Paused"
                                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:border-amber-500/10"
                                              : "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:border-slate-500/10",
                                        )}
                                      >
                                        <div
                                          className={cn(
                                            "w-1 h-1 rounded-full",
                                            r.status === "Active"
                                              ? "bg-emerald-500 animate-pulse"
                                              : r.status === "Paused"
                                                ? "bg-amber-500"
                                                : "bg-slate-500",
                                          )}
                                        />
                                        {r.status}
                                      </motion.span>
                                    </AnimatePresence>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  setExpandedNotesId(
                                    expandedNotesId === r.id ? null : r.id,
                                  )
                                }
                                className={cn(
                                  "px-4 h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                  expandedNotesId === r.id
                                    ? "bg-slate-900 text-white shadow-xl"
                                    : "bg-[var(--bg)] text-[var(--ink-muted)] hover:bg-slate-100",
                                )}
                              >
                                <NotebookText className="w-4 h-4" />
                                Notes
                              </button>
                              <button
                                onClick={() => handleEdit(r)}
                                className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none"
                              >
                                <ArrowUpRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>

                        <AnimatePresence>
                          {expandedNotesId === r.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-8 bg-indigo-50/50 dark:bg-indigo-500/5 border-x border-b border-[var(--border)] rounded-b-[2rem] -mt-8 pt-12 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <NotebookText className="w-4 h-4 text-indigo-500" />
                                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                                        Internal Team Notes
                                      </h4>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                                      <p className="text-xs text-[var(--ink)] font-medium leading-relaxed italic">
                                        {r.internalNotes ||
                                          "No internal notes provided for this responder."}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                      <UserCheck className="w-4 h-4 text-emerald-500" />
                                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                                        Audit Trail
                                      </h4>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 overflow-hidden shrink-0">
                                        <img
                                          src={r.updatedBy?.avatar}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <p className="text-[10px] font-black text-[var(--ink)] uppercase tracking-widest">
                                          {r.updatedBy?.name}
                                        </p>
                                        <p className="text-[9px] font-bold text-[var(--ink-muted)] italic">
                                          Last updated {r.updatedBy?.timestamp}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Sandbox Simulator & Live Triggers */}
            <div className="xl:col-span-4 space-y-8">
              {/* Sandbox Simulator */}
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-[var(--border)] shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Command className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[var(--ink)]">
                      Routing Sandbox
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Test post-scoped triggers in real-time
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Post Context Selection Toggle Buttons */}
                  <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => {
                        setSandboxPostIdMode("select");
                        setSandboxResults({ status: "idle" });
                        setSandboxTrace(null);
                      }}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all",
                        sandboxPostIdMode === "select"
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border)]"
                          : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                      )}
                    >
                      Select Post
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSandboxPostIdMode("custom");
                        setSandboxResults({ status: "idle" });
                        setSandboxTrace(null);
                      }}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all",
                        sandboxPostIdMode === "custom"
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-[var(--border)]"
                          : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                      )}
                    >
                      Custom Post ID
                    </button>
                  </div>

                  {sandboxPostIdMode === "select" ? (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                          Target Post Context
                        </label>
                        <select
                          value={sandboxPostId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSandboxPostId(val);
                            setSandboxResults({ status: "idle" });
                            setSandboxTrace(null);
                            if (val === "p3") {
                              setSandboxMessage(
                                "Hey! WHERE is this place located exactly?",
                              );
                            } else if (val === "p12") {
                              setSandboxMessage(
                                "What is the PRICE of this sale item?",
                              );
                            } else {
                              const details = getPostDetails(val);
                              const kws = getRelevantKeywordsForPost(val, details.platform);
                              if (kws.length > 0) {
                                setSandboxMessage(`Tell me more about ${kws[0]}!`);
                              } else {
                                setSandboxMessage("I need INFO about this!");
                              }
                            }
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-2xl px-4 py-3.5 text-xs font-black tracking-tight text-[var(--ink)] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                        >
                          <optgroup label="✨ Standard Mock Posts">
                            {mockPosts.map((p) => (
                              <option
                                key={p.id}
                                value={p.id}
                                className="text-[var(--ink)]"
                              >
                                [{p.platform === "Instagram" ? "IG" : "FB"}] {p.title.length > 32 ? p.title.substring(0, 32) + "..." : p.title} (ID: {p.id})
                              </option>
                            ))}
                          </optgroup>
                          {customTargetedPostIds.length > 0 && (
                            <optgroup label="🔗 Custom Targeted IDs (from Rules)">
                              {customTargetedPostIds.map((c) => (
                                <option
                                  key={c.id}
                                  value={c.id}
                                  className="text-[var(--ink)]"
                                >
                                  [{c.platform === "Instagram" ? "IG" : "FB"}] Custom: {c.id}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                          Target Custom Post ID
                        </label>
                        <input
                          type="text"
                          value={sandboxCustomPostId}
                          onChange={(e) => {
                            setSandboxCustomPostId(e.target.value);
                            setSandboxResults({ status: "idle" });
                            setSandboxTrace(null);
                          }}
                          placeholder="e.g. custom_reel_827"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-2xl px-4 py-3.5 text-xs font-semibold text-[var(--ink)] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                          Target Platform Context
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSandboxPlatform("Instagram");
                              setSandboxResults({ status: "idle" });
                              setSandboxTrace(null);
                            }}
                            className={cn(
                              "flex items-center justify-center gap-2 py-3 border-2 text-[10px] font-black uppercase tracking-wider rounded-2xl transition-all",
                              sandboxPlatform === "Instagram"
                                ? "border-pink-500 bg-pink-50/15 text-pink-600 dark:text-pink-400"
                                : "border-[var(--border)] bg-slate-50/50 dark:bg-slate-950/50 text-[var(--ink-muted)] hover:border-slate-350",
                            )}
                          >
                            <Instagram className="w-3.5 h-3.5" />
                            Instagram
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSandboxPlatform("Facebook");
                              setSandboxResults({ status: "idle" });
                              setSandboxTrace(null);
                            }}
                            className={cn(
                              "flex items-center justify-center gap-2 py-3 border-2 text-[10px] font-black uppercase tracking-wider rounded-2xl transition-all",
                              sandboxPlatform === "Facebook"
                                ? "border-blue-600 bg-blue-50/15 text-blue-600 dark:text-blue-400"
                                : "border-[var(--border)] bg-slate-50/50 dark:bg-slate-950/50 text-[var(--ink-muted)] hover:border-slate-355",
                            )}
                          >
                            <Facebook className="w-3.5 h-3.5" />
                            Facebook
                          </button>
                        </div>
                      </div>

                      {/* Display suggestions for custom post IDs targeted in responders */}
                      {(() => {
                        const untargetedId = sandboxCustomPostId.trim();
                        const isMockPost = mockPosts.some((p) => p.id === untargetedId);
                        const isTargeted = responders.some(
                          (r) => r.scope === "Posts" && r.targetedPostIds?.includes(untargetedId)
                        );
                        if (!isMockPost && !isTargeted && customTargetedPostIds.length > 0) {
                          return (
                            <div className="space-y-1.5 pt-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                                💡 Custom IDs Targeted in Active Rules:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {customTargetedPostIds.map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                      setSandboxCustomPostId(c.id);
                                      setSandboxPlatform(c.platform);
                                      setSandboxResults({ status: "idle" });
                                      setSandboxTrace(null);
                                    }}
                                    className="px-2 py-1 bg-slate-50 dark:bg-slate-950 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-mono transition-all"
                                  >
                                    {c.id}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Platform validation indicator */}
                      {(() => {
                        const val = sandboxCustomPostId.trim();
                        const matchingRules = responders.filter(
                          (r) => r.scope === "Posts" && r.targetedPostIds?.includes(val)
                        );
                        if (matchingRules.length > 0) {
                          const rulePlatforms = Array.from(new Set(matchingRules.map(r => r.platform)));
                          if (rulePlatforms.length === 1 && rulePlatforms[0] !== sandboxPlatform) {
                            return (
                              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl text-[9px] font-semibold flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-250">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  Note: Rules targeting ID "{val}" are set to{" "}
                                  <strong>{rulePlatforms[0]}</strong>. Adjust platform context above to evaluate match.
                                </span>
                              </div>
                            );
                          }
                        }
                        return null;
                      })()}
                    </div>
                  )}

                  {/* Display Current Resolved Context & Keyword Injectors */}
                  {(() => {
                    const idToEvaluate = sandboxPostIdMode === "select" ? sandboxPostId : sandboxCustomPostId.trim();
                    const details = getPostDetails(idToEvaluate);
                    const relevantKeywords = getRelevantKeywordsForPost(details.id, details.platform);
                    const isConfiguredInRules = responders.some(
                      (r) =>
                        r.status === "Active" &&
                        r.platform === details.platform &&
                        (r.scope === "All" || r.targetedPostIds?.includes(details.id))
                    );

                    return (
                      <div className="space-y-3 animate-in fade-in duration-300">
                        {/* The Preview Card */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/45 rounded-2xl border border-[var(--border)] text-left">
                          <img
                            src={details.image}
                            alt=""
                            className="w-16 h-16 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-[var(--border)] self-center sm:self-auto"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest border shrink-0",
                                details.platform === "Instagram"
                                  ? "bg-pink-50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-900/30"
                                  : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30"
                              )}>
                                {details.platform === "Instagram" ? (
                                  <Instagram className="w-2.5 h-2.5" />
                                ) : (
                                  <Facebook className="w-2.5 h-2.5 text-blue-600" />
                                )}
                                {details.platform}
                              </span>
                              <span className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest border shrink-0",
                                details.isCustom 
                                  ? "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30"
                                  : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                              )}>
                                {details.type}
                              </span>
                            </div>
                            <p className="text-xs font-black text-[var(--ink)] truncate">
                              {details.title}
                            </p>
                            <p className="font-mono text-[9px] text-[var(--ink-muted)] font-black">
                              Target ID: <span className="text-indigo-500">{details.id}</span>
                            </p>
                          </div>
                        </div>

                        {/* Rule Linkages indicator */}
                        <div className="bg-slate-50/55 dark:bg-slate-950/25 border border-[var(--border)] rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                              Trigger Simulation Status
                            </span>
                            <span className={cn(
                              "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                              isConfiguredInRules 
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                            )}>
                              {isConfiguredInRules ? "✅ Trigger Ready" : "⚠️ No Specific Rules"}
                            </span>
                          </div>

                          {relevantKeywords.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-[9px] font-bold text-[var(--ink-muted)] italic leading-relaxed">
                                Click any active keyword configured for this specific post/platform to pre-fill the simulator comment:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {relevantKeywords.map((kw) => (
                                  <button
                                    key={kw}
                                    type="button"
                                    onClick={() => {
                                      // Compose an interactive comment containing the keyword
                                      const variations = [
                                        `I need details on ${kw}!`,
                                        `Can you send information about ${kw}?`,
                                        `Interested in ${kw}`,
                                        `Please send me ${kw}`,
                                        `${kw}`,
                                      ];
                                      const randomVar = variations[Math.floor(Math.random() * variations.length)];
                                      setSandboxMessage(randomVar);
                                      setSandboxResults({ status: "idle" });
                                      setSandboxTrace(null);
                                      setSandboxToast(`✍️ Prefilled check for: "${kw}"`);
                                      setTimeout(() => setSandboxToast(null), 1500);
                                    }}
                                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-black tracking-tight transition-all hover:scale-105 active:scale-95 shadow-sm"
                                  >
                                    #{kw}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-[9px] font-bold text-amber-500 italic leading-relaxed">
                              There are no active keyword rules targeting ID "{details.id}" on {details.platform}. Create or activate a rule with matching parameters to simulate triggers.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Simulate Comment Text Input */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                      Simulate Comment Text
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={sandboxMessage}
                        onChange={(e) => setSandboxMessage(e.target.value)}
                        placeholder="e.g. Send details, please!"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-[var(--border)] rounded-2xl px-4 py-3.5 text-xs font-semibold text-[var(--ink)] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleSimulateRouting}
                    disabled={isSandboxProcessing || !sandboxMessage.trim()}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-55 disabled:cursor-not-allowed rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
                  >
                    {isSandboxProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Evaluating Overlaps...
                      </span>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Evaluate & Dispatch DM
                      </>
                    )}
                  </button>
                </div>

                {/* Simulated Outputs & Logs displaying matching results */}
                <AnimatePresence mode="wait">
                  {sandboxResults.status !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border-t border-[var(--border)] pt-5 space-y-4"
                    >
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-indigo-500" />
                        Evaluation Telemetry
                      </p>

                      {sandboxResults.status === "success" &&
                      sandboxResults.matchedRule ? (
                        <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
                          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                              Route Matched Successfully!
                            </span>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-[var(--border)] space-y-2.5">
                            <div className="flex items-center justify-between text-[9px]">
                              <span className="text-slate-400 font-bold uppercase">
                                Trigger Filter:
                              </span>
                              <span className="font-mono bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-black">
                                #{sandboxResults.matchedRule.keywords[0]}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[9px]">
                              <span className="text-slate-400 font-bold uppercase">
                                Target Scope:
                              </span>
                              <span className="font-bold text-[var(--ink-muted)]">
                                {sandboxResults.matchedRule.scope === "All"
                                  ? "🌐 All Posts (Fallback)"
                                  : `📍 Specific Post (${sandboxResults.matchedRule.targetedPostIds?.length} post)`}
                              </span>
                            </div>
                            <div className="h-px bg-[var(--border)] my-1" />
                            <div className="space-y-1">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                📬 Sent DM Variation:
                              </p>
                              <p className="text-xs text-[var(--ink)] font-semibold leading-relaxed italic pr-2">
                                "{sandboxResults.dispatchedReply}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/25 p-4 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            No keyword trigger matched scope
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">
                            "Comment didn't contain active keywords targeted to
                            that post. Logged to Unmatched log queue."
                          </p>
                        </div>
                      )}

                      {/* Diagnostic Trace Steps Accordion */}
                      {sandboxTrace && (
                        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-[var(--border)] p-4 space-y-3">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                            <span className="flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-indigo-500" />
                              Diagnostic Evaluation Trace
                            </span>
                            <span className="font-mono text-indigo-500">
                              Active Rules Checked: {sandboxTrace.totalScanned}
                            </span>
                          </div>
                          
                          <div className="h-px bg-[var(--border)]" />
                          
                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {sandboxTrace.rulesEvaluated.map((t: any, index: number) => (
                              <div 
                                key={t.ruleId || index}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[var(--border)] text-left space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className={cn(
                                      "w-2 h-2 rounded-full",
                                      t.matched ? "bg-emerald-500 animate-pulse" : "bg-rose-450"
                                    )} />
                                    <span className="text-[10px] font-extrabold text-[var(--ink)]">
                                      Rule #{t.ruleId}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-400">
                                      ({t.keywords.slice(0, 3).join(", ")})
                                    </span>
                                  </div>
                                  <span className={cn(
                                    "text-[7px] font-black uppercase px-2 py-0.5 rounded border tracking-widest",
                                    t.matched 
                                      ? "bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30" 
                                      : "bg-rose-50 dark:bg-rose-950/25 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30"
                                  )}>
                                    {t.matched ? "MATCHED" : "SKIPPED"}
                                  </span>
                                </div>
                                
                                <div className="text-[9px] font-semibold space-y-1 pl-3.5">
                                  <div className="flex items-center gap-2 text-slate-400">
                                    <span>Platform: <strong>{t.platform}</strong></span>
                                    <span>•</span>
                                    <span>Scope: <strong>{t.scope}</strong></span>
                                  </div>
                                  {t.reasons.map((reason: string, rIdx: number) => (
                                    <div key={rIdx} className="flex items-start gap-1 text-[8.5px] leading-relaxed">
                                      <span className={t.matched ? "text-emerald-500" : "text-amber-500"}>
                                        {t.matched ? "✓" : "•"}
                                      </span>
                                      <span className={t.matched ? "text-slate-650 dark:text-slate-400" : "text-amber-600/90 dark:text-amber-400/80"}>
                                        {reason}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Local Mini-Toast */}
                <AnimatePresence>
                  {sandboxToast && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center shadow-lg shadow-indigo-500/20"
                    >
                      {sandboxToast}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Live Triggers Feed Log */}
              <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden h-[380px] flex flex-col shadow-2xl border border-white/5">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                      Live Triggers Stream
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-2">
                  {liveStream.map((activity, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={`${activity.user}-${i}`}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between px-2 text-white/30 text-[9px]">
                        <span className="font-black uppercase tracking-widest">
                          {activity.user}
                        </span>
                        <span className="font-mono">{activity.time}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-[1.2rem]">
                        <p className="text-[11px] text-white/90 leading-relaxed font-mono italic">
                          "{activity.msg}"
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <Zap className="w-3 h-3 text-indigo-400" />
                          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                            Matched: #{activity.kw}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Unmatched" && (
          <motion.div
            key="unmatched"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-10 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[var(--ink)] tracking-tight italic">
                  Unmatched Queries
                </h2>
                <p className="text-[var(--ink-muted)] text-sm font-medium">
                  Messages that didn't trigger any keyword. Use these to
                  discover new potentials.
                </p>
              </div>
              <button
                onClick={() => setShowDiscoveryPanel(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 animate-pulse"
              >
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                AI Cluster Discovery
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unmatchedQueries.map((q, idx) => (
                <div
                  key={q.id}
                  className="neural-card group flex items-center justify-between gap-6 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                          {q.user}
                        </span>
                        <div className="h-2 w-px bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400">
                          {q.timestamp}
                        </span>
                      </div>
                      <p className="text-sm font-black text-[var(--ink)] italic leading-none">
                        "{q.text}"
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Seen {q.frequency} times
                        </span>
                        <div className="w-1 h-1 rounded-full bg-rose-500/50" />
                        {q.platform === "Instagram" ? (
                          <Instagram className="w-2.5 h-2.5 text-pink-500/50" />
                        ) : (
                          <Facebook className="w-2.5 h-2.5 text-blue-600/50" />
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddRuleFromUnmatched(q)}
                    className="px-5 h-12 bg-indigo-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    Add Rule
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "History" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-10 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[var(--ink)] tracking-tight italic">
                    Reply History
                  </h2>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                      Audit Log of AI & Static Responses
                    </p>
                    <div className="h-3 w-px bg-[var(--border)]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest">
                        Sort by:
                      </span>
                      {(["timestamp", "user", "type", "feedback"] as const).map(
                        (field) => (
                          <button
                            key={field}
                            onClick={() => {
                              if (historySortField === field) {
                                setHistorySortOrder((prev) =>
                                  prev === "asc" ? "desc" : "asc",
                                );
                              } else {
                                setHistorySortField(field);
                                setHistorySortOrder("desc");
                              }
                            }}
                            className={cn(
                              "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all flex items-center gap-1",
                              historySortField === field
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                : "text-[var(--ink-muted)] hover:text-indigo-500 hover:bg-indigo-50",
                            )}
                          >
                            {field}
                            {historySortField === field &&
                              (historySortOrder === "asc" ? (
                                <ChevronUp className="w-2 h-2" />
                              ) : (
                                <ChevronDown className="w-2 h-2" />
                              ))}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elevated History Dashboard Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-3xl flex flex-col justify-between">
                <span className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-wider">
                  Total Actions
                </span>
                <p className="text-2xl font-black text-[var(--ink)] tracking-tight font-mono mt-2">
                  {historyLogs.length}
                </p>
                <p className="text-[8px] text-[var(--ink-muted)] mt-1">
                  Direct replies logged
                </p>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-3xl flex flex-col justify-between">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">
                  AI Delegations
                </span>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight font-mono mt-2">
                  {historyLogs.filter((l) => l.type === "AI").length}
                </p>
                <p className="text-[8px] text-[var(--ink-muted)] mt-1">
                  {Math.round(
                    (historyLogs.filter(
                      (l) => l.type === "AI" && l.feedback === "Positive",
                    ).length /
                      Math.max(
                        1,
                        historyLogs.filter((l) => l.type === "AI").length,
                      )) *
                      100,
                  )}
                  % positive rating
                </p>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-3xl flex flex-col justify-between">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-wider">
                  Static Matches
                </span>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight font-mono mt-2">
                  {historyLogs.filter((l) => l.type === "Static").length}
                </p>
                <p className="text-[8px] text-[var(--ink-muted)] mt-1">
                  Predefined rule triggers
                </p>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-3xl flex flex-col justify-between">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider">
                  Requires Review
                </span>
                <p className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono mt-2">
                  {historyLogs.filter((l) => l.feedback === "Negative").length}
                </p>
                <p className="text-[8px] text-rose-500/70 mt-1">
                  Negative feedback flagged
                </p>
              </div>
            </div>

            {/* Advanced Multi-Filtering Live Controls */}
            <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl space-y-6">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                {/* Status Engine Filter Group */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                    Status Filter (Engine)
                  </span>
                  <div className="grid grid-cols-3 gap-2 bg-[var(--bg)] p-1 rounded-2xl border border-[var(--border)]">
                    {(["All", "AI", "Static"] as const).map((t) => {
                      const isActive = historyTypeFilter === t;
                      const count =
                        t === "All"
                          ? historyLogs.length
                          : historyLogs.filter((l) => l.type === t).length;
                      return (
                        <button
                          key={t}
                          onClick={() => setHistoryTypeFilter(t)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            isActive
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                              : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                          )}
                        >
                          <span>{t === "All" ? "All Status" : t}</span>
                          <span
                            className={cn(
                              "text-[8px] font-mono px-1.5 py-0.5 rounded-md",
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-[var(--card)] border border-[var(--border)] text-[var(--ink-muted)]",
                            )}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback Quality Filter Group */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Feedback Filter (Audit)
                  </span>
                  <div className="flex flex-wrap gap-2 bg-[var(--bg)] p-1 rounded-2xl border border-[var(--border)]">
                    {(["All", "Positive", "Negative", "Unrated"] as const).map(
                      (f) => {
                        const isActive = historyFeedbackFilter === f;
                        const count =
                          f === "All"
                            ? historyLogs.length
                            : f === "Unrated"
                              ? historyLogs.filter(
                                  (l) =>
                                    l.feedback === null ||
                                    l.feedback === undefined,
                                ).length
                              : historyLogs.filter((l) => l.feedback === f)
                                  .length;

                        return (
                          <button
                            key={f}
                            onClick={() => setHistoryFeedbackFilter(f)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                              isActive
                                ? f === "Positive"
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                                  : f === "Negative"
                                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/10"
                                    : "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                            )}
                          >
                            <span className="capitalize">
                              {f === "All" ? "All Feedback" : f}
                            </span>
                            <span
                              className={cn(
                                "text-[8px] font-mono px-1.5 py-0.5 rounded-md",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--ink-muted)]",
                              )}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              {/* Dedicated AI-Failure Targeting Presets */}
              <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-wider">
                    Audit Presets:
                  </span>
                  <button
                    onClick={() => {
                      setHistoryTypeFilter("AI");
                      setHistoryFeedbackFilter("Negative");
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border",
                      historyTypeFilter === "AI" &&
                        historyFeedbackFilter === "Negative"
                        ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10"
                        : "bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10",
                    )}
                  >
                    <AlertCircle className="w-3 h-3" />
                    🔴 AI Failures Block (
                    {
                      historyLogs.filter(
                        (l) => l.type === "AI" && l.feedback === "Negative",
                      ).length
                    }
                    )
                  </button>
                  <button
                    onClick={() => {
                      setHistoryTypeFilter("Static");
                      setHistoryFeedbackFilter("Negative");
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border",
                      historyTypeFilter === "Static" &&
                        historyFeedbackFilter === "Negative"
                        ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/10"
                        : "bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/10 hover:bg-amber-500/10",
                    )}
                  >
                    <AlertCircle className="w-3 h-3" />
                    🟠 Static Failures (
                    {
                      historyLogs.filter(
                        (l) => l.type === "Static" && l.feedback === "Negative",
                      ).length
                    }
                    )
                  </button>
                  <button
                    onClick={() => {
                      setHistoryTypeFilter("All");
                      setHistoryFeedbackFilter("Positive");
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border",
                      historyTypeFilter === "All" &&
                        historyFeedbackFilter === "Positive"
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                        : "bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-muted)] hover:text-emerald-500",
                    )}
                  >
                    <ThumbsUp className="w-3 h-3 text-emerald-500" />⭐ Top
                    Rated Reactions (
                    {
                      historyLogs.filter((l) => l.feedback === "Positive")
                        .length
                    }
                    )
                  </button>
                </div>

                <button
                  onClick={() => {
                    setHistoryTypeFilter("All");
                    setHistoryFeedbackFilter("All");
                  }}
                  className="text-[9px] font-black text-indigo-500 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all font-mono"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Render Log Cards Listing */}
            {sortedHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="neural-card flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-[var(--border)] bg-[var(--card)]"
              >
                <div className="w-20 h-20 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-600 mb-6 relative">
                  <FileSearch className="w-10 h-10 text-indigo-400/80 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-bounce" />
                </div>
                <h3 className="text-base font-black text-[var(--ink)] mb-2 tracking-tight">
                  No actions match your audit rules
                </h3>
                <p className="text-xs text-[var(--ink-muted)] mb-8 max-w-md leading-relaxed">
                  Try adjusting your Status Filter (current:{" "}
                  <b className="text-indigo-500 font-mono">
                    {historyTypeFilter}
                  </b>
                  ) or Feedback Filter (current:{" "}
                  <b className="text-indigo-500 font-mono">
                    {historyFeedbackFilter}
                  </b>
                  ) to view other activity records.
                </p>
                <button
                  onClick={() => {
                    setHistoryTypeFilter("All");
                    setHistoryFeedbackFilter("All");
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 hover:scale-105"
                >
                  Reset History Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedHistory.map((log, idx) => {
                  const isNegative = log.feedback === "Negative";
                  const isPositive = log.feedback === "Positive";

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "neural-card group p-0 overflow-hidden border transition-all flex flex-col",
                        isNegative
                          ? "border-rose-500/30 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/10"
                          : isPositive
                            ? "border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
                            : "border-[var(--border)] hover:border-indigo-500/30",
                      )}
                    >
                      <div className="p-6 border-b border-[var(--border)] bg-[var(--bg)]/30 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--border)] shrink-0">
                                <img
                                  src={log.userAvatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-[var(--ink)]">
                                  @{log.user}
                                </p>
                                <span className="text-[8px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">
                                  {log.timestamp}
                                </span>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border",
                                log.type === "AI"
                                  ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              )}
                            >
                              {log.type} delegation
                            </div>
                          </div>

                          {/* Error Callout Banner for Poor AI Responses */}
                          {isNegative && (
                            <div className="mb-4 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest leading-none">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500 animate-pulse" />
                              <span>Poor Response Quality Detected</span>
                            </div>
                          )}

                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                              User Comment
                            </span>
                            <p className="text-xs text-[var(--ink)] font-semibold italic bg-[var(--bg)]/40 p-3 rounded-xl border border-[var(--border)]/40 leading-relaxed mb-4">
                              "{log.message}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 border-t border-[var(--border)] pt-4 mt-2">
                          <Zap
                            className={cn(
                              "w-4 h-4 shrink-0 mt-0.5",
                              isNegative ? "text-rose-500" : "text-indigo-500",
                            )}
                          />
                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest">
                              Matched keyword{" "}
                              <b className="text-indigo-500 font-mono">
                                #{log.keyword}
                              </b>
                            </span>
                            <p
                              className={cn(
                                "text-xs font-bold leading-normal",
                                isNegative
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-[var(--ink)]",
                              )}
                            >
                              "{log.reply}"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "px-6 py-4 border-t flex flex-col gap-3.5",
                          isNegative
                            ? "bg-rose-500/[0.02]"
                            : isPositive
                              ? "bg-emerald-500/[0.02]"
                              : "bg-indigo-50/30 dark:bg-slate-900",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full animate-ping",
                                isNegative
                                  ? "bg-rose-500"
                                  : isPositive
                                    ? "bg-emerald-500"
                                    : "bg-slate-400",
                              )}
                            />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                              Live Audit Quality
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] p-1 rounded-xl">
                            <button
                              onClick={() =>
                                toggleHistoryFeedback(log.id, "Positive")
                              }
                              className={cn(
                                "p-2 rounded-lg transition-all active:scale-95",
                                isPositive
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                  : "text-[var(--ink-muted)] hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800",
                              )}
                              title="Mark as Positive AI Response"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                toggleHistoryFeedback(log.id, "Negative")
                              }
                              className={cn(
                                "p-2 rounded-lg transition-all active:scale-95",
                                isNegative
                                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                                  : "text-[var(--ink-muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800",
                              )}
                              title="Mark as Poor/Negative Response"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Fix CTA Button */}
                        <button
                          onClick={() => handleFixResponder(log)}
                          className={cn(
                            "w-full py-2.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer",
                            isNegative
                              ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20"
                              : "bg-[var(--bg)] border border-[var(--border)] text-[var(--ink)] hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-500",
                          )}
                        >
                          {isNegative ? (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
                              <span>Fix Associated Responder Rule Now</span>
                            </>
                          ) : (
                            <>
                              <Cpu className="w-3.5 h-3.5" />
                              <span>Tune Responder Keyword Rule</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              className="bg-white w-full max-w-5xl rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32" />

              <div className="relative z-10 flex flex-col h-full text-[var(--ink)]">
                <div className="flex items-center justify-between mb-12">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Command className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-3xl font-black text-[var(--ink)] tracking-tight flex items-center flex-wrap gap-2">
                        <span>
                          {editingResponderId
                            ? "Edit Auto-Reply"
                            : "New Auto-Reply"}
                        </span>
                        {selectedTemplateName && (
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 uppercase tracking-widest px-3 py-1.5 rounded-xl font-mono">
                            Template: {selectedTemplateName}
                          </span>
                        )}
                      </h2>
                    </div>
                    <p className="text-sm text-[var(--ink-muted)] font-medium tracking-tight">
                      {editingResponderId
                        ? "Update your current automation settings."
                        : "Set up a new automatic reply."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setEditingResponderId(null);
                      setNewKeywords("");
                      setNewResponseTemplates([
                        {
                          id: Math.random().toString(36).substr(2, 9),
                          text: "",
                        },
                      ]);
                      setSelectedPosts([]);
                      setSelectedTemplateName(null);
                    }}
                    className="w-12 h-12 bg-[var(--bg)] hover:bg-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--ink-muted)] transition-all font-black"
                  >
                    X
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  {/* CONFIGURATION */}
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                        Social Apps
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            setNewPlatform("Instagram");
                            validateKeywords(
                              newKeywords,
                              newScope,
                              selectedPosts,
                              "Instagram",
                            );
                          }}
                          className={cn(
                            "group p-6 rounded-[2rem] border-2 flex items-center gap-5 transition-all text-left",
                            newPlatform === "Instagram"
                              ? "border-indigo-600 bg-indigo-50/50"
                              : "border-[var(--border)] bg-[var(--bg)] text-[var(--ink-muted)]",
                          )}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shadow-xl transition-all",
                              newPlatform === "Instagram"
                                ? "bg-indigo-600 text-white"
                                : "bg-[var(--card)] text-slate-200",
                            )}
                          >
                            <Instagram className="w-6 h-6" />
                          </div>
                          <span
                            className={cn(
                              "text-[12px] font-black uppercase tracking-widest",
                              newPlatform === "Instagram"
                                ? "text-indigo-900 dark:text-indigo-400"
                                : "",
                            )}
                          >
                            Instagram
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setNewPlatform("Facebook");
                            validateKeywords(
                              newKeywords,
                              newScope,
                              selectedPosts,
                              "Facebook",
                            );
                          }}
                          className={cn(
                            "group p-6 rounded-[2rem] border-2 flex items-center gap-5 transition-all text-left",
                            newPlatform === "Facebook"
                              ? "border-indigo-600 bg-indigo-50/50"
                              : "border-[var(--border)] bg-[var(--bg)] text-[var(--ink-muted)]",
                          )}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shadow-xl transition-all",
                              newPlatform === "Facebook"
                                ? "bg-indigo-600 text-white"
                                : "bg-[var(--card)] text-slate-200",
                            )}
                          >
                            <Facebook className="w-6 h-6" />
                          </div>
                          <span
                            className={cn(
                              "text-[12px] font-black uppercase tracking-widest",
                              newPlatform === "Facebook"
                                ? "text-indigo-900 dark:text-indigo-400"
                                : "",
                            )}
                          >
                            Facebook
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-[var(--bg)] border border-[var(--border)] p-8 rounded-[2.5rem] space-y-6 relative group/variations">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover/variations:bg-indigo-500/10 transition-colors" />
                        <div className="flex items-center justify-between relative z-10">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">
                              Auto Reply Variations
                            </p>
                            <p className="text-[9px] text-[var(--ink-muted)] font-black uppercase tracking-tight">
                              Picked {newRandomizeTemplates ? "at random" : "sequentially"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap font-sans">
                            <button
                              type="button"
                              onClick={() => {
                                if (newResponseTemplates.length < 2) return;
                                const shuffled = [...newResponseTemplates];
                                for (let i = shuffled.length - 1; i > 0; i--) {
                                  const j = Math.floor(Math.random() * (i + 1));
                                  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                                }
                                setNewResponseTemplates(shuffled);
                              }}
                              className="px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 border border-indigo-100 dark:border-indigo-900/40 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                              title="Shuffle variation template order"
                            >
                              <Sparkles className="w-3 h-3" /> Shuffle
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = newResponseTemplates.filter(
                                  (t) => t.text.trim(),
                                );
                                if (filtered.length > 0) {
                                  const index = newRandomizeTemplates 
                                    ? Math.floor(Math.random() * filtered.length)
                                    : 0;
                                  const picked = filtered[index].text;
                                  alert(
                                    `Simulation: System picked variation (${newRandomizeTemplates ? "Random" : "First Preferred"})\n\n"${picked}"`,
                                  );
                                } else {
                                  alert(
                                    "Enter at least one variation to test.",
                                  );
                                }
                              }}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2"
                            >
                              <PlayCircle className="w-3 h-3" /> Test Selection
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newId = Math.random()
                                  .toString(36)
                                  .substr(2, 9);
                                setNewResponseTemplates([
                                  ...newResponseTemplates,
                                  { id: newId, text: "" },
                                ]);
                                setLastAddedId(newId);
                                setTimeout(() => setLastAddedId(null), 3000);
                              }}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                            >
                              <Plus className="w-3 h-3" /> Add Variation
                            </button>
                          </div>
                        </div>
                        <div className="space-y-4 relative z-10">
                          <Reorder.Group
                            axis="y"
                            values={newResponseTemplates}
                            onReorder={setNewResponseTemplates}
                            className="space-y-4"
                          >
                            <AnimatePresence mode="popLayout">
                              {newResponseTemplates.map((template, idx) => (
                                <Reorder.Item
                                  key={template.id}
                                  value={template}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className="relative group/var"
                                >
                                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-200 group-focus-within/var:bg-indigo-500 transition-colors" />
                                  {lastAddedId === template.id && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="absolute -top-2 left-6 bg-emerald-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full z-20 shadow-sm"
                                    >
                                      New Variation
                                    </motion.div>
                                  )}
                                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 p-2 text-[var(--ink-muted)] opacity-0 group-hover/var:opacity-100 transition-all cursor-grab active:cursor-grabbing">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <textarea
                                    value={template.text}
                                    onChange={(e) => {
                                      setNewResponseTemplates((prev) =>
                                        prev.map((t) =>
                                          t.id === template.id
                                            ? { ...t, text: e.target.value }
                                            : t,
                                        ),
                                      );
                                    }}
                                    placeholder={`Variation #${idx + 1}...`}
                                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl px-5 py-4 pr-12 text-xs font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm min-h-[90px] text-[var(--ink)] resize-none transition-all placeholder:text-[var(--ink-muted)]/40"
                                  />
                                  <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-0 group-hover/var:opacity-100 transition-opacity">
                                    {idx > 0 && (
                                      <button
                                        onClick={() => moveTemplate(idx, "up")}
                                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Move Up"
                                      >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    {idx < newResponseTemplates.length - 1 && (
                                      <button
                                        onClick={() =>
                                          moveTemplate(idx, "down")
                                        }
                                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Move Down"
                                      >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                    {newResponseTemplates.length > 1 && (
                                      <button
                                        onClick={() =>
                                          setNewResponseTemplates(
                                            newResponseTemplates.filter(
                                              (_, i) => i !== idx,
                                            ),
                                          )
                                        }
                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all mt-1"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="absolute bottom-3 right-4 px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-md opacity-0 group-hover/var:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest italic">
                                      v{idx + 1}
                                    </span>
                                  </div>
                                </Reorder.Item>
                              ))}
                            </AnimatePresence>
                          </Reorder.Group>
                        </div>
                        <div className="pt-2 flex items-start gap-3 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-indigo-700/80 font-bold leading-relaxed italic">
                            System rotates variations to prevent "bot-like"
                            behavior. We recommend at least 3 variations for
                            maximum security.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between relative z-10">
                          <div className="space-y-1 max-w-[70%]">
                            <p className="text-[10px] font-black text-[var(--ink)] uppercase tracking-wider">
                              Randomize Selection Order
                            </p>
                            <p className="text-[9px] text-[var(--ink-muted)] font-bold italic leading-relaxed">
                              Toggle whether the automation picks templates completely randomly (recommended for natural-sounding replies) or cycles sequentially.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewRandomizeTemplates(!newRandomizeTemplates)}
                            className={cn(
                              "w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 outline-none border border-[var(--border)]",
                              newRandomizeTemplates ? "bg-indigo-600 border-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                            )}
                          >
                            <div
                              className={cn(
                                "w-4 h-4 bg-white rounded-full absolute top-[3px] transition-all duration-300 shadow-md",
                                newRandomizeTemplates ? "right-1" : "left-1"
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                        Status
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {(["Active", "Paused", "Draft"] as Status[]).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() => setNewStatus(status)}
                              className={cn(
                                "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                newStatus === status
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                                  : "bg-[var(--card)] border-[var(--border)] text-[var(--ink-muted)] hover:border-slate-300",
                              )}
                            >
                              {status}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                        Engagement Refinements
                      </label>
                      <div className="grid grid-cols-1 gap-4">
                        <div
                          className={cn(
                            "p-6 rounded-[2rem] border-2 transition-all cursor-pointer",
                            newAutoLike
                              ? "border-emerald-500 bg-emerald-50/50"
                              : "border-[var(--border)] bg-[var(--bg)]",
                          )}
                          onClick={() => setNewAutoLike(!newAutoLike)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center",
                                  newAutoLike
                                    ? "bg-emerald-500 text-white"
                                    : "bg-[var(--card)] text-[var(--ink-muted)]",
                                )}
                              >
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-[var(--ink)]">
                                  Auto-Like Comment
                                </p>
                                <p className="text-[10px] text-[var(--ink-muted)] font-medium italic">
                                  Automatically like the user's comment when a
                                  keyword is triggered.
                                </p>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "w-12 h-6 rounded-full relative transition-all shrink-0",
                                newAutoLike
                                  ? "bg-emerald-500"
                                  : "bg-[var(--border)]",
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                  newAutoLike ? "left-7" : "left-1",
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "p-6 rounded-[2rem] border-2 transition-all",
                            newPublicReply
                              ? "border-indigo-600 bg-indigo-50/50"
                              : "border-[var(--border)] bg-[var(--bg)]",
                          )}
                        >
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setNewPublicReply(!newPublicReply)}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center",
                                  newPublicReply
                                    ? "bg-indigo-600 text-white"
                                    : "bg-[var(--card)] text-[var(--ink-muted)]",
                                )}
                              >
                                <MessageSquare className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-[var(--ink)]">
                                  Public Reply to Comment
                                </p>
                                <p className="text-[10px] text-[var(--ink-muted)] font-medium italic">
                                  Post a public reply to the comment to boost
                                  visibility.
                                </p>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "w-12 h-6 rounded-full relative transition-all shrink-0",
                                newPublicReply
                                  ? "bg-indigo-600"
                                  : "bg-[var(--border)]",
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                  newPublicReply ? "left-7" : "left-1",
                                )}
                              />
                            </div>
                          </div>

                          {newPublicReply && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-6 pt-6 border-t border-indigo-100"
                            >
                              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">
                                Public Reply Template
                              </p>
                              <textarea
                                value={newPublicReplyText}
                                onChange={(e) =>
                                  setNewPublicReplyText(e.target.value)
                                }
                                placeholder="e.g. Just sent you a DM! Check your inbox 📩"
                                className="w-full bg-[var(--card)] border border-indigo-200 rounded-xl px-4 py-3 text-[11px] font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none shadow-sm min-h-[80px] text-[var(--ink)]"
                              />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                        Where to look?
                      </label>
                      <div className="flex bg-[var(--bg)] p-2 rounded-[1.8rem] border border-[var(--border)] shadow-inner">
                        <button
                          onClick={() => {
                            setNewScope("All");
                            validateKeywords(newKeywords, "All", selectedPosts);
                          }}
                          className={cn(
                            "flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all",
                            newScope === "All"
                              ? "bg-[var(--card)] shadow-xl text-indigo-600"
                              : "text-[var(--ink-muted)]",
                          )}
                        >
                          All Posts
                        </button>
                        <button
                          onClick={() => {
                            setNewScope("Posts");
                            validateKeywords(
                              newKeywords,
                              "Posts",
                              selectedPosts,
                            );
                          }}
                          className={cn(
                            "flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            newScope === "Posts"
                              ? "bg-[var(--card)] shadow-xl text-indigo-600"
                              : "text-[var(--ink-muted)]",
                          )}
                        >
                          Pick Posts
                          {selectedPosts.length > 0 && (
                            <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px] animate-in zoom-in duration-300">
                              {selectedPosts.length}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Choose Keywords
                      </label>
                      <div className="relative">
                        <Hash
                          className={cn(
                            "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                            keywordError ? "text-rose-400" : "text-indigo-300",
                          )}
                        />
                        <input
                          type="text"
                          placeholder="e.g. PRICING, BOOKING, DEMO"
                          value={newKeywords}
                          onChange={(e) => {
                            setNewKeywords(e.target.value);
                            validateKeywords(e.target.value);
                          }}
                          className={cn(
                            "w-full bg-slate-50 border-none rounded-[1.8rem] pl-16 pr-8 py-5 text-sm font-black tracking-tight focus:ring-4 transition-all shadow-inner text-slate-900",
                            keywordError
                              ? "ring-4 ring-rose-500/20 bg-rose-50/30 placeholder:text-rose-300"
                              : "focus:ring-indigo-500/10 placeholder:text-slate-300",
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-3 px-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-slate-400 font-medium italic uppercase tracking-wider">
                            Separate with commas.
                          </p>
                          {keywordError && (
                            <motion.p
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-[10px] text-rose-500 font-black uppercase tracking-widest"
                            >
                              {keywordError}
                            </motion.p>
                          )}
                        </div>

                        {/* Keyword Scope Intelligence Card */}
                        {keywordInsights.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-2 mt-2">
                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                              Keyword Scope Router Analyzer
                            </p>
                            <div className="space-y-2.5 max-h-[160px] overflow-y-auto scrollbar-hide pr-1">
                              {keywordInsights.map((ins, i) => (
                                <div
                                  key={i}
                                  className="flex gap-2.5 items-start text-[10px] leading-relaxed font-semibold"
                                >
                                  {ins.type === "success" ? (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                  ) : ins.type === "warning" ? (
                                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                  )}
                                  <div className="space-y-0.5">
                                    <span className="font-mono text-[8px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1 py-0.5 rounded mr-1">
                                      #{ins.keyword}
                                    </span>
                                    <span className="text-slate-600 dark:text-slate-300">
                                      {ins.text}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={handleCreate}
                        disabled={!newKeywords.trim()}
                        className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(15,23,42,0.3)] hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingResponderId
                          ? "Update Automation"
                          : "Save and Start"}
                      </button>
                    </div>
                  </div>

                  {/* TARGET SELECTION */}
                  <div className="bg-[var(--bg)]/50 rounded-[3rem] border border-[var(--border)] p-10 flex flex-col h-full overflow-hidden min-h-[500px]">
                    {newScope === "All" ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center gap-10 p-10 mt-auto mb-auto">
                        <div className="relative">
                          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
                          <div className="w-28 h-28 bg-[var(--card)] rounded-[2.5rem] shadow-2xl flex items-center justify-center text-indigo-500 relative z-10 border border-[var(--border)]">
                            <Zap className="w-12 h-12" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-[var(--ink)] tracking-tight italic">
                            Smart Mode
                          </h3>
                          <p className="text-xs text-[var(--ink-muted)] font-medium leading-relaxed max-w-xs mx-auto italic">
                            System will monitor every interaction across your
                            entire social environment.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                          <div className="space-y-1">
                            <h3 className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em]">
                              Post Selection
                            </h3>
                            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest italic leading-none">
                              Choose Targets
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p
                                className={cn(
                                  "text-3xl font-black leading-none italic transition-colors",
                                  selectedPosts.length > 0
                                    ? "text-indigo-600"
                                    : "text-[var(--ink-muted)] opacity-30",
                                )}
                              >
                                {selectedPosts.length}
                              </p>
                              <p className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest mt-1">
                                Posts Linked
                              </p>
                            </div>
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                                selectedPosts.length > 0
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20"
                                  : "bg-[var(--bg)] text-[var(--ink-muted)] border-[var(--border)] opacity-30",
                              )}
                            >
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                          </div>
                        </div>

                        {/* Target Selection Method Switcher */}
                        <div className="flex bg-[var(--card)] p-1.5 rounded-2xl border border-[var(--border)] shadow-inner mb-6 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setPostTargetMethod("gallery");
                              setShowSelectedOnly(false);
                            }}
                            className={cn(
                              "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              postTargetMethod === "gallery"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10"
                                : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                            )}
                          >
                            Select from List
                          </button>
                          <button
                            type="button"
                            onClick={() => setPostTargetMethod("manual")}
                            className={cn(
                              "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              postTargetMethod === "manual"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10"
                                : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                            )}
                          >
                            Input Post IDs Manually
                          </button>
                        </div>

                        {postTargetMethod === "gallery" ? (
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
                                <button
                                  onClick={() => setShowSelectedOnly(false)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    !showSelectedOnly
                                      ? "bg-indigo-600 text-white shadow-md"
                                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                                  )}
                                >
                                  All
                                </button>
                                <button
                                  onClick={() => setShowSelectedOnly(true)}
                                  className={cn(
                                    "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    showSelectedOnly
                                      ? "bg-indigo-600 text-white shadow-md"
                                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                                  )}
                                >
                                  Review{" "}
                                  {selectedPosts.length > 0 &&
                                    `(${selectedPosts.length})`}
                                </button>
                              </div>

                              <div className="h-6 w-px bg-[var(--border)]" />

                              <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
                                {(
                                  ["All", "Instagram", "Facebook"] as const
                                ).map((p) => (
                                  <button
                                    key={p}
                                    onClick={() => setPostPlatformFilter(p)}
                                    className={cn(
                                      "px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                      postPlatformFilter === p
                                        ? "bg-slate-900 dark:bg-indigo-900/50 text-white"
                                        : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                                    )}
                                  >
                                    {p === "All" ? "Platform" : p}
                                  </button>
                                ))}
                              </div>

                              <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
                                {(["All", "Post", "Reel"] as const).map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => setPostTypeFilter(t)}
                                    className={cn(
                                      "px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                      postTypeFilter === t
                                        ? "bg-slate-900 dark:bg-indigo-900/50 text-white"
                                        : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
                                    )}
                                  >
                                    {t === "All" ? "Format" : t}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                              <div className="flex items-center gap-6">
                                <button
                                  onClick={() => {
                                    const pagedIds = pagedPosts.map(
                                      (p) => p.id,
                                    );
                                    const allPagedSelected = pagedIds.every(
                                      (id) => selectedPosts.includes(id),
                                    );
                                    if (allPagedSelected) {
                                      setSelectedPosts((prev) =>
                                        prev.filter(
                                          (id) => !pagedIds.includes(id),
                                        ),
                                      );
                                    } else {
                                      setSelectedPosts((prev) => [
                                        ...new Set([...prev, ...pagedIds]),
                                      ]);
                                    }
                                  }}
                                  className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                >
                                  <div className="w-4 h-4 rounded-md border-2 border-indigo-500/30 flex items-center justify-center">
                                    {pagedPosts.length > 0 &&
                                    pagedPosts.every((p) =>
                                      selectedPosts.includes(p.id),
                                    ) ? (
                                      <CheckCircle2 className="w-3 h-3 text-indigo-500 fill-indigo-500/10" />
                                    ) : null}
                                  </div>
                                  Select Page
                                </button>

                                <button
                                  onClick={() => {
                                    const matched = filteredPosts.map(
                                      (p) => p.id,
                                    );
                                    setSelectedPosts((prev) => [
                                      ...new Set([...prev, ...matched]),
                                    ]);
                                  }}
                                  className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors"
                                >
                                  Select All {filteredPosts.length} Matching
                                </button>
                              </div>

                              <button
                                onClick={() => setSelectedPosts([])}
                                className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                              >
                                Clear All
                              </button>
                            </div>

                            <div className="relative group mb-8">
                              <Search
                                className={cn(
                                  "absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                  postSearchQuery
                                    ? "text-indigo-500"
                                    : "text-[var(--ink-muted)] group-focus-within:text-indigo-500",
                                )}
                              />
                              <input
                                type="text"
                                placeholder="Find posts by title..."
                                value={postSearchQuery}
                                onChange={(e) =>
                                  setPostSearchQuery(e.target.value)
                                }
                                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl pl-14 pr-12 py-4 text-xs font-bold tracking-tight focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none shadow-inner text-[var(--ink)]"
                              />
                              {postSearchQuery && (
                                <button
                                  onClick={() => setPostSearchQuery("")}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[var(--bg)] text-[var(--ink-muted)] hover:text-indigo-600 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="flex-1 overflow-y-auto pr-3 grid grid-cols-2 gap-6 pb-6">
                              {pagedPosts.map((post) => (
                                <button
                                  key={post.id}
                                  onClick={() => togglePost(post.id)}
                                  className={cn(
                                    "group relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all text-left",
                                    selectedPosts.includes(post.id)
                                      ? "border-indigo-600 shadow-2xl scale-[1.02]"
                                      : "border-transparent opacity-60 hover:opacity-100",
                                  )}
                                >
                                  <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                  <div
                                    className={cn(
                                      "absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-5 transition-opacity duration-500",
                                      selectedPosts.includes(post.id)
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100",
                                    )}
                                  >
                                    <p className="text-[10px] font-black text-white uppercase tracking-tight mb-2 pr-4">
                                      {post.title}
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1.5 text-[8px] font-black text-indigo-300 uppercase tracking-widest">
                                        <Activity className="w-2.5 h-2.5" />
                                        {post.likes} ENG
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={cn(
                                      "absolute top-4 right-4 rounded-xl p-2 z-20 transition-all duration-300 shadow-2xl",
                                      selectedPosts.includes(post.id)
                                        ? "bg-indigo-600 scale-100 rotate-0"
                                        : "bg-white/20 backdrop-blur-md border border-white/30 scale-90 -rotate-12 opacity-0 group-hover:opacity-100",
                                    )}
                                  >
                                    <CheckCircle2
                                      className={cn(
                                        "w-4 h-4 transition-colors",
                                        selectedPosts.includes(post.id)
                                          ? "text-white"
                                          : "text-white/40",
                                      )}
                                    />
                                  </div>
                                  <div
                                    className={cn(
                                      "absolute inset-0 bg-indigo-600/20 transition-opacity",
                                      selectedPosts.includes(post.id)
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </button>
                              ))}
                              {pagedPosts.length === 0 && (
                                <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center opacity-40">
                                  <Search className="w-12 h-12 mb-4 text-[var(--ink-muted)]" />
                                  <p className="text-xs font-black uppercase tracking-widest text-[var(--ink)]">
                                    No posts found
                                  </p>
                                </div>
                              )}

                              {totalPages > 1 && (
                                <div className="col-span-2 mt-4 flex items-center justify-center gap-4 py-2 border-t border-[var(--border)] pt-6">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPostSelectionPage((p) =>
                                        Math.max(1, p - 1),
                                      );
                                    }}
                                    disabled={postSelectionPage === 1}
                                    className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                                  >
                                    <ChevronLeft className="w-5 h-5" />
                                  </button>
                                  <div className="flex items-center gap-2">
                                    {Array.from(
                                      { length: totalPages },
                                      (_, i) => i + 1,
                                    ).map((page) => (
                                      <button
                                        key={page}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPostSelectionPage(page);
                                        }}
                                        className={cn(
                                          "w-8 h-8 rounded-lg text-[9px] font-black transition-all",
                                          postSelectionPage === page
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                            : "text-[var(--ink-muted)] hover:bg-[var(--bg)]",
                                        )}
                                      >
                                        {page}
                                      </button>
                                    ))}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPostSelectionPage((p) =>
                                        Math.min(totalPages, p + 1),
                                      );
                                    }}
                                    disabled={postSelectionPage === totalPages}
                                    className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                                  >
                                    <ChevronRight className="w-5 h-5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 space-y-6">
                            <div className="space-y-4">
                              <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-[0.15em] leading-relaxed">
                                Enter custom alphanumeric post/reel IDs below to
                                associate with this keyword rule. You can input
                                multiple IDs separated by commas, spaces, or
                                lines.
                              </p>

                              <div className="relative">
                                <textarea
                                  placeholder="e.g. p10, launch_brand_x, summer_re_999, custom_ig_post"
                                  value={manualPostIds}
                                  onChange={(e) =>
                                    setManualPostIds(e.target.value)
                                  }
                                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[1.8rem] p-6 text-sm font-bold tracking-tight text-[var(--ink)] shadow-inner min-h-[140px] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none"
                                />
                              </div>

                              <div className="flex gap-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    linkManualIds(manualPostIds);
                                    setManualPostIds("");
                                  }}
                                  disabled={!manualPostIds.trim()}
                                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/10 hover:scale-[1.01] active:scale-95"
                                >
                                  Link Post IDs
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setManualPostIds("")}
                                  className="px-6 py-4 bg-[var(--card)] border border-[var(--border)] text-[var(--ink-muted)] hover:text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                  Clear Box
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                              <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5" /> Direct Lookup
                                  Preset IDs
                                </h4>
                                <ul className="text-[10px] text-[var(--ink-muted)] space-y-1 font-semibold leading-relaxed">
                                  <li>
                                    Click any item to immediately link it:
                                  </li>
                                </ul>

                                <div className="flex flex-wrap gap-2 pt-1">
                                  {mockPosts.map((post) => {
                                    const isAlreadyLinked =
                                      selectedPosts.includes(post.id);
                                    return (
                                      <button
                                        key={post.id}
                                        type="button"
                                        onClick={() => togglePost(post.id)}
                                        className={cn(
                                          "px-2.5 py-1.5 rounded-lg text-[9px] font-mono transition-all flex items-center gap-1.5",
                                          isAlreadyLinked
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/10"
                                            : "bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-muted)] hover:text-indigo-500 hover:border-indigo-500/20",
                                        )}
                                      >
                                        <div
                                          className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            isAlreadyLinked
                                              ? "bg-white"
                                              : "bg-slate-400",
                                          )}
                                        />
                                        ID: {post.id}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-slate-200">
                          {selectedPosts.length > 0 && (
                            <div className="mb-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  Selected Previews
                                </p>
                                <button
                                  onClick={() => {
                                    setSelectedPosts([]);
                                    validateKeywords(newKeywords, newScope, []);
                                  }}
                                  className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                                >
                                  Clear All
                                </button>
                              </div>
                              <div className="flex gap-3 overflow-x-auto pb-4">
                                {selectedPosts.map((id) => {
                                  const post = mockPosts.find(
                                    (p) => p.id === id,
                                  );
                                  const isCustom = !post;
                                  const postObj = post || {
                                    id,
                                    title: `Manually Target ID: "${id}"`,
                                    image:
                                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
                                  };
                                  return (
                                    <div
                                      key={id}
                                      className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden group border border-slate-200 dark:border-white/10 bg-slate-900 flex flex-col justify-end p-1.5 text-left text-[8px] text-white"
                                    >
                                      <img
                                        src={postObj.image}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity"
                                      />
                                      <span className="relative z-10 font-bold truncate pr-3">
                                        {id}
                                      </span>
                                      {isCustom && (
                                        <span className="relative z-10 text-[6px] text-indigo-300 font-extrabold uppercase tracking-widest leading-none mb-0.5">
                                          Custom ID
                                        </span>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          togglePost(id);
                                        }}
                                        className="absolute inset-0 bg-rose-500/95 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20"
                                      >
                                        <Trash2 className="w-4 h-4 text-white" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <p className="text-[10px] font-black text-slate-300 italic uppercase tracking-widest">
                            Selection complete. Ready to start.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Cluster Discovery Modal */}
      <AnimatePresence>
        {showDiscoveryPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-6 text-left"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] w-full max-w-4xl p-10 max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl relative"
            >
              <button
                onClick={() => setShowDiscoveryPanel(false)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/30">
                  <Sparkles className="w-6 h-6 animate-pulse text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight italic">
                    AI Cluster Discoveries
                  </h3>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                    Smart opportunity suggestions based on unhandled incoming
                    interactions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "Sizing & Fit Advice",
                    mentions: 12,
                    keywords: "SIZE, SIZING, FIT",
                    example: "What size should I get for a tighter look?",
                    recommendedReply:
                      "Our comprehensive size chart is at neural.hub/sizes. We do say they run true to size, but size up if in-between!",
                    badge: "High Intent",
                  },
                  {
                    title: "Returns & Refund Policy",
                    mentions: 8,
                    keywords: "RETURN, REFUND, WARRANTY",
                    example: "Can I exchange this if the fit is wrong?",
                    recommendedReply:
                      "We have a 30-day return policy! Reach out at neural.hub/returns with your order ID.",
                    badge: "Support Risk",
                  },
                  {
                    title: "Creator Collaborations",
                    mentions: 5,
                    keywords: "COLLAB, PARTNER, INFLUENCER",
                    example: "Do you offer sponsorships/collabs?",
                    recommendedReply:
                      "We are always looking for creatives! Fill in your profile details at creators.neural.hub and our team will check it out!",
                    badge: "Brand Growth",
                  },
                ].map((cluster, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] hover:border-indigo-500/30 p-6 rounded-3xl transition-all h-full group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg">
                          {cluster.badge}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 italic">
                          {cluster.mentions} occurrences
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-950 dark:text-white leading-tight italic">
                        {cluster.title}
                      </h4>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Suggested Keywords:
                        </span>
                        <p className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400">
                          {cluster.keywords}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Representative query:
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed">
                          "{cluster.example}"
                        </p>
                      </div>
                      <div className="space-y-1 border-t border-slate-200 dark:border-white/5 pt-3">
                        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Recommended reply:
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                          {cluster.recommendedReply}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleCreateFromSuggestion(
                          cluster.keywords,
                          cluster.recommendedReply,
                        )
                      }
                      className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/10 group-hover:scale-[1.02]"
                    >
                      Instantly Activate Rule
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-50/50 dark:bg-slate-900 border border-indigo-100 dark:border-indigo-500/10 p-5 rounded-2xl flex items-center gap-4 text-slate-600 dark:text-indigo-200/80 text-xs shadow-inner">
                <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                <p className="font-medium">
                  Applying an AI suggestions preset automatically prefills the
                  rule form so you can review scope, active channels, or draft
                  status before saving.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
