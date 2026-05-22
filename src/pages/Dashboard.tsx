import React from 'react';
import { 
  Activity, 
  Target, 
  Zap, 
  MessageCircle, 
  ArrowUpRight, 
  TrendingUp,
  Cpu,
  Globe,
  ShieldCheck,
  Radar,
  Users,
  Sparkles,
  MessageSquare,
  Play,
  Pause,
  Trash2,
  Terminal,
  ArrowRight,
  Send,
  AlertCircle,
  HelpCircle,
  Hash,
  Instagram,
  Facebook
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

// Data from Analytics
const triggerHistory = [
  { date: 'May 12', triggers: 45, success: 42 },
  { date: 'May 13', triggers: 52, success: 50 },
  { date: 'May 14', triggers: 38, success: 35 },
  { date: 'May 15', triggers: 65, success: 62 },
  { date: 'May 16', triggers: 88, success: 85 },
  { date: 'May 17', triggers: 110, success: 108 },
  { date: 'May 18', triggers: 95, success: 92 },
];

const platformData = [
  { name: 'Instagram', value: 65, color: '#6366f1' },
  { name: 'Facebook', value: 35, color: '#10b981' },
];

const topKeywords = [
  { keyword: 'Price', count: 450 },
  { keyword: 'Shipping', count: 320 },
  { keyword: 'Discount', count: 280 },
  { keyword: 'Promo', count: 210 },
  { keyword: 'Help', count: 150 },
];

const responderPerformance = [
  { name: 'Price Bot', triggers: 850, rate: 98 },
  { name: 'Sale Alert', triggers: 640, rate: 95 },
  { name: 'Support Smart', triggers: 520, rate: 92 },
  { name: 'Newsletter', triggers: 410, rate: 88 },
];

const leadResponseDailyTrends = [
  { day: 'May 15', 'Automated DM': 120, 'Comment Auto-Responder': 95, 'Story Mention Reply': 45 },
  { day: 'May 16', 'Automated DM': 145, 'Comment Auto-Responder': 110, 'Story Mention Reply': 52 },
  { day: 'May 17', 'Automated DM': 130, 'Comment Auto-Responder': 102, 'Story Mention Reply': 48 },
  { day: 'May 18', 'Automated DM': 165, 'Comment Auto-Responder': 140, 'Story Mention Reply': 65 },
  { day: 'May 19', 'Automated DM': 188, 'Comment Auto-Responder': 165, 'Story Mention Reply': 85 },
  { day: 'May 20', 'Automated DM': 210, 'Comment Auto-Responder': 195, 'Story Mention Reply': 110 },
  { day: 'May 21', 'Automated DM': 195, 'Comment Auto-Responder': 175, 'Story Mention Reply': 95 },
];

const StatCard = ({ title, value, change, icon: Icon, color, bg }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="neural-card group relative overflow-hidden p-8"
  >
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", bg, color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black italic">
        <ArrowUpRight className="w-3 h-3" />
        {change}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-[var(--ink)] tracking-tighter italic">{value}</h3>
    </div>
  </motion.div>
);

const EventLog = ({ 
  logs, 
  isLive, 
  setIsLive, 
  onClear, 
  selectedLog, 
  setSelectedLog, 
  filterPlatform, 
  setFilterPlatform, 
  filterType, 
  setFilterType,
  manualText,
  setManualText,
  manualUser,
  setManualUser,
  manualPlatform,
  setManualPlatform,
  onManualTriggerSubmit
}: any) => {
  const [showSimulator, setShowSimulator] = React.useState(false);

  const filteredLogs = logs.filter((log: any) => {
    const matchesPlatform = filterPlatform === 'All' || log.platform.toLowerCase() === filterPlatform.toLowerCase();
    const matchesType = filterType === 'All' || log.type.toLowerCase() === filterType.toLowerCase() || (filterType === 'Error' && log.status.toLowerCase() === 'audit needed');
    return matchesPlatform && matchesType;
  });

  return (
    <div className="neural-card h-full flex flex-col p-8 lg:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radar className={cn("w-5 h-5 text-indigo-500", isLive && "animate-pulse")} />
          <div>
            <h3 className="text-[10px] font-black text-[var(--ink)] uppercase tracking-[0.2em] leading-none">Live Monitor</h3>
            <p className="text-[8px] font-semibold text-[var(--ink-muted)] uppercase tracking-widest mt-1">Triggers incoming</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "p-2 rounded-xl transition-all flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest",
              isLive ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-slate-500/10 text-slate-600 border border-slate-500/20"
            )}
            title={isLive ? "Pause Real-Time Stream" : "Resume Real-Time Stream"}
          >
            {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isLive ? "Streaming" : "Paused"}
          </button>
          
          <button 
            onClick={onClear}
            className="p-2 border border-[var(--border)] text-[var(--ink-muted)] hover:text-rose-500 hover:border-rose-500/20 rounded-xl transition-all"
            title="Clear Stream Logs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Simulator Toggler Section */}
      <div className="border border-[var(--border)] bg-[var(--bg)]/50 rounded-2xl p-4">
        <button
          onClick={() => setShowSimulator(!showSimulator)}
          className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--ink)]"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Trigger Playground Simulator
          </span>
          <span className="text-[9px] text-indigo-500 underline font-extrabold">
            {showSimulator ? 'Hide Drawer' : 'Show Drawer'}
          </span>
        </button>

        {showSimulator && (
          <form onSubmit={onManualTriggerSubmit} className="space-y-4 mt-4 pt-4 border-t border-[var(--border)]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest mb-1 block">Username</label>
                <input
                  type="text"
                  value={manualUser}
                  onChange={(e) => setManualUser(e.target.value)}
                  placeholder="@clara_val"
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold leading-none appearance-none outline-none focus:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest mb-1 block">Network</label>
                <select
                  value={manualPlatform}
                  onChange={(e) => setManualPlatform(e.target.value as any)}
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500/30"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest mb-1 block">Message / Comment Text</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="e.g. Do you sell pro plans with discount?"
                  className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold leading-none appearance-none outline-none focus:border-indigo-500/30"
                />
                <button
                  type="submit"
                  disabled={!manualText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl disabled:opacity-50 flex items-center gap-1.5 transition-all outline-none"
                >
                  <Send className="w-3 h-3" />
                  Inject
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-1 font-bold text-[8px] text-[var(--ink-muted)]">
              <span>Try keys:</span>
              {['PRICE', 'LOCATION', 'PROMO', 'HELP'].map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setManualText(`What is your ${k.toLowerCase()} details?`)}
                  className="px-1.5 py-0.5 bg-[var(--card)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-[var(--border)] transition-colors"
                >
                  {k}
                </button>
              ))}
            </div>
          </form>
        )}
      </div>

      {/* Mini Filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[7.5px] font-black text-[var(--ink-muted)] uppercase tracking-[0.2em] w-12">Network:</span>
          {['All', 'Instagram', 'Facebook', 'System'].map((pf: any) => (
            <button
              key={pf}
              onClick={() => setFilterPlatform(pf)}
              className={cn(
                "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                filterPlatform === pf 
                  ? "bg-slate-900 text-white dark:bg-indigo-950 dark:text-indigo-200 shadow-md shadow-slate-900/10" 
                  : "text-[var(--ink-muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
              )}
            >
              {pf}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[7.5px] font-black text-[var(--ink-muted)] uppercase tracking-[0.2em] w-12">Action:</span>
          {['All', 'Reply', 'Flow', 'Post', 'System', 'Error'].map((t: any) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn(
                "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                filterType === t 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-[var(--ink-muted)] hover:bg-[var(--bg)] hover:text-[var(--ink)]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Viewport */}
      <div className="flex-1 min-h-[180px] max-h-[280px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-[var(--ink-muted)]">
            <Terminal className="w-8 h-8 opacity-20 mb-2" />
            <p className="text-[9px] font-black uppercase tracking-widest">No matching activities</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredLogs.map((log: any) => {
              const isActive = selectedLog?.id === log.id;
              const isError = log.status.toLowerCase() === 'audit needed' || log.type === 'Error';
              const isSystem = log.platform.toLowerCase() === 'system';
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedLog(isActive ? null : log)}
                  className={cn(
                    "p-4 rounded-2xl border text-left cursor-pointer transition-all flex gap-3 items-start",
                    isActive 
                      ? "bg-indigo-500/5 border-indigo-500" 
                      : isError
                        ? "bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/15"
                        : "bg-[var(--bg)]/70 hover:bg-[var(--bg)] border-[var(--border)]"
                  )}
                >
                  <span className="text-[8.5px] font-mono font-bold text-[var(--ink-muted)] leading-none mt-1 shrink-0">{log.time}</span>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black text-[var(--ink)] truncate uppercase tracking-tight">
                        {isSystem ? 'System Engine' : log.user}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {log.platform === 'Instagram' && <Instagram className="w-2.5 h-2.5 text-pink-500" />}
                        {log.platform === 'Facebook' && <Facebook className="w-2.5 h-2.5 text-blue-600" />}
                        <span className={cn(
                          "text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider",
                          isError 
                            ? "bg-rose-500/10 text-rose-500" 
                            : log.type === 'Reply' 
                              ? "bg-indigo-500/10 text-indigo-500"
                              : log.type === 'Flow'
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-teal-500/10 text-teal-500"
                        )}>
                          {log.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-[10px] font-bold text-[var(--ink)] opacity-80 leading-normal tracking-tight truncate">
                      {log.event}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Selected Trace Details Drawer */}
      {selectedLog && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl space-y-4 shadow-xl text-left font-mono"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Core Log Trace
            </span>
            <button 
              onClick={() => setSelectedLog(null)} 
              className="text-slate-400 hover:text-white text-[9px] uppercase font-black tracking-widest"
            >
              ✕ Close
            </button>
          </div>
          <div className="space-y-2 text-[9px] leading-relaxed select-all">
            <div className="grid grid-cols-3 text-slate-400">
              <span>Trigger ID:</span>
              <span className="col-span-2 text-indigo-300 font-bold">{selectedLog.id}</span>
            </div>
            <div className="grid grid-cols-3 text-slate-400">
              <span>Timestamp:</span>
              <span className="col-span-2 text-slate-200">{selectedLog.time} UTC</span>
            </div>
            <div className="grid grid-cols-3 text-slate-400">
              <span>Target Node:</span>
              <span className="col-span-2 text-slate-200 uppercase">{selectedLog.platform} Feed</span>
            </div>
            <div className="grid grid-cols-3 text-slate-400">
              <span>Parsed Client:</span>
              <span className="col-span-2 text-teal-300">{selectedLog.user}</span>
            </div>
            <div className="grid grid-cols-3 text-slate-400">
              <span>Matched Rule:</span>
              <span className="col-span-2 text-amber-300">Keyword [{selectedLog.matched}]</span>
            </div>
            <div className="grid grid-cols-3 text-slate-400">
              <span>Processing Latency:</span>
              <span className="col-span-2 text-emerald-400 font-bold">{selectedLog.duration}</span>
            </div>
            <div className="grid grid-cols-3 text-slate-400">
              <span>Routing Node:</span>
              <span className="col-span-2 text-slate-200">SocialFlow Automation Core V2.4</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[8px] text-slate-300 whitespace-pre-wrap leading-tight">
              <span className="text-pink-400 font-bold text-[9px] block mb-1">RAW ENCRYPTED CONTEXT:</span>
              {selectedLog.payload}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [totalTriggers, setTotalTriggers] = React.useState(4285);
  const [aiAccuracy, setAiAccuracy] = React.useState(94.2);
  const [responseTime, setResponseTime] = React.useState(0.8);
  const [auditedLogs, setAuditedLogs] = React.useState(1284);
  const [isLive, setIsLive] = React.useState(true);
  
  // Real-time Event log state
  const [logs, setLogs] = React.useState<any[]>(() => [
    { id: 'l1', time: '12:42:04', event: 'Keyword "PRICE" used in DM', type: 'Reply', platform: 'Instagram', user: '@sophie_k', status: 'Success', matched: 'PRICE', duration: '0.78s', payload: 'Original content: "Hi, what is the price of the monthly subscription?" -> Generated Automatic Dispatch: "Our monthly plan starts at $29. Check it out at neural.hub/pricing"' },
    { id: 'l2', time: '12:41:55', event: 'Sending automated template via rule #4', type: 'Flow', platform: 'Instagram', user: '@brand_builder_m', status: 'Success', matched: 'N/A', duration: '0.82s', payload: 'Dispatched template asset: [onboarding_flow_v2]' },
    { id: 'l3', time: '12:41:50', event: 'New lead comments match rule #1', type: 'Post', platform: 'Facebook', user: '@daniel.m', status: 'Success', matched: 'LOCATION', duration: '0.90s', payload: 'Original content: "Where are you guys located?" -> Generated Response: "We are located at 123 Neural St, Matrix City! Open 24/7."' },
    { id: 'l4', time: '12:40:12', event: 'Task "Lead Gen Verification" succeeded', type: 'System', platform: 'System', user: 'SYSTEM', status: 'Success', matched: 'N/A', duration: '1.20s', payload: 'Background system trace checks completed successfully.' },
    { id: 'l5', time: '12:38:45', event: 'System check: Heartbeat healthy', type: 'System', platform: 'System', user: 'SYSTEM', status: 'Success', matched: 'N/A', duration: '0.45s', payload: 'Operational node responder report status 200.' },
  ]);

  const [filterPlatform, setFilterPlatform] = React.useState<'All' | 'Instagram' | 'Facebook' | 'System'>('All');
  const [filterType, setFilterType] = React.useState<'All' | 'Reply' | 'Flow' | 'Post' | 'System' | 'Error'>('All');
  const [selectedLog, setSelectedLog] = React.useState<any | null>(null);

  // Playground form states
  const [manualUser, setManualUser] = React.useState('@clara_val');
  const [manualText, setManualText] = React.useState('');
  const [manualPlatform, setManualPlatform] = React.useState<'Instagram' | 'Facebook'>('Instagram');

  // Trigger generator effect
  React.useEffect(() => {
    if (!isLive) return;

    const names = [
      '@alex_g', '@brent_m', '@clara_val', '@david_rocks', '@emma_design',
      '@fiona.x', '@gabe_code', '@hanna_h', '@ian_travels', '@julia_m'
    ];

    const triggersPool = [
      {
        text: 'How much does the business plan cost?',
        keyword: 'PRICE',
        response: 'Our monthly plan starts at $29. Check it out at neural.hub/pricing',
        type: 'Reply',
      },
      {
        text: 'Where are you guys located? Any physical address?',
        keyword: 'LOCATION',
        response: 'We are located at 123 Neural St, Matrix City! Open 24/7.',
        type: 'Reply',
      },
      {
        text: 'Hey do you have any promo discount?',
        keyword: 'PROMO',
        response: 'Use code WELCOME10 for 10% off your first month subscription.',
        type: 'Reply',
      },
      {
        text: 'Can I get some help with integration?',
        keyword: 'HELP',
        response: 'We have dispatched this query to our live support team! Ticket #401.',
        type: 'Reply',
      },
      {
        text: 'Is there active shipping to standard areas?',
        keyword: 'SHIPPING',
        response: 'Standard shipping is free for all plans!',
        type: 'Reply',
      }
    ];

    const generateEvent = () => {
      const randomIdx = Math.floor(Math.random() * triggersPool.length);
      const randomTrigger = triggersPool[randomIdx];
      const randomUser = names[Math.floor(Math.random() * names.length)];
      const platform = Math.random() > 0.45 ? 'Instagram' : 'Facebook';
      
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const isSuccess = Math.random() > 0.12; // 12% warning / audit rate

      const newLog = {
        id: 'live_' + Math.floor(Math.random() * 100000),
        time: timeStr,
        event: isSuccess 
          ? `Keyword "${randomTrigger.keyword}" matched via DM`
          : `Audit notice: Verification mismatch for rule ${randomTrigger.keyword}`,
        type: isSuccess ? randomTrigger.type : 'Error',
        platform,
        user: randomUser,
        status: isSuccess ? 'Success' : 'Audit Needed',
        matched: randomTrigger.keyword,
        duration: (0.4 + Math.random() * 0.8).toFixed(2) + 's',
        payload: `Original message: "${randomTrigger.text}" -> Generated Automatic Dispatch: "${randomTrigger.response}"`
      };

      setLogs(prev => {
        const withNew = [newLog, ...prev];
        return withNew.slice(0, 40); // Max 40
      });

      // Update counters dynamically
      setTotalTriggers(prev => prev + 1);
      
      if (isSuccess) {
        setAiAccuracy(prev => {
          const delta = (Math.random() * 0.1 - 0.04);
          return Math.min(100, Math.max(90, parseFloat((prev + delta).toFixed(2))));
        });
      } else {
        setAuditedLogs(prev => prev + 1);
        setAiAccuracy(prev => {
          const delta = (Math.random() * 0.15 + 0.05);
          return Math.max(90, parseFloat((prev - delta).toFixed(2)));
        });
      }

      setResponseTime(prev => {
        const currentLatency = 0.4 + Math.random() * 0.8;
        return parseFloat(((prev * 19 + currentLatency) / 20).toFixed(2));
      });
    };

    const runLoop = () => {
      generateEvent();
      const nextDelay = 3000 + Math.random() * 4000; // randomized 3-7s delay interval
      timerId = setTimeout(runLoop, nextDelay);
    };

    let timerId = setTimeout(runLoop, 4000);
    return () => clearTimeout(timerId);
  }, [isLive]);

  const handleManualTriggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const normalizedText = manualText.toUpperCase();
    const matchedKeyword = ['PRICE', 'LOCATION', 'PROMO', 'HELP', 'SHIPPING', 'DISCOUNT'].find(kw => 
      normalizedText.includes(kw)
    ) || 'GENERIC';

    const mockResponses: { [key: string]: string } = {
      PRICE: 'Our monthly plan starts at $29. Check it out at neural.hub/pricing',
      LOCATION: 'We are located at 123 Neural St, Matrix City! Open 24/7.',
      PROMO: 'Use code WELCOME10 for 10% off your first month subscription.',
      HELP: 'We have dispatched this query to our live support team! Ticket #401.',
      SHIPPING: 'Standard shipping is free for all plans!',
      DISCOUNT: 'Use code WELCOME10 for 10% off your first month subscription.',
      GENERIC: 'Thank you for your message! Our AI engine is reviewing your comment.'
    };

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const manualLog = {
      id: 'manual_' + Math.floor(Math.random() * 100000),
      time: timeStr,
      event: `Custom Payload matched via ${manualPlatform}`,
      type: 'Reply',
      platform: manualPlatform,
      user: manualUser.startsWith('@') ? manualUser : `@${manualUser}`,
      status: 'Success',
      matched: matchedKeyword,
      duration: '0.34s',
      payload: `Manual Test Message: "${manualText}" -> Routed Dispatch Response: "${mockResponses[matchedKeyword]}"`
    };

    setLogs(prev => [manualLog, ...prev]);
    setTotalTriggers(prev => prev + 1);
    setManualText('');
  };

  return (
    <div className="space-y-10 matrix-bg min-h-screen pb-20">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Triggers" value={totalTriggers.toLocaleString()} change="+12%" icon={Zap} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="AI Accuracy" value={`${aiAccuracy}%`} change="+2.1%" icon={Activity} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Audited Logs" value={auditedLogs.toLocaleString()} change="+142" icon={ShieldCheck} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Response Time" value={`${responseTime}s`} change="-0.2s" icon={TrendingUp} color="text-cyan-600" bg="bg-cyan-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 neural-card h-[500px] flex flex-col p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[var(--ink)] tracking-tight italic">Triggers Activity</h3>
              <p className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">Growth over the last 7 days</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">Success</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={triggerHistory}>
                <defs>
                  <linearGradient id="colorTriggers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94A3B8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94A3B8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    padding: '16px',
                    fontSize: '10px',
                    fontWeight: 800
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="triggers" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTriggers)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-1">
          <EventLog 
            logs={logs}
            isLive={isLive}
            setIsLive={setIsLive}
            onClear={() => setLogs([])}
            selectedLog={selectedLog}
            setSelectedLog={setSelectedLog}
            filterPlatform={filterPlatform}
            setFilterPlatform={setFilterPlatform}
            filterType={filterType}
            setFilterType={setFilterType}
            manualText={manualText}
            setManualText={setManualText}
            manualUser={manualUser}
            setManualUser={setManualUser}
            manualPlatform={manualPlatform}
            setManualPlatform={setManualPlatform}
            onManualTriggerSubmit={handleManualTriggerSubmit}
          />
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Distribution */}
        <div className="neural-card p-10 flex flex-col items-center">
          <h3 className="text-xl font-black text-[var(--ink)] italic tracking-tight mb-2">Platform Distribution</h3>
          <p className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-widest mb-8">Triggers per network</p>
          
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-[var(--ink)] italic">100%</span>
              <span className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Active</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-8">
            {platformData.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--ink)]">{p.name}</span>
                </div>
                <span className="text-sm font-black italic text-indigo-600">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hottest Keywords */}
        <div className="neural-card p-10">
          <div className="flex items-center justify-between mb-10">
             <div className="space-y-1">
              <h3 className="text-xl font-black text-[var(--ink)] italic tracking-tight">Hottest Keywords</h3>
              <p className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">Most triggered terms</p>
            </div>
            <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-6">
            {topKeywords.map((k, i) => (
              <div key={k.keyword} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--ink)] italic">#{k.keyword}</span>
                  <span className="text-[10px] font-black text-indigo-500">{k.count} hits</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(k.count / 450) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Response Protocol Performance Trends */}
      <div className="neural-card p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xl font-black text-[var(--ink)] tracking-tight italic">
                Lead Response Protocol
              </h3>
            </div>
            <p className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">
              Execution Trends of Active Automations Over the Past Week
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
            <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1.5 rounded-xl">
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Active: 3 rules</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1.5 rounded-xl">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Success Rate: 99.4%</span>
            </div>
          </div>
        </div>

        {/* Visual Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
          <div className="p-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] mb-1">
              Automated DM Node
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[var(--ink)] italic">1,113</span>
              <span className="text-[8px] text-emerald-500 font-bold font-mono">+12.4%</span>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] mb-1">
              Comment Auto-Responder
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[var(--ink)] italic">982</span>
              <span className="text-[8px] text-emerald-500 font-bold font-mono">+8.7%</span>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col justify-between">
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] mb-1">
              Story Mention Reply
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[var(--ink)] italic">517</span>
              <span className="text-[8px] text-emerald-500 font-bold font-mono">+15.1%</span>
            </div>
          </div>
        </div>

        {/* Line Chart Container */}
        <div className="h-[320px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadResponseDailyTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: '#94A3B8' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fontWeight: 700, fill: '#94A3B8' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '16px',
                  fontSize: '10px',
                  fontWeight: 800
                }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ 
                  fontSize: '9px', 
                  fontWeight: 900, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="Automated DM" 
                stroke="#6366f1" 
                strokeWidth={3.5} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Comment Auto-Responder" 
                stroke="#ec4899" 
                strokeWidth={3.5} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Story Mention Reply" 
                stroke="#10b981" 
                strokeWidth={3.5} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Responder Health */}
      <div className="neural-card p-10">
        <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
            <h3 className="text-xl font-black text-[var(--ink)] italic tracking-tight">Responder Health</h3>
            <p className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">Efficiency rankings</p>
          </div>
          <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
            Optimization Settings <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-[var(--ink-muted)]">Responder</th>
                <th className="text-center py-4 text-[10px] font-black uppercase tracking-widest text-[var(--ink-muted)]">Triggers</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-[var(--ink-muted)]">Success</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {responderPerformance.map((rp) => (
                <tr key={rp.name} className="group">
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-[var(--ink)] italic">{rp.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <span className="text-sm font-bold text-[var(--ink)]">{rp.triggers}</span>
                  </td>
                  <td className="py-6 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black italic">
                      {rp.rate}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Checks & Team Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Instagram API', status: 'Good', icon: ShieldCheck },
            { label: 'Automation Engine', status: 'Working', icon: Zap },
            { label: 'Database', status: 'Fast', icon: Activity },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-[var(--card)] border border-[var(--border)] rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--bg)] rounded-2xl flex items-center justify-center text-[var(--ink-muted)]">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-black text-[var(--ink)] tracking-tight">{item.status}</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          ))}
        </div>

        <div className="neural-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ink)]">Top Auditors</h4>
          </div>
          {[
            { name: 'Sarah C.', audits: 142, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
            { name: 'Mike R.', audits: 98, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
            { name: 'Alex V.', audits: 76, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
          ].map((member, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/10 overflow-hidden">
                  <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-[var(--ink)]">{member.name}</span>
              </div>
              <span className="text-[10px] font-black text-indigo-500 font-mono italic">{member.audits}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

