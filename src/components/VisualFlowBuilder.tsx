import React, { useState, useEffect } from "react";
import {
  Zap,
  Filter,
  Heart,
  MessageSquare,
  Send,
  Play,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Cpu,
  CornerDownRight,
  HelpCircle,
  ThumbsUp,
  AlertCircle,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Target,
  ClipboardList,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

// Make sure the interface matches KeywordResponder in KeywordResponders
interface KeywordResponder {
  id: string;
  platform: "Instagram" | "Facebook";
  keywords: string[];
  responseTemplates?: string[];
  randomizeTemplates?: boolean;
  autoLike?: boolean;
  publicReply?: boolean;
  publicReplyTemplate?: string;
  status: "Active" | "Draft" | "Paused";
  triggerCount: number;
  lastTriggered: string;
  createdAt: string;
  scope: "All" | "Posts";
  targetedPostIds?: string[];
  internalNotes?: string;
  verificationStatus: "Verified" | "Pending" | "Draft";
  successRate?: number;
  conversionRate?: number;
  avgLatency?: number;
  enableFallback?: boolean;
  fallbackResponseTemplate?: string;
  fallbackPublicReplyTemplate?: string;
  fallbackTriggerCount?: number;
}

interface VisualFlowBuilderProps {
  responders: KeywordResponder[];
  onSelectResponder?: (responderId: string) => void;
  onEditResponder?: (responderId: string) => void;
  onDeleteResponder?: (responderId: string) => void;
}

export default function VisualFlowBuilder({
  responders,
  onSelectResponder,
  onEditResponder,
  onDeleteResponder,
}: VisualFlowBuilderProps) {
  // Select first active responder by default or the first in the list
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (responders && responders.length > 0) {
      return responders[0].id;
    }
    return "";
  });

  // State to simulate trigger pulse journey
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [activePulseNode, setActivePulseNode] = useState<
    "trigger" | "filter" | "likes" | "reply" | "dm" | null
  >(null);

  // Heatmap mode state
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);

  // Card expand states for templates & targeting
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Toggle state to hide/fade inactive rules
  const [hideInactiveRules, setHideInactiveRules] = useState(false);

  // Deletion confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (deletingId) {
      const timer = setTimeout(() => {
        setDeletingId(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deletingId]);

  // Latency heatmap shades (shades of green/amber/red based on average response latency)
  const getLatencyColor = (latency: number) => {
    if (latency < 0.5) {
      return {
        border: "border-emerald-500/80 dark:border-emerald-500/60",
        bg: "bg-emerald-50/50 dark:bg-emerald-950/10",
        text: "text-emerald-500",
        iconBg: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500",
        pulse: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
        connector: "border-emerald-500/40 dark:border-emerald-500/30",
        glow: "#10b981"
      };
    } else if (latency <= 1.0) {
      return {
        border: "border-amber-500/80 dark:border-amber-500/60",
        bg: "bg-amber-50/50 dark:bg-amber-950/10",
        text: "text-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-500/10 text-amber-500",
        pulse: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
        connector: "border-amber-500/40 dark:border-amber-500/30",
        glow: "#f59e0b"
      };
    } else {
      return {
        border: "border-rose-500/80 dark:border-rose-500/60",
        bg: "bg-rose-50/50 dark:bg-rose-950/10",
        text: "text-rose-500",
        iconBg: "bg-rose-100 dark:bg-rose-500/10 text-rose-500",
        pulse: "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]",
        connector: "border-rose-500/50 dark:border-rose-500/30",
        glow: "#f43f5e"
      };
    }
  };

  // Sync state if responders prop changes or selection updates
  useEffect(() => {
    if (responders && responders.length > 0 && !selectedId) {
      setSelectedId(responders[0].id);
    }
  }, [responders, selectedId]);

  const activeResponder = responders.find((r) => r.id === selectedId) || responders[0];

  // Handler to trigger the visual diagnostic laser flow
  const handlePlayFlow = () => {
    if (isPlayingAnimation) return;
    setIsPlayingAnimation(true);

    const stages: Array<"trigger" | "filter" | "likes" | "reply" | "dm"> = [
      "trigger",
      "filter",
      "likes",
      "reply",
      "dm",
    ];

    let currentStageIndex = 0;

    const runStage = () => {
      if (currentStageIndex < stages.length) {
        setActivePulseNode(stages[currentStageIndex]);
        currentStageIndex++;
        setTimeout(runStage, 900); // Pulse duration per node step
      } else {
        setActivePulseNode(null);
        setIsPlayingAnimation(false);
      }
    };

    runStage();
  };

  if (!activeResponder) {
    return (
      <div className="neural-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="font-black text-lg text-[var(--ink)]">No Automation Rules Configured</h3>
        <p className="text-xs text-[var(--ink-muted)] max-w-sm mt-1 leading-relaxed">
          Create an automation responder in the "Rules" tab first to visualize its trigger diagram.
        </p>
      </div>
    );
  }

  // Format templates to display
  const templates = activeResponder.responseTemplates || [
    "Thanks! Direct flow link dispatched to your DMs.",
  ];
  const publicReplyText = activeResponder.publicReplyTemplate || "Check your direct messages! 📩";

  // Mock statistics for selected flows if none exist
  const statSuccess = activeResponder.successRate ?? 99.2;
  const statConversion = activeResponder.conversionRate ?? 46.5;
  const statLatency = activeResponder.avgLatency ?? 0.74;

  const lColor = getLatencyColor(statLatency);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6">
      {/* LEFT: Quick Selector Side Panel (Col-span-4) */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        <div
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={() => setIsCardHovered(false)}
          className={cn(
            "neural-card relative flex flex-col transition-all duration-500 ease-in-out",
            (isCardExpanded || isCardHovered) ? "max-h-[1150px] shadow-xl shadow-indigo-500/[0.04]" : "max-h-[640px] overflow-hidden",
            activeResponder?.status === "Active" && "animate-pulse-subtle",
            (hideInactiveRules && activeResponder?.status !== "Active") && "opacity-50 hover:opacity-100"
          )}
        >
          {/* Status Indicator Dot & Hide Toggle at top-right */}
          <div className="absolute top-5 right-6 flex flex-col items-end gap-1.5 z-20">
            <div className="flex items-center gap-1.5" title={`Current Selected Flow Status: ${activeResponder?.status}`}>
              <span className="relative flex h-2 w-2">
                {activeResponder?.status === "Active" && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2 w-2 transition-colors duration-300",
                    activeResponder?.status === "Active"
                      ? "bg-emerald-500"
                      : activeResponder?.status === "Paused"
                      ? "bg-amber-500"
                      : "bg-slate-400"
                  )}
                />
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                {activeResponder?.status}
              </span>
            </div>

            {/* Hide Toggle Switch */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none group/hide-toggle" title="Fade card if currently selected rule is Paused or Draft">
              <span className="text-[8px] font-black uppercase tracking-wider text-[var(--ink-muted)] group-hover/hide-toggle:text-indigo-500 transition-colors">
                Hide Inactive
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hideInactiveRules}
                  onChange={(e) => setHideInactiveRules(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-6 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-2.5 after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-white after:rounded-full after:h-2.5 after:w-2.5 after:shadow-sm after:transition-all peer-checked:bg-indigo-500"></div>
              </div>
            </label>
          </div>

          <div 
            onClick={() => setIsCardExpanded(!isCardExpanded)}
            className="flex items-center justify-between mb-4 pr-16 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 p-1 -m-1 rounded-2xl transition-colors"
            title="Click to toggle expanded template & targeting details"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[var(--ink)]">Automation Flows</h3>
                {isCardExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-indigo-500 transition-transform" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-indigo-500 transition-transform" />
                )}
              </div>
              <p className="text-[9px] uppercase tracking-widest text-[var(--ink-muted)] font-black">
                {isCardExpanded ? "Click to collapse specs" : "Hover or click to expand"}
              </p>
            </div>
            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black shrink-0">
              {responders.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar">
            {responders.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    if (onSelectResponder) onSelectResponder(item.id);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer select-none",
                    isSelected
                      ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-600/40 text-indigo-600 shadow-md shadow-indigo-600/5"
                      : "bg-[var(--card)] border-[var(--border)] text-[var(--ink)] hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-tight block max-w-[150px] truncate">
                        {item.keywords.map((k) => `#${k}`).join(", ")}
                      </span>
                      <span
                        className={cn(
                          "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                          item.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : item.status === "Paused"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-slate-500/10 text-slate-500"
                        )}
                      >
                        {item.status}
                      </span>
                      {item.enableFallback && (
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 border",
                            (item.fallbackTriggerCount || 0) > 0
                              ? "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400"
                              : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                          )}
                          title="Fallback Analytics"
                        >
                          <span className={cn("w-1 h-1 rounded-full", (item.fallbackTriggerCount || 0) > 0 ? "bg-amber-500 animate-pulse" : "bg-slate-400")} />
                          Fallback: {item.fallbackTriggerCount || 0}
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] font-medium text-[var(--ink-muted)] flex flex-wrap items-center gap-1.5">
                      <span>{item.platform}</span>
                      <span>•</span>
                      <span>{item.triggerCount} runs</span>
                      {item.enableFallback && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider flex items-center gap-0.5 border border-amber-500/15">
                            fallback: {item.fallbackTriggerCount || 0} intercepts
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {onDeleteResponder && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (deletingId === item.id) {
                            onDeleteResponder(item.id);
                            setDeletingId(null);
                          } else {
                            setDeletingId(item.id);
                          }
                        }}
                        className={cn(
                          "p-2 rounded-xl transition-all duration-300 relative focus:outline-none",
                          deletingId === item.id
                            ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/20 scale-110"
                            : "text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 opacity-0 group-hover:opacity-100"
                        )}
                        title={deletingId === item.id ? "Click again to confirm deletion!" : "Delete responder"}
                        aria-label="Delete responder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deletingId === item.id && (
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                          </span>
                        )}
                      </button>
                    )}
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isSelected ? "text-indigo-600 translate-x-1" : "text-slate-400 group-hover:translate-x-1"
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animated Expanded specs & templates drawer section */}
          <AnimatePresence>
            {(isCardExpanded || isCardHovered) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="border-t border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/35 p-4 shrink-0 overflow-hidden"
              >
                <div className="space-y-4 text-left">
                  {/* Title Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--ink-muted)] flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-indigo-500" />
                      Flow Specifications
                    </span>
                    <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-widest leading-none">
                      Active Specs
                    </span>
                  </div>

                  {/* Targeting Criteria Grid */}
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-3 space-y-2.5 shadow-sm">
                    <div className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] flex items-center gap-1">
                      <Target className="w-3 h-3 text-pink-500" />
                      Targeting Criteria
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[9px]">
                      <div className="p-1 px-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-[var(--border)] flex items-center justify-between">
                        <span className="text-[var(--ink-muted)] font-medium">Platform:</span>
                        <span className="font-bold text-[var(--ink)]">{activeResponder.platform}</span>
                      </div>
                      <div className="p-1 px-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-[var(--border)] flex items-center justify-between">
                        <span className="text-[var(--ink-muted)] font-medium">Scope:</span>
                        <span className="font-bold text-[var(--ink)]">{activeResponder.scope === "All" ? "All Content" : "Specific Posts"}</span>
                      </div>
                      <div className="col-span-2 p-1.5 px-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-[var(--border)] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--ink-muted)] font-medium">Trigger Keywords:</span>
                          <span className="font-bold text-indigo-500">{activeResponder.keywords.length} active</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activeResponder.keywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md font-mono text-[8px] border border-indigo-500/10 font-bold">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      {activeResponder.scope === "Posts" && activeResponder.targetedPostIds && activeResponder.targetedPostIds.length > 0 && (
                        <div className="col-span-2 p-1.5 px-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-[var(--border)]">
                          <span className="text-[var(--ink-muted)] font-medium block mb-1">Targeted Posts:</span>
                          <div className="flex flex-wrap gap-1">
                            {activeResponder.targetedPostIds.map((id, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-pink-50 dark:bg-pink-950/45 text-pink-600 dark:text-pink-400 rounded-md font-mono text-[8.5px] border border-pink-500/10">
                                ID: {id}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response Templates List */}
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-3 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-emerald-500" />
                        Response Templates ({templates.length})
                      </div>
                      {activeResponder.randomizeTemplates && (
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black uppercase tracking-widest text-right">
                          Randomized
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar">
                      {templates.map((tpl, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-[var(--border)] text-[9px] flex items-start gap-2">
                          <span className="w-4 h-4 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 rounded-md flex items-center justify-center font-bold text-[8px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-[var(--ink)] block break-words leading-relaxed font-medium">
                            {tpl}
                          </span>
                        </div>
                      ))}
                      
                      {activeResponder.publicReply && (
                        <div className="p-2 bg-pink-50/40 dark:bg-pink-950/5 rounded-xl border border-pink-500/15 text-[9px] space-y-1">
                          <span className="font-extrabold uppercase text-[7.5px] text-pink-500 tracking-wider block">Public Feed Reply Template:</span>
                          <span className="text-[var(--ink)] block italic">
                            "{publicReplyText}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Last Successful Dispatch Highlight Footer */}
          <div className="mt-auto border-t border-[var(--border)] bg-indigo-50/30 dark:bg-indigo-950/20 px-4 py-3.5 flex items-center justify-between shrink-0 rounded-b-3xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-[var(--ink-muted)] block leading-none">
                  Last Successful Dispatch
                </span>
                <span className="text-[8px] font-medium text-[var(--ink-muted)] block mt-1">
                  Active Rule: {activeResponder.keywords.length > 0 ? `#${activeResponder.keywords[0]}` : "None"} • Match Verified
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-[var(--border)] px-3 py-1 rounded-full shadow-sm">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">
                {activeResponder.lastTriggered || "No active dispatches"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Diagnostics Metrics Panel */}
        <div className="neural-card bg-slate-950 text-white relative overflow-hidden p-6 border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-[40px] pointer-events-none rounded-full" />
          <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            Live Analytics & Health
          </h4>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-[8px] uppercase tracking-wider text-white/40 block">Conversion</span>
              <span className="text-xs font-black text-indigo-400 block mt-1">{statConversion}%</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-[8px] uppercase tracking-wider text-white/40 block">Success Rate</span>
              <span className="text-xs font-black text-emerald-400 block mt-1">{statSuccess}%</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-[8px] uppercase tracking-wider text-white/40 block">Avg Latency</span>
              <span className="text-xs font-black text-amber-400 block mt-1">{statLatency}s</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="text-[9px] font-mono text-white/50">Last response latency:</div>
            <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-semibold font-mono">
              Excellent
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Visual Canvas (Col-span-8) */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        <div className="neural-card relative min-h-[500px] flex flex-col p-6 overflow-hidden">
          {/* Canvas Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f108_1px,transparent_1px),linear-gradient(to_bottom,#6366f108_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

          {/* Canvas Header / Controller bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4 mb-6 relative z-10">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping shrink-0" />
                <h3 className="font-black text-base text-[var(--ink)] tracking-tight">
                  {activeResponder.platform} Flow Map
                </h3>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                Visual Flow Debugger Interface
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setHeatmapEnabled(!heatmapEnabled)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  heatmapEnabled
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5 hover:border-indigo-500/50 animate-pulse"
                    : "bg-[var(--card)] border-[var(--border)] text-[var(--ink-muted)] hover:border-slate-300 dark:hover:border-slate-700"
                )}
                title="Toggle Latency Heatmap Mode to color paths based on avg response speed"
              >
                <Activity className={cn("w-3.5 h-3.5", heatmapEnabled ? "text-indigo-500 animate-spin" : "text-slate-400")} />
                Latency Heatmap: {heatmapEnabled ? "ON" : "OFF"}
              </button>

              <button
                type="button"
                onClick={handlePlayFlow}
                disabled={isPlayingAnimation}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  isPlayingAnimation
                    ? "bg-slate-100 dark:bg-slate-800 text-[var(--ink-muted)] cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/10 active:scale-95"
                )}
              >
                <Play className="w-3.5 h-3.5 text-white animate-pulse" />
                Animate Path Simulation
              </button>
            </div>
          </div>

          {heatmapEnabled && (
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-5 py-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-[1.8rem] border border-[var(--border)] mb-6 text-[10px] relative z-10 transition-all shadow-sm">
              <span className="font-extrabold text-[var(--ink-muted)] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-bounce"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Heatmap Paths:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[var(--ink-muted)] font-medium">Fast (&lt;0.5s)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-[var(--ink-muted)] font-medium">Moderate (0.5s - 1.0s)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-[var(--ink-muted)] font-medium">Slow (&gt;1.0s)</span>
              </div>
              <div className="ml-auto flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                <span>Observed Execution State:</span>
                <span className={cn(
                  "font-black px-2.5 py-1 rounded-xl text-[10px] uppercase font-mono tracking-wider border transition-colors",
                  lColor.border,
                  lColor.bg,
                  lColor.text
                )}>
                  {statLatency}s avg latency
                </span>
              </div>
            </div>
          )}

          {/* ACTIVE FLOW CHART COMPONENT */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-[380px]">
            
            {/* Horizontal Layout containing Interactive Node Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, scale: 0.98, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 pb-6"
              >
                
                {/* NODE 1: COMMENT TRIGGER */}
              <motion.div
                animate={activePulseNode === "trigger" ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "w-full lg:w-[200px] bg-[var(--card)] border rounded-[1.8rem] p-5 shadow-sm transition-all relative text-left cursor-pointer hover:shadow-lg dark:hover:shadow-indigo-500/5",
                  heatmapEnabled
                    ? `${lColor.border} ${lColor.bg} shadow-md`
                    : activePulseNode === "trigger" ? "border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10" : "border-[var(--border)]"
                )}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center transition-colors",
                    heatmapEnabled ? lColor.iconBg : "bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-500"
                  )}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest font-black text-indigo-500 block">Trigger Node</span>
                    <span className="text-[11px] font-black text-[var(--ink)]">User Comment</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-[var(--border)] overflow-hidden">
                  <div className="text-[8px] text-[var(--ink-muted)] font-bold mb-1 uppercase">Keywords matched:</div>
                  <div className="flex flex-wrap gap-1">
                    {activeResponder.keywords.map((kw, i) => (
                      <span
                        key={kw + i}
                        className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase px-2 py-0.5 rounded"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Laser Point Output Connector */}
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-900 border border-[var(--border)] flex items-center justify-center">
                  <div className={cn("w-2 h-2 rounded-full", activePulseNode === "trigger" ? "bg-indigo-600 animate-ping" : "bg-slate-400")} />
                </div>
              </motion.div>

              {/* ARROW OR CONNECTOR SVG 1 */}
              <div className="hidden lg:block flex-1 max-w-[40px] h-0.5 relative">
                <div className={cn("absolute inset-0 bg-dashed border-b-2 border-dashed w-full transition-colors", heatmapEnabled ? lColor.connector : "border-indigo-400/30")} />
                {activePulseNode === "trigger" && (
                  <motion.div
                    initial={{ left: 0 }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 0.9, ease: "linear" }}
                    className={cn("absolute -top-1 w-2.5 h-2.5 rounded-full", heatmapEnabled ? lColor.pulse : "bg-indigo-500 shadow-[0_0_10px_#6366f1]")}
                  />
                )}
              </div>

              {/* NODE 2: FLOW FILTER & SCOPE */}
              <motion.div
                animate={activePulseNode === "filter" ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "w-full lg:w-[200px] bg-[var(--card)] border rounded-[1.8rem] p-5 shadow-sm transition-all relative text-left cursor-pointer hover:shadow-lg dark:hover:shadow-pink-500/5",
                  heatmapEnabled
                    ? `${lColor.border} ${lColor.bg} shadow-md`
                    : activePulseNode === "filter" ? "border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10" : "border-[var(--border)]"
                )}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center transition-colors",
                    heatmapEnabled ? lColor.iconBg : "bg-pink-600/10 text-pink-500"
                  )}>
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest font-black text-pink-500 block">Guard Gate</span>
                    <span className="text-[11px] font-black text-[var(--ink)]">Filter Conditions</span>
                  </div>
                </div>

                <div className="space-y-2 py-1 text-[10px]">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5">
                    <span className="text-[9px] text-[var(--ink-muted)]">Platform:</span>
                    <span className="font-extrabold text-[var(--ink)] uppercase tracking-wider">{activeResponder.platform}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5">
                    <span className="text-[9px] text-[var(--ink-muted)]">Scope:</span>
                    <span className="font-extrabold text-[var(--ink)] uppercase tracking-wider">
                      {activeResponder.scope === "All" ? "All Posts" : "Target Posts"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[var(--ink-muted)]">Verified Badge:</span>
                    <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                      AUTO
                    </span>
                  </div>
                </div>

                {/* Connectors */}
                <div className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-900 border border-[var(--border)] flex items-center justify-center">
                  <div className={cn("w-2 h-2 rounded-full", activePulseNode === "filter" ? "bg-indigo-600" : "bg-slate-400")} />
                </div>
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-900 border border-[var(--border)] flex items-center justify-center">
                  <div className={cn("w-2 h-2 rounded-full", activePulseNode === "filter" ? "bg-indigo-600 animate-ping" : "bg-slate-400")} />
                </div>
              </motion.div>

              {/* CONNECTOR SVG 2 */}
              <div className="hidden lg:block flex-1 max-w-[40px] h-0.5 relative">
                <div className={cn("absolute inset-0 bg-dashed border-b-2 border-dashed w-full transition-colors", heatmapEnabled ? lColor.connector : "border-indigo-400/30")} />
                {activePulseNode === "filter" && (
                  <motion.div
                    initial={{ left: 0 }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 0.9, ease: "linear" }}
                    className={cn("absolute -top-1 w-2.5 h-2.5 rounded-full", heatmapEnabled ? lColor.pulse : "bg-indigo-500 shadow-[0_0_10px_#6366f1]")}
                  />
                )}
              </div>

              {/* NODE 3: DUAL ACTION ENGAGEMENT NODE */}
              <div className="flex flex-col gap-6 w-full lg:w-[220px]">
                
                {/* Auto-Like Box Action */}
                <motion.div
                  animate={activePulseNode === "likes" ? { scale: 1.05, y: -1 } : { scale: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "bg-[var(--card)] border rounded-2xl p-3.5 shadow-sm text-left relative transition-all cursor-pointer hover:shadow-md dark:hover:shadow-emerald-500/5",
                    heatmapEnabled
                      ? `${lColor.border} ${lColor.bg} shadow-md`
                      : activePulseNode === "likes" ? "border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10" : "border-[var(--border)]",
                    !activeResponder.autoLike && "opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className={cn("w-4 h-4", activeResponder.autoLike ? "text-rose-500 fill-rose-500/20" : "text-slate-400")} />
                      <span className="text-[10px] font-black text-[var(--ink)]">Auto-Like Comment</span>
                    </div>
                    {activeResponder.autoLike ? (
                      <span className="text-[8px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                        Skip
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Auto-Reply Box Action */}
                <motion.div
                  animate={activePulseNode === "reply" ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "bg-[var(--card)] border rounded-[1.8rem] p-4.5 shadow-sm text-left relative transition-all cursor-pointer hover:shadow-lg dark:hover:shadow-indigo-500/5",
                    heatmapEnabled
                      ? `${lColor.border} ${lColor.bg} shadow-md`
                      : activePulseNode === "reply" ? "border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10" : "border-[var(--border)]",
                    !activeResponder.publicReply && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <div>
                      <span className="text-[8px] uppercase tracking-widest font-black text-indigo-500 block">Immediate Action</span>
                      <span className="text-[10px] font-black text-[var(--ink)]">Public Reply Comment</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-2.5 border border-[var(--border)] font-mono text-[9px] text-[var(--ink-muted)] line-clamp-2 italic leading-relaxed">
                    "{activeResponder.publicReply ? publicReplyText : "Disabled"}"
                  </div>

                  {/* Connectors */}
                  <div className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-900 border border-[var(--border)] flex items-center justify-center">
                    <div className={cn("w-2 h-2 rounded-full", activePulseNode === "likes" || activePulseNode === "reply" ? "bg-indigo-600" : "bg-slate-400")} />
                  </div>
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-900 border border-[var(--border)] flex items-center justify-center">
                    <div className={cn("w-2 h-2 rounded-full", activePulseNode === "reply" ? "bg-indigo-600 animate-ping" : "bg-slate-400")} />
                  </div>
                </motion.div>

              </div>

              {/* CONNECTOR SVG 3 */}
              <div className="hidden lg:block flex-1 max-w-[40px] h-0.5 relative">
                <div className={cn("absolute inset-0 bg-dashed border-b-2 border-dashed w-full transition-colors", heatmapEnabled ? lColor.connector : "border-indigo-400/30")} />
                {activePulseNode === "reply" && (
                  <motion.div
                    initial={{ left: 0 }}
                    animate={{ left: "100%" }}
                    transition={{ duration: 0.9, ease: "linear" }}
                    className={cn("absolute -top-1 w-2.5 h-2.5 rounded-full", heatmapEnabled ? lColor.pulse : "bg-indigo-500 shadow-[0_0_10px_#6366f1]")}
                  />
                )}
              </div>

              {/* NODE 4: DM DISPATCH (ENDPOINT!) */}
              <motion.div
                animate={activePulseNode === "dm" ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "w-full lg:w-[220px] bg-[var(--card)] border rounded-[1.8rem] p-5 shadow-sm transition-all relative text-left cursor-pointer hover:shadow-lg dark:hover:shadow-emerald-500/5",
                  heatmapEnabled
                    ? `${lColor.border} ${lColor.bg} shadow-md`
                    : activePulseNode === "dm" ? "border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10" : "border-[var(--border)]"
                )}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-pulse">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest font-black text-emerald-500 block">End Target Action</span>
                    <span className="text-[11px] font-black text-[var(--ink)]">DM Auto-Dispatch</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[8px] text-[var(--ink-muted)] border-b border-[var(--border)] pb-1.5 font-bold uppercase tracking-wider">
                    <span>Message Template:</span>
                    {activeResponder.randomizeTemplates && (
                      <span className="bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 px-1 rounded">
                        RANDOMIZED
                      </span>
                    )}
                  </div>
                  <div className="max-h-24 overflow-y-auto pr-1">
                    {templates.map((tmpl, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "bg-slate-50 dark:bg-slate-900 rounded-xl p-2.5 border text-[9px] text-[var(--ink-muted)] tracking-tight leading-relaxed font-semibold italic mb-2 relative overflow-hidden",
                          idx === 0 ? "border-indigo-100 dark:border-indigo-950 font-medium" : "border-[var(--border)]"
                        )}
                      >
                        {idx === 0 && (
                          <div className="absolute top-0 right-0 px-1 bg-indigo-600/10 text-indigo-500 text-[6px] font-black uppercase">
                            Primary
                          </div>
                        )}
                        "{tmpl}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left Connector */}
                <div className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-50 dark:bg-slate-900 border border-[var(--border)] flex items-center justify-center">
                  <div className={cn("w-2 h-2 rounded-full", activePulseNode === "reply" || activePulseNode === "dm" ? "bg-indigo-600" : "bg-slate-400")} />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Step Guides for beginners */}
            <div className="w-full flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-500/10 rounded-2xl p-4 mt-6 text-left">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                <p className="text-[11px] text-[var(--ink-muted)] leading-normal font-medium">
                  <strong>How the flow resolves:</strong> Comments matching matching keywords trigger immediate 
                  evaluations. Qualified comments are liked, matched with a public reply comment, and then a direct DM is automatically dispatched in the backend pipeline.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
