import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WebApp, BrowserTab, SpeedDialItem, NewsItem } from '../types';
import {
  NEWS_FEED_DATA,
  NEWS_CATEGORIES,
  CITIES_WEATHER,
  TRENDING_TAGS,
  WeatherData,
} from '../data/homeData';
import { CURATED_LINKS, CuratedLink } from '../data/curatedLinks';
import { GLOBAL_CHANNELS_LIST, GlobalChannelItem } from '../data/globalChannels';
import { LiveChannelsSection } from './LiveChannelsSection';
import { AppIconRenderer } from '../utils/iconMap';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home as HomeIcon,
  Plus,
  X,
  Star,
  ShieldCheck,
  ExternalLink,
  Clock,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Tv,
  Bot,
  Sparkles,
  MessageSquare,
  ChevronDown,
  Globe,
  BookOpen,
  Lock,
  Compass,
  LayoutGrid,
  Zap,
  Radio,
  Play,
  Laptop,
} from 'lucide-react';

interface HomeTabProps {
  apps?: WebApp[];
  initialView?: 'browser' | 'shortcuts' | 'channels' | 'news';
  onNavigateToStore: () => void;
  onNavigateToLaunchpad: () => void;
  onLaunchApp: (app: WebApp) => void;
  onOpenAppDetails: (app: WebApp) => void;
  featuredApp?: WebApp;
  onDirectSearchInStore: (query: string) => void;
}

const STORAGE_SPEED_DIAL = 'appgo_browser_speed_dial_v4';

const DEFAULT_SHORTCUTS: SpeedDialItem[] = [
  { id: 'sc-google', title: 'Google', url: 'https://www.google.com', category: 'tools', type: 'Web Search', badge: 'Search', color: 'from-blue-600 to-indigo-700', icon: 'Globe' },
  { id: 'sc-youtube', title: 'YouTube', url: 'https://www.youtube.com', category: 'entertainment', type: 'Video Streaming', badge: 'Streaming', color: 'from-red-600 to-rose-800', icon: 'Tv' },
  { id: 'sc-wikipedia', title: 'Wikipedia', url: 'https://en.wikipedia.org', category: 'tools', type: 'Free Encyclopedia', badge: 'Reference', color: 'from-slate-700 to-zinc-900', icon: 'BookOpen' },
  { id: 'sc-bbc', title: 'BBC News', url: 'https://www.bbc.com/news', category: 'news', type: 'Global Headlines', badge: 'Live News', color: 'from-red-700 to-rose-900', icon: 'Radio' },
  { id: 'sc-cnn', title: 'CNN News', url: 'https://edition.cnn.com', category: 'news', type: 'Breaking News', badge: 'Live News', color: 'from-blue-700 to-indigo-900', icon: 'Tv' },
  { id: 'sc-aljazeera', title: 'Al Jazeera', url: 'https://www.aljazeera.com', category: 'news', type: 'World News & Live', badge: 'Live News', color: 'from-amber-600 to-orange-800', icon: 'Globe' },
  { id: 'sc-chatgpt', title: 'ChatGPT', url: 'https://chatgpt.com', category: 'ai', type: 'Conversational AI', badge: 'AI Assistant', color: 'from-emerald-600 to-teal-800', icon: 'Bot' },
  { id: 'sc-claude', title: 'Claude AI', url: 'https://claude.ai', category: 'ai', type: 'Anthropic Assistant', badge: 'AI Model', color: 'from-amber-700 to-orange-900', icon: 'Sparkles' },
  { id: 'sc-openrouter', title: 'OpenRouter AI', url: 'https://openrouter.ai', category: 'ai', type: 'Multi-Model Hub', badge: 'AI Gateway', color: 'from-indigo-600 to-violet-800', icon: 'Zap' },
  { id: 'sc-github', title: 'GitHub', url: 'https://github.com', category: 'dev', type: 'Code & Repositories', badge: 'Developer', color: 'from-zinc-800 to-slate-950', icon: 'Laptop' },
  { id: 'sc-reddit', title: 'Reddit', url: 'https://reddit.com', category: 'social', type: 'Community Discussions', badge: 'Social', color: 'from-orange-600 to-red-700', icon: 'MessageSquare' },
  { id: 'sc-twitch', title: 'Twitch', url: 'https://twitch.tv', category: 'entertainment', type: 'Live Game Streaming', badge: 'Live', color: 'from-purple-600 to-indigo-800', icon: 'Tv' },
];

type SearchEngine = 'google' | 'duckduckgo' | 'youtube' | 'wikipedia' | 'ai';
type BrowserViewMode = 'browser' | 'shortcuts' | 'channels' | 'news';

export const HomeTab: React.FC<HomeTabProps> = ({
  apps = [],
  initialView = 'browser',
  onNavigateToStore,
  onNavigateToLaunchpad,
  onLaunchApp,
  onOpenAppDetails,
  featuredApp,
  onDirectSearchInStore,
}) => {
  // --- INLINE VIEW SWITCH STATE: 'browser' | 'shortcuts' | 'channels' | 'news' ---
  const [activeView, setActiveView] = useState<BrowserViewMode>(initialView);

  // Sync initialView when parent prop changes
  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
    }
  }, [initialView]);

  // --- BROWSER STATE (SINGLE ACTIVE TAB, NO BULKY TAB STRIP ROW) ---
  const [activeTab, setActiveTab] = useState<BrowserTab>({
    id: 'main-tab',
    title: 'Start Page',
    url: 'appgo:speeddial',
    isSpeedDial: true,
    isLoading: false,
    history: ['appgo:speeddial'],
    historyIndex: 0,
  });

  // --- OMNIBOX ADDRESS BAR STATE ---
  const [addressInput, setAddressInput] = useState<string>('');
  const [searchEngine, setSearchEngine] = useState<SearchEngine>('google');
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [isEngineSelectorOpen, setIsEngineSelectorOpen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  // Sync omnibox text with active tab
  useEffect(() => {
    if (activeTab.isSpeedDial) {
      setAddressInput('');
    } else if (activeTab.url.startsWith('https://www.google.com/search?igu=1&q=')) {
      try {
        const urlObj = new URL(activeTab.url);
        setAddressInput(urlObj.searchParams.get('q') || activeTab.url);
      } catch {
        setAddressInput(activeTab.url);
      }
    } else {
      setAddressInput(activeTab.url);
    }
    setIframeError(false);
  }, [activeTab]);

  // --- GLOBAL CHANNELS QUICK BAR STATE ---
  const [channelSearchQuery, setChannelSearchQuery] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string>(GLOBAL_CHANNELS_LIST[0]?.id || 'gc-bbcnews');

  // Filtered channel options for dropdown
  const filteredChannelsList = useMemo(() => {
    if (!channelSearchQuery.trim()) return GLOBAL_CHANNELS_LIST;
    const q = channelSearchQuery.toLowerCase().trim();
    return GLOBAL_CHANNELS_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q)
    );
  }, [channelSearchQuery]);

  // Active selected channel
  const selectedChannelObj = useMemo(() => {
    return (
      GLOBAL_CHANNELS_LIST.find((c) => c.id === selectedChannelId) ||
      GLOBAL_CHANNELS_LIST[0]
    );
  }, [selectedChannelId]);

  // Channels grouped by Region for smart dropdown
  const channelRegionGroups = useMemo(() => {
    const groups: Record<string, GlobalChannelItem[]> = {};
    for (const ch of filteredChannelsList) {
      const reg = ch.region;
      if (!groups[reg]) groups[reg] = [];
      groups[reg].push(ch);
    }
    return groups;
  }, [filteredChannelsList]);

  // --- SHORTCUTS (SPEED DIAL) STATE ---
  const [speedDialItems, setSpeedDialItems] = useState<SpeedDialItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SPEED_DIAL);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_SHORTCUTS;
  });

  const [speedDialCategory, setSpeedDialCategory] = useState<string>('all');
  const [isAddSpeedDialOpen, setIsAddSpeedDialOpen] = useState(false);
  const [newDialTitle, setNewDialTitle] = useState('');
  const [newDialUrl, setNewDialUrl] = useState('');
  const [newDialType, setNewDialType] = useState('');

  // Persist shortcuts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SPEED_DIAL, JSON.stringify(speedDialItems));
    } catch {}
  }, [speedDialItems]);

  // --- SHORTCUT OPEN MODE ('new-window' recommended to prevent iframe X-Frame-Options blocking) ---
  const [shortcutOpenMode, setShortcutOpenMode] = useState<'new-window' | 'in-app'>('new-window');
  const [showQuickShortcuts, setShowQuickShortcuts] = useState<boolean>(true);

  // Launch shortcut directly in its own window or in-app
  const handleLaunchShortcut = (url: string, title?: string, forceMode?: 'new-window' | 'in-app') => {
    const mode = forceMode || shortcutOpenMode;
    if (mode === 'new-window') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      handleNavigateActiveTab(url, title);
    }
  };

  // --- WEATHER & CLOCK STATE ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState('New York');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weather = useMemo(() => {
    return CITIES_WEATHER[selectedCity] || CITIES_WEATHER['New York'];
  }, [selectedCity]);

  // --- NEWS & FEED STATE ---
  const [newsCategory, setNewsCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // --- IN-PAGE GOOGLE SEARCH VIEW MODE ---
  const [searchViewMode, setSearchViewMode] = useState<'appgo-theme' | 'live-embed'>('appgo-theme');
  const [inPageSearchQuery, setInPageSearchQuery] = useState('');
  const [googleResultTab, setGoogleResultTab] = useState<'all' | 'web' | 'ai' | 'videos' | 'stories' | 'apps'>('all');
  const [isRawIframeDark, setIsRawIframeDark] = useState(true);

  // --- NAVIGATION HANDLERS ---
  const handleNavigateActiveTab = (targetUrlOrQuery: string, customTitle?: string) => {
    const trimmed = targetUrlOrQuery.trim();
    if (!trimmed) return;

    let destinationUrl = trimmed;
    let newTitle = customTitle || trimmed;
    let isSpeedDial = false;

    if (trimmed === 'appgo:speeddial' || trimmed === 'about:blank') {
      destinationUrl = 'appgo:speeddial';
      newTitle = 'Start Page';
      isSpeedDial = true;
      setActiveView('browser');
    } else if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.includes('.') && !trimmed.includes(' ')
    ) {
      destinationUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      try {
        const u = new URL(destinationUrl);
        newTitle = customTitle || u.hostname.replace('www.', '');
      } catch {
        newTitle = customTitle || trimmed;
      }
      setActiveView('browser');
    } else {
      // Search query
      setInPageSearchQuery(trimmed);
      switch (searchEngine) {
        case 'duckduckgo':
          destinationUrl = `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
          newTitle = `${trimmed} - DuckDuckGo`;
          break;
        case 'youtube':
          destinationUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(trimmed)}`;
          newTitle = `${trimmed} - YouTube`;
          break;
        case 'wikipedia':
          destinationUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(trimmed)}`;
          newTitle = `${trimmed} - Wikipedia`;
          break;
        case 'ai':
          destinationUrl = `https://openrouter.ai/chat?q=${encodeURIComponent(trimmed)}`;
          newTitle = `${trimmed} - AI Search`;
          break;
        case 'google':
        default:
          destinationUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(trimmed)}`;
          newTitle = `${trimmed} - Google Search`;
          break;
      }
      setActiveView('browser');
    }

    setIframeLoading(!isSpeedDial);
    setIframeError(false);

    setActiveTab((prev) => {
      const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), destinationUrl];
      return {
        ...prev,
        title: newTitle,
        url: destinationUrl,
        isSpeedDial,
        isLoading: !isSpeedDial,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  };

  const handleOmniboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    handleNavigateActiveTab(addressInput.trim());
  };

  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      const prevIdx = activeTab.historyIndex - 1;
      const targetUrl = activeTab.history[prevIdx];
      setActiveTab((prev) => ({
        ...prev,
        url: targetUrl,
        historyIndex: prevIdx,
        isSpeedDial: targetUrl === 'appgo:speeddial',
      }));
    }
  };

  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const nextIdx = activeTab.historyIndex + 1;
      const targetUrl = activeTab.history[nextIdx];
      setActiveTab((prev) => ({
        ...prev,
        url: targetUrl,
        historyIndex: nextIdx,
        isSpeedDial: targetUrl === 'appgo:speeddial',
      }));
    }
  };

  const handleReload = () => {
    setIsReloading(true);
    setIframeLoading(true);
    setIframeError(false);
    setTimeout(() => {
      setIsReloading(false);
      setIframeLoading(false);
    }, 700);
  };

  // --- PIN / BOOKMARK TO SPEED DIAL ---
  const isCurrentSitePinned = useMemo(() => {
    if (activeTab.isSpeedDial) return false;
    return speedDialItems.some((item) => item.url === activeTab.url);
  }, [speedDialItems, activeTab]);

  const handleTogglePinSite = () => {
    if (activeTab.isSpeedDial) return;
    if (isCurrentSitePinned) {
      setSpeedDialItems((prev) => prev.filter((item) => item.url !== activeTab.url));
    } else {
      const newShortcut: SpeedDialItem = {
        id: `sd-${Date.now()}`,
        title: activeTab.title.slice(0, 20),
        url: activeTab.url,
        category: 'pinned',
        type: 'Pinned Site',
        badge: 'Custom',
        color: 'from-indigo-600 to-purple-800',
        icon: 'Globe',
        isCustom: true,
      };
      setSpeedDialItems((prev) => [newShortcut, ...prev]);
    }
  };

  const handleAddCustomSpeedDial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDialTitle.trim() || !newDialUrl.trim()) return;

    let targetUrl = newDialUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    const newItem: SpeedDialItem = {
      id: `sd-custom-${Date.now()}`,
      title: newDialTitle.trim(),
      url: targetUrl,
      category: 'pinned',
      type: newDialType.trim() || 'Custom Shortcut',
      badge: 'My Site',
      color: 'from-indigo-600 to-pink-700',
      icon: 'Globe',
      isCustom: true,
    };

    setSpeedDialItems((prev) => [newItem, ...prev]);
    setIsAddSpeedDialOpen(false);
    setNewDialTitle('');
    setNewDialUrl('');
    setNewDialType('');
  };

  const handleDeleteSpeedDialItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeedDialItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Filtered shortcuts
  const filteredSpeedDial = useMemo(() => {
    if (speedDialCategory === 'all') return speedDialItems;
    if (speedDialCategory === 'pinned') return speedDialItems.filter((i) => i.isCustom || i.category === 'pinned');
    return speedDialItems.filter((i) => i.category === speedDialCategory);
  }, [speedDialItems, speedDialCategory]);

  const renderWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'rain':
        return <CloudRain className="w-3.5 h-3.5 text-sky-400" />;
      case 'cloud-sun':
        return <CloudSun className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <Cloud className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  // Detect whether active URL is a Google search URL
  const isGoogleSearchUrl = activeTab.url.includes('google.com/search?');

  // Dynamic search results for Theme view
  const dynamicSearchResults = useMemo(() => {
    if (!inPageSearchQuery.trim()) {
      return {
        matchedApps: [],
        matchedWeb: [],
        matchedStories: [],
        synthesizedWeb: [],
        videos: [],
        relatedQueries: [],
        aiOverview: null,
      };
    }
    const q = inPageSearchQuery.toLowerCase().trim();
    const capitalizedQ = q
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const matchedApps = apps
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.category.toLowerCase().includes(q)
      )
      .map((a) => ({
        id: a.id,
        title: `${a.title} - Official Web App`,
        url: a.url,
        displayUrl: `https://appgo.dev › tools › ${a.id.replace('app-', '')}`,
        snippet: `${a.tagline}. ${a.description.slice(0, 160)}... Category: ${a.category} • Rating: ★ ${a.rating}`,
        type: 'app' as const,
        badge: a.category,
      }));

    const matchedWeb = CURATED_LINKS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        (c.type && c.type.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    ).map((c) => ({
      id: c.id,
      title: `${c.title} - ${c.category}`,
      url: c.url,
      displayUrl: c.url.replace(/^https?:\/\//, ''),
      snippet: `${c.tagline}. Direct verified access curated for fast performance.`,
      type: 'web' as const,
      badge: c.type || c.category,
    }));

    const matchedStories = NEWS_FEED_DATA.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q)
    ).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      displayUrl: `${n.source} › story › ${n.category.toLowerCase()}`,
      snippet: `${n.summary} • Published ${n.timeAgo} by ${n.author || n.source}`,
      type: 'article' as const,
      badge: n.category,
    }));

    const synthesizedWeb = [
      {
        id: `synth-wiki-${q}`,
        title: `${capitalizedQ} - Wikipedia, the free encyclopedia`,
        url: `https://en.m.wikipedia.org/wiki/${encodeURIComponent(capitalizedQ.replace(/\s+/g, '_'))}`,
        displayUrl: `https://en.wikipedia.org › wiki › ${encodeURIComponent(capitalizedQ.replace(/\s+/g, '_'))}`,
        snippet: `In-depth encyclopedic history, definitions, scientific context, and verified references covering ${capitalizedQ}. Verified community reference.`,
        type: 'web' as const,
        badge: 'Encyclopedia',
      },
      {
        id: `synth-official-${q}`,
        title: `${capitalizedQ} - Official Homepage & Documentation`,
        url: `https://www.google.com/search?igu=1&q=${encodeURIComponent(q + ' official site')}`,
        displayUrl: `https://${q.replace(/[^a-z0-9]/g, '')}.org › overview`,
        snippet: `Explore the authentic hub, release notes, security advisories, and community channels for ${capitalizedQ}.`,
        type: 'web' as const,
        badge: 'Official',
      },
      {
        id: `synth-news-${q}`,
        title: `Latest News, Insights & Industry Trends for "${capitalizedQ}"`,
        url: `https://news.google.com/search?q=${encodeURIComponent(q)}`,
        displayUrl: `https://news.google.com › stories › ${encodeURIComponent(q)}`,
        snippet: `Real-time journalistic dispatches, market implications, and editorial reviews on ${capitalizedQ}.`,
        type: 'web' as const,
        badge: 'Headlines',
      },
    ];

    const videos = [
      {
        id: `vid-1-${q}`,
        title: `${capitalizedQ} - Everything You Need to Know (2026 Overview)`,
        channel: 'Global Tech & Culture',
        duration: '12:45',
        views: '480K views',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
        thumb: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: `vid-2-${q}`,
        title: `How to Get Started with ${capitalizedQ} - Step by Step Walkthrough`,
        channel: 'AppGo Creator Hub',
        duration: '18:20',
        views: '210K views',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' tutorial')}`,
        thumb: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=400&q=80',
      },
    ];

    const aiOverview = {
      title: `AI Overview for "${capitalizedQ}"`,
      summary: `${capitalizedQ} is actively indexed within AppGo's live web directory. Verified direct links, official documentation, multimedia streaming channels, and curated utilities matching your query are available below.`,
      keyTakeaways: [
        `Direct official references loaded without iframe restrictions.`,
        `Explore interactive apps, developer tools, and news for ${capitalizedQ}.`,
        `Integrated Ad & Tracker shields protect your browsing session.`,
      ],
      sourceName: 'Wikipedia & AppGo Directory',
      sourceUrl: `https://en.m.wikipedia.org/wiki/${encodeURIComponent(capitalizedQ.replace(/\s+/g, '_'))}`,
    };

    return {
      matchedApps,
      matchedWeb,
      matchedStories,
      synthesizedWeb,
      videos,
      aiOverview,
      relatedQueries: [`${q} official site`, `${q} online`, `${q} login`, `${q} free tools`, `${q} latest news`],
    };
  }, [inPageSearchQuery, apps]);

  const activeResultsList = useMemo(() => {
    const { matchedApps, matchedWeb, matchedStories, synthesizedWeb } = dynamicSearchResults;
    switch (googleResultTab) {
      case 'apps':
        return matchedApps;
      case 'web':
        return [...matchedWeb, ...synthesizedWeb];
      case 'stories':
        return matchedStories;
      case 'all':
      default:
        return [...matchedApps, ...matchedWeb, ...synthesizedWeb, ...matchedStories];
    }
  }, [dynamicSearchResults, googleResultTab]);

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col bg-slate-950 text-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. SMART & LEAN BROWSER TOOLBAR (NO LEFT SIDEBAR, NO BULKY TABS ROW) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-3 py-2 sm:px-4 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Brand + Inline View Navigation Tabs (Smart, Compact, Inline) */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0 justify-between md:justify-start">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-xs font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent hidden sm:inline">
              Browser
            </span>
          </div>

          {/* Smart, Lean Inline Action Tabs */}
          <nav className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => {
                setActiveView('browser');
                if (!activeTab.isSpeedDial) {
                  // Keep currently open web page
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                activeView === 'browser'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Browser & Search View"
            >
              <Globe className="w-3 h-3" />
              <span>Browser</span>
            </button>

            <button
              onClick={() => setActiveView('shortcuts')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                activeView === 'shortcuts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Shortcuts & Speed Dial"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Shortcuts</span>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {speedDialItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView('channels')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                activeView === 'channels'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Global Live Channels"
            >
              <Tv className="w-3 h-3 text-purple-400" />
              <span>Global Channels</span>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-purple-950/60 text-purple-300 font-mono">
                {GLOBAL_CHANNELS_LIST.length}+
              </span>
            </button>

            <button
              onClick={() => setActiveView('news')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                activeView === 'news'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Latest World News"
            >
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span>News</span>
            </button>
          </nav>
        </div>

        {/* Center: Smart Omnibox Address & Search Bar */}
        <div className="flex-1 max-w-2xl w-full">
          <form onSubmit={handleOmniboxSubmit} className="relative">
            <div className="relative flex items-center bg-slate-900 border border-slate-700/80 focus-within:border-indigo-500 rounded-xl px-2.5 py-1 text-xs text-white shadow-inner transition">
              {/* Back / Forward Navigation Controls */}
              <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-800 text-slate-400">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={activeTab.historyIndex <= 0}
                  className={`p-1 rounded transition ${
                    activeTab.historyIndex > 0
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-slate-600 cursor-not-allowed'
                  }`}
                  title="Back"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleForward}
                  disabled={activeTab.historyIndex >= activeTab.history.length - 1}
                  className={`p-1 rounded transition ${
                    activeTab.historyIndex < activeTab.history.length - 1
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-slate-600 cursor-not-allowed'
                  }`}
                  title="Forward"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleReload}
                  className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  title="Reload"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigateActiveTab('appgo:speeddial')}
                  className={`p-1 rounded transition ${
                    activeTab.isSpeedDial
                      ? 'text-indigo-400 bg-indigo-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Start Page"
                >
                  <HomeIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search Engine Selector */}
              <div className="relative pl-1.5 pr-2 border-r border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEngineSelectorOpen(!isEngineSelectorOpen)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white uppercase tracking-wider"
                >
                  <span>{searchEngine}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isEngineSelectorOpen && (
                  <div className="absolute left-0 top-6 w-32 rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-2xl z-50 text-[11px] space-y-0.5">
                    {(['google', 'duckduckgo', 'youtube', 'wikipedia', 'ai'] as SearchEngine[]).map(
                      (eng) => (
                        <button
                          key={eng}
                          type="button"
                          onClick={() => {
                            setSearchEngine(eng);
                            setIsEngineSelectorOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded-lg capitalize font-medium transition ${
                            searchEngine === eng
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {eng === 'ai' ? 'AI Search' : eng}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Address / Search Input */}
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder={
                  activeTab.isSpeedDial
                    ? `Search ${searchEngine} or enter URL (e.g. bbc.com, cnn.com)...`
                    : activeTab.url
                }
                className="w-full bg-transparent px-2.5 text-xs text-white placeholder-slate-400 focus:outline-none font-mono"
              />

              {/* Omnibox Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {addressInput && (
                  <button
                    type="button"
                    onClick={() => setAddressInput('')}
                    className="text-slate-400 hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {/* Star Pin */}
                {!activeTab.isSpeedDial && (
                  <button
                    type="button"
                    onClick={handleTogglePinSite}
                    className={`p-1 rounded-md transition ${
                      isCurrentSitePinned
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-400 hover:text-amber-400'
                    }`}
                    title={isCurrentSitePinned ? 'Pinned to Shortcuts' : 'Pin to Shortcuts'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isCurrentSitePinned ? 'fill-amber-400' : ''}`} />
                  </button>
                )}

                {/* Ad-Shield Badge */}
                <div
                  className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isAdBlockEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title="AppGo Ad Protection Active"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Shield</span>
                </div>

                {/* "Go" Button */}
                <button
                  type="submit"
                  className="px-2.5 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                >
                  <span>Go</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Clock & Weather Widget */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-[11px]">
            {renderWeatherIcon(weather.icon)}
            <span>{weather.temp}°F</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-[10px] text-indigo-300 font-bold border-none focus:outline-none cursor-pointer"
            >
              {Object.keys(CITIES_WEATHER).map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. SMART & LEAN GLOBAL CHANNEL QUICK SEARCH BAR (ALL CHANNELS IN DROPDOWN) */}
      {/* ========================================================= */}
      <div className="bg-slate-900/95 border-b border-indigo-500/20 px-3 py-2 sm:px-4 sm:py-2.5 text-xs shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Quick bar title & live count */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <Tv className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">Global Channel Quick Bar</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {GLOBAL_CHANNELS_LIST.length} Global Channels
              </span>
            </div>
          </div>

          {/* Smart, Lean Dropdown & Filter Controls */}
          <div className="flex flex-1 items-center gap-2 max-w-2xl">
            {/* Filter Input */}
            <div className="relative w-36 sm:w-44 shrink-0">
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={channelSearchQuery}
                onChange={(e) => setChannelSearchQuery(e.target.value)}
                placeholder="Filter channels..."
                className="w-full pl-6 pr-2 py-1 text-[11px] rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400"
              />
              {channelSearchQuery && (
                <button
                  type="button"
                  onClick={() => setChannelSearchQuery('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Comprehensive Dropdown List with ALL Global Channels */}
            <select
              value={selectedChannelId}
              onChange={(e) => setSelectedChannelId(e.target.value)}
              className="flex-1 px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-medium focus:outline-none focus:border-indigo-400 truncate cursor-pointer"
            >
              {Object.entries(channelRegionGroups).map(([reg, chList]) => (
                <optgroup key={reg} label={`━━ ${reg} (${chList.length}) ━━`} className="bg-slate-900 text-indigo-300 font-bold">
                  {chList.map((ch) => (
                    <option key={ch.id} value={ch.id} className="bg-slate-950 text-white font-normal">
                      {ch.flag} {ch.name} • {ch.category} ({ch.badge || 'Live'})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Instant Watch Button */}
            {selectedChannelObj && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    if (shortcutOpenMode === 'new-window') {
                      window.open(selectedChannelObj.url, '_blank', 'noopener,noreferrer');
                    } else {
                      handleNavigateActiveTab(selectedChannelObj.url, selectedChannelObj.name);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 transition active:scale-95 whitespace-nowrap"
                  title={`Watch ${selectedChannelObj.name} (${shortcutOpenMode === 'new-window' ? 'Opens in own window' : 'In-App'})`}
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Watch Stream</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </button>

                <a
                  href={selectedChannelObj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Open in new window"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN CONTENT VIEW: BROWSER vs SHORTCUTS vs CHANNELS vs NEWS */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* --- VIEW 1: BROWSER VIEW (WEB PAGE OR SPEED DIAL SEARCH) --- */}
        {activeView === 'browser' && (
          activeTab.isSpeedDial ? (
            /* Speed Dial Search Center */
            <div className="p-5 sm:p-8 min-h-full space-y-6 max-w-4xl mx-auto w-full">
              {/* Clean Welcome Box */}
              <div className="text-center space-y-2 pt-2 sm:pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Fast, Private & Clean Web Navigation</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  AppGo Browser
                </h1>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Type any search term, URL, or choose from verified shortcuts and global channels.
                </p>
              </div>

              {/* Central Fast Search Bar */}
              <form onSubmit={handleOmniboxSubmit} className="relative max-w-2xl mx-auto">
                <div className="relative flex items-center bg-slate-900 border border-slate-700 hover:border-indigo-500 focus-within:border-indigo-500 rounded-2xl p-1.5 shadow-xl transition">
                  <Search className="w-4 h-4 text-indigo-400 ml-3 pointer-events-none" />
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder={`Search ${searchEngine} or enter web address...`}
                    className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition shadow-md"
                  >
                    Go
                  </button>
                </div>
              </form>

              {/* Popular Trending Tags (Inline & Lean) */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-400 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Quick:</span>
                {TRENDING_TAGS.slice(0, 7).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleNavigateActiveTab(tag.replace('#', ''))}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Featured Shortcuts Shelf Preview */}
              {showQuickShortcuts ? (
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Quick Shortcuts</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {shortcutOpenMode === 'new-window' ? 'Opens in own window ↗' : 'In-App Frame'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      {/* Mode toggle */}
                      <button
                        type="button"
                        onClick={() => setShortcutOpenMode((prev) => (prev === 'new-window' ? 'in-app' : 'new-window'))}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition font-medium text-[10px]"
                        title="Toggle: Open in own window (100% working) vs In-App frame"
                      >
                        {shortcutOpenMode === 'new-window' ? 'Mode: ↗ Own Window' : 'Mode: 📱 In-App'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowQuickShortcuts(false)}
                        className="text-slate-400 hover:text-slate-200 transition text-[11px]"
                        title="Remove / Hide quick shortcuts from start page"
                      >
                        Hide
                      </button>

                      <span className="text-slate-600">•</span>

                      <button
                        type="button"
                        onClick={() => setActiveView('shortcuts')}
                        className="text-indigo-400 hover:underline font-semibold text-[11px]"
                      >
                        All Shortcuts →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {speedDialItems.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleLaunchShortcut(item.url, item.title)}
                        className="group flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 hover:shadow-lg transition text-left cursor-pointer"
                        title={`Open ${item.title} in ${shortcutOpenMode === 'new-window' ? 'its own window' : 'AppGo'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${item.color ? `bg-gradient-to-tr ${item.color}` : 'bg-slate-800'}`}>
                          <AppIconRenderer type="preset" value={item.icon || 'Globe'} className="w-4 h-4" />
                        </div>
                        <div className="truncate flex-1">
                          <div className="flex items-center justify-between">
                            <span className="block text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {item.title}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 opacity-60 group-hover:opacity-100 transition shrink-0 ml-1" />
                          </div>
                          <span className="block text-[10px] text-slate-400 truncate">
                            {item.badge || item.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Quick shortcuts are hidden.</span>
                  <button
                    type="button"
                    onClick={() => setShowQuickShortcuts(true)}
                    className="text-indigo-400 hover:underline font-semibold"
                  >
                    Restore Quick Shortcuts
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Active In-Browser Web Page / Search View */
            <div className="flex-1 flex flex-col h-full bg-slate-950 min-h-0">
              {/* Status & Popout Strip */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-mono text-slate-300 font-medium text-[11px] truncate max-w-md">
                    {activeTab.url}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isGoogleSearchUrl && (
                    <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
                      <button
                        onClick={() => setSearchViewMode('appgo-theme')}
                        className={`px-2 py-0.5 rounded font-semibold transition ${
                          searchViewMode === 'appgo-theme'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        AppGo Theme
                      </button>
                      <button
                        onClick={() => setSearchViewMode('live-embed')}
                        className={`px-2 py-0.5 rounded font-semibold transition ${
                          searchViewMode === 'live-embed'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Raw Google
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleNavigateActiveTab('appgo:speeddial')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                  >
                    Start Page
                  </button>

                  <a
                    href={activeTab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold"
                  >
                    <span>Pop Out</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Viewport Content */}
              {isGoogleSearchUrl && searchViewMode === 'appgo-theme' ? (
                /* 1. AppGo Theme Google Search */
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto space-y-5 w-full">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center text-xl font-black">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">o</span>
                        <span className="text-[#FBBC05]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#34A853]">l</span>
                        <span className="text-[#EA4335]">e</span>
                        <span className="ml-2 text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          AppGo Theme
                        </span>
                      </div>
                      <button
                        onClick={() => setSearchViewMode('live-embed')}
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Raw Google Web</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Inline Filter Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto text-[11px] pt-1 border-t border-slate-800 scrollbar-none">
                      {[
                        { id: 'all', label: 'All Results' },
                        { id: 'web', label: 'Web' },
                        { id: 'apps', label: 'Apps' },
                        { id: 'stories', label: 'Headlines' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setGoogleResultTab(t.id as any)}
                          className={`px-2.5 py-0.5 rounded-lg font-semibold transition ${
                            googleResultTab === t.id
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results List */}
                  <div className="space-y-3">
                    {activeResultsList.map((res: any) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono truncate">{res.displayUrl}</span>
                          {res.badge && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 text-[10px]">
                              {res.badge}
                            </span>
                          )}
                        </div>
                        <h3
                          onClick={() => handleNavigateActiveTab(res.url, res.title)}
                          className="text-sm font-bold text-indigo-400 hover:underline cursor-pointer"
                        >
                          {res.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{res.snippet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isGoogleSearchUrl && searchViewMode === 'live-embed' ? (
                /* 2. Raw Google Live Web Frame */
                <div className="flex-1 w-full h-full bg-slate-950 overflow-hidden">
                  <iframe
                    key={`google-raw-${activeTab.url}`}
                    src={activeTab.url}
                    title={activeTab.title}
                    className={`w-full h-full border-none ${
                      isRawIframeDark ? 'filter invert-[0.88] hue-rotate-180 contrast-[1.05] bg-slate-900' : 'bg-white'
                    }`}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
                  />
                </div>
              ) : (
                /* 3. In-Browser Web Page Viewer */
                <div className="flex-1 w-full h-full bg-slate-950 overflow-hidden flex flex-col">
                  {/* Security Policy / Direct Window Helper Bar */}
                  <div className="bg-slate-900 border-b border-slate-800 px-3 py-1 flex items-center justify-between text-[11px] text-slate-300 shrink-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate text-slate-400">Website loaded in AppGo viewer. If blocked by site security:</span>
                    </div>
                    <a
                      href={activeTab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 px-2.5 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 shrink-0 text-[10px] transition"
                    >
                      <span>Open in Own Window</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  {iframeError ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
                        <Globe className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-bold text-white">{activeTab.title}</h3>
                      <p className="font-mono text-xs text-indigo-400">{activeTab.url}</p>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        This site prohibits embedded viewing (X-Frame-Options: SAMEORIGIN). Click below to open directly in a new tab:
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleNavigateActiveTab('appgo:speeddial')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-white"
                        >
                          ← Start Page
                        </button>
                        <a
                          href={activeTab.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
                        >
                          <span>Open in New Tab</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      key={activeTab.url}
                      src={activeTab.url}
                      title={activeTab.title}
                      onLoad={() => setIframeLoading(false)}
                      onError={() => {
                        setIframeLoading(false);
                        setIframeError(true);
                      }}
                      className="w-full flex-1 border-none bg-white min-h-[500px]"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
                    />
                  )}
                </div>
              )}
            </div>
          )
        )}

        {/* --- VIEW 2: DEDICATED SHORTCUTS TAB (SMART, LEAN & INLINE) --- */}
        {activeView === 'shortcuts' && (
          <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-5 animate-fadeIn">
            {/* Header: Title + Mode Toggle + Inline Category Tabs + Add Button */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-white tracking-tight">
                      Verified Shortcuts & Quick Launch
                    </h2>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {shortcutOpenMode === 'new-window' ? 'Opens in own window ↗ (100% Working)' : 'In-App Frame'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Fast 1-click access to top global web tools and services
                  </span>
                </div>
              </div>

              {/* Action Controls & Inline Category Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Mode Selector */}
                <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShortcutOpenMode('new-window')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                      shortcutOpenMode === 'new-window'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Opens websites in their own window to bypass connection blocks"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>New Window (Recommended)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShortcutOpenMode('in-app')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md transition font-medium ${
                      shortcutOpenMode === 'in-app'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Load inside in-app frame"
                  >
                    <Laptop className="w-3 h-3" />
                    <span>In-App Frame</span>
                  </button>
                </div>

                {/* Lean Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto text-[11px] scrollbar-none">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'news', label: 'News' },
                    { id: 'ai', label: 'AI Bots' },
                    { id: 'tools', label: 'Tools' },
                    { id: 'social', label: 'Social' },
                    { id: 'dev', label: 'Developer' },
                    { id: 'pinned', label: 'Pinned' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSpeedDialCategory(cat.id)}
                      className={`px-2 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                        speedDialCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsAddSpeedDialOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold whitespace-nowrap border border-slate-700 ml-1"
                  >
                    <Plus className="w-3 h-3 text-indigo-400" />
                    <span>Add Custom</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Shortcuts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredSpeedDial.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleLaunchShortcut(item.url, item.title)}
                  className="group relative flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer text-center"
                  title={`Open ${item.title} (${shortcutOpenMode === 'new-window' ? 'in its own window' : 'in app'})`}
                >
                  {/* Delete button if custom */}
                  {item.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSpeedDialItem(item.id, e)}
                      className="absolute top-1.5 right-1.5 p-1 rounded text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition z-10"
                      title="Remove shortcut"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}

                  {/* Icon Tile */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-105 transition-transform ${
                      item.color ? `bg-gradient-to-tr ${item.color}` : 'bg-slate-800'
                    }`}
                  >
                    <AppIconRenderer type="preset" value={item.icon || 'Globe'} className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1 justify-center max-w-[120px]">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                      {item.title}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 opacity-60 group-hover:opacity-100 transition shrink-0" />
                  </div>

                  <span className="text-[10px] text-slate-400 truncate max-w-[100px] mt-0.5">
                    {item.badge || item.type}
                  </span>

                  {/* In-App Frame Alternative trigger */}
                  <div className="mt-2 pt-1 border-t border-slate-800/80 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchShortcut(item.url, item.title, 'in-app');
                      }}
                      className="text-[9px] text-slate-400 hover:text-indigo-300 font-medium px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
                      title="Try viewing in-app frame"
                    >
                      Preview In-App
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Tile */}
              <button
                type="button"
                onClick={() => setIsAddSpeedDialOpen(true)}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/30 hover:bg-slate-900/60 transition group text-slate-400 hover:text-white"
              >
                <div className="w-11 h-11 rounded-xl border border-slate-700/80 flex items-center justify-center mb-2 bg-slate-800/50 group-hover:scale-105 transition">
                  <Plus className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-xs font-bold">Add Shortcut</span>
                <span className="text-[10px] text-slate-400">Custom link</span>
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 3: GLOBAL CHANNELS DIRECTORY VIEW --- */}
        {activeView === 'channels' && (
          <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-5 animate-fadeIn">
            <LiveChannelsSection />
          </div>
        )}

        {/* --- VIEW 4: LATEST WORLD NEWS VIEW --- */}
        {activeView === 'news' && (
          <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-5 animate-fadeIn">
            {/* News Header & Inline Category Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-base font-black text-white tracking-tight">AppGo Global News Feed</h2>
                  <span className="text-[11px] text-slate-400">Curated real-time updates from verified international publishers</span>
                </div>
              </div>

              {/* Inline News Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
                {NEWS_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewsCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition ${
                      newsCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* News Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {NEWS_FEED_DATA.filter((n) => newsCategory === 'All' || n.category === newsCategory).map((news) => (
                <div
                  key={news.id}
                  onClick={() => setSelectedArticle(news)}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800">
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" loading="lazy" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white uppercase">
                        {news.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">{news.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{news.summary}</p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-indigo-400">{news.source}</span>
                    <span>{news.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 4. ADD CUSTOM SHORTCUT MODAL */}
      {/* ========================================================= */}
      {isAddSpeedDialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Custom Shortcut</span>
              </h3>
              <button onClick={() => setIsAddSpeedDialOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomSpeedDial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Shortcut Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Website, Netflix"
                  value={newDialTitle}
                  onChange={(e) => setNewDialTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Web Address (URL) *</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newDialUrl}
                  onChange={(e) => setNewDialUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Tools, Media"
                  value={newDialType}
                  onChange={(e) => setNewDialType(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSpeedDialOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition text-xs"
                >
                  Save Shortcut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {selectedArticle.category} • {selectedArticle.source}
              </span>
              <button onClick={() => setSelectedArticle(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-base font-bold text-white leading-snug">{selectedArticle.title}</h2>

            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full aspect-video rounded-xl object-cover"
            />

            <p className="text-xs text-slate-300 leading-relaxed">{selectedArticle.summary}</p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{selectedArticle.timeAgo}</span>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
