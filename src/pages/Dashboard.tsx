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
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
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
  Cell
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

const EventLog = () => (
  <div className="neural-card h-full flex flex-col p-10">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Radar className="w-5 h-5 text-indigo-500 animate-pulse" />
        <h3 className="text-[10px] font-black text-[var(--ink)] uppercase tracking-[0.2em]">Activity Log</h3>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Live</span>
      </div>
    </div>
    
    <div className="flex-1 space-y-6 overflow-hidden">
      {[
        { time: '12:42:04', event: 'Keyword "PRICE" used in DM', type: 'Reply' },
        { time: '12:41:55', event: 'Sending automated template', type: 'Flow' },
        { time: '12:41:50', event: 'New lead from a post', type: 'Post' },
        { time: '12:40:12', event: 'Task "Lead Gen" finished', type: 'Task' },
        { time: '12:38:45', event: 'System check: Everything is working', type: 'System' },
      ].map((log, i) => (
        <div key={i} className="flex gap-4 items-start group">
          <span className="text-[9px] font-mono text-[var(--ink-muted)] mt-1">{log.time}</span>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-[var(--ink)] tracking-tight opacity-80">{log.event}</p>
            <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-[0.2em]">{log.type}</span>
          </div>
        </div>
      ))}
    </div>
    
    <button className="mt-8 w-full py-4 border border-[var(--border)] rounded-2xl text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest hover:bg-[var(--bg)] transition-colors">
      View All History
    </button>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-10 matrix-bg min-h-screen pb-20">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Triggers" value="4,285" change="+12%" icon={Zap} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="AI Accuracy" value="94.2%" change="+2.1%" icon={Activity} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Audited Logs" value="1,284" change="+142" icon={ShieldCheck} color="text-amber-600" bg="bg-amber-50" />
        <StatCard title="Response Time" value="0.8s" change="-0.2s" icon={TrendingUp} color="text-cyan-600" bg="bg-cyan-50" />
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
          <EventLog />
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

