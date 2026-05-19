import React, { useState, useEffect } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Templates from './Templates';

type Platform = 'Instagram' | 'Facebook';
type Status = 'Active' | 'Draft' | 'Paused';

interface KeywordResponder {
  id: string;
  platform: Platform;
  keywords: string[];
  responseTemplates?: string[];
  autoLike?: boolean;
  publicReply?: boolean;
  publicReplyTemplate?: string;
  status: Status;
  triggerCount: number;
  lastTriggered: string;
  createdAt: string;
  scope: 'All' | 'Posts';
  targetedPostIds?: string[];
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
  type: 'AI' | 'Static';
}

const mockHistory: ResponderHistory[] = [
  {
    id: 'h1',
    user: 'sarah_j',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    platform: 'Instagram',
    message: 'Hey, what is the PRICE for the monthly plan?',
    keyword: 'PRICE',
    reply: 'Our monthly plan starts at $29/month. You can explore all tiers at neural.hub/pricing.',
    timestamp: '2 mins ago',
    type: 'AI'
  },
  {
    id: 'h2',
    user: 'mike_dev',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    platform: 'Facebook',
    message: 'WHERE are you guys located? Thanks!',
    keyword: 'LOCATION',
    reply: 'We are located at 123 Neural St, Matrix City! Feel free to drop by.',
    timestamp: '15 mins ago',
    type: 'Static'
  },
  {
    id: 'h3',
    user: 'tech_guru',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    platform: 'Instagram',
    message: 'How can I JOIN the beta program?',
    keyword: 'JOIN',
    reply: 'To join our Beta program, simply head over to beta.neural.hub and fill out the application!',
    timestamp: '42 mins ago',
    type: 'AI'
  },
  {
    id: 'h4',
    user: 'creative_bee',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    platform: 'Instagram',
    message: 'What is the COST for enterprise?',
    keyword: 'COST',
    reply: 'For enterprise solutions, we offer tailored pricing. Our sales team will contact you shortly!',
    timestamp: '1 hour ago',
    type: 'AI'
  }
];

const mockPosts = [
  { id: 'p1', platform: 'Instagram', type: 'Reel', title: 'Summer Collection Launch', likes: 1240, comments: 45, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
  { id: 'p2', platform: 'Instagram', type: 'Post', title: 'Why Neural AI is the future', likes: 890, comments: 12, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop' },
  { id: 'p3', platform: 'Facebook', type: 'Post', title: 'Weekend Promo: 50% OFF', likes: 450, comments: 89, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop' },
  { id: 'p4', platform: 'Instagram', type: 'Reel', title: 'Behind the scenes at the Hub', likes: 2300, comments: 120, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop' },
  { id: 'p5', platform: 'Instagram', type: 'Post', title: 'New Features Roadmap 2024', likes: 670, comments: 34, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop' },
  { id: 'p6', platform: 'Facebook', type: 'Reel', title: 'Customer Success Story: Zenith', likes: 1560, comments: 67, image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop' },
  { id: 'p7', platform: 'Instagram', type: 'Post', title: 'Holiday Spirit at Neural', likes: 420, comments: 12, image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=200&h=200&fit=crop' },
  { id: 'p8', platform: 'Facebook', type: 'Post', title: 'Join our Beta Program', likes: 890, comments: 154, image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop' },
  { id: 'p9', platform: 'Instagram', type: 'Reel', title: 'AI Tips: Optimization', likes: 3100, comments: 89, image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop' },
  { id: 'p10', platform: 'Instagram', type: 'Post', title: 'Meet the Team: Alex', likes: 340, comments: 5, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop' },
  { id: 'p11', platform: 'Facebook', type: 'Reel', title: 'Neural Hub Office Tour', likes: 780, comments: 23, image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&h=200&fit=crop' },
  { id: 'p12', platform: 'Instagram', type: 'Post', title: 'Flash Sale: 24 Hours Only', likes: 2100, comments: 340, image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop' },
];

export default function KeywordResponders() {
  const [responders, setResponders] = useState<KeywordResponder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingResponderId, setEditingResponderId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mainPlatformFilter, setMainPlatformFilter] = useState<'All' | 'Instagram' | 'Facebook'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | Status>('All');
  const [responseTypeFilter, setResponseTypeFilter] = useState<'All' | 'Static' | 'AI'>('All');
  const [hoveredTriggerId, setHoveredTriggerId] = useState<string | null>(null);
  
  // Creation State
  const [newPlatform, setNewPlatform] = useState<Platform>('Instagram');
  const [newKeywords, setNewKeywords] = useState('');
  const [newStatus, setNewStatus] = useState<Status>('Active');
  const [newResponseTemplates, setNewResponseTemplates] = useState<string[]>(['']);
  const [newAutoLike, setNewAutoLike] = useState(false);
  const [newPublicReply, setNewPublicReply] = useState(false);
  const [newPublicReplyText, setNewPublicReplyText] = useState('');
  const [newScope, setNewScope] = useState<'All' | 'Posts'>('All');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [postSelectionPage, setPostSelectionPage] = useState(1);
  const [keywordError, setKeywordError] = useState<string | null>(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [postPlatformFilter, setPostPlatformFilter] = useState<'All' | 'Instagram' | 'Facebook'>('All');
  const [postTypeFilter, setPostTypeFilter] = useState<'All' | 'Post' | 'Reel'>('All');
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

  const moveTemplate = (index: number, direction: 'up' | 'down') => {
    const next = [...newResponseTemplates];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setNewResponseTemplates(next);
  };

  const postsPerPage = 6;

  useEffect(() => {
    // Reset pagination when search or filters change
    setPostSelectionPage(1);
  }, [postSearchQuery, postPlatformFilter, postTypeFilter, showSelectedOnly]);

  useEffect(() => {
    // Simulate fetching responders
    const timer = setTimeout(() => {
      setResponders([
        {
          id: '1',
          platform: 'Instagram',
          keywords: ['PRICE', 'COST', 'HOW MUCH'],
          responseTemplates: ["Our monthly plan starts at $29. Check it out at neural.hub/pricing"],
          status: 'Active',
          triggerCount: 842,
          lastTriggered: '12 mins ago',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          scope: 'All'
        },
        {
          id: '2',
          platform: 'Facebook',
          keywords: ['LOCATION', 'WHERE'],
          responseTemplates: ["We are located at 123 Neural St, Matrix City!", "Find us at 123 Neural St! Open 24/7."],
          status: 'Active',
          triggerCount: 156,
          lastTriggered: '1 hour ago',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          scope: 'Posts',
          targetedPostIds: ['p3']
        },
        {
          id: '3',
          platform: 'Instagram',
          keywords: ['JOIN', 'SIGNUP'],
          responseTemplates: ["Join our beta at beta.neural.hub!"],
          status: 'Paused',
          triggerCount: 45,
          lastTriggered: '2 days ago',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          scope: 'All'
        }
      ]);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = responders.filter(r => {
    const matchesSearch = r.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = mainPlatformFilter === 'All' || r.platform === mainPlatformFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const togglePost = (id: string) => {
    setSelectedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    setKeywordError(null);

    if (!newKeywords.trim()) {
      setKeywordError('Keywords are required.');
      return;
    }

    const keywords = newKeywords.split(',').map(k => k.trim().toUpperCase()).filter(k => k);
    
    if (keywords.length === 0) {
      setKeywordError('Please enter at least one valid keyword.');
      return;
    }

    for (const kw of keywords) {
      if (kw.length < 2) {
        setKeywordError(`Keyword "${kw}" is too short (min 2 characters).`);
        return;
      }
      if (!/^[A-Z0-9_]+$/.test(kw)) {
        setKeywordError(`Keyword "${kw}" contains invalid characters. Use letters, numbers, and underscores only.`);
        return;
      }
    }

    if (newResponseTemplates.every(t => !t.trim())) {
      setKeywordError('At least one static response variation is required.');
      return;
    }

    const finalTemplates = newResponseTemplates.map(t => t.trim()).filter(t => t);

    if (editingResponderId) {
      setResponders(prev => prev.map(r => r.id === editingResponderId ? {
        ...r,
        platform: newPlatform,
        keywords: keywords,
        responseTemplates: finalTemplates,
        autoLike: newAutoLike,
        publicReply: newPublicReply,
        publicReplyTemplate: newPublicReply ? newPublicReplyText : undefined,
        status: newStatus,
        createdAt: r.createdAt,
        scope: newScope,
        targetedPostIds: newScope === 'Posts' ? selectedPosts : undefined
      } : r));
    } else {
      const newResponder: KeywordResponder = {
        id: Math.random().toString(36).substr(2, 9),
        platform: newPlatform,
        keywords: keywords,
        responseTemplates: finalTemplates,
        status: newStatus,
        triggerCount: 0,
        lastTriggered: 'Just now',
        createdAt: new Date().toISOString(),
        scope: newScope,
        targetedPostIds: newScope === 'Posts' ? selectedPosts : undefined
      };
      setResponders(prev => [newResponder, ...prev]);
    }

    setIsAdding(false);
    setEditingResponderId(null);
    
    // Reset state
    setNewPlatform('Instagram');
    setNewKeywords('');
    setNewStatus('Active');
    setNewResponseTemplates(['']);
    setNewAutoLike(false);
    setNewPublicReply(false);
    setNewPublicReplyText('');
    setNewScope('All');
    setPostSearchQuery('');
    setSelectedPosts([]);
    setKeywordError(null);
  };

  const handleEdit = (responder: KeywordResponder) => {
    setEditingResponderId(responder.id);
    setNewPlatform(responder.platform);
    setNewKeywords(responder.keywords.join(', '));
    setNewStatus(responder.status);
    setNewResponseTemplates(responder.responseTemplates && responder.responseTemplates.length > 0 ? responder.responseTemplates : ['']);
    setNewAutoLike(responder.autoLike || false);
    setNewPublicReply(responder.publicReply || false);
    setNewPublicReplyText(responder.publicReplyTemplate || '');
    setNewScope(responder.scope);
    setSelectedPosts(responder.targetedPostIds || []);
    setIsAdding(true);
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
              setNewScope(template.trigger === 'Comment' ? 'Posts' : 'All');
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Matrix Protocol</p>
          <h1 className="text-4xl font-black text-[var(--ink)] tracking-tight italic">Automations</h1>
          <p className="text-[var(--ink-muted)] text-sm font-medium">Automatic DMs based on keyword triggers on Instagram and Facebook.</p>
        </div>
        <button 
          onClick={() => setShowTemplates(true)}
          className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
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
                  <p className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-widest ml-4">Platform</p>
                  <div className="flex bg-[var(--card)] p-1 rounded-[1.2rem] border border-[var(--border)] shadow-sm">
                    {(['All', 'Instagram', 'Facebook'] as const).map((platform) => (
                      <button
                        key={platform}
                        onClick={() => setMainPlatformFilter(platform)}
                        className={cn(
                          "px-4 py-2 rounded-[0.8rem] text-[9px] font-black uppercase tracking-widest transition-all min-w-[80px]",
                          mainPlatformFilter === platform 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                            : "text-[var(--ink-muted)] hover:text-indigo-500"
                        )}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-black text-[var(--ink-muted)] uppercase tracking-widest ml-4">Status</p>
                  <div className="flex bg-[var(--card)] p-1 rounded-[1.2rem] border border-[var(--border)] shadow-sm">
                    {(['All', 'Active', 'Paused', 'Draft'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                          "px-4 py-2 rounded-[0.8rem] text-[9px] font-black uppercase tracking-widest transition-all min-w-[80px]",
                          statusFilter === status 
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                            : "text-[var(--ink-muted)] hover:text-indigo-500"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {(mainPlatformFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
                  <button 
                    onClick={() => {
                      setMainPlatformFilter('All');
                      setStatusFilter('All');
                      setSearchQuery('');
                    }}
                    className="self-end mb-1 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Clear</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((r, idx) => (
                <motion.div
                  layout
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="neural-card flex flex-col md:flex-row md:items-center justify-between gap-8 group"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 duration-500",
                      r.platform === 'Instagram' ? "bg-gradient-to-tr from-pink-500 to-rose-400 text-white" : "bg-blue-600 text-white"
                    )}>
                      {r.platform === 'Instagram' ? <Instagram className="w-8 h-8" /> : <Facebook className="w-8 h-8" />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full ring-4 ring-offset-2",
                          r.status === 'Active' ? "bg-emerald-500 ring-emerald-500/20" : "bg-slate-300 ring-slate-100"
                        )} />
                        <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.2em]">
                          {r.scope === 'All' ? 'All Posts' : `${r.targetedPostIds?.length || 0} Specific Posts`}
                        </span>
                        
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded-md">
                          {r.platform === 'Instagram' ? 
                            <Instagram className="w-2.5 h-2.5 text-pink-500" /> : 
                            <Facebook className="w-2.5 h-2.5 text-blue-600" />
                          }
                          <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)]">{r.platform}</span>
                        </div>

                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded-md">
                          <Zap className={cn("w-2.5 h-2.5", r.responseTemplates && r.responseTemplates.length > 1 ? "text-indigo-500" : "text-amber-500")} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ink-muted)]">
                            {r.responseTemplates && r.responseTemplates.length > 1 ? 'Dynamic Static' : 'Static'}
                          </span>
                        </div>

                        {r.autoLike && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/5 border border-emerald-500/20 rounded-md">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Auto-Like</span>
                          </div>
                        )}

                        {r.publicReply && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/5 border border-indigo-500/20 rounded-md">
                            <MessageSquare className="w-2.5 h-2.5 text-indigo-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Public Reply</span>
                          </div>
                        )}

                        {r.scope === 'Posts' && r.targetedPostIds && r.targetedPostIds.length > 0 && (
                          <div className="flex -space-x-3 ml-2">
                            {r.targetedPostIds.slice(0, 3).map(id => {
                              const post = mockPosts.find(p => p.id === id);
                              if (!post) return null;
                              
                              const TypeIcon = post.type === 'Reel' ? Clapperboard : post.type === 'Post' ? ImageIcon : PlayCircle;

                              return (
                                <div key={id} className="w-7 h-7 rounded-lg border-2 border-white overflow-hidden shadow-sm relative z-10 hover:z-20 transition-all hover:scale-125 hover:-translate-y-1 cursor-pointer group/thumb">
                                  <img src={post.image} className="w-full h-full object-cover" alt="" />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                    <TypeIcon className="w-3 h-3 text-white" />
                                  </div>
                                  <div className="absolute bottom-0 right-0 p-0.5 bg-black/40 rounded-tl-sm">
                                     <TypeIcon className="w-[6px] h-[6px] text-white" />
                                  </div>
                                </div>
                              );
                            })}
                            {r.targetedPostIds.length > 3 && (
                              <div className="w-7 h-7 rounded-lg border-2 border-white bg-slate-900 flex items-center justify-center text-[8px] font-black text-white shadow-sm relative z-0">
                                +{r.targetedPostIds.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {r.keywords.map(kw => (
                          <div key={kw} className="bg-[var(--bg)] border border-[var(--border)] px-3 py-1.5 rounded-xl flex items-center gap-2">
                            <Hash className="w-3 h-3 text-[var(--ink-muted)]" />
                            <span className="text-[10px] font-black text-[var(--ink)] tracking-tight">{kw}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-[var(--ink-muted)] font-medium italic line-clamp-1 max-w-[300px]">
                        {r.responseTemplates && r.responseTemplates.length > 1 
                          ? `${r.responseTemplates.length} variations (e.g. "${r.responseTemplates[0]}")` 
                          : `"${r.responseTemplates?.[0] || ''}"`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-6 md:pt-0 border-[var(--border)]">
                    <div className="flex items-center gap-8">
                      <div 
                        className="text-center md:text-right relative"
                        onMouseEnter={() => setHoveredTriggerId(r.id)}
                        onMouseLeave={() => setHoveredTriggerId(null)}
                      >
                        <div className="flex items-center md:justify-end gap-2 text-indigo-500 mb-1">
                          <Zap className="w-3 h-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Total Triggers</span>
                        </div>
                        <p className="text-2xl font-black text-[var(--ink)] tracking-tighter italic leading-none cursor-help">{r.triggerCount}</p>
                        
                        <AnimatePresence>
                          {hoveredTriggerId === r.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute bottom-full mb-4 right-0 bg-[#0f172a] border border-white/10 p-5 rounded-[2rem] shadow-2xl z-50 w-56 text-left pointer-events-none backdrop-blur-xl"
                            >
                              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                  <Activity className="w-3.5 h-3.5" /> Performance
                                </span>
                                <div className="px-2 py-0.5 bg-indigo-500/10 rounded-md">
                                  <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active</span>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between group/stat">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Lifespan</span>
                                  <span className="text-[11px] font-black text-white font-mono">
                                    {Math.max(1, Math.ceil((new Date().getTime() - new Date(r.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)))} Days
                                  </span>
                                </div>
                                <div className="flex items-center justify-between group/stat">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Daily Avg</span>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                                    <span className="text-[11px] font-black text-emerald-400 font-mono">
                                      {(r.triggerCount / Math.max(1, (new Date().getTime() - new Date(r.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))).toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between group/stat">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Weekly Avg</span>
                                  <span className="text-[11px] font-black text-white font-mono">
                                    {(r.triggerCount / Math.max(0.1, (new Date().getTime() - new Date(r.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 7))).toFixed(1)}
                                  </span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5">
                                  <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold italic">
                                    <History className="w-3 h-3 text-indigo-400/50" />
                                    Last triggered {r.lastTriggered}
                                  </div>
                                </div>
                              </div>
                              <div className="absolute -bottom-1 right-8 w-2 h-2 bg-[#0f172a] rotate-45 border-r border-b border-white/10" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="text-center md:text-right hidden sm:block">
                        <div className="flex items-center md:justify-end gap-2 text-[var(--ink-muted)] mb-1">
                          <Activity className="w-3 h-3" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Last Active</span>
                        </div>
                        <p className="text-[11px] font-bold text-[var(--ink)] tracking-tight italic leading-none">{r.lastTriggered}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="w-12 h-12 bg-[var(--bg)] rounded-2xl text-[var(--ink-muted)] hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center">
                        <Power className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setResponders(prev => prev.filter(res => res.id !== r.id))}
                        className="w-12 h-12 bg-[var(--bg)] rounded-2xl text-[var(--ink-muted)] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                      >
                        <Trash2 className="w-5 h-5" />
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
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Live Stream */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden h-[700px] flex flex-col shadow-2xl border border-white/5">
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">Recent Activity</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                   <Cpu className="w-3 h-3 text-white/40" />
                   <span className="text-[8px] font-black uppercase tracking-widest text-white/40 italic">v2.4</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide pr-2">
                {[
                  { user: 'alex_matrix', msg: 'Price check: what is the PRICE?', time: '0s', kw: 'PRICE', color: 'indigo' },
                  { user: 'neo_coder', msg: 'LOCATION please', time: '12s', kw: 'LOCATION', color: 'emerald' },
                  { user: 'trinity_ai', msg: 'What is the COST?', time: '1m', kw: 'COST', color: 'rose' },
                  { user: 'morpheus', msg: 'Send me the JOIN link', time: '2m', kw: 'JOIN', color: 'amber' },
                ].map((activity, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{activity.user}</span>
                      </div>
                      <span className="text-[8px] font-mono text-white/20">{activity.time}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] relative group hover:bg-white/10 transition-colors">
                      <p className="text-xs text-white/90 leading-relaxed font-mono italic">"{activity.msg}"</p>
                      <div className="mt-4 flex items-center gap-3">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Matched Keyword: #{activity.kw}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-6 border-l-2 border-indigo-500/20 ml-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black shadow-lg shadow-indigo-500/20">FIX</div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-indigo-300 font-bold leading-tight font-mono">Writing reply...</p>
                         <div className="flex gap-1">
                            {[1,2,3].map(d => <div key={d} className="w-1 h-1 bg-indigo-500/40 rounded-full animate-bounce" style={{ animationDelay: `${d*0.1}s` }} />)}
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Total Replies</p>
                   <p className="text-xl font-mono text-white italic">148.4k</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                   <ArrowUpRight className="w-5 h-5 text-white/40" />
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Response Logs History */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--ink)] tracking-tight italic">Reply History</h2>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mt-1">Audit Log of AI & Static Responses</p>
            </div>
          </div>
          <button className="text-[10px] font-black text-[var(--ink-muted)] uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-2">
            View All Logs <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockHistory.map((log, idx) => (
            <motion.div
              layout
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="neural-card group p-0 overflow-hidden border border-[var(--border)] hover:border-indigo-500/30 transition-all"
            >
              <div className="p-6 border-b border-[var(--border)] bg-[var(--bg)]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)]">
                      <img src={log.userAvatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-[var(--ink)] tracking-tight">@{log.user}</p>
                      <div className="flex items-center gap-2">
                         {log.platform === 'Instagram' ? <Instagram className="w-2.5 h-2.5 text-pink-500" /> : <Facebook className="w-2.5 h-2.5 text-blue-600" />}
                         <span className="text-[8px] font-bold text-[var(--ink-muted)] uppercase tracking-widest">{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5",
                    log.type === 'AI' ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  )}>
                    {log.type === 'AI' ? <Sparkles className="w-2 h-2" /> : <Zap className="w-2 h-2" />}
                    {log.type} Reply
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="mt-1">
                    <MessageSquare className="w-4 h-4 text-[var(--ink-muted)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-medium italic">
                      "{log.message}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 relative">
                <div className="absolute top-0 left-8 h-4 w-px bg-gradient-to-b from-[var(--border)] to-transparent" />
                <div className="flex gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                    log.type === 'AI' ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
                  )}>
                    {log.type === 'AI' ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest font-mono">#{log.keyword} TRIGGERED</span>
                    </div>
                    <p className="text-[12px] text-[var(--ink)] font-bold italic leading-relaxed tracking-tight">
                      {log.reply}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
                       <h2 className="text-3xl font-black text-[var(--ink)] tracking-tight">
                         {editingResponderId ? 'Edit Auto-Reply' : 'New Auto-Reply'}
                       </h2>
                    </div>
                    <p className="text-sm text-[var(--ink-muted)] font-medium tracking-tight">
                      {editingResponderId ? 'Update your current automation settings.' : 'Set up a new automatic reply.'}
                    </p>
                  </div>
                  <button onClick={() => {
                    setIsAdding(false);
                    setEditingResponderId(null);
                    setNewKeywords('');
                    setNewResponseTemplates(['']);
                    setSelectedPosts([]);
                  }} className="w-12 h-12 bg-[var(--bg)] hover:bg-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--ink-muted)] transition-all font-black">X</button>
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
                          onClick={() => setNewPlatform('Instagram')}
                          className={cn(
                            "group p-6 rounded-[2rem] border-2 flex items-center gap-5 transition-all text-left",
                            newPlatform === 'Instagram' ? "border-indigo-600 bg-indigo-50/50" : "border-[var(--border)] bg-[var(--bg)] text-[var(--ink-muted)]"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-xl transition-all",
                            newPlatform === 'Instagram' ? "bg-indigo-600 text-white" : "bg-[var(--card)] text-slate-200"
                          )}>
                             <Instagram className="w-6 h-6" />
                          </div>
                          <span className={cn(
                            "text-[12px] font-black uppercase tracking-widest",
                            newPlatform === 'Instagram' ? "text-indigo-900 dark:text-indigo-400" : ""
                          )}>Instagram</span>
                        </button>
                        <button 
                          onClick={() => setNewPlatform('Facebook')}
                          className={cn(
                            "group p-6 rounded-[2rem] border-2 flex items-center gap-5 transition-all text-left",
                            newPlatform === 'Facebook' ? "border-indigo-600 bg-indigo-50/50" : "border-[var(--border)] bg-[var(--bg)] text-[var(--ink-muted)]"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-xl transition-all",
                            newPlatform === 'Facebook' ? "bg-indigo-600 text-white" : "bg-[var(--card)] text-slate-200"
                          )}>
                             <Facebook className="w-6 h-6" />
                          </div>
                          <span className={cn(
                            "text-[12px] font-black uppercase tracking-widest",
                            newPlatform === 'Facebook' ? "text-indigo-900 dark:text-indigo-400" : ""
                          )}>Facebook</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[var(--bg)] border border-[var(--border)] p-8 rounded-[2.5rem] space-y-6 relative group/variations">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover/variations:bg-indigo-500/10 transition-colors" />
                           <div className="flex items-center justify-between relative z-10">
                             <div className="space-y-1">
                               <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Auto Reply Variations</p>
                               <p className="text-[9px] text-[var(--ink-muted)] font-black uppercase tracking-tight">One is picked at random</p>
                             </div>
                             <div className="flex items-center gap-3">
                               <button 
                                 onClick={() => {
                                   const filtered = newResponseTemplates.filter(t => t.trim());
                                   if (filtered.length > 0) {
                                     const picked = filtered[Math.floor(Math.random() * filtered.length)];
                                     alert(`Simulation: System picked variation\n\n"${picked}"`);
                                   } else {
                                     alert("Enter at least one variation to test.");
                                   }
                                 }}
                                 className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2"
                               >
                                 <PlayCircle className="w-3 h-3" /> Test Random
                               </button>
                               <button 
                                 onClick={() => {
                                   setNewResponseTemplates([...newResponseTemplates, '']);
                                   setLastAddedIndex(newResponseTemplates.length);
                                   setTimeout(() => setLastAddedIndex(null), 3000);
                                 }}
                                 className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2"
                               >
                                 <Plus className="w-3 h-3" /> Add Variation
                               </button>
                             </div>
                           </div>
                           <div className="space-y-4 relative z-10">
                             <AnimatePresence mode="popLayout">
                               {newResponseTemplates.map((template, idx) => (
                                 <motion.div 
                                   key={idx}
                                   initial={{ opacity: 0, x: -20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   exit={{ opacity: 0, x: 20 }}
                                   layout
                                   className="relative group/var"
                                 >
                                   <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-200 group-focus-within/var:bg-indigo-500 transition-colors" />
                                   {lastAddedIndex === idx && (
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
                                    value={template}
                                    onChange={(e) => {
                                      const next = [...newResponseTemplates];
                                      next[idx] = e.target.value;
                                      setNewResponseTemplates(next);
                                    }}
                                    placeholder={`Variation #${idx + 1}...`}
                                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl px-5 py-4 pr-12 text-xs font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm min-h-[90px] text-[var(--ink)] resize-none transition-all placeholder:text-[var(--ink-muted)]/40"
                                   />
                                   <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-0 group-hover/var:opacity-100 transition-opacity">
                                     {idx > 0 && (
                                       <button 
                                         onClick={() => moveTemplate(idx, 'up')}
                                         className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                         title="Move Up"
                                       >
                                         <ChevronUp className="w-3.5 h-3.5" />
                                       </button>
                                     )}
                                     {idx < newResponseTemplates.length - 1 && (
                                       <button 
                                         onClick={() => moveTemplate(idx, 'down')}
                                         className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                                         title="Move Down"
                                       >
                                         <ChevronDown className="w-3.5 h-3.5" />
                                       </button>
                                     )}
                                     {newResponseTemplates.length > 1 && (
                                       <button 
                                         onClick={() => setNewResponseTemplates(newResponseTemplates.filter((_, i) => i !== idx))}
                                         className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all mt-1"
                                         title="Delete"
                                       >
                                         <Trash2 className="w-3.5 h-3.5" />
                                       </button>
                                     )}
                                   </div>
                                   <div className="absolute bottom-3 right-4 px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-md opacity-0 group-hover/var:opacity-100 transition-opacity pointer-events-none">
                                      <span className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest italic">v{idx + 1}</span>
                                   </div>
                                 </motion.div>
                               ))}
                             </AnimatePresence>
                           </div>
                           <div className="pt-2 flex items-start gap-3 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <p className="text-[9px] text-indigo-700/80 font-bold leading-relaxed italic">
                                System rotates variations to prevent "bot-like" behavior. We recommend at least 3 variations for maximum security.
                              </p>
                           </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em] flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                         Status
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['Active', 'Paused', 'Draft'] as Status[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => setNewStatus(status)}
                            className={cn(
                              "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                              newStatus === status ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-[var(--card)] border-[var(--border)] text-[var(--ink-muted)] hover:border-slate-300"
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em] flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                         Engagement Refinements
                      </label>
                      <div className="grid grid-cols-1 gap-4">
                        <div className={cn(
                          "p-6 rounded-[2rem] border-2 transition-all cursor-pointer",
                          newAutoLike ? "border-emerald-500 bg-emerald-50/50" : "border-[var(--border)] bg-[var(--bg)]"
                        )} onClick={() => setNewAutoLike(!newAutoLike)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", newAutoLike ? "bg-emerald-500 text-white" : "bg-[var(--card)] text-[var(--ink-muted)]")}>
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-[var(--ink)]">Auto-Like Comment</p>
                                <p className="text-[10px] text-[var(--ink-muted)] font-medium italic">Automatically like the user's comment when a keyword is triggered.</p>
                              </div>
                            </div>
                            <div className={cn("w-12 h-6 rounded-full relative transition-all shrink-0", newAutoLike ? "bg-emerald-500" : "bg-[var(--border)]")}>
                              <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", newAutoLike ? "left-7" : "left-1")} />
                            </div>
                          </div>
                        </div>

                        <div className={cn(
                          "p-6 rounded-[2rem] border-2 transition-all",
                          newPublicReply ? "border-indigo-600 bg-indigo-50/50" : "border-[var(--border)] bg-[var(--bg)]"
                        )}>
                          <div className="flex items-center justify-between cursor-pointer" onClick={() => setNewPublicReply(!newPublicReply)}>
                            <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", newPublicReply ? "bg-indigo-600 text-white" : "bg-[var(--card)] text-[var(--ink-muted)]")}>
                                <MessageSquare className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-[var(--ink)]">Public Reply to Comment</p>
                                <p className="text-[10px] text-[var(--ink-muted)] font-medium italic">Post a public reply to the comment to boost visibility.</p>
                              </div>
                            </div>
                            <div className={cn("w-12 h-6 rounded-full relative transition-all shrink-0", newPublicReply ? "bg-indigo-600" : "bg-[var(--border)]")}>
                              <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", newPublicReply ? "left-7" : "left-1")} />
                            </div>
                          </div>
                          
                          {newPublicReply && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-6 pt-6 border-t border-indigo-100"
                            >
                              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Public Reply Template</p>
                              <textarea 
                                value={newPublicReplyText}
                                onChange={(e) => setNewPublicReplyText(e.target.value)}
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
                          onClick={() => setNewScope('All')}
                          className={cn(
                            "flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all",
                            newScope === 'All' ? "bg-[var(--card)] shadow-xl text-indigo-600" : "text-[var(--ink-muted)]"
                          )}
                        >
                          All Posts
                        </button>
                        <button 
                          onClick={() => setNewScope('Posts')}
                          className={cn(
                            "flex-1 py-4 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            newScope === 'Posts' ? "bg-[var(--card)] shadow-xl text-indigo-600" : "text-[var(--ink-muted)]"
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
                        <Hash className={cn(
                          "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                          keywordError ? "text-rose-400" : "text-indigo-300"
                        )} />
                        <input 
                          type="text" 
                          placeholder="e.g. PRICING, BOOKING, DEMO"
                          value={newKeywords}
                          onChange={(e) => {
                            setNewKeywords(e.target.value);
                            if (keywordError) setKeywordError(null);
                          }}
                          className={cn(
                            "w-full bg-slate-50 border-none rounded-[1.8rem] pl-16 pr-8 py-5 text-sm font-black tracking-tight focus:ring-4 transition-all shadow-inner text-slate-900",
                            keywordError 
                              ? "ring-4 ring-rose-500/20 bg-rose-50/30 placeholder:text-rose-300" 
                              : "focus:ring-indigo-500/10 placeholder:text-slate-300"
                          )}
                        />
                      </div>
                      <div className="flex items-center justify-between px-2">
                        <p className="text-[10px] text-slate-400 font-medium italic uppercase tracking-wider">Separate with commas.</p>
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
                    </div>

                    <div className="pt-6">
                       <button 
                        onClick={handleCreate}
                        disabled={!newKeywords.trim()}
                        className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(15,23,42,0.3)] hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          {editingResponderId ? 'Update Automation' : 'Save and Start'}
                       </button>
                    </div>
                  </div>

                  {/* TARGET SELECTION */}
                  <div className="bg-[var(--bg)]/50 rounded-[3rem] border border-[var(--border)] p-10 flex flex-col h-full overflow-hidden min-h-[500px]">
                    {newScope === 'All' ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center gap-10 p-10 mt-auto mb-auto">
                        <div className="relative">
                           <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
                           <div className="w-28 h-28 bg-[var(--card)] rounded-[2.5rem] shadow-2xl flex items-center justify-center text-indigo-500 relative z-10 border border-[var(--border)]">
                              <Zap className="w-12 h-12" />
                           </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-[var(--ink)] tracking-tight italic">Smart Mode</h3>
                          <p className="text-xs text-[var(--ink-muted)] font-medium leading-relaxed max-w-xs mx-auto italic">
                            System will monitor every interaction across your entire social environment.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                           <div className="space-y-1">
                              <h3 className="text-[11px] font-black text-[var(--ink-muted)] uppercase tracking-[0.3em]">Post Selection</h3>
                              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest italic leading-none">Choose Targets</p>
                           </div>
                           <div className="flex items-center gap-4">
                             <div className="text-right">
                               <p className={cn(
                                 "text-3xl font-black leading-none italic transition-colors",
                                 selectedPosts.length > 0 ? "text-indigo-600" : "text-[var(--ink-muted)] opacity-30"
                               )}>{selectedPosts.length}</p>
                               <p className="text-[8px] font-black text-[var(--ink-muted)] uppercase tracking-widest mt-1">Posts Linked</p>
                             </div>
                             <div className={cn(
                               "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                               selectedPosts.length > 0 ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20" : "bg-[var(--bg)] text-[var(--ink-muted)] border-[var(--border)] opacity-30"
                             )}>
                               <ShieldCheck className="w-6 h-6" />
                             </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
                            <button 
                              onClick={() => setShowSelectedOnly(false)}
                              className={cn(
                                "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                !showSelectedOnly ? "bg-indigo-600 text-white shadow-md" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                              )}
                            >
                              All
                            </button>
                            <button 
                              onClick={() => setShowSelectedOnly(true)}
                              className={cn(
                                "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                showSelectedOnly ? "bg-indigo-600 text-white shadow-md" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                              )}
                            >
                              Review {selectedPosts.length > 0 && `(${selectedPosts.length})`}
                            </button>
                          </div>
                          
                          <div className="h-6 w-px bg-[var(--border)]" />
                          
                          <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
                            {(['All', 'Instagram', 'Facebook'] as const).map(p => (
                              <button 
                                key={p}
                                onClick={() => setPostPlatformFilter(p)}
                                className={cn(
                                  "px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                  postPlatformFilter === p ? "bg-slate-900 dark:bg-indigo-900/50 text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                                )}
                              >
                                {p === 'All' ? 'Platform' : p}
                              </button>
                            ))}
                          </div>

                          <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
                            {(['All', 'Post', 'Reel'] as const).map(t => (
                              <button 
                                key={t}
                                onClick={() => setPostTypeFilter(t)}
                                className={cn(
                                  "px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                  postTypeFilter === t ? "bg-slate-900 dark:bg-indigo-900/50 text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                                )}
                              >
                                {t === 'All' ? 'Format' : t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-8">
                           <div className="flex items-center gap-6">
                             <button 
                              onClick={() => {
                                const filtered = mockPosts.filter(p => 
                                  p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) &&
                                  (postPlatformFilter === 'All' || p.platform === postPlatformFilter) &&
                                  (postTypeFilter === 'All' || p.type === postTypeFilter) &&
                                  (!showSelectedOnly || selectedPosts.includes(p.id))
                                );
                                const paged = filtered.slice((postSelectionPage - 1) * postsPerPage, postSelectionPage * postsPerPage);
                                const pagedIds = paged.map(p => p.id);
                                
                                const allPagedSelected = pagedIds.every(id => selectedPosts.includes(id));
                                if (allPagedSelected) {
                                  setSelectedPosts(prev => prev.filter(id => !pagedIds.includes(id)));
                                } else {
                                  setSelectedPosts(prev => [...new Set([...prev, ...pagedIds])]);
                                }
                              }}
                              className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                            >
                              <div className="w-4 h-4 rounded-md border-2 border-indigo-500/30 flex items-center justify-center">
                                {(() => {
                                  const filtered = mockPosts.filter(p => 
                                    p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) &&
                                    (postPlatformFilter === 'All' || p.platform === postPlatformFilter) &&
                                    (postTypeFilter === 'All' || p.type === postTypeFilter) &&
                                    (!showSelectedOnly || selectedPosts.includes(p.id))
                                  );
                                  const paged = filtered.slice((postSelectionPage - 1) * postsPerPage, postSelectionPage * postsPerPage);
                                  const pagedIds = paged.map(p => p.id);
                                  return pagedIds.length > 0 && pagedIds.every(id => selectedPosts.includes(id)) ? <CheckCircle2 className="w-3 h-3 text-indigo-500 fill-indigo-500/10" /> : null;
                                })()}
                              </div>
                              Select Page
                            </button>

                            <button 
                              onClick={() => {
                                const matched = mockPosts.filter(p => 
                                  p.title.toLowerCase().includes(postSearchQuery.toLowerCase()) &&
                                  (postPlatformFilter === 'All' || p.platform === postPlatformFilter) &&
                                  (postTypeFilter === 'All' || p.type === postTypeFilter)
                                ).map(p => p.id);
                                setSelectedPosts(prev => [...new Set([...prev, ...matched])]);
                              }}
                              className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors"
                            >
                              Select All Matching
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
                          <Search className={cn(
                            "absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                            postSearchQuery ? "text-indigo-500" : "text-[var(--ink-muted)] group-focus-within:text-indigo-500"
                          )} />
                          <input 
                            type="text" 
                            placeholder="Find posts by title..."
                            value={postSearchQuery}
                            onChange={(e) => setPostSearchQuery(e.target.value)}
                            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl pl-14 pr-12 py-4 text-xs font-bold tracking-tight focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none shadow-inner text-[var(--ink)]"
                          />
                          {postSearchQuery && (
                            <button 
                              onClick={() => setPostSearchQuery('')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[var(--bg)] text-[var(--ink-muted)] hover:text-indigo-600 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-3 grid grid-cols-2 gap-6 pb-6">
                          {(() => {
                            const filteredPosts = mockPosts.filter(post => 
                              post.title.toLowerCase().includes(postSearchQuery.toLowerCase()) && 
                              (postPlatformFilter === 'All' || post.platform === postPlatformFilter) &&
                              (postTypeFilter === 'All' || post.type === postTypeFilter) &&
                              (!showSelectedOnly || selectedPosts.includes(post.id))
                            );
                            const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                            const pagedPosts = filteredPosts.slice(
                              (postSelectionPage - 1) * postsPerPage, 
                              postSelectionPage * postsPerPage
                            );

                            return (
                              <>
                                {pagedPosts.map((post) => (
                                  <button 
                                    key={post.id}
                                    onClick={() => togglePost(post.id)}
                                    className={cn(
                                      "group relative aspect-square rounded-[2rem] overflow-hidden border-4 transition-all text-left",
                                      selectedPosts.includes(post.id) ? "border-indigo-600 shadow-2xl scale-[1.02]" : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                  >
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className={cn(
                                      "absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-5 transition-opacity duration-500",
                                      selectedPosts.includes(post.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    )}>
                                      <p className="text-[10px] font-black text-white uppercase tracking-tight mb-2 pr-4">{post.title}</p>
                                      <div className="flex items-center gap-3">
                                         <div className="flex items-center gap-1.5 text-[8px] font-black text-indigo-300 uppercase tracking-widest">
                                            <Activity className="w-2.5 h-2.5" />
                                            {post.likes} ENG
                                         </div>
                                      </div>
                                    </div>
                                    <div className={cn(
                                      "absolute top-4 right-4 rounded-xl p-2 z-20 transition-all duration-300 shadow-2xl",
                                      selectedPosts.includes(post.id) 
                                        ? "bg-indigo-600 scale-100 rotate-0" 
                                        : "bg-white/20 backdrop-blur-md border border-white/30 scale-90 -rotate-12 opacity-0 group-hover:opacity-100"
                                    )}>
                                      <CheckCircle2 className={cn(
                                        "w-4 h-4 transition-colors",
                                        selectedPosts.includes(post.id) ? "text-white" : "text-white/40"
                                      )} />
                                    </div>
                                    <div className={cn(
                                      "absolute inset-0 bg-indigo-600/20 transition-opacity",
                                      selectedPosts.includes(post.id) ? "opacity-100" : "opacity-0"
                                    )} />
                                  </button>
                                ))}
                                {pagedPosts.length === 0 && (
                                  <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center opacity-40">
                                    <Search className="w-12 h-12 mb-4 text-[var(--ink-muted)]" />
                                    <p className="text-xs font-black uppercase tracking-widest text-[var(--ink)]">No posts found</p>
                                  </div>
                                )}
                                
                                {totalPages > 1 && (
                                  <div className="col-span-2 mt-4 flex items-center justify-center gap-4 py-2 border-t border-[var(--border)] pt-6">
                                    <button 
                                      onClick={(e) => { e.preventDefault(); setPostSelectionPage(p => Math.max(1, p - 1)); }}
                                      disabled={postSelectionPage === 1}
                                      className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                      <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-2">
                                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                          key={page}
                                          onClick={(e) => { e.preventDefault(); setPostSelectionPage(page); }}
                                          className={cn(
                                            "w-8 h-8 rounded-lg text-[9px] font-black transition-all",
                                            postSelectionPage === page 
                                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                              : "text-[var(--ink-muted)] hover:bg-[var(--bg)]"
                                          )}
                                        >
                                          {page}
                                        </button>
                                      ))}
                                    </div>
                                    <button 
                                      onClick={(e) => { e.preventDefault(); setPostSelectionPage(p => Math.min(totalPages, p + 1)); }}
                                      disabled={postSelectionPage === totalPages}
                                      className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                      <ChevronRight className="w-5 h-5" />
                                    </button>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          {selectedPosts.length > 0 && (
                            <div className="mb-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Previews</p>
                                <button 
                                  onClick={() => setSelectedPosts([])}
                                  className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                                >
                                  Clear All
                                </button>
                              </div>
                              <div className="flex gap-3 overflow-x-auto pb-4">
                                {selectedPosts.map(id => {
                                  const post = mockPosts.find(p => p.id === id);
                                  if (!post) return null;
                                  return (
                                    <div key={id} className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden group border border-slate-100">
                                      <img src={post.image} className="w-full h-full object-cover" />
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); togglePost(id); }}
                                        className="absolute inset-0 bg-rose-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                      >
                                        <Trash2 className="w-4 h-4 text-white" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <p className="text-[10px] font-black text-slate-300 italic uppercase tracking-widest">Selection complete. Ready to start.</p>
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
    </div>
  );
}
