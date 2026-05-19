import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  NavLink,
  Link,
  useLocation
} from 'react-router-dom';
import { 
  Zap, 
  LayoutDashboard, 
  MessageCircle, 
  Users, 
  Settings,
  Activity,
  Inbox,
  Command,
  Bell,
  Search,
  Shield,
  Moon,
  Sun,
  Instagram,
  Facebook,
  ChevronDown,
  Check,
  MousePointer2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';
import KeywordResponders from './pages/KeywordResponders';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/Settings';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const [activeAccount, setActiveAccount] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeAccount') || 'Instagram: @social_flow';
    }
    return 'Instagram: @social_flow';
  });

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('activeAccount', activeAccount);
  }, [activeAccount]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const accounts = [
    { name: 'Instagram: @social_flow', platform: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { name: 'Facebook: Social Hub', platform: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { name: 'Instagram: @shop_automate', platform: 'Instagram', icon: Instagram, color: 'text-orange-500' },
  ];

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Automations', path: '/automations', icon: Zap },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[var(--card)] border-r border-[var(--border)] flex flex-col z-50 transition-colors duration-300">
        <div className="p-10 pb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-slate-200 group cursor-pointer hover:scale-105 transition-transform duration-500">
              <Zap className="w-6 h-6 text-indigo-400 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div>
              <h2 className="font-black text-[var(--ink)] tracking-tighter leading-tight text-xl uppercase">SocialFlow</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-0.5">Version 2.4</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide pb-10">
          <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-[0.4em] px-4 mb-4">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-6 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all group",
                isActive 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20" 
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)]"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110 duration-300",
                location.pathname === item.path ? "text-white" : "text-[var(--ink-muted)] group-hover:text-[var(--ink)]"
              )} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-[var(--border)] relative">
          <button 
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[1.5rem] p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                {activeAccount.includes('Instagram') ? <Instagram className="w-5 h-5 text-pink-500" /> : <Facebook className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-[var(--ink)] tracking-tight truncate w-32">{activeAccount}</p>
                <p className="text-[8px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">Active Account</p>
              </div>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-[var(--ink-muted)] transition-transform duration-300", isAccountMenuOpen && "rotate-180")} />
          </button>

          {isAccountMenuOpen && (
            <div className="absolute bottom-full left-8 right-8 mb-4 bg-[var(--card)] border border-[var(--border)] rounded-[1.8rem] shadow-2xl p-2 z-[60] animate-in slide-in-from-bottom-4 duration-300">
               {accounts.map((acc) => (
                 <button
                  key={acc.name}
                  onClick={() => {
                    setActiveAccount(acc.name);
                    setIsAccountMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-[var(--bg)]",
                    activeAccount === acc.name ? "bg-indigo-50 dark:bg-indigo-500/10" : ""
                  )}
                 >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-[var(--border)]">
                        <acc.icon className={cn("w-4 h-4", acc.color)} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-black tracking-tight",
                        activeAccount === acc.name ? "text-indigo-600" : "text-[var(--ink)]"
                      )}>{acc.name}</span>
                    </div>
                    {activeAccount === acc.name && <Check className="w-3 h-3 text-indigo-600" />}
                 </button>
               ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-[var(--bg)] transition-colors duration-300">
        {/* Superior Header */}
        <header className="h-28 bg-[var(--card)]/60 backdrop-blur-2xl border-b border-[var(--border)] sticky top-0 z-40 px-12 flex items-center justify-between transition-colors duration-300">
           <div className="flex items-center gap-8">
              <div className="relative group lg:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)] group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="w-full bg-[var(--bg)]/50 border border-[var(--border)] rounded-2xl pl-14 pr-6 py-4 text-xs font-bold tracking-tight focus:bg-[var(--card)] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none text-[var(--ink)]"
                />
              </div>
           </div>
           
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                 <button 
                  onClick={toggleTheme}
                  className="relative w-14 h-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-95 group"
                 >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                 </button>
                 <button className="relative w-14 h-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-95 group">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[var(--card)] ring-4 ring-indigo-500/10" />
                 </button>
                 <Link to="/settings" className="relative w-14 h-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-95 group">
                    <Settings className="w-5 h-5" />
                 </Link>
              </div>

              <div className="flex items-center gap-5 pl-8 border-l border-[var(--border)]">
                 <div className="text-right flex flex-col items-end">
                    <p className="text-xs font-black text-[var(--ink)] tracking-tight">Shaun P.</p>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <p className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-widest">Active User</p>
                    </div>
                 </div>
                 <div className="relative group">
                    <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-tr from-slate-950 to-indigo-900 border-2 border-[var(--card)] shadow-2xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                       <span className="text-[10px] font-black text-white/40">SP</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-lg border-2 border-[var(--card)] flex items-center justify-center">
                       <Zap className="w-3 h-3 text-white" />
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-24">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/automations" element={<KeywordResponders />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <Command className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Page Not Found</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">This page doesn't exist.</p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}
