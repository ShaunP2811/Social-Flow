import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
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
  MousePointer2,
  X,
  AlertTriangle,
  XCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Menu,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./lib/utils";
import KeywordResponders from "./pages/KeywordResponders";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: Date;
  duration?: number;
}

interface LayoutProps {
  children: React.ReactNode;
  theme: "light" | "dark";
  toggleTheme: () => void;
  activeAccount: string;
  setActiveAccount: (val: string) => void;
}

const Layout = ({
  children,
  theme,
  toggleTheme,
  activeAccount,
  setActiveAccount,
}: LayoutProps) => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecutedLog, setLastExecutedLog] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let syncTimeout: any = null;
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      const status = customEvent.detail?.status;
      if (status === true) {
        setIsSyncing(true);
        if (syncTimeout) {
          clearTimeout(syncTimeout);
          syncTimeout = null;
        }
      } else if (status === false) {
        setIsSyncing(false);
      } else {
        // Simple start-stop sequence automatically
        setIsSyncing(true);
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          setIsSyncing(false);
        }, 1200);
      }
    };

    window.addEventListener("social-flow-sync", handleSync);
    return () => {
      window.removeEventListener("social-flow-sync", handleSync);
      if (syncTimeout) clearTimeout(syncTimeout);
    };
  }, []);

  useEffect(() => {
    let timeoutId: any = null;
    const handleExecution = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setLastExecutedLog(customEvent.detail);
        setIsExecuting(true);
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsExecuting(false);
        }, 2200);
      }
    };
    window.addEventListener("responder-trigger-execution", handleExecution);
    return () => {
      window.removeEventListener(
        "responder-trigger-execution",
        handleExecution,
      );
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const { title, message, type, id, duration } = customEvent.detail;
        const newId = id || Math.random().toString(36).substr(2, 9);
        const newToast: ToastMessage = {
          id: newId,
          title: title || "System Incident Notification",
          message: message || "",
          type: type || "info",
          timestamp: new Date(),
          duration: duration || 6500,
        };
        setToasts((prev) => {
          // Prevent exact duplicate notifications from flooding
          if (
            prev.some(
              (t) =>
                t.message === newToast.message &&
                Date.now() - t.timestamp.getTime() < 3000,
            )
          ) {
            return prev;
          }
          return [...prev, newToast];
        });

        // Auto remove
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newId));
        }, duration || 6500);
      }
    };

    window.addEventListener("social-flow-toast", handleToastEvent);
    return () => {
      window.removeEventListener("social-flow-toast", handleToastEvent);
    };
  }, []);

  const accounts = [
    {
      name: "Instagram: @social_flow",
      platform: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
    },
    {
      name: "Facebook: Social Hub",
      platform: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
    },
    {
      name: "Instagram: @shop_automate",
      platform: "Instagram",
      icon: Instagram,
      color: "text-orange-500",
    },
  ];

  const navItems = [
    { name: "Home", path: "/", icon: LayoutDashboard },
    { name: "Automations", path: "/automations", icon: Zap },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 lg:static lg:flex w-72 bg-[var(--card)] border-r border-[var(--border)] flex flex-col z-[100] transition-transform duration-300 ease-in-out shrink-0",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-10 pb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center shadow-2xl shadow-slate-200 dark:shadow-none group cursor-pointer hover:scale-105 transition-transform duration-500">
              <Zap className="w-6 h-6 text-indigo-400 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div>
              <h2 className="font-black text-[var(--ink)] tracking-tighter leading-tight text-xl uppercase">
                SocialFlow
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-0.5">
                  Version 2.4
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide pb-10">
          <p className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-[0.4em] px-4 mb-4">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-6 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all group",
                  isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20"
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)]",
                )
              }
            >
              <item.icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110 duration-300",
                  location.pathname === item.path
                    ? "text-white"
                    : "text-[var(--ink-muted)] group-hover:text-[var(--ink)]",
                )}
              />
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
                {activeAccount.includes("Instagram") ? (
                  <Instagram className="w-5 h-5 text-pink-500" />
                ) : (
                  <Facebook className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-[var(--ink)] tracking-tight truncate w-32">
                  {activeAccount}
                </p>
                <p className="text-[8px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">
                  Active Account
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-[var(--ink-muted)] transition-transform duration-300",
                isAccountMenuOpen && "rotate-180",
              )}
            />
          </button>

          {isAccountMenuOpen && (
            <div className="absolute bottom-full left-8 right-8 mb-4 bg-[var(--card)] border border-[var(--border)] rounded-[1.8rem] shadow-2xl p-2 z-[60] animate-in slide-in-from-bottom-4 duration-300">
              {accounts.map((acc) => (
                <button
                  key={acc.name}
                  onClick={() => {
                    setActiveAccount(acc.name);
                    setIsAccountMenuOpen(false);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-[var(--bg)]",
                    activeAccount === acc.name
                      ? "bg-indigo-50 dark:bg-indigo-500/10"
                      : "",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-[var(--border)]">
                      <acc.icon className={cn("w-4 h-4", acc.color)} />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-black tracking-tight",
                        activeAccount === acc.name
                          ? "text-indigo-600"
                          : "text-[var(--ink)]",
                      )}
                    >
                      {acc.name}
                    </span>
                  </div>
                  {activeAccount === acc.name && (
                    <Check className="w-3 h-3 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-[var(--bg)] transition-colors duration-300">
        {/* Superior Header */}
        <header className="h-28 bg-[var(--card)]/60 backdrop-blur-2xl border-b border-[var(--border)] sticky top-0 z-40 px-4 sm:px-6 md:px-12 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
            {/* Mobile Hamburger toggle button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] active:scale-95 transition-transform flex items-center justify-center"
              title="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative group w-36 sm:w-48 md:w-72">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)] group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[var(--bg)]/50 border border-[var(--border)] rounded-2xl pl-14 pr-6 py-4 text-xs font-bold tracking-tight focus:bg-[var(--card)] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none text-[var(--ink)]"
              />
            </div>

            {/* Syncing Indicator */}
            <AnimatePresence>
              {isSyncing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-500 shadow-md shadow-indigo-500/5 select-none shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline-block">Syncing...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Real-time Execution Indicator */}
            <div className="hidden md:flex items-center gap-4">
              <div className="h-8 w-[1px] bg-[var(--border)]" />
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      isExecuting
                        ? "bg-indigo-500 shadow-[0_0_12px_#6366f1] scale-125"
                        : "bg-emerald-500 animate-pulse",
                    )}
                  />
                  {isExecuting && (
                    <span className="absolute w-4 h-4 bg-indigo-500/30 rounded-full animate-ping pointer-events-none" />
                  )}
                </div>

                <div className="flex flex-col select-none">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink)]">
                      {isExecuting ? "Processing Event" : "Live Engine Active"}
                    </span>
                    {isExecuting && (
                      <span className="text-[7px] font-mono px-1 bg-indigo-500 text-white rounded-md uppercase font-bold animate-pulse">
                        FLASH
                      </span>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {isExecuting && lastExecutedLog ? (
                      <motion.span
                        key={lastExecutedLog.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="text-[8px] font-mono font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 truncate max-w-[170px]"
                      >
                        {lastExecutedLog.platform === "Instagram"
                          ? "IG"
                          : lastExecutedLog.platform === "Facebook"
                            ? "FB"
                            : "SYS"}
                        : {lastExecutedLog.user} (
                        {lastExecutedLog.matched || "N/A"})
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[8px] font-semibold text-[var(--ink-muted)] uppercase tracking-widest"
                      >
                        Listening for incoming queries
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10">
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-95 group"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              <Link
                to="/settings"
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-95 group"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center gap-3 sm:gap-5 pl-4 sm:pl-8 border-l border-[var(--border)]">
              <div className="hidden sm:flex text-right flex-col items-end">
                <p className="text-xs font-black text-[var(--ink)] tracking-tight">
                  Shaun P.
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-widest">
                    Active User
                  </p>
                </div>
              </div>
              <div className="relative group shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-[1.2rem] bg-gradient-to-tr from-slate-950 to-indigo-900 border-2 border-[var(--card)] shadow-2xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white/40">
                    SP
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-lg border-2 border-[var(--card)] flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-24">{children}</div>
        </div>
      </main>

      {/* Global Toast Container */}
      <div
        id="global-toast-container"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3.5 max-w-sm w-full pointer-events-none px-4"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const isError = toast.type === "error";
            const isWarning = toast.type === "warning";
            const isSuccess = toast.type === "success";

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30, x: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: 30,
                  transition: { duration: 0.2 },
                }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className={cn(
                  "p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3.5 pointer-events-auto relative overflow-hidden",
                  isError
                    ? "bg-rose-50/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-100"
                    : isWarning
                      ? "bg-amber-50/95 dark:bg-amber-950/90 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-100"
                      : isSuccess
                        ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-950/20 text-emerald-900 dark:text-emerald-100"
                        : "bg-slate-50/95 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100",
                )}
              >
                {/* Visual Indicator Line */}
                <div
                  className={cn(
                    "absolute top-0 bottom-0 left-0 w-1",
                    isError
                      ? "bg-rose-500"
                      : isWarning
                        ? "bg-amber-500"
                        : isSuccess
                          ? "bg-emerald-500"
                          : "bg-indigo-500",
                  )}
                />

                <div className="shrink-0 mt-0.5">
                  {isError && <XCircle className="w-4 h-4 text-rose-500" />}
                  {isWarning && (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  {isSuccess && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                  {toast.type === "info" && (
                    <Info className="w-4 h-4 text-indigo-500" />
                  )}
                </div>

                <div className="flex-1 space-y-1 select-none pr-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider leading-none">
                      {toast.title}
                    </span>
                    <span className="text-[8px] font-mono opacity-50 select-none">
                      {toast.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold leading-normal opacity-85 break-words">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                  className="shrink-0 text-current opacity-40 hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 active:scale-90 transition-transform"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  const [activeAccount, setActiveAccount] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeAccount") || "Instagram: @social_flow";
    }
    return "Instagram: @social_flow";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("activeAccount", activeAccount);
  }, [activeAccount]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <Layout
        theme={theme}
        toggleTheme={toggleTheme}
        activeAccount={activeAccount}
        setActiveAccount={setActiveAccount}
      >
        <Routes>
          <Route path="/" element={<Dashboard activeAccount={activeAccount} />} />
          <Route path="/automations" element={<KeywordResponders activeAccount={activeAccount} />} />
          <Route path="/settings" element={<SettingsPage activeAccount={activeAccount} setActiveAccount={setActiveAccount} theme={theme} toggleTheme={toggleTheme} />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <Command className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    Page Not Found
                  </h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    This page doesn't exist.
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
