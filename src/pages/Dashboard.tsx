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
  Facebook,
  Database,
  Clock,
  Timer,
  History
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

const performanceTrendsData = [
  { date: 'May 11', automated: 85, human: 32 },
  { date: 'May 12', automated: 92, human: 28 },
  { date: 'May 13', automated: 110, human: 35 },
  { date: 'May 14', automated: 95, human: 42 },
  { date: 'May 15', automated: 120, human: 38 },
  { date: 'May 16', automated: 135, human: 41 },
  { date: 'May 17', automated: 150, human: 45 },
  { date: 'May 18', automated: 142, human: 39 },
  { date: 'May 19', automated: 160, human: 48 },
  { date: 'May 20', automated: 175, human: 52 },
  { date: 'May 21', automated: 158, human: 44 },
  { date: 'May 22', automated: 165, human: 40 },
  { date: 'May 23', automated: 180, human: 55 },
  { date: 'May 24', automated: 195, human: 62 },
  { date: 'May 25', automated: 210, human: 58 },
  { date: 'May 26', automated: 188, human: 50 },
  { date: 'May 27', automated: 172, human: 46 },
  { date: 'May 28', automated: 190, human: 53 },
  { date: 'May 29', automated: 205, human: 61 },
  { date: 'May 30', automated: 220, human: 65 },
  { date: 'May 31', automated: 235, human: 57 },
  { date: 'Jun 01', automated: 215, human: 49 },
  { date: 'Jun 02', automated: 200, human: 42 },
  { date: 'Jun 03', automated: 228, human: 51 },
  { date: 'Jun 04', automated: 240, font: 56, human: 56 }, // Keep human/automated simple
  { date: 'Jun 05', automated: 265, human: 68 },
  { date: 'Jun 06', automated: 280, human: 72 },
  { date: 'Jun 07', automated: 255, human: 60 },
  { date: 'Jun 08', automated: 242, human: 53 },
  { date: 'Jun 09', automated: 260, human: 59 },
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

            <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--border)] border-dashed">
              <span className="text-[8px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 animate-pulse" />
                Simulate System Incident
              </span>
              <button
                type="button"
                onClick={() => {
                  const errorId = 'live_' + Math.floor(Math.random() * 100000);
                  const errorLog = {
                    id: errorId,
                    time: new Date().toTimeString().split(' ')[0],
                    event: `Audit notice: Verification mismatch for rule CUSTOM_MANUAL_SIM`,
                    type: 'Error',
                    platform: manualPlatform,
                    user: manualUser,
                    status: 'Audit Needed',
                    matched: 'CUSTOM_MANUAL_SIM',
                    duration: '0.94s',
                    payload: `Manual simulation of critical verification failure: User comment "${manualText || 'No message entered'}" matched automated flow but failed parity check.`
                  };
                  
                  // Insert simulated log block
                  window.dispatchEvent(new CustomEvent('insert-simulated-log', { detail: errorLog }));
                  
                  // Trigger toast notification
                  window.dispatchEvent(
                    new CustomEvent('social-flow-toast', {
                      detail: {
                        id: errorId,
                        title: "Automation Rule Execution Failed",
                        message: `Parity verification audit mismatch for user ${manualUser} on ${manualPlatform}. Raised record #${errorId}.`,
                        type: "error",
                        duration: 8000
                      }
                    })
                  );
                }}
                className="w-full text-center px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-[8px] uppercase tracking-widest rounded-xl border border-rose-500/20 transition-all cursor-pointer hover:scale-102 active:scale-98"
              >
                Force Simulated Rule Match Audit Error
              </button>

              <div className="h-[1px] bg-[var(--border)] border-dashed my-1" />

              <span className="text-[8px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Simulate Platform API Call
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const apiId = 'api_' + Math.floor(Math.random() * 100000);
                    const now = new Date();
                    const timeStr = now.toTimeString().split(' ')[0];
                    const endpoint = manualPlatform === 'Instagram' ? 'graph.instagram.com/v16.0/me/messages' : 'graph.facebook.com/v16.0/me/messages';
                    const successLog = {
                      id: apiId,
                      time: timeStr,
                      event: `POST /${manualPlatform === 'Instagram' ? 'ig' : 'fb'}/messages (SUCCESS - 200 OK)`,
                      type: 'API Call',
                      platform: manualPlatform,
                      user: 'META_GRAPH_API',
                      status: 'Success',
                      matched: 'N/A',
                      duration: (0.2 + Math.random() * 0.4).toFixed(2) + 's',
                      payload: `Request Endpoint: POST https://${endpoint}\nRecipient User: ${manualUser}\nMessage Body: {"messaging_type": "RESPONSE", "recipient": {"id": "usr_${Math.floor(Math.random()*10000)}"}, "message": {"text": "${manualText || 'Our product catalog has been successfully sent to your Direct Messages!'}"}}\n\nResponse 200 OK:\n{\n  "recipient_id": "usr_${Math.floor(Math.random()*10000)}",\n  "message_id": "mid.api_${Math.floor(Math.random()*100000)}"\n}`
                    };

                    window.dispatchEvent(new CustomEvent('insert-simulated-log', { detail: successLog }));
                    window.dispatchEvent(
                      new CustomEvent('social-flow-toast', {
                        detail: {
                          id: apiId,
                          title: "API Call Successful",
                          message: `Dispatched comments-to-DMs payload to Meta Graph API for user ${manualUser} on ${manualPlatform}.`,
                          type: "success",
                          duration: 4000
                        }
                      })
                    );
                  }}
                  className="w-full text-center px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[8px] uppercase tracking-widest rounded-xl border border-emerald-500/20 transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  API Success
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const apiId = 'api_' + Math.floor(Math.random() * 100000);
                    const now = new Date();
                    const timeStr = now.toTimeString().split(' ')[0];
                    const endpoint = manualPlatform === 'Instagram' ? 'graph.instagram.com/v16.0/me/messages' : 'graph.facebook.com/v16.0/me/messages';
                    const failedLog = {
                      id: apiId,
                      time: timeStr,
                      event: `POST /${manualPlatform === 'Instagram' ? 'ig' : 'fb'}/messages (FAILED - 401 Unauthorized)`,
                      type: 'API Call',
                      platform: manualPlatform,
                      user: 'META_GRAPH_API',
                      status: 'Audit Needed',
                      matched: 'N/A',
                      duration: (0.6 + Math.random() * 0.6).toFixed(2) + 's',
                      payload: `Request Endpoint: POST https://${endpoint}\nRecipient User: ${manualUser}\nMessage Body: {"messaging_type": "RESPONSE", "recipient": {"id": "usr_${Math.floor(Math.random()*10000)}"}, "message": {"text": "Manual API template payload content."}}\n\nResponse 401 Unauthorized:\n{\n  "error": {\n    "message": "Error validating access token: Session has expired or is otherwise invalid on current page node.",\n    "type": "OAuthException",\n    "code": 190,\n    "error_subcode": 463,\n    "fbtrace_id": "FBT_${Math.floor(Math.random()*100000)}" \n  }\n}`
                    };

                    window.dispatchEvent(new CustomEvent('insert-simulated-log', { detail: failedLog }));
                    window.dispatchEvent(
                      new CustomEvent('social-flow-toast', {
                        detail: {
                          id: apiId,
                          title: "External API Call Failed",
                          message: `Meta OAuth validation failed with 401 Unauthorized error code 190 for user ${manualUser}.`,
                          type: "error",
                          duration: 7500
                        }
                      })
                    );
                  }}
                  className="w-full text-center px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-[8px] uppercase tracking-widest rounded-xl border border-rose-500/20 transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  API Failure
                </button>
              </div>
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
          {['All', 'Reply', 'Flow', 'Post', 'System', 'API Call', 'Error'].map((t: any) => (
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
                                : log.type === 'API Call'
                                  ? "bg-purple-500/10 text-purple-500"
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

export default function Dashboard({ activeAccount = "Instagram: @social_flow" }: { activeAccount?: string }) {
  // 30 Days Performance Trends Calculations
  const totalAutomated30d = React.useMemo(() => performanceTrendsData.reduce((sum, item) => sum + item.automated, 0), []);
  const totalHuman30d = React.useMemo(() => performanceTrendsData.reduce((sum, item) => sum + item.human, 0), []);
  const totalInteractions30d = totalAutomated30d + totalHuman30d;
  const automationRate30d = React.useMemo(() => ((totalAutomated30d / (totalInteractions30d || 1)) * 100).toFixed(1), [totalAutomated30d, totalInteractions30d]);
  const reclaimedHours = React.useMemo(() => Math.round((totalAutomated30d * 45) / 3600), [totalAutomated30d]);

  const [totalTriggers, setTotalTriggers] = React.useState(4285);
  const [aiAccuracy, setAiAccuracy] = React.useState(94.2);
  const [responseTime, setResponseTime] = React.useState(0.8);
  const [auditedLogs, setAuditedLogs] = React.useState(1284);
  const [isLive, setIsLive] = React.useState(true);
  const [showAdvisor, setShowAdvisor] = React.useState(true);
  
  // Supabase Auto-Sync States
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [isAutoSyncActive, setIsAutoSyncActive] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("supabase_auto_sync_active") === "true";
    }
    return false;
  });
  const [lastSyncTime, setLastSyncTime] = React.useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("supabase_last_sync_time") || null;
    }
    return null;
  });
  const [syncIntervalVal, setSyncIntervalVal] = React.useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("supabase_auto_sync_interval")) || 30;
    }
    return 30;
  });
  const [countdown, setCountdown] = React.useState<number | null>(null);
  const [syncHistory, setSyncHistory] = React.useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const histStr = localStorage.getItem("supabase_sync_history");
        return histStr ? JSON.parse(histStr) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [showHistory, setShowHistory] = React.useState(false);

  const runBackgroundSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    window.dispatchEvent(new CustomEvent("social-flow-sync", { detail: { status: true } }));
    try {
      const response = await fetch('/api/automations');
      if (response.ok) {
        const rules = await response.json();
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        localStorage.setItem("supabase_last_sync_time", timeStr);
        localStorage.setItem("supabase_last_sync_timestamp", String(now.getTime()));
        setLastSyncTime(timeStr);

        // Update sync history
        const updatedHistory = (() => {
          try {
            const histStr = localStorage.getItem("supabase_sync_history") || "[]";
            const currentHistory = Array.isArray(JSON.parse(histStr)) ? JSON.parse(histStr) : [];
            return [timeStr, ...currentHistory.filter((t: string) => t !== timeStr)].slice(0, 5);
          } catch (e) {
            return [timeStr];
          }
        })();
        localStorage.setItem("supabase_sync_history", JSON.stringify(updatedHistory));
        setSyncHistory(updatedHistory);

        window.dispatchEvent(
          new CustomEvent("social-flow-toast", {
            detail: {
              title: "Periodic Rules Synced",
              message: `Successfully loaded ${rules.length || 0} rules from the Supabase database.`,
              type: "success",
              duration: 3000
            }
          })
        );
      }
    } catch (err) {
      console.error("Dashboard background sync failed", err);
    } finally {
      setIsSyncing(false);
      window.dispatchEvent(new CustomEvent("social-flow-sync", { detail: { status: false } }));
    }
  };

  React.useEffect(() => {
    if (!isAutoSyncActive) {
      setCountdown(null);
      return;
    }

    // Set first countdown immediately based on existing timestamp
    const updateCountdown = () => {
      const lastSyncTsStr = localStorage.getItem("supabase_last_sync_timestamp");
      if (!lastSyncTsStr) {
        runBackgroundSync();
        return;
      }
      const lastSyncTs = Number(lastSyncTsStr);
      const elapsedSeconds = Math.floor((Date.now() - lastSyncTs) / 1000);
      const remaining = syncIntervalVal - elapsedSeconds;

      if (remaining <= 0) {
        runBackgroundSync();
      } else {
        setCountdown(remaining);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [isAutoSyncActive, syncIntervalVal, isSyncing]);

  React.useEffect(() => {
    let syncAnimTimeout: any = null;

    const checkSyncStatus = () => {
      if (typeof window !== "undefined") {
        const active = localStorage.getItem("supabase_auto_sync_active") === "true";
        const lastSync = localStorage.getItem("supabase_last_sync_time") || null;
        const interval = Number(localStorage.getItem("supabase_auto_sync_interval")) || 30;
        
        setIsAutoSyncActive(active);
        setLastSyncTime(lastSync);
        setSyncIntervalVal(interval);

        try {
          const histStr = localStorage.getItem("supabase_sync_history");
          if (histStr) {
            setSyncHistory(JSON.parse(histStr));
          }
        } catch (e) {
          // fallback
        }
      }
    };
    
    checkSyncStatus();
    
    // Listen for events dispatched from Settings to immediately adapt
    const handleSyncChange = () => {
      checkSyncStatus();
      setIsSyncing(true);
      if (syncAnimTimeout) clearTimeout(syncAnimTimeout);
      syncAnimTimeout = setTimeout(() => {
        setIsSyncing(false);
      }, 1000);
    };

    window.addEventListener("social-flow-toast", handleSyncChange);
    window.addEventListener("social-flow-sync", handleSyncChange);
    window.addEventListener("storage", handleSyncChange);
    
    const intervalId = setInterval(checkSyncStatus, 2000);
    
    return () => {
      window.removeEventListener("social-flow-toast", handleSyncChange);
      window.removeEventListener("social-flow-sync", handleSyncChange);
      window.removeEventListener("storage", handleSyncChange);
      clearInterval(intervalId);
      if (syncAnimTimeout) clearTimeout(syncAnimTimeout);
    };
  }, []);
  
  // Real-time Event log state
  const [logs, setLogs] = React.useState<any[]>(() => [
    { id: 'l1', time: '12:42:04', event: 'Keyword "PRICE" used in DM', type: 'Reply', platform: 'Instagram', user: '@sophie_k', status: 'Success', matched: 'PRICE', duration: '0.78s', payload: 'Original content: "Hi, what is the price of the monthly subscription?" -> Generated Automatic Dispatch: "Our monthly plan starts at $29. Check it out at neural.hub/pricing"' },
    { id: 'l_api_1', time: '12:41:58', event: 'POST /ig/messages (SUCCESS - 200 OK)', type: 'API Call', platform: 'Instagram', user: 'META_GRAPH_API', status: 'Success', matched: 'N/A', duration: '0.34s', payload: 'Request Endpoint: POST https://graph.instagram.com/v16.0/me/messages\nRecipient User: @sophie_k\nMessage Body: {"messaging_type": "RESPONSE", "recipient": {"id": "usr_94382"}, "message": {"text": "Our monthly plan starts at $29. Check it out at neural.hub/pricing"}}\n\nResponse 200 OK:\n{\n  "recipient_id": "usr_94382",\n  "message_id": "mid.api_84310"\n}' },
    { id: 'l2', time: '12:41:55', event: 'Sending automated template via rule #4', type: 'Flow', platform: 'Instagram', user: '@brand_builder_m', status: 'Success', matched: 'N/A', duration: '0.82s', payload: 'Dispatched template asset: [onboarding_flow_v2]' },
    { id: 'l3', time: '12:41:50', event: 'New lead comments match rule #1', type: 'Post', platform: 'Facebook', user: '@daniel.m', status: 'Success', matched: 'LOCATION', duration: '0.90s', payload: 'Original content: "Where are you guys located?" -> Generated Response: "We are located at 123 Neural St, Matrix City! Open 24/7."' },
    { id: 'l_api_2', time: '12:41:12', event: 'POST /fb/messages (FAILED - 400 Bad Request)', type: 'API Call', platform: 'Facebook', user: 'META_GRAPH_API', status: 'Audit Needed', matched: 'N/A', duration: '1.12s', payload: 'Request Endpoint: POST https://graph.facebook.com/v16.0/me/messages\nRecipient User: @daniel.m\nMessage Body: {"messaging_type": "RESPONSE", "recipient": {"id": "usr_48210"}, "message": {"text": "Thank you for matching! Our AI is reviewing."}}\n\nResponse 400 Bad Request:\n{\n  "error": {\n    "message": "Error validating access token: Session has expired or is otherwise invalid or has revoked permissions.",\n    "type": "OAuthException",\n    "code": 190,\n    "error_subcode": 463,\n    "fbtrace_id": "FBT_493820"\n  }\n}' },
    { id: 'l4', time: '12:40:12', event: 'Task "Lead Gen Verification" succeeded', type: 'System', platform: 'System', user: 'SYSTEM', status: 'Success', matched: 'N/A', duration: '1.20s', payload: 'Background system trace checks completed successfully.' },
    { id: 'l5', time: '12:38:45', event: 'System check: Heartbeat healthy', type: 'System', platform: 'System', user: 'SYSTEM', status: 'Success', matched: 'N/A', duration: '0.45s', payload: 'Operational node responder report status 200.' },
  ]);

  const [filterPlatform, setFilterPlatform] = React.useState<'All' | 'Instagram' | 'Facebook' | 'System'>('All');
  const [filterType, setFilterType] = React.useState<'All' | 'Reply' | 'Flow' | 'Post' | 'System' | 'API Call' | 'Error'>('All');
  const [selectedLog, setSelectedLog] = React.useState<any | null>(null);

  // Playground form states
  const [manualUser, setManualUser] = React.useState('@clara_val');
  const [manualText, setManualText] = React.useState('');
  const [manualPlatform, setManualPlatform] = React.useState<'Instagram' | 'Facebook'>('Instagram');

  const currentPlatform = activeAccount.includes("Instagram") ? "Instagram" : "Facebook";

  React.useEffect(() => {
    setFilterPlatform(currentPlatform as any);
    setManualPlatform(currentPlatform as any);
  }, [activeAccount, currentPlatform]);

  // Insert simulated logs directly
  React.useEffect(() => {
    const handleInsertLog = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setLogs(prev => [customEvent.detail, ...prev]);
        setTotalTriggers(prev => prev + 1);
        setAuditedLogs(prev => prev + 1);
        window.dispatchEvent(
          new CustomEvent('responder-trigger-execution', { detail: customEvent.detail })
        );
      }
    };
    window.addEventListener('insert-simulated-log', handleInsertLog);
    return () => {
      window.removeEventListener('insert-simulated-log', handleInsertLog);
    };
  }, []);

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
      const isApiCallChance = Math.random() > 0.65;
      const randomIdx = Math.floor(Math.random() * triggersPool.length);
      const randomTrigger = triggersPool[randomIdx];
      const randomUser = names[Math.floor(Math.random() * names.length)];
      const platform = Math.random() > 0.45 ? 'Instagram' : 'Facebook';
      
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const isSuccess = Math.random() > 0.12; // 12% warning / audit rate

      let newLog: any;

      if (isApiCallChance) {
        const isApiSuccess = Math.random() > 0.15;
        const endpoint = platform === 'Instagram' ? 'graph.instagram.com/v16.0/me/messages' : 'graph.facebook.com/v16.0/me/messages';
        newLog = {
          id: 'live_api_' + Math.floor(Math.random() * 100000),
          time: timeStr,
          event: isApiSuccess 
            ? `POST /${platform === 'Instagram' ? 'ig' : 'fb'}/messages (SUCCESS - 200 OK)`
            : `POST /${platform === 'Instagram' ? 'ig' : 'fb'}/messages (FAILED - 400 Bad Request)`,
          type: 'API Call',
          platform,
          user: 'META_GRAPH_API',
          status: isApiSuccess ? 'Success' : 'Audit Needed',
          matched: 'N/A',
          duration: (0.2 + Math.random() * 0.4).toFixed(2) + 's',
          payload: isApiSuccess
            ? `Request URL: POST https://${endpoint}\nHeaders: {"Authorization": "Bearer EAAG..."}\nRecipient User Name: "${randomUser}"\nBody: {"messaging_type": "RESPONSE", "recipient": {"id": "usr_${Math.floor(Math.random()*10000)}"}, "message": {"text": "${randomTrigger.response}"}}\n\nResponse 200 OK:\n{\n  "recipient_id": "usr_${Math.floor(Math.random()*10000)}",\n  "message_id": "mid.api_${Math.floor(Math.random()*100000)}"\n}`
            : `Request URL: POST https://${endpoint}\nHeaders: {"Authorization": "Bearer EAAG..."}\nRecipient User Name: "${randomUser}"\nBody: {"messaging_type": "RESPONSE", "recipient": {"id": "usr_${Math.floor(Math.random()*10000)}"}, "message": {"text": "${randomTrigger.response}"}}\n\nResponse 400 Bad Request:\n{\n  "error": {\n    "message": "The user has not logged in or active session of the page has expired.",\n    "type": "OAuthException",\n    "code": 190,\n    "error_subcode": 463,\n    "fbtrace_id": "FBT_${Math.floor(Math.random()*1000000)}"\n  }\n}`
        };
      } else {
        newLog = {
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
      }

      setLogs(prev => {
        const withNew = [newLog, ...prev];
        return withNew.slice(0, 40); // Max 40
      });

      // Dispatch real-time indicator alert
      window.dispatchEvent(
        new CustomEvent('responder-trigger-execution', { detail: newLog })
      );

      // Dispatch global toast on failure/audit needed
      if (newLog.status === 'Audit Needed') {
        window.dispatchEvent(
          new CustomEvent('social-flow-toast', {
            detail: {
              id: newLog.id,
              title: newLog.type === 'API Call' ? "External API Call Failed" : "Automation Execution Failed",
              message: newLog.type === 'API Call'
                ? `Meta Platform Graph OAuth verification failed for user ${randomUser}. Raising incident #${newLog.id}.`
                : `Audit required: Rule verification mismatch on ${platform} for user ${randomUser}. Raised record #${newLog.id}.`,
              type: "error",
              duration: 7500
            }
          })
        );
      }

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
    window.dispatchEvent(
      new CustomEvent('responder-trigger-execution', { detail: manualLog })
    );
    setManualText('');
  };

  return (
    <div className="space-y-10 matrix-bg min-h-screen pb-20">
      {/* Dynamic Focused Header */}
      <div className="bg-gradient-to-r from-indigo-50/50 to-indigo-100/10 dark:from-indigo-950/25 dark:to-transparent border border-indigo-100/50 dark:border-indigo-950/60 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Automated Hub Context
          </span>
          <h1 className="text-3xl font-black text-[var(--ink)] tracking-tighter uppercase italic">
            Workspace: {activeAccount.split(':')[1]?.trim() || activeAccount}
          </h1>
          <p className="text-xs text-[var(--ink-muted)] sm:text-sm font-bold leading-relaxed">
            {activeAccount.includes("Instagram") 
              ? "Monitoring live Instagram feeds, comments, direct messages, and automated keyword flows." 
              : "Monitoring live Facebook updates, messenger queries, wall post comments, and active rules."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Supabase Sync Status Widget */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl px-5 py-3 border border-indigo-500/15 text-center min-w-[140px] relative overflow-hidden block hover:bg-indigo-500/15 transition-all select-none group"
            >
              {/* Shimmer Effect */}
              {isSyncing && (
                <motion.div
                  initial={{ left: "-150%" }}
                  animate={{ left: "150%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent -skew-x-12 pointer-events-none z-10"
                />
              )}
              
              <div className="text-[9px] font-black uppercase tracking-widest text-indigo-500 flex items-center justify-center gap-1 relative z-10">
                <span className="inline-block shrink-0">
                  <Database className="w-3 h-3 text-indigo-500" />
                </span>
                Sync Status
              </div>
              <div className="text-xs font-black flex items-center gap-1.5 justify-center mt-1 uppercase tracking-wider relative z-10">
                {isAutoSyncActive ? (
                  <div className="flex items-center gap-1.5 relative">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 text-emerald-400"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-500 font-extrabold text-[11px]">Auto ({syncIntervalVal}s)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="text-[var(--ink-muted)] text-[11px]">Manual Only</span>
                  </div>
                )}
              </div>
              <div className="text-[8px] font-mono font-bold text-[var(--ink-muted)] mt-1 flex items-center justify-center gap-1 relative z-10">
                <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                Last: {lastSyncTime || "N/A"}
              </div>
              {isAutoSyncActive && countdown !== null && (
                <div className="text-[8px] font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center justify-center gap-1 relative z-10">
                  <Timer className="w-2.5 h-2.5 text-indigo-550 dark:text-indigo-400 shrink-0" />
                  Next: {countdown}s
                </div>
              )}
              
              {/* Subtle view log tag */}
              <div className="mt-1.5 pt-1.5 border-t border-indigo-500/10 text-[7px] font-bold uppercase tracking-widest text-indigo-500 group-hover:text-indigo-600 flex items-center justify-center gap-1 relative z-10">
                <History className="w-2 h-2" />
                {showHistory ? "Close Log" : "Sync History"}
              </div>
            </button>

            {/* Sync History Dropdown overlay */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl shadow-indigo-500/5 p-4 z-50 text-left"
                >
                  <div className="flex items-center justify-between border-b border-indigo-100 dark:border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-indigo-500" />
                      Sync History
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.removeItem("supabase_sync_history");
                        setSyncHistory([]);
                      }}
                      className="text-[8px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-700 bg-rose-500/5 dark:bg-rose-500/10 px-1.5 py-0.5 rounded transition-colors"
                    >
                      Clear Log
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {syncHistory.length === 0 ? (
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold italic py-3 text-center">
                        No recent syncs logged
                      </div>
                    ) : (
                      syncHistory.map((time, idx) => (
                        <div 
                          key={time + idx} 
                          className="flex items-center justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="font-mono text-[9px]">{time}</span>
                          </div>
                          <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 font-black uppercase">
                            {idx === 0 ? "Latest" : `#${syncHistory.length - idx}`}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="text-[8px] text-slate-400 dark:text-slate-500 font-bold text-center mt-3 pt-2 border-t border-slate-100 dark:border-white/5 uppercase tracking-wide">
                    Tracks last 5 syncs
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-emerald-500/10 text-emerald-600 rounded-2xl px-5 py-3 border border-emerald-500/20 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Node Status</div>
            <div className="text-xs font-black flex items-center gap-1.5 justify-center mt-1 uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Connected
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Account Advice Panel */}
      {showAdvisor && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-550/25 rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/15">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1.5 flex-1 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Team Architecture Tip: Unified Page Access Setup
                </span>
                <button 
                  onClick={() => setShowAdvisor(false)} 
                  className="text-[9px] text-amber-600 dark:text-amber-400 font-black uppercase tracking-wider hover:underline"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-xs text-[var(--ink)] font-black leading-normal">
                👋 Do we need separate tokens if multiple child pages are owned by one master Facebook profile?
              </p>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-bold">
                <strong>No!</strong> If all business pages and Instagram accounts belong to the same Facebook account or Business Manager, you only need to issue and track <strong>one master token</strong> in settings with all required permissions. The platform will automatically authorize and route comments/DMs correctly across all pages contextually!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Triggers" value={totalTriggers.toLocaleString()} change="+12%" icon={Zap} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="AI Accuracy" value={`${aiAccuracy}%`} change="+2.1%" icon={Activity} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Audited Logs" value={auditedLogs.toLocaleString()} change="+142" icon={ShieldCheck} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Response Time" value={`${responseTime}s`} change="-0.2s" icon={TrendingUp} color="text-cyan-600" bg="bg-cyan-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 neural-card h-[350px] sm:h-[450px] lg:h-[500px] flex flex-col p-6 sm:p-10">
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
        <div className="neural-card p-6 sm:p-10 flex flex-col items-center">
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
        <div className="neural-card p-6 sm:p-10">
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

      {/* Performance Trends 30d Card */}
      <div id="performance-trends-card" className="neural-card p-6 sm:p-10 space-y-8 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h3 className="text-xl font-black text-[var(--ink)] tracking-tight italic">
                Performance Trends (Last 30 Days)
              </h3>
            </div>
            <p className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">
              Automated responses versus manual human-to-human interactions
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-3.5 py-1.5 rounded-2xl">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <div className="leading-none text-left">
                <span className="text-[7.5px] font-black uppercase text-[var(--ink-muted)] block">Automated</span>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 block">
                  {totalAutomated30d.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/10 px-3.5 py-1.5 rounded-2xl">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="leading-none text-left">
                <span className="text-[7.5px] font-black uppercase text-[var(--ink-muted)] block">Human</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                  {totalHuman30d.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-amber-50/50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/20 px-3.5 py-1.5 rounded-2xl">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="leading-none text-left">
                <span className="text-[7.5px] font-black uppercase text-[var(--ink-muted)] block">Automation Ratio</span>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
                  {automationRate30d}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
          <div className="p-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] mb-1">
              Active Scaling Ratio
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[var(--ink)] italic">
                {(totalAutomated30d / (totalHuman30d || 1)).toFixed(1)}x
              </span>
              <span className="text-[8px] text-indigo-500 font-bold font-mono">Efficiency Spike</span>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] mb-1">
              Monthly Human Hand-offs
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[var(--ink)] italic">
                {Math.round(totalHuman30d * 0.15)}
              </span>
              <span className="text-[8px] text-emerald-500 font-bold font-mono">-18% load</span>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] mb-1">
              Errors Resolved Pre-Escalation
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[var(--ink)] italic">99.1%</span>
              <span className="text-[8px] text-indigo-500 font-bold font-mono">Failsafe active</span>
            </div>
          </div>

          <div className="p-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col justify-between text-left">
            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)] mb-1">
              Time Reclaimed (Calculated)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[var(--ink)] italic">
                {reclaimedHours}h
              </span>
              <span className="text-[8px] text-indigo-500 font-bold font-mono">~45s per response</span>
            </div>
          </div>
        </div>

        {/* Area Chart Container */}
        <div className="h-[340px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceTrendsData}>
              <defs>
                <linearGradient id="colorTrendAutomated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTrendHuman" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
              <Area 
                type="monotone" 
                name="Automated Responses"
                dataKey="automated" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTrendAutomated)" 
              />
              <Area 
                type="monotone" 
                name="Human Interactions"
                dataKey="human" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTrendHuman)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Responder Health */}
      <div className="neural-card p-6 sm:p-10">
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

