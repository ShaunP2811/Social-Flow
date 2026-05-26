import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Copy,
  Save,
  Cpu,
  Database,
  Globe,
  Lock,
  RefreshCw,
  Calendar,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  Instagram,
  Facebook,
  ChevronLeft,
  ChevronRight,
  Info,
  Filter,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKeyStatus {
  name: string;
  description: string;
  isSet: boolean;
  type: 'AI' | 'Database' | 'Platform';
  envVar: string;
  icon: React.ElementType;
}

interface MetaToken {
  id: string;
  accountName: string;
  platform: 'Instagram' | 'Facebook' | 'Meta Graph API';
  type: 'Short-lived' | 'Long-lived' | 'Never-expiring';
  tokenSnippet: string;
  createdAt: string;
  expiresAt: string | null;
  scopes: string[];
  category?: string;
}

const REQUIRED_SCOPES: Record<'Instagram' | 'Facebook' | 'Meta Graph API', string[]> = {
  'Instagram': ['instagram_basic', 'instagram_manage_comments', 'instagram_manage_messages', 'pages_show_list'],
  'Facebook': ['pages_manage_metadata', 'pages_read_engagement', 'pages_manage_posts', 'pages_show_list'],
  'Meta Graph API': [
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_messages',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_metadata',
    'pages_manage_posts'
  ]
};

const DEFAULT_TOKENS: MetaToken[] = [
  {
    id: 'token-1',
    accountName: '@fashion_forward',
    platform: 'Instagram',
    type: 'Long-lived',
    tokenSnippet: 'EAAGv1A1...pZC9e',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    scopes: ['instagram_basic', 'instagram_manage_comments', 'instagram_manage_messages', 'pages_show_list'],
    category: 'Marketing'
  },
  {
    id: 'token-2',
    accountName: 'Fashion Forward Apparel Page',
    platform: 'Facebook',
    type: 'Short-lived',
    tokenSnippet: 'EAAGv1A1...dfA2e',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(),
    scopes: ['pages_manage_metadata', 'pages_read_engagement', 'pages_manage_posts'],
    category: 'Sales'
  },
  {
    id: 'token-3',
    accountName: 'Meta Developer Portal Core App',
    platform: 'Meta Graph API',
    type: 'Never-expiring',
    tokenSnippet: 'EAAGv1A1...AppCore',
    createdAt: new Date('2026-01-15T00:00:00Z').toISOString(),
    expiresAt: null,
    scopes: ['instagram_basic', 'instagram_manage_comments', 'instagram_manage_messages', 'pages_show_list', 'pages_read_engagement', 'pages_manage_metadata'],
    category: 'Engineering'
  }
];

const Settings = ({
  activeAccount = "Instagram: @social_flow",
  setActiveAccount,
  theme = "light",
  toggleTheme,
}: {
  activeAccount?: string;
  setActiveAccount?: (val: string) => void;
  theme?: "light" | "dark";
  toggleTheme?: () => void;
}) => {
  const [keyStatuses, setKeyStatuses] = useState<ApiKeyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeyInfo, setShowKeyInfo] = useState<string | null>(null);

  // Supabase Auto-Sync States
  const [isAutoSyncActive, setIsAutoSyncActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("supabase_auto_sync_active") === "true";
    }
    return false;
  });
  const [syncIntervalVal, setSyncIntervalVal] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("supabase_auto_sync_interval")) || 30;
    }
    return 30;
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("supabase_last_sync_time") || null;
    }
    return null;
  });
  const [syncStatusLog, setSyncStatusLog] = useState<string>("Ready.");
  const [isSyncRunning, setIsSyncRunning] = useState<boolean>(false);
  const [showSyncConfirmModal, setShowSyncConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("supabase_auto_sync_active", String(isAutoSyncActive));
  }, [isAutoSyncActive]);

  useEffect(() => {
    localStorage.setItem("supabase_auto_sync_interval", String(syncIntervalVal));
  }, [syncIntervalVal]);

  const syncSupabaseDatabaseRules = async (isManual = false) => {
    if (isSyncRunning) return;
    setIsSyncRunning(true);
    setSyncStatusLog("Connecting to database pool...");
    
    // Dispatch synchronization animation to header spinner
    window.dispatchEvent(new CustomEvent("social-flow-sync", { detail: { status: true } }));
    
    try {
      const response = await fetch('/api/automations');
      if (!response.ok) throw new Error("HTTP error " + response.status);
      const rules = await response.json();
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(timeStr);
      localStorage.setItem("supabase_last_sync_time", timeStr);
      localStorage.setItem("supabase_last_sync_timestamp", String(now.getTime()));
      setSyncStatusLog(`[${timeStr}] Synced ${rules.length || 0} active automation rules.`);
      
      // Dispatch toast notice
      window.dispatchEvent(
        new CustomEvent("social-flow-toast", {
          detail: {
            title: isManual ? "Database Synced" : "Periodic Rules Synced",
            message: `Successfully loaded ${rules.length || 0} rules from the Supabase database.`,
            type: "success",
            duration: 4000
          }
        })
      );
    } catch (err: any) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSyncStatusLog(`[${timeStr}] Sync failed: ${err.message || 'Connection lost'}`);
      
      window.dispatchEvent(
        new CustomEvent("social-flow-toast", {
          detail: {
            title: "Supabase Sync Failed",
            message: `Could not retrieve rule updates: ${err.message || 'Connection lost'}`,
            type: "warning",
            duration: 5000
          }
        })
      );
    } finally {
      setIsSyncRunning(false);
      // Stop the global header sync animation
      window.dispatchEvent(new CustomEvent("social-flow-sync", { detail: { status: false } }));
    }
  };

  useEffect(() => {
    if (!isAutoSyncActive) return;
    
    // Trigger immediately on activate
    syncSupabaseDatabaseRules(false);
    
    const intervalMs = syncIntervalVal * 1000;
    const intervalId = setInterval(() => {
      syncSupabaseDatabaseRules(false);
    }, intervalMs);
    
    return () => clearInterval(intervalId);
  }, [isAutoSyncActive, syncIntervalVal]);

  const handleManualSyncClick = () => {
    if (isAutoSyncActive) {
      setShowSyncConfirmModal(true);
    } else {
      syncSupabaseDatabaseRules(true);
    }
  };

  // Token Expiration Tracking States
  const [tokens, setTokens] = useState<MetaToken[]>(() => {
    const saved = localStorage.getItem('socialflow_meta_tokens');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing tokens', e);
      }
    }
    return DEFAULT_TOKENS;
  });

  // Token Filter State
  const [tokenStatusFilter, setTokenStatusFilter] = useState<'all' | 'active' | 'warning' | 'expired'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Calendar Visualizer States
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDayObj, setSelectedDayObj] = useState<Date | null>(new Date());

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getExpiringTokensForDate = (date: Date) => {
    return tokens.filter(token => {
      if (!token.expiresAt) return false;
      const expDate = new Date(token.expiresAt);
      return isSameDay(expDate, date) && token.type !== 'Never-expiring';
    });
  };

  const [isAddingToken, setIsAddingToken] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenPlatform, setNewTokenPlatform] = useState<'Instagram' | 'Facebook' | 'Meta Graph API'>('Instagram');
  const [newTokenType, setNewTokenType] = useState<'Short-lived' | 'Long-lived' | 'Never-expiring'>('Long-lived');
  const [newTokenVal, setNewTokenVal] = useState('');
  const [newTokenScopes, setNewTokenScopes] = useState('instagram_basic, instagram_manage_comments, pages_show_list');
  const [newTokenCategory, setNewTokenCategory] = useState('Marketing');
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  // Inspector / Debugger States
  const [inspectInput, setInspectInput] = useState('');
  const [inspectResult, setInspectResult] = useState<any | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('socialflow_meta_tokens', JSON.stringify(tokens));
  }, [tokens]);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim() || !newTokenVal.trim()) {
      window.dispatchEvent(
        new CustomEvent("social-flow-toast", {
          detail: {
            title: "Validation Error",
            message: "Account name and token value are required fields.",
            type: "warning",
          },
        })
      );
      return;
    }

    let expiresAt: string | null = null;
    const now = new Date();
    if (newTokenType === 'Short-lived') {
      expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours
    } else if (newTokenType === 'Long-lived') {
      expiresAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(); // 60 days
    }

    const scopesArray = newTokenScopes
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const tokenSnippet = newTokenVal.trim().substring(0, 8) + '...' + newTokenVal.trim().slice(-5);

    const newToken: MetaToken = {
      id: `token-${Date.now()}`,
      accountName: newTokenName.trim(),
      platform: newTokenPlatform,
      type: newTokenType,
      tokenSnippet: tokenSnippet,
      createdAt: now.toISOString(),
      expiresAt: expiresAt,
      scopes: scopesArray,
      category: newTokenCategory.trim() || undefined,
    };

    setTokens(prev => [newToken, ...prev]);
    setIsAddingToken(false);
    
    // Clear inputs
    setNewTokenName('');
    setNewTokenVal('');
    setNewTokenScopes('instagram_basic, instagram_manage_comments, pages_show_list');
    setNewTokenCategory('Marketing');

    window.dispatchEvent(
      new CustomEvent("social-flow-toast", {
        detail: {
          title: "Token Multi-Tracker Added",
          message: `Now tracking token expiry dates for ${newTokenName} on ${newTokenPlatform}.`,
          type: "success",
        },
      })
    );
  };

  const handleDeleteToken = (id: string, name: string) => {
    setTokens(prev => prev.filter(t => t.id !== id));
    window.dispatchEvent(
      new CustomEvent("social-flow-toast", {
        detail: {
          title: "Token Untracked",
          message: `Successfully stopped tracking token for ${name}.`,
          type: "success",
        },
      })
    );
  };

  const handleAutoFixScopes = (id: string) => {
    setTokens(prev => prev.map(t => {
      if (t.id === id) {
        const required = REQUIRED_SCOPES[t.platform];
        const missing = required.filter(s => !t.scopes.includes(s));
        if (missing.length > 0) {
          const updatedScopes = [...t.scopes, ...missing];
          window.dispatchEvent(
            new CustomEvent("social-flow-toast", {
              detail: {
                title: "Scopes Auto-Fixed",
                message: `Successfully added ${missing.length} missing permissions to ${t.accountName}.`,
                type: "success",
              },
            })
          );
          return {
            ...t,
            scopes: updatedScopes
          };
        }
      }
      return t;
    }));
  };

  const handleCopySnippet = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2000);
    window.dispatchEvent(
      new CustomEvent("social-flow-toast", {
        detail: {
          title: "Copiedsnippet",
          message: `Copied token snippet ${snippet} to clipboard.`,
          type: "success",
        },
      })
    );
  };

  // Simulates exchange of short-lived user token for long-lived page token
  const handleExchangeToLongLived = (tokenId: string, accountName: string) => {
    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          type: 'Long-lived',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        };
      }
      return t;
    }));

    window.dispatchEvent(
      new CustomEvent("social-flow-toast", {
        detail: {
          title: "Token Successfully Renewed",
          message: `Exchanged short-lived token to 60-day Long-Lived Page Access Token for ${accountName}!`,
          type: "success",
        },
      })
    );
  };

  // Simulated debugger/inspector
  const handleInspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectInput.trim()) {
      window.dispatchEvent(
        new CustomEvent("social-flow-toast", {
          detail: {
            title: "Debugger Input Needed",
            message: "Please enter or paste a valid Facebook / Instagram access token to debug.",
            type: "warning",
          },
        })
      );
      return;
    }

    setInspectLoading(true);
    setInspectResult(null);

    setTimeout(() => {
      const isShort = inspectInput.length < 50;
      const parsedInfo = {
        app_id: "1098415918451845",
        application: "SocialFlow Automation Hub",
        type: isShort ? "USER" : "PAGE",
        is_valid: true,
        issued_at: new Date(Date.now() - 4000000).toLocaleString(),
        expires_at: isShort 
          ? new Date(Date.now() + 1.5 * 60 * 60 * 1000).toLocaleString() 
          : new Date(Date.now() + 58 * 24 * 60 * 60 * 1000).toLocaleString(),
        data_access_expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleString(),
        scopes: [
          "pages_show_list",
          "instagram_basic",
          "instagram_manage_comments",
          "instagram_manage_messages",
          "pages_read_engagement",
          "pages_manage_metadata"
        ],
        user_id: "781405105912441"
      };
      setInspectResult(parsedInfo);
      setInspectLoading(false);

      window.dispatchEvent(
        new CustomEvent("social-flow-toast", {
          detail: {
            title: "Access Token Decoded",
            message: `Debug response received. Connection state: ACTIVE. Type: ${parsedInfo.type} Token.`,
            type: "success",
          },
        })
      );
    }, 1200);
  };

  const getTokenLifespanInfo = (token: MetaToken) => {
    if (token.type === 'Never-expiring' || !token.expiresAt) {
      return {
        percentage: 100,
        label: 'Never Expiring',
        remainingText: 'Permanent Access',
        status: 'active' as const,
        colorClass: 'bg-emerald-500'
      };
    }

    const createdTime = new Date(token.createdAt).getTime();
    const expiresTime = new Date(token.expiresAt).getTime();
    const now = Date.now();

    const totalDuration = expiresTime - createdTime;
    const elapsed = now - createdTime;
    const remaining = expiresTime - now;

    if (remaining <= 0) {
      return {
        percentage: 0,
        label: 'Expired',
        remainingText: 'Expired',
        status: 'expired' as const,
        colorClass: 'bg-rose-500'
      };
    }

    const percentage = Math.max(0, Math.min(100, (remaining / totalDuration) * 100));
    
    // Format remaining text
    let remainingText = '';
    const remainingMinutes = Math.floor(remaining / (60 * 1000));
    const remainingHours = Math.floor(remaining / (60 * 60 * 1000));
    const remainingDays = Math.floor(remaining / (24 * 60 * 60 * 1000));

    if (remainingDays >= 1) {
      remainingText = `${remainingDays}d ${remainingHours % 24}h remaining`;
    } else if (remainingHours >= 1) {
      remainingText = `${remainingHours}h ${remainingMinutes % 60}m remaining`;
    } else {
      remainingText = `${remainingMinutes}m remaining`;
    }

    // Status classification
    let status: 'active' | 'warning' | 'expired' = 'active';
    let colorClass = 'bg-emerald-500';
    if (remainingDays < 7) {
      status = 'warning';
      colorClass = 'bg-amber-500';
    }

    return {
      percentage,
      label: token.type,
      remainingText,
      status,
      colorClass
    };
  };

  const calculateTokenHealth = (token: MetaToken) => {
    const lifespanInfo = getTokenLifespanInfo(token);
    
    // 1. Validity Score (0 to 100)
    const validityScore = Math.round(lifespanInfo.percentage);
    
    // 2. Scope Core Coverage Score (0 to 100)
    const required = REQUIRED_SCOPES[token.platform] || [];
    const totalRequired = required.length;
    if (totalRequired === 0) {
      return {
        score: 100,
        grade: "Healthy" as const,
        colorClass: "bg-emerald-500",
        textColorClass: "text-emerald-500",
        bgColorClass: "bg-emerald-500/10",
        description: "Full configuration verified.",
        validityScore: 100,
        scopeScore: 100,
      };
    }
    
    const presentCount = required.filter(s => token.scopes.includes(s)).length;
    const scopeScore = Math.round((presentCount / totalRequired) * 100);
    
    // Weighted Health calculation: 60% validity, 40% scope coverage core
    const weightedScore = Math.round((validityScore * 0.6) + (scopeScore * 0.4));
    
    let grade: "Healthy" | "Stable" | "Warning" | "Critical" = "Healthy";
    let colorClass = "bg-emerald-500";
    let textColorClass = "text-emerald-600 dark:text-emerald-400";
    let bgColorClass = "bg-emerald-500/10";
    let description = "Perfect compliance and remaining validity.";
    
    if (weightedScore < 30 || lifespanInfo.status === 'expired') {
      grade = "Critical";
      colorClass = "bg-rose-500";
      textColorClass = "text-rose-600 dark:text-rose-400";
      bgColorClass = "bg-rose-500/10";
      description = "Immediate action required. Automated flows paused.";
    } else if (weightedScore < 60) {
      grade = "Warning";
      colorClass = "bg-amber-500";
      textColorClass = "text-amber-600 dark:text-amber-400";
      bgColorClass = "bg-amber-500/10";
      description = "Needs attention soon. Missing core scopes or expiring.";
    } else if (weightedScore < 85) {
      grade = "Stable";
      colorClass = "bg-indigo-500";
      textColorClass = "text-indigo-600 dark:text-indigo-400";
      bgColorClass = "bg-indigo-500/10";
      description = "Secure connection with slight warning or minor scope gap.";
    }
    
    return {
      score: weightedScore,
      grade,
      colorClass,
      textColorClass,
      bgColorClass,
      description,
      validityScore,
      scopeScore,
    };
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      const statuses: ApiKeyStatus[] = [
        {
          name: 'Firebase Admin',
          description: 'Used for persistent cloud storage and real-time data sync.',
          isSet: data.database === 'connected',
          type: 'Database',
          envVar: 'FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY',
          icon: Database
        },
        {
          name: 'Platform Service',
          description: 'Standard infrastructure for application deployment.',
          isSet: true,
          type: 'Platform',
          envVar: 'PORT, NODE_ENV',
          icon: Globe
        }
      ];
      setKeyStatuses(statuses);
    } catch (error) {
      console.error('Failed to fetch health status', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Calendar Date Grid Processing Math ---
  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();

  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
  const totalMonthDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

  const calendarDaysList: { date: Date; isCurrentMonth: boolean }[] = [];

  // Prefix days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDaysList.push({
      date: new Date(calendarYear, calendarMonth - 1, prevMonthDays - i),
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= totalMonthDays; i++) {
    calendarDaysList.push({
      date: new Date(calendarYear, calendarMonth, i),
      isCurrentMonth: true
    });
  }

  // Suffix days to pad grid to multiples of 7 (full calendar weeks)
  const totalGridCells = calendarDaysList.length;
  const trailingCellsNeeded = totalGridCells % 7 === 0 ? 0 : 7 - (totalGridCells % 7);
  for (let i = 1; i <= trailingCellsNeeded; i++) {
    calendarDaysList.push({
      date: new Date(calendarYear, calendarMonth + 1, i),
      isCurrentMonth: false
    });
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-[var(--ink)] tracking-tighter uppercase leading-none">Settings & Security</h1>
        <p className="text-sm font-bold text-[var(--ink-muted)] uppercase tracking-[0.3em]">Configure your automation engine infrastructure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* API Key Management */}
          <section className="neural-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10 rounded-full" />
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                  <Key className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-[var(--ink)] tracking-tight">API Infrastructure</h3>
                  <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Environment Variables</p>
                </div>
              </div>
              <button 
                onClick={fetchStatus}
                className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 transition-all active:rotate-180"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </button>
            </div>

            <div className="space-y-4">
              {keyStatuses.map((status) => (
                <div 
                  key={status.name}
                  className="group bg-[var(--bg)]/50 border border-[var(--border)] rounded-2xl p-6 transition-all hover:bg-[var(--card)] hover:border-indigo-500/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-[var(--card)] dark:bg-slate-800 rounded-xl border border-[var(--border)] flex items-center justify-center shadow-sm">
                        <status.icon className="w-5 h-5 text-[var(--ink-muted)] group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-black text-sm text-[var(--ink)] tracking-tight">{status.name}</h4>
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                            status.isSet 
                              ? "bg-emerald-500/10 text-emerald-600" 
                              : "bg-amber-500/10 text-amber-600"
                          )}>
                            {status.isSet ? 'Connected' : 'Missing'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[var(--ink-muted)] mt-1">{status.description}</p>
                        
                        <div className="mt-4 flex items-center gap-2 overflow-hidden">
                           <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
                              <Lock className="w-3 h-3 text-slate-500" />
                              <code className="text-[10px] text-indigo-400 font-mono tracking-tight">
                                {status.envVar}
                              </code>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {status.isSet ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 flex items-start gap-5">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-black text-indigo-900 dark:text-indigo-400 tracking-tight mb-2 uppercase">How to manage keys securely?</p>
                <p className="text-xs font-bold text-indigo-700/70 dark:text-indigo-400/50 leading-relaxed">
                  For your security, individual API keys cannot be edited directly within the application UI. 
                  To update or add new keys, please navigate to the <span className="text-indigo-600 font-black underline cursor-pointer">Platform Settings</span> menu on the main workbench and define the environment variables listed above.
                </p>
                <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">
                  Open Workbench Settings <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </section>

          {/* Meta Access Tokens Tracker Card */}
          <section className="neural-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10 rounded-full" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-[var(--ink)] tracking-tight">Meta Access Token Tracker</h3>
                  <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Track Token Expiry Dates & Lifespans</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setTokenStatusFilter(prev => prev === 'active' ? 'all' : 'active')}
                  className={cn(
                    "py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 border cursor-pointer",
                    tokenStatusFilter === 'active'
                      ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                      : "bg-[var(--card)] border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)]/80"
                  )}
                  title="Filter by active tokens to reduce clutter"
                >
                  <Filter className="w-3.5 h-3.5" />
                  {tokenStatusFilter === 'active' ? "Showing Active" : "Active Only"}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black ml-1",
                    tokenStatusFilter === 'active'
                      ? "bg-white/20 text-white"
                      : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {tokens.filter(t => getTokenLifespanInfo(t).status === 'active').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingToken(!isAddingToken)}
                  className="py-2.5 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingToken ? "Cancel" : "Track Token"}
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-muted)] mb-5 leading-relaxed font-bold">
              Meta Graph & Messenger APIs require access tokens to run background automations. Short-lived user tokens expire in 2 hours, while Page Access Tokens last up to 60 days. Monitor your connected tokens below to prevent message interruptions.
            </p>

            <div className="bg-gradient-to-tr from-indigo-500/5 to-indigo-505/10 dark:from-indigo-400/5 dark:to-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/10 rounded-2xl p-4 mb-8 text-left select-none">
              <span className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-wider text-indigo-700 dark:text-indigo-400">
                <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 animate-pulse" />
                Team Guide: Token Setup for Multi-Page Ownership
              </span>
              <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed mt-1 font-bold">
                If all of your child pages and Instagram profiles belong to a <strong>single physical Facebook profile or Business Manager</strong>, you only need to register and track <strong>one single, unified Meta Access Token</strong> under Settings! The platform will automatically authorize and automate message flows contextually across all sibling pages. Submitting separate tokens is only necessary if your pages are owned by completely distinct, separate personal accounts.
              </p>
            </div>

            {/* Expander: Add token form */}
            {isAddingToken && (
              <form onSubmit={handleSaveToken} className="mb-8 p-6 bg-[var(--bg)] border border-[var(--border)] rounded-2xl space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black uppercase text-[var(--ink)] tracking-wider">Register Token for Monitoring</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-[var(--ink-muted)]">Profile Account Name</label>
                    <input
                      type="text"
                      placeholder="e.g. @your_brand"
                      value={newTokenName}
                      onChange={(e) => setNewTokenName(e.target.value)}
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs font-bold outline-none text-[var(--ink)] focus:border-indigo-500 text-left"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-[var(--ink-muted)]">Platform Context</label>
                    <select
                      value={newTokenPlatform}
                      onChange={(e) => setNewTokenPlatform(e.target.value as any)}
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs font-bold outline-none text-[var(--ink)] focus:border-indigo-500 text-left"
                    >
                      <option value="Instagram">Instagram Professional</option>
                      <option value="Facebook">Facebook Page Feed</option>
                      <option value="Meta Graph API">Meta Graph API Core</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-[var(--ink-muted)]">Lifespan Type</label>
                    <select
                      value={newTokenType}
                      onChange={(e) => setNewTokenType(e.target.value as any)}
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs font-bold outline-none text-[var(--ink)] focus:border-indigo-500 text-left"
                    >
                      <option value="Short-lived">Short-lived User Token (2 Hours)</option>
                      <option value="Long-lived">Long-lived Page Token (60 Days)</option>
                      <option value="Never-expiring">Never-expiring Page Token</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-[var(--ink-muted)]">Scopes (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="instagram_basic, pages_show_list, ..."
                      value={newTokenScopes}
                      onChange={(e) => setNewTokenScopes(e.target.value)}
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs font-bold outline-none text-[var(--ink)] focus:border-indigo-500 text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-[var(--ink-muted)]">Project / Department (Category Label)</label>
                    <input
                      type="text"
                      placeholder="e.g. Marketing, Sales, Engineering"
                      value={newTokenCategory}
                      onChange={(e) => setNewTokenCategory(e.target.value)}
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs font-bold outline-none text-[var(--ink)] focus:border-indigo-500 text-left"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-[var(--ink-muted)]">Access Token Value</label>
                    <input
                      type="password"
                      placeholder="EAA..."
                      value={newTokenVal}
                      onChange={(e) => setNewTokenVal(e.target.value)}
                      className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-xs font-mono outline-none text-[var(--ink)] focus:border-indigo-500 text-left"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingToken(false)}
                    className="py-2.5 px-4 rounded-xl border border-[var(--border)] font-black text-[10px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider hover:bg-indigo-700 transition-colors"
                  >
                    Start Monitoring
                  </button>
                </div>
              </form>
            )}

            {/* Split layout: Calendar on Left, Token registry on Right */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Calendar Widget (Left) */}
              <div className="xl:col-span-5 space-y-4 text-left">
                 {/* Urgent Expiration Alert Banner */}
                 {(() => {
                   const urgentExpiringTokens = tokens.filter(token => {
                     if (!token.expiresAt) return false;
                     const remaining = new Date(token.expiresAt).getTime() - Date.now();
                     return remaining > 0 && remaining < 48 * 60 * 60 * 1000;
                   });
                   
                   if (urgentExpiringTokens.length === 0) return null;
                   
                   return (
                     <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden shadow-sm">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5">
                           <span className="flex h-2 w-2 relative">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                           </span>
                           <h5 className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5 leading-none">
                             Action Required
                           </h5>
                         </div>
                         <span className="text-[8px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-500/15 animate-pulse">
                           Urgent Expiry
                         </span>
                       </div>
                       
                       <p className="text-[10px] text-[var(--ink-muted)] font-medium leading-relaxed">
                         The following connected Meta OAuth tokens expire in less than 48 hours. Please update or renew them immediately:
                       </p>
                       
                       <div className="space-y-1.5 mt-1 border-t border-rose-500/10 pt-2.5">
                         {urgentExpiringTokens.map(t => {
                           const hoursLeft = Math.max(1, Math.round((new Date(t.expiresAt!).getTime() - Date.now()) / (60 * 60 * 1000)));
                           return (
                             <div key={t.id} className="flex items-center justify-between text-[10px] font-bold">
                               <div className="flex items-center gap-1.5">
                                 <span className="text-rose-500 animate-ping">•</span>
                                 <span className="text-[var(--ink)] font-black">{t.accountName}</span>
                                 <span className="text-[var(--ink-muted)]">({t.platform})</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <span className="text-rose-600 dark:text-rose-400 font-mono text-[9px] font-extrabold bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">
                                   {hoursLeft} {hoursLeft === 1 ? 'hour' : 'hours'} left
                                 </span>
                                 <button
                                   type="button"
                                   onClick={() => {
                                     setSelectedDayObj(new Date(t.expiresAt!));
                                     setCalendarDate(new Date(t.expiresAt!));
                                   }}
                                   className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline uppercase text-[9px] font-black tracking-wider shrink-0 transition-all"
                                 >
                                   Locate
                                 </button>
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   );
                 })()}

                 <div className="bg-[var(--bg)]/40 border border-[var(--border)] rounded-2xl p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--ink)]">
                          {calendarDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCalendarDate(new Date())}
                          className="px-2 py-1 border border-[var(--border)] rounded text-[9px] font-black uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--card)]"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                          className="p-1 border border-[var(--border)] rounded hover:bg-[var(--card)] text-[var(--ink)]"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                          className="p-1 border border-[var(--border)] rounded hover:bg-[var(--card)] text-[var(--ink)]"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* S M T W T F S weekday header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-wider">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="py-1">{day}</div>
                      ))}
                    </div>

                    {/* Calendar cells */}
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {calendarDaysList.map((cell: { date: Date; isCurrentMonth: boolean }, idx: number) => {
                        const cellDate = cell.date;
                        const expiringTokens = getExpiringTokensForDate(cellDate);
                        const hasExpirations = expiringTokens.length > 0;
                        const isSelected = selectedDayObj && isSameDay(cellDate, selectedDayObj);
                        const isToday = isSameDay(cellDate, new Date());

                        // Check for urgent expirations (less than 48 hours remaining)
                        const urgentTokens = expiringTokens.filter(token => {
                          if (!token.expiresAt) return false;
                          const remaining = new Date(token.expiresAt).getTime() - Date.now();
                          return remaining > 0 && remaining < 48 * 60 * 60 * 1000;
                        });
                        const hasUrgentExpiration = urgentTokens.length > 0;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedDayObj(cellDate)}
                            className={cn(
                              "relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all focus:outline-none",
                              !cell.isCurrentMonth && "text-[var(--ink-muted)] opacity-30 hover:opacity-100 bg-transparent",
                              cell.isCurrentMonth && "text-[var(--ink)] bg-[var(--card)] hover:bg-[var(--bg)] border border-[var(--border)]",
                              isToday && "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 border-indigo-500",
                              isSelected && "bg-indigo-600 text-white! border-indigo-600 hover:bg-indigo-700 font-black scale-105 shadow-md shadow-indigo-600/25",
                              hasExpirations && !isSelected && !hasUrgentExpiration && "border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-extrabold",
                              hasUrgentExpiration && !isSelected && "border-rose-500 bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 font-black animate-pulse ring-1 ring-rose-500/30"
                            )}
                          >
                            <span className={isSelected ? "text-white" : ""}>{cellDate.getDate()}</span>
                            
                            {/* Pulse glowing dot for urgent warning */}
                            {hasUrgentExpiration && (
                              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                              </span>
                            )}

                            {/* Colored dot symbols */}
                            {hasExpirations && (
                              <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
                                {expiringTokens.map((t, tIdx) => (
                                  <span
                                    key={t.id || tIdx}
                                    className={cn(
                                      "w-1 h-1 rounded-full shrink-0",
                                      t.platform === "Instagram" && "bg-pink-500",
                                      t.platform === "Facebook" && "bg-blue-500",
                                      t.platform === "Meta Graph API" && "bg-indigo-500"
                                    )}
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="pt-3 border-t border-[var(--border)] flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[var(--ink-muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        <span>Instagram</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[var(--ink-muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Facebook</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[var(--ink-muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>Meta Graph</span>
                      </div>
                    </div>
                 </div>

                 {/* Selected Date Details Widget */}
                 <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/20 text-left">
                   <div className="flex items-center gap-2 mb-2 font-black text-xs text-[var(--ink)] uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span>Date Metrics: {selectedDayObj ? selectedDayObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'None'}</span>
                   </div>
                   
                   {selectedDayObj ? (
                     (() => {
                       const deadlines = getExpiringTokensForDate(selectedDayObj);
                       if (deadlines.length === 0) {
                         return (
                           <div className="flex items-center gap-2 text-[10px] text-[var(--ink-muted)] font-bold">
                             <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                             <span>No access tokens set to expire on this date.</span>
                           </div>
                         );
                       }
                       return (
                         <div className="space-y-2">
                           {deadlines.map(t => {
                             const remainingValue = t.expiresAt ? (new Date(t.expiresAt).getTime() - Date.now()) : 0;
                             const isUrgent = remainingValue > 0 && remainingValue < 48 * 60 * 60 * 1000;
                             return (
                               <div key={t.id} className="flex items-center justify-between text-xs bg-[var(--card)] p-2.5 rounded-xl border border-[var(--border)] text-left">
                                 <div className="flex items-center gap-2">
                                   <div className={cn(
                                     "w-6 h-6 rounded flex items-center justify-center shrink-0 text-[10px] font-black",
                                     t.platform === 'Instagram' && "bg-pink-500/10 text-pink-500",
                                     t.platform === 'Facebook' && "bg-blue-500/10 text-blue-500",
                                     t.platform === 'Meta Graph API' && "bg-indigo-500/10 text-indigo-500"
                                   )}>
                                     {t.platform === 'Instagram' ? 'IG' : t.platform === 'Facebook' ? 'FB' : 'API'}
                                   </div>
                                   <div className="text-left">
                                     <div className="flex items-center gap-1.5 flex-wrap">
                                       <p className="font-extrabold text-[var(--ink)] text-xs leading-none">{t.accountName}</p>
                                       {isUrgent && (
                                         <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold uppercase text-[7px] px-1.5 py-0.5 rounded tracking-wider animate-pulse border border-rose-500/10">
                                           <span className="relative flex h-1.5 w-1.5">
                                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                             <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                                           </span>
                                           Action Required
                                         </span>
                                       )}
                                     </div>
                                     <p className="text-[9px] font-bold text-[var(--ink-muted)] mt-1">Expires: {new Date(t.expiresAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                   </div>
                                 </div>
                                 {t.type === 'Short-lived' && (
                                   <button
                                     type="button"
                                     onClick={() => handleExchangeToLongLived(t.id, t.accountName)}
                                     className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-[8px] text-white font-black uppercase tracking-wider transition-all scale-95 active:scale-90"
                                   >
                                     Renew
                                   </button>
                                 )}
                               </div>
                             );
                           })}
                         </div>
                       );
                     })()
                   ) : (
                     <p className="text-[10px] text-[var(--ink-muted)] font-black uppercase">Select a calendar date to inspect expiration details.</p>
                   )}
                 </div>
              </div>

              {/* Token Registry View (Right) */}
              <div className="xl:col-span-7 space-y-6">
                {/* Status and Category Filtering Bar */}
                <div className="space-y-4 border-b border-[var(--border)] pb-4 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--ink-muted)]">
                        Registered Tokens Filter
                      </h4>
                      <p className="text-xs text-[var(--ink-muted)] font-medium">
                        Toggle views by connection status, health, and department
                      </p>
                    </div>
                    
                    {/* Toggle buttons */}
                    <div className="flex flex-wrap gap-1 bg-[var(--bg)]/80 p-0.5 border border-[var(--border)] rounded-xl">
                      <button
                        type="button"
                        onClick={() => setTokenStatusFilter('all')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-black transition-all",
                          tokenStatusFilter === 'all'
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--card)]"
                        )}
                      >
                        All ({tokens.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTokenStatusFilter('active')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5",
                          tokenStatusFilter === 'active'
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-[var(--ink-muted)] hover:text-emerald-500 hover:bg-emerald-500/5"
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active ({tokens.filter(t => getTokenLifespanInfo(t).status === 'active').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTokenStatusFilter('warning')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5",
                          tokenStatusFilter === 'warning'
                            ? "bg-amber-600 text-white shadow-sm"
                            : "text-[var(--ink-muted)] hover:text-amber-500 hover:bg-amber-500/5"
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Soon ({tokens.filter(t => getTokenLifespanInfo(t).status === 'warning').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTokenStatusFilter('expired')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5",
                          tokenStatusFilter === 'expired'
                            ? "bg-rose-600 text-white shadow-sm"
                            : "text-[var(--ink-muted)] hover:text-rose-500 hover:bg-rose-500/5"
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Expired ({tokens.filter(t => getTokenLifespanInfo(t).status === 'expired').length})
                      </button>
                    </div>
                  </div>

                  {/* Category Selection Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-wider flex items-center gap-1 mr-1">
                      <Filter className="w-3 h-3 text-indigo-500" />
                      Department:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryFilter('all')}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all",
                        selectedCategoryFilter === 'all'
                          ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                          : "bg-[var(--card)] border-[var(--border)] text-[var(--ink-muted)] hover:border-indigo-500/30 hover:text-[var(--ink)]"
                      )}
                    >
                      All Categories ({tokens.length})
                    </button>
                    {(() => {
                      const categories = Array.from(new Set(tokens.map(t => t.category).filter(Boolean)));
                      return categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategoryFilter(cat!)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all",
                            selectedCategoryFilter === cat
                              ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm"
                              : "bg-[var(--card)] border-[var(--border)] text-[var(--ink-muted)] hover:border-indigo-500/30 hover:text-[var(--ink)]"
                          )}
                        >
                          {cat} ({tokens.filter(t => t.category === cat).length})
                        </button>
                      ));
                    })()}
                  </div>
                </div>

                {/* Tokens List conditional on Filtered status */}
                {(() => {
                  const filteredTokens = tokens.filter(token => {
                    if (tokenStatusFilter !== 'all') {
                      const info = getTokenLifespanInfo(token);
                      if (info.status !== tokenStatusFilter) return false;
                    }
                    if (selectedCategoryFilter !== 'all') {
                      if (token.category !== selectedCategoryFilter) return false;
                    }
                    return true;
                  });

                  if (filteredTokens.length === 0) {
                    return (
                      <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg)]/10 text-left">
                        <p className="text-xs text-[var(--ink-muted)] font-bold text-center">
                          No Meta tokens match the active filters.
                        </p>
                        <div className="flex justify-center mt-4 gap-2">
                          {tokenStatusFilter !== 'all' && (
                            <button
                              type="button"
                              onClick={() => setTokenStatusFilter('all')}
                              className="px-3 py-1.5 bg-indigo-550 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Reset Status Filter
                            </button>
                          )}
                          {selectedCategoryFilter !== 'all' && (
                            <button
                              type="button"
                              onClick={() => setSelectedCategoryFilter('all')}
                              className="px-3 py-1.5 bg-indigo-550 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                            >
                              Reset Category Filter
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return filteredTokens.map((token) => {
                    const info = getTokenLifespanInfo(token);
                    const health = calculateTokenHealth(token);
                    return (
                      <div 
                        key={token.id}
                        className="bg-[var(--bg)]/50 border border-[var(--border)] rounded-2xl p-5 hover:border-indigo-500/20 transition-all flex flex-col gap-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start md:items-center">
                          {/* Col 1: Credentials */}
                          <div className="md:col-span-5 flex items-start gap-3.5 text-left w-full">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-[var(--border)]",
                              token.platform === "Instagram" && "bg-pink-500/5 text-pink-600 dark:text-pink-400",
                              token.platform === "Facebook" && "bg-blue-500/5 text-blue-600 dark:text-blue-400",
                              token.platform === "Meta Graph API" && "bg-indigo-500/5 text-indigo-600 dark:text-indigo-400"
                            )}>
                              {token.platform === "Instagram" && <Instagram className="w-5 h-5" />}
                              {token.platform === "Facebook" && <Facebook className="w-5 h-5 text-blue-600" />}
                              {token.platform === "Meta Graph API" && <Globe className="w-5 h-5" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap text-left">
                                <h4 className="font-black text-sm text-[var(--ink)] leading-none">{token.accountName}</h4>
                                <span className={cn(
                                  "text-[9px] font-mono tracking-tight px-2 py-0.5 rounded border",
                                  token.platform === "Instagram" && "bg-pink-500/10 text-pink-500 border-pink-500/20 dark:border-pink-500/30",
                                  token.platform === "Facebook" && "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:border-blue-500/30",
                                  token.platform === "Meta Graph API" && "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 dark:border-indigo-500/30"
                                )}>
                                  {token.platform}
                                </span>
                                {token.category && (
                                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-500/90 dark:text-indigo-400">
                                    {token.category}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-[var(--ink-muted)] font-bold text-left">
                                <span>Snippet:</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopySnippet(token.id, token.tokenSnippet)}
                                  className="bg-slate-950 px-2 py-1 rounded font-mono text-[9px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                                >
                                  {token.tokenSnippet}
                                  <Copy className="w-3 h-3 text-slate-500 hover:text-white" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Col 2: Inline Health Score gauge */}
                          <div className="md:col-span-4 flex items-center gap-3 bg-[var(--bg)]/90 border border-[var(--border)] rounded-2xl p-3 select-none w-full">
                            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  className="text-slate-200 dark:text-slate-800"
                                  strokeWidth="3.5"
                                  stroke="currentColor"
                                  fill="transparent"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                  className={cn(
                                    health.score >= 85 ? "text-emerald-500" :
                                    health.score >= 60 ? "text-indigo-500" :
                                    health.score >= 30 ? "text-amber-500" : "text-rose-500"
                                  )}
                                  strokeDasharray={`${health.score}, 100`}
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                              </svg>
                              <div className="absolute text-[10px] font-black text-[var(--ink)]">
                                {health.score}%
                              </div>
                            </div>
                            
                            <div className="text-left space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black uppercase text-[var(--ink)] tracking-wider">Health Score</span>
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                  health.bgColorClass,
                                  health.textColorClass
                                )}>
                                  {health.grade}
                                </span>
                              </div>
                              <p className="text-[9px] text-[var(--ink-muted)] font-semibold leading-tight line-clamp-1 max-w-[200px]">
                                {health.description}
                              </p>
                            </div>
                          </div>

                          {/* Col 3: Visual Expiration Banner Badge */}
                          <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1 shrink-0 text-left md:text-right w-full md:w-auto">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5",
                              info.status === 'expired' && "bg-rose-500/10 text-rose-600",
                              info.status === 'warning' && "bg-amber-500/10 text-amber-600",
                              info.status === 'active' && "bg-emerald-500/10 text-emerald-600"
                            )}>
                              {info.status === 'expired' && <AlertCircle className="w-3.5 h-3.5" />}
                              {info.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                              {info.status === 'active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {info.remainingText}
                            </span>
                            <span className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-wider">
                              Type: {info.label}
                            </span>
                          </div>
                        </div>

                        {/* Lifespan Progress Bar Tracker */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest">
                            <span>Connection Health / Lifespan Remaining</span>
                            <span>{Math.round(info.percentage)}% Valid</span>
                          </div>
                          <div className="h-2 w-full bg-[var(--bg)] border border-[var(--border)] rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full transition-all duration-1000", info.colorClass)}
                              style={{ width: `${info.percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Connected Permission Scopes list */}
                        <div className="flex flex-wrap gap-1.5 border-t border-[var(--border)]/60 pt-3 justify-start">
                          {token.scopes.map((scope) => (
                            <span 
                              key={scope} 
                              className="bg-[var(--bg)] border border-[var(--border)] text-indigo-600/80 font-mono text-[9px] px-2 py-0.5 rounded tracking-tight font-black"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>

                        {/* Validation Scopes Check */}
                        {(() => {
                          const required = REQUIRED_SCOPES[token.platform];
                          const missing = required.filter(s => !token.scopes.includes(s));
                          if (missing.length === 0) return null;

                          return (
                            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-550/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                              <div className="space-y-1">
                                <span className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-wider text-amber-700 dark:text-amber-400">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-bounce" />
                                  Missing Required Scopes
                                </span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {missing.map((s) => (
                                    <span key={s} className="bg-rose-500/5 dark:bg-rose-550/10 border border-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[8.5px] px-2 py-0.5 rounded font-bold">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAutoFixScopes(token.id)}
                                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-[9.5px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/10 shrink-0 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                                title="Add all missing required scopes automatically"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-white" />
                                Auto-Fix Scopes
                              </button>
                            </div>
                          );
                        })()}

                        {/* Interactive Buttons for tokens */}
                        <div className="flex justify-between items-center border-t border-[var(--border)]/60 pt-3">
                          <div className="text-[9px] font-bold text-[var(--ink-muted)]">
                            Connected on: {new Date(token.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            {token.type === 'Short-lived' && info.status !== 'expired' && (
                              <button
                                type="button"
                                onClick={() => handleExchangeToLongLived(token.id, token.accountName)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/10 transition-all active:scale-95"
                                title="Exchange short-lived token to long-lived 60-day token"
                              >
                                <RefreshCw className="w-3 h-3 text-white animate-pulse" />
                                Exchange To Long-Lived
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteToken(token.id, token.accountName)}
                              className="p-1.5 rounded-lg border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                              title="Remove Token"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </section>

          {/* Connected Token Inspector / Debugger Card */}
          <section className="neural-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[120px] -z-10 rounded-full" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                <Cpu className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-xl text-[var(--ink)] tracking-tight">Access Token Debugger</h3>
                <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Inspect OAuth scopes and Meta metadata</p>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-muted)] mb-6 leading-relaxed font-bold">
              Paste a custom Meta User Access Token or Page Access Token below to decode inside our secure sandbox. This utility simulates calls to the Meta Graph API <code className="text-indigo-500 font-mono">/debug_token</code> endpoint.
            </p>

            <form onSubmit={handleInspectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black tracking-wider text-[var(--ink-muted)] text-left block">Raw Meta OAuth Access Token</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter EAA... token value to inspect"
                    value={inspectInput}
                    onChange={(e) => setInspectInput(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-3 pr-16 py-3 text-xs font-mono tracking-tight focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-[var(--ink)]"
                  />
                  <button
                    type="submit"
                    disabled={inspectLoading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {inspectLoading ? "Inspecting" : "Inspect"}
                  </button>
                </div>
              </div>
            </form>

            {inspectResult && (
              <div className="mt-6 p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs font-mono animate-in slide-in-from-top-2 duration-300 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-sans">Token Health Report</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] uppercase tracking-widest font-black">ACTIVE / VALID</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] font-sans font-black uppercase tracking-wider block">Target Application</span>
                    <span className="text-slate-200 font-bold">{inspectResult.application}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] font-sans font-black uppercase tracking-wider block">App ID</span>
                    <span className="text-slate-300">{inspectResult.app_id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] font-sans font-black uppercase tracking-wider block">Token Scope Type</span>
                    <span className="text-indigo-400 font-black">{inspectResult.type} Access Token</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] font-sans font-black uppercase tracking-wider block">User ID</span>
                    <span className="text-slate-300">{inspectResult.user_id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 font-sans">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider block">Expires At</span>
                    <span className="text-amber-400 font-bold font-mono">{inspectResult.expires_at}</span>
                  </div>
                  <div className="space-y-1 font-sans">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider block">Data Access Expires</span>
                    <span className="text-slate-300 font-mono">{inspectResult.data_access_expires_at}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-slate-500 text-[10px] font-sans font-black uppercase tracking-wider block">Included Permissions</span>
                  <div className="flex flex-wrap gap-1">
                    {inspectResult.scopes.map((sc: string) => (
                      <span key={sc} className="bg-white/5 border border-white/10 text-slate-300 font-mono text-[8px] px-1.5 py-0.5 rounded">
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Security Logs */}
          <section className="neural-card">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-black text-xl text-[var(--ink)] tracking-tight">Security Audit</h3>
                <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Recent Access Logs</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { event: 'API Key Verified', time: 'Just now', ip: '192.168.1.1', status: 'Success' },
                { event: 'Session Refresh', time: '14 mins ago', ip: '192.168.1.1', status: 'Success' },
                { event: 'System Variable Sync', time: '1 hour ago', ip: 'internal', status: 'Success' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0 group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs font-black text-[var(--ink)] tracking-tight uppercase">{log.event}</p>
                      <p className="text-[10px] font-bold text-[var(--ink-muted)] tracking-wider uppercase">{log.time} • IP: {log.ip}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest group-hover:scale-110 transition-transform">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          {/* Appearance Panel */}
          <section className="neural-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -z-10 rounded-full" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                {theme === "dark" ? (
                  <Moon className="w-6 h-6 text-indigo-400" />
                ) : (
                  <Sun className="w-6 h-6 text-indigo-600" />
                )}
              </div>
              <div className="text-left">
                <h3 className="font-black text-xl text-[var(--ink)] tracking-tight">Appearance</h3>
                <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Interface Theme Settings</p>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-muted)] mb-5 leading-relaxed font-bold text-left">
              Tailor your visual theme workspace. Switch between high-contrast dark mode and eye-safe clean light mode to reduce glare.
            </p>

            <div className="grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-5">
              <button
                type="button"
                onClick={() => theme === "dark" && toggleTheme && toggleTheme()}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 group relative overflow-hidden",
                  theme === "light" 
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-600/40 text-indigo-600 shadow-lg shadow-indigo-600/5 pointer-events-none" 
                    : "bg-[var(--card)] border-[var(--border)] text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  theme === "light" ? "bg-indigo-600 text-white" : "bg-slate-150 dark:bg-slate-800 text-slate-400"
                )}>
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-tight block">Light Mode</span>
                  <span className="text-[9px] text-[var(--ink-muted)] font-medium leading-none">Clean & Bright</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => theme === "light" && toggleTheme && toggleTheme()}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 group relative overflow-hidden",
                  theme === "dark" 
                    ? "bg-slate-900 border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/10 pointer-events-none" 
                    : "bg-[var(--card)] border-[var(--border)] text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  theme === "dark" ? "bg-indigo-500 text-white" : "bg-slate-150 dark:bg-slate-800 text-slate-400"
                )}>
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-tight block">Dark Mode</span>
                  <span className="text-[9px] text-[var(--ink-muted)] font-medium leading-none">Safe Slate Dark</span>
                </div>
              </button>
            </div>
          </section>

          {/* Supabase Database Auto-Sync Controller Card */}
          <section className="neural-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -z-10 rounded-full" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-xl text-[var(--ink)] tracking-tight">Supabase Sync</h3>
                <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Real-time Database sync</p>
              </div>
            </div>

            <p className="text-xs text-[var(--ink-muted)] mb-5 leading-relaxed font-bold text-left">
              Enable background state synchronization to automatically pull live keyword responders and rules from your active Supabase database clusters.
            </p>

            <div className="space-y-5 border-t border-[var(--border)] pt-5">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-black text-[var(--ink)] uppercase tracking-tight block">Auto-Sync Status</span>
                  <span className="text-[10px] text-[var(--ink-muted)] font-medium">Keep local cache in perfect match</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsAutoSyncActive(!isAutoSyncActive)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out outline-none",
                    isAutoSyncActive ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-850 border border-[var(--border)]"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out",
                      isAutoSyncActive ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* Interval Select Option */}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-black text-[var(--ink)] uppercase tracking-tight block">Sync Frequency</span>
                  <span className="text-[10px] text-[var(--ink-muted)] font-medium">Polling cycle interval</span>
                </div>
                <select
                  disabled={!isAutoSyncActive}
                  value={syncIntervalVal}
                  onChange={(e) => setSyncIntervalVal(Number(e.target.value))}
                  className="bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[11px] font-bold px-2 py-1.5 outline-none focus:border-indigo-500 text-[var(--ink)] disabled:opacity-40 transition-opacity"
                >
                  <option value={10}>Every 10s</option>
                  <option value={30}>Every 30s</option>
                  <option value={60}>Every 1m</option>
                  <option value={300}>Every 5m</option>
                </select>
              </div>

              {/* Last Synced Info */}
              <div className="flex items-center justify-between pb-3">
                <div className="text-left">
                  <span className="text-xs font-black text-[var(--ink)] uppercase tracking-tight block">Last Sync Cycle</span>
                  <span className="text-[10px] text-[var(--ink-muted)] font-medium">Pulled rules cache timestamp</span>
                </div>
                <div className="flex items-center gap-1.5 align-middle">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-mono font-bold text-[var(--ink)]">
                    {lastSyncTime || "Never"}
                  </span>
                </div>
              </div>

              {/* Status Log Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-wider block text-left">Engine Sync Console</span>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSyncRunning ? "bg-amber-400 animate-pulse" : isAutoSyncActive ? "bg-emerald-500 animate-ping" : "bg-slate-600"
                  )} />
                </div>
                <p className="text-[10px] font-mono text-indigo-400 leading-normal text-left truncate" title={syncStatusLog}>
                  {syncStatusLog}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleManualSyncClick}
                  disabled={isSyncRunning}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-600/50 text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isSyncRunning && "animate-spin")} />
                  Force Pull Rules
                </button>
              </div>
            </div>
          </section>

          <section className="neural-card bg-slate-900 border-0">
             <div className="relative z-10">
                <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Core Status</h4>
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-black tracking-tight uppercase">Encryption Level</span>
                      <span className="text-indigo-400 font-mono text-[10px]">AES-256-GCM</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-black tracking-tight uppercase">Firewall Mode</span>
                      <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Reactive
                      </span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-black tracking-tight uppercase">IP Whitelisting</span>
                      <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">Disabled</span>
                   </div>
                </div>

                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold text-white/60 leading-relaxed italic">
                     "The system core is protected by multi-layered encryption. Any unauthorized access attempts will trigger automatic isolation."
                   </p>
                </div>
             </div>
             
             {/* Decorative grid */}
             <div className="absolute inset-0 matrix-bg opacity-10 pointer-events-none" />
          </section>

          <section className="neural-card">
              <h3 className="font-black text-sm text-[var(--ink)] tracking-tight mb-6 uppercase">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                 <button className="w-full py-4 px-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)] text-[10px] font-black text-[var(--ink)] uppercase tracking-widest hover:border-indigo-500/30 transition-all flex items-center justify-center gap-3 active:scale-95">
                    <RefreshCw className="w-4 h-4" />
                    Rotate Session Tokens
                 </button>
                 <button className="w-full py-4 px-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)] text-[10px] font-black text-[var(--ink)] uppercase tracking-widest hover:border-indigo-500/30 transition-all flex items-center justify-center gap-3 active:scale-95">
                    <Save className="w-4 h-4" />
                    Export Security Log
                 </button>
              </div>
          </section>
        </div>
      </div>

      {/* Confirmation Dialog for Automatic Sync Conflict */}
      <AnimatePresence>
        {showSyncConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-[var(--border)] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full -mr-10 -mt-10" />
              
              <div className="relative z-10 space-y-6 text-[var(--ink)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[var(--ink)] tracking-tight">Active Auto-Sync</h3>
                    <p className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider">Potential Conflict Warning</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-bold">
                    Automatic sync is actively scheduled to pull rule updates every <strong className="text-[var(--ink)] font-black">{syncIntervalVal} seconds</strong>. 
                  </p>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-medium">
                    Triggering an unnecessary manual force sync might result in redundant database requests and rate-limiting side-effects. Do you wish to skip or proceed?
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSyncConfirmModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] bg-[var(--card)] text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Skip (Cancel)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSyncConfirmModal(false);
                      syncSupabaseDatabaseRules(true);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-600/10"
                  >
                    Proceed Sync
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
