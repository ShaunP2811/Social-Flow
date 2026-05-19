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
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ApiKeyStatus {
  name: string;
  description: string;
  isSet: boolean;
  type: 'AI' | 'Database' | 'Platform';
  envVar: string;
  icon: React.ElementType;
}

const Settings = () => {
  const [keyStatuses, setKeyStatuses] = useState<ApiKeyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeyInfo, setShowKeyInfo] = useState<string | null>(null);

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
    </div>
  );
};

export default Settings;
