import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Plus, 
  Zap, 
  Target, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Hash,
  Video,
  Play,
  Command,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Template {
  id: string;
  title: string;
  description: string;
  goal: 'Grow' | 'Engage' | 'Drive';
  trigger: 'Comment' | 'DM' | 'Story' | 'Live';
  isPopular?: boolean;
}

const templates: Template[] = [
  {
    id: 'SCRATCH',
    title: 'Start from Scratch',
    description: 'Begin with a blank canvas and construct your own dynamic keyword trigger automations manually.',
    goal: 'Engage',
    trigger: 'DM'
  },
  {
    id: '1',
    title: 'DM Auto-Reply',
    description: 'Automatically reply to messages based on post comments.',
    goal: 'Drive',
    trigger: 'Comment',
    isPopular: true
  },
  {
    id: '2',
    title: 'Story Reply',
    description: 'Reply to people who watch your stories.',
    goal: 'Drive',
    trigger: 'Story'
  },
  {
    id: '3',
    title: 'Inbox Manager',
    description: 'Manage all your chats in one place.',
    goal: 'Engage',
    trigger: 'DM'
  },
  {
    id: '6',
    title: 'AI Chat Bot',
    description: 'An AI bot that answers questions.',
    goal: 'Engage',
    trigger: 'DM',
    isPopular: true
  },
  {
    id: '7',
    title: 'Comment Reply',
    description: 'Reply to comments privately in DMs.',
    goal: 'Drive',
    trigger: 'Comment'
  },
  {
    id: '8',
    title: 'Link Sender',
    description: 'Automatically send links to your site.',
    goal: 'Drive',
    trigger: 'DM'
  }
];

export default function Templates({ onClose, onSelect }: { onClose?: () => void, onSelect?: (template: Template) => void }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeCategory === 'All') return matchesSearch;
      
      // Goal filters
      if (activeCategory === 'Growth') return matchesSearch && t.goal === 'Grow';
      if (activeCategory === 'Engagement') return matchesSearch && t.goal === 'Engage';
      if (activeCategory === 'Sales') return matchesSearch && t.goal === 'Drive';
      
      // Trigger filters
      if (activeCategory === 'Comments') return matchesSearch && t.trigger === 'Comment';
      if (activeCategory === 'DMs') return matchesSearch && t.trigger === 'DM';
      if (activeCategory === 'Stories') return matchesSearch && t.trigger === 'Story';
      
      return matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const SidebarItem = ({ label, group, icon: Icon }: { label: string, group?: boolean, icon?: React.ElementType }) => (
    <button 
      onClick={() => !group && setActiveCategory(label)}
      className={cn(
        "w-full text-left px-5 py-3 text-[10px] uppercase tracking-[0.2em] transition-all rounded-xl flex items-center gap-3",
        group ? "font-black text-[var(--ink-muted)] mt-10 mb-2 cursor-default border-none" : 
        activeCategory === label 
          ? "bg-[var(--ink)] dark:bg-indigo-600 border border-[var(--ink)] font-black text-[var(--card)] shadow-xl" 
          : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--bg)] font-bold border border-transparent"
      )}
    >
      {Icon && <Icon className={cn("w-4 h-4", activeCategory === label ? "text-indigo-400" : "text-[var(--ink-muted)]")} />}
      {label}
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[var(--bg)] z-[100] flex flex-col overflow-hidden font-sans"
    >
      {/* Superior Header */}
      <header className="h-28 border-b border-[var(--border)] px-12 flex items-center justify-between flex-shrink-0 bg-[var(--card)]">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
              <Command className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-[var(--ink)] tracking-tight leading-none italic">Template Library</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1.5 opacity-80">Version 2.4</p>
           </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelect?.({ 
              id: 'SCRATCH', 
              title: 'Custom Template', 
              description: 'Create from scratch', 
              goal: 'Engage', 
              trigger: 'DM' 
            })}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/10 hover:bg-indigo-600 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Custom
          </button>
          
          {onClose && (
            <button onClick={onClose} className="w-14 h-14 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center rounded-[1.2rem] text-[var(--ink-muted)] hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
              <X className="w-5 h-5 font-black" />
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-80 border-r border-[var(--border)] overflow-y-auto p-10 scrollbar-hide bg-[var(--card)]">
          <SidebarItem label="All" icon={Hash} />
          
          <SidebarItem label="Goals" group />
          <SidebarItem label="Growth" icon={TrendingUp} />
          <SidebarItem label="Engagement" icon={Users} />
          <SidebarItem label="Sales" icon={Target} />

          <SidebarItem label="Triggers" group />
          <SidebarItem label="Comments" icon={MessageCircle} />
          <SidebarItem label="DMs" icon={Zap} />
          <SidebarItem label="Stories" icon={Video} />
        </aside>

        {/* Matrix Main Grid */}
        <main className="flex-1 overflow-y-auto p-12 bg-[var(--bg)]/20 matrix-bg">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Semantic Search */}
            <div className="relative group max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)] group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[1.5rem] pl-16 pr-8 py-5 text-sm font-bold tracking-tight focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none shadow-sm text-[var(--ink)]"
              />
            </div>

            {/* Neural Recommendations */}
            {activeCategory === 'All' && !searchQuery && (
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                   <Zap className="w-4 h-4 text-amber-500" />
                   <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--ink-muted)] italic">Popular</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {templates.filter(t => t.isPopular).map((template) => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      featured={template.id === '1'} 
                      onClick={() => onSelect?.(template)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Matrix Result Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--ink-muted)] italic">
                   {searchQuery ? `Results for: "${searchQuery}"` : activeCategory === 'All' ? 'Full Library' : activeCategory}
                 </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-40">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <TemplateCard 
                      key={template.id} 
                      template={template} 
                      onClick={() => onSelect?.(template)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-40 flex flex-col items-center justify-center text-center gap-6 bg-[var(--card)]/20 rounded-[3rem] border border-[var(--border)] border-dashed">
                    <div className="w-20 h-20 bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-xl flex items-center justify-center text-[var(--ink-muted)] opacity-20">
                       <Command className="w-10 h-10" />
                    </div>
                    <div>
                       <p className="text-lg font-black text-[var(--ink)] tracking-tight italic">Nothing Found</p>
                       <p className="text-[10px] text-[var(--ink-muted)] font-black uppercase tracking-widest mt-1 italic">Try searching for something else.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </motion.div>
  );
}

function TemplateCard({ template, featured, onClick }: { template: Template, featured?: boolean, onClick?: () => void }) {
  const isScratch = template.id === 'SCRATCH';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className={cn(
        "bg-[var(--card)] border rounded-[2.5rem] p-10 transition-all cursor-pointer group flex flex-col min-h-[300px] relative overflow-hidden",
        isScratch 
          ? "border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/5 hover:shadow-2xl hover:shadow-indigo-500/5 dark:bg-indigo-950/5"
          : featured 
            ? "border-indigo-500 shadow-2xl shadow-indigo-500/10 dark:shadow-none" 
            : "border-[var(--border)] hover:border-indigo-200/50 hover:shadow-2xl hover:shadow-indigo-500/5"
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

      <div className="space-y-4 flex-1 relative z-10">
        <div className="flex items-center gap-3">
           <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isScratch ? 'bg-indigo-500 text-white shadow-lg' : featured ? 'bg-indigo-600 text-white' : 'bg-[var(--bg)] text-[var(--ink-muted)] group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors')}>
              {isScratch ? <Plus className="w-5 h-5 font-black" /> : <Zap className="w-5 h-5" />}
           </div>
           <p className="text-[9px] font-black text-indigo-500/60 uppercase tracking-[0.3em] italic">{isScratch ? 'Custom Mode' : `${template.trigger} Trigger`}</p>
        </div>
        <h3 className="text-2xl font-black text-[var(--ink)] italic tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
          {template.title}
        </h3>
        <p className="text-sm text-[var(--ink-muted)] font-medium leading-relaxed italic opacity-80">
          "{template.description}"
        </p>
      </div>

      <div className="mt-10 pt-6 border-t border-[var(--border)] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 text-[10px] font-black text-[var(--ink-muted)] opacity-50 uppercase tracking-widest italic group-hover:text-indigo-400 group-hover:opacity-100 transition-all">
          <ArrowUpRight className="w-4 h-4" />
          {isScratch ? 'Blank Canvas' : 'Use This'}
        </div>
        <div className="flex gap-2">
          {template.isPopular && (
            <span className="text-[8px] font-black text-orange-600 bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-orange-500/20 shadow-sm">POPULAR</span>
          )}
          {isScratch && (
            <span className="text-[8px] font-black text-indigo-600 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20 shadow-sm font-mono">NEW</span>
          )}
        </div>
      </div>
      
      <div className="mt-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all relative z-10">
        <button className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all">
          {isScratch ? 'Start Blank' : 'Select'}
        </button>
      </div>
    </motion.div>
  );
}
