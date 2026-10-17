import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WebApp, BrowserTab, SpeedDialItem, SidebarPanelType, NewsItem } from '../types';
import {
  NEWS_FEED_DATA,
  NEWS_CATEGORIES,
  CITIES_WEATHER,
  TRENDING_TAGS,
  WeatherData,
} from '../data/homeData';
import { CURATED_LINKS, CuratedLink } from '../data/curatedLinks';
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
  Sliders,
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
  Share2,
  Maximize2,
  Minimize2,
  Laptop,
} from 'lucide-react';

interface HomeTabProps {
  apps?: WebApp[];
  onNavigateToStore: () => void;
  onNavigateToLaunchpad: () => void;
  onLaunchApp: (app: WebApp) => void;
  onOpenAppDetails: (app: WebApp) => void;
  featuredApp: WebApp;
  onDirectSearchInStore: (query: string) => void;
}

const STORAGE_SPEED_DIAL = 'appgo_browser_speed_dial_v3';
const STORAGE_SPEED_DIAL_FALLBACK = 'appgo_opera_speed_dial_v2';
const STORAGE_BROWSER_WALLPAPER = 'appgo_browser_wallpaper_v2';

const INITIAL_SPEED_DIAL: SpeedDialItem[] = [
  {
    id: 'sd-openrouter',
    title: 'OpenRouter AI',
    url: 'https://openrouter.ai',
    category: 'ai',
    type: 'Multi-Model Playground',
    badge: 'API Gateway',
    color: 'from-indigo-600 to-violet-700',
    icon: 'Layers',
  },
  {
    id: 'sd-groq',
    title: 'Groq Cloud',
    url: 'https://groq.com',
    category: 'ai',
    type: 'High-Speed Inference',
    badge: 'LPU Speed',
    color: 'from-amber-500 to-orange-600',
    icon: 'Zap',
  },
  {
    id: 'sd-puter',
    title: 'Puter Cloud OS',
    url: 'https://puter.com',
    category: 'ai',
    type: 'Browser OS & AI SDK',
    badge: 'Cloud Desktop',
    color: 'from-blue-600 to-cyan-600',
    icon: 'Globe',
  },
  {
    id: 'sd-bolt',
    title: 'Bolt.new',
    url: 'https://bolt.new',
    category: 'ai',
    type: 'Full-Stack App Gen',
    badge: 'App Builder',
    color: 'from-purple-600 to-pink-600',
    icon: 'Sparkles',
  },
  {
    id: 'sd-freebuff',
    title: 'Freebuff',
    url: 'https://freebuff.com',
    category: 'ai',
    type: 'Coding Agent & Builder',
    badge: 'Agent',
    color: 'from-emerald-600 to-teal-700',
    icon: 'Code2',
  },
  {
    id: 'sd-lmstudio',
    title: 'LM Studio',
    url: 'https://lmstudio.ai',
    category: 'ai',
    type: 'Offline Local LLM',
    badge: 'Local Desktop',
    color: 'from-slate-800 to-zinc-950',
    icon: 'Terminal',
  },
  {
    id: 'sd-jan',
    title: 'Jan AI',
    url: 'https://jan.ai',
    category: 'ai',
    type: 'Open-Source Assistant',
    badge: 'Open Source',
    color: 'from-violet-700 to-purple-900',
    icon: 'Bot',
  },
  {
    id: 'sd-google',
    title: 'Google',
    url: 'https://www.google.com/search?igu=1',
    category: 'tools',
    type: 'Web Search',
    badge: 'Search',
    color: 'from-blue-500 to-emerald-500',
    icon: 'Search',
  },
  {
    id: 'sd-youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    category: 'entertainment',
    type: 'Video Streaming',
    badge: 'Media',
    color: 'from-red-600 to-red-800',
    icon: 'Radio',
  },
  {
    id: 'sd-github',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'dev',
    type: 'Code Repository',
    badge: 'Developer',
    color: 'from-zinc-700 to-zinc-900',
    icon: 'Code2',
  },
  {
    id: 'sd-wikipedia',
    title: 'Wikipedia',
    url: 'https://en.m.wikipedia.org',
    category: 'tools',
    type: 'Free Encyclopedia',
    badge: 'Knowledge',
    color: 'from-slate-600 to-slate-800',
    icon: 'BookOpen',
  },
  {
    id: 'sd-reddit',
    title: 'Reddit',
    url: 'https://www.reddit.com',
    category: 'social',
    type: 'Discussions & Communities',
    badge: 'Social',
    color: 'from-orange-600 to-red-600',
    icon: 'MessageSquare',
  },
];

type SearchEngine = 'google' | 'duckduckgo' | 'youtube' | 'wikipedia' | 'ai';

export const HomeTab: React.FC<HomeTabProps> = ({
  apps = [],
  onNavigateToStore,
  onNavigateToLaunchpad,
  onLaunchApp,
  onOpenAppDetails,
  featuredApp,
  onDirectSearchInStore,
}) => {
  // --- 1. APPG0 BROWSER TABS STATE ---
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Start Page',
      url: 'appgo:speeddial',
      isSpeedDial: true,
      isLoading: false,
      history: ['appgo:speeddial'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Active tab getter
  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  // --- 2. OMNIBOX ADDRESS BAR STATE ---
  const [addressInput, setAddressInput] = useState<string>(
    activeTab.isSpeedDial ? '' : activeTab.url
  );
  const [searchEngine, setSearchEngine] = useState<SearchEngine>('google');
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [isAppGoMenuOpen, setIsAppGoMenuOpen] = useState(false);
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

  // --- 3. BROWSER SIDEBAR STATE ---
  const [activeSidebarPanel, setActiveSidebarPanel] = useState<SidebarPanelType>('none');
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);

  // --- 4. SPEED DIAL STATE ---
  const [speedDialItems, setSpeedDialItems] = useState<SpeedDialItem[]>(() => {
    try {
      const raw =
        localStorage.getItem(STORAGE_SPEED_DIAL) ||
        localStorage.getItem(STORAGE_SPEED_DIAL_FALLBACK);
      return raw ? JSON.parse(raw) : INITIAL_SPEED_DIAL;
    } catch {
      return INITIAL_SPEED_DIAL;
    }
  });

  const [speedDialCategory, setSpeedDialCategory] = useState<string>('all');
  const [isAddSpeedDialOpen, setIsAddSpeedDialOpen] = useState(false);
  const [newDialTitle, setNewDialTitle] = useState('');
  const [newDialUrl, setNewDialUrl] = useState('');
  const [newDialType, setNewDialType] = useState('');

  // Save speed dial items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SPEED_DIAL, JSON.stringify(speedDialItems));
    } catch (e) {
      console.error(e);
    }
  }, [speedDialItems]);

  // --- 5. WALLPAPER & SETTINGS ---
  const [wallpaper, setWallpaper] = useState<'aurora' | 'minimal-dark' | 'gradient' | 'clean'>(
    () => {
      try {
        return (localStorage.getItem(STORAGE_BROWSER_WALLPAPER) as any) || 'aurora';
      } catch {
        return 'aurora';
      }
    }
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BROWSER_WALLPAPER, wallpaper);
    } catch (e) {
      console.error(e);
    }
  }, [wallpaper]);

  // --- 6. WEATHER & CLOCK WIDGET ---
  const [selectedCity, setSelectedCity] = useState<string>('San Francisco');
  const weather: WeatherData = CITIES_WEATHER[selectedCity] || CITIES_WEATHER['San Francisco'];
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 7. DISCOVER NEWS & LIVE CHANNELS TOGGLE ---
  const [showNewsFeed, setShowNewsFeed] = useState(false);
  const [showLiveShelf, setShowLiveShelf] = useState(true);
  const [newsCategory, setNewsCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // --- 8. IN-BROWSER SEARCH ENGINE RESULTS STATE ---
  const [inPageSearchQuery, setInPageSearchQuery] = useState('');
  const [googleResultTab, setGoogleResultTab] = useState<'all' | 'web' | 'ai' | 'videos' | 'stories' | 'apps'>('all');
  const [searchViewMode, setSearchViewMode] = useState<'appgo-theme' | 'live-embed'>('appgo-theme');
  const [isRawIframeDark, setIsRawIframeDark] = useState(true);

  // Search Results inside browser (dynamic synthesis for ANY query)
  const dynamicSearchResults = useMemo(() => {
    if (!inPageSearchQuery) {
      return {
        all: [],
        apps: [],
        stories: [],
        web: [],
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

    // 1. Matched Apps from catalog
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
        appObj: a,
      }));

    // 2. Curated & Web matches
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
      webObj: c,
    }));

    // 3. News matches
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
      newsObj: n,
    }));

    // 4. Synthesized organic web results tailored to the query
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
      {
        id: `synth-github-${q}`,
        title: `GitHub Open Source Repositories & Tools for ${capitalizedQ}`,
        url: `https://github.com/search?q=${encodeURIComponent(q)}`,
        displayUrl: `https://github.com › search › ${encodeURIComponent(q)}`,
        snippet: `Open-source packages, software repositories, developer scripts, and CLI utilities associated with ${capitalizedQ}.`,
        type: 'web' as const,
        badge: 'Open Source',
      },
    ];

    // 5. Video results
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
      {
        id: `vid-3-${q}`,
        title: `${capitalizedQ} vs Alternatives: Full Comparison & Analysis`,
        channel: 'Review Lab International',
        duration: '15:10',
        views: '1.1M views',
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' comparison')}`,
        thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
      },
    ];

    // 6. AI Overview card
    const aiOverview = {
      title: `AI Overview for "${capitalizedQ}"`,
      summary: `${capitalizedQ} is actively tracked within AppGo's live web directory. Below you'll find verified direct links, official documentation, multimedia streaming channels, and curated utilities matching your query.`,
      keyTakeaways: [
        `Access verified official sources and documentation directly inside AppGo Browser on the same page.`,
        `Explore interactive web apps, developer sandboxes, and social discussions related to ${capitalizedQ}.`,
        `Integrated Ad & Tracker shields protect your browsing session without external popups.`,
      ],
      sourceName: 'Wikipedia & AppGo Curated Directory',
      sourceUrl: `https://en.m.wikipedia.org/wiki/${encodeURIComponent(capitalizedQ.replace(/\s+/g, '_'))}`,
    };

    // 7. Related Searches ("People also ask")
    const relatedQueries = [
      `${q} official website`,
      `${q} free online tools`,
      `best alternatives to ${q}`,
      `${q} guide and tips`,
      `${q} latest news 2026`,
      `${q} reviews and ratings`,
    ];

    const combinedWeb = [...matchedWeb, ...synthesizedWeb];

    return {
      all: [...matchedApps, ...combinedWeb, ...matchedStories],
      apps: matchedApps,
      stories: matchedStories,
      web: combinedWeb,
      videos,
      relatedQueries,
      aiOverview,
    };
  }, [inPageSearchQuery, apps]);

  const activeResultsList = useMemo(() => {
    if (googleResultTab === 'apps') return dynamicSearchResults.apps;
    if (googleResultTab === 'stories') return dynamicSearchResults.stories;
    if (googleResultTab === 'web') return dynamicSearchResults.web;
    return dynamicSearchResults.all;
  }, [dynamicSearchResults, googleResultTab]);

  // --- TAB MANAGEMENT FUNCTIONS ---
  const handleOpenNewTab = (url = 'appgo:speeddial', title = 'Start Page') => {
    const newId = `tab-${Date.now()}`;
    const isSD = url === 'appgo:speeddial' || url === 'opera:speeddial';
    const newTab: BrowserTab = {
      id: newId,
      title: isSD ? 'Start Page' : title,
      url: isSD ? 'appgo:speeddial' : url,
      isSpeedDial: isSD,
      isLoading: false,
      history: [isSD ? 'appgo:speeddial' : url],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (tabIdToClose: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (tabs.length === 1) {
      setTabs([
        {
          id: 'tab-1',
          title: 'Start Page',
          url: 'appgo:speeddial',
          isSpeedDial: true,
          isLoading: false,
          history: ['appgo:speeddial'],
          historyIndex: 0,
        },
      ]);
      setActiveTabId('tab-1');
      return;
    }

    const index = tabs.findIndex((t) => t.id === tabIdToClose);
    const newTabs = tabs.filter((t) => t.id !== tabIdToClose);
    setTabs(newTabs);

    if (activeTabId === tabIdToClose) {
      const nextActive = newTabs[Math.max(0, index - 1)];
      setActiveTabId(nextActive.id);
    }
  };

  // Main navigation function: Opens ON THE SAME PAGE!
  const handleNavigateActiveTab = (targetUrl: string, title?: string) => {
    const isSD = targetUrl === 'appgo:speeddial' || targetUrl === 'opera:speeddial';

    if (isSD) {
      updateActiveTab('appgo:speeddial', 'Start Page', true);
      return;
    }

    // Check if target is a search query or a web URL
    const isExplicitUrl =
      targetUrl.startsWith('http://') ||
      targetUrl.startsWith('https://') ||
      targetUrl.startsWith('appgo:') ||
      targetUrl.startsWith('opera:');

    const hasDomainExtension =
      !targetUrl.includes(' ') &&
      (targetUrl.includes('.com') ||
        targetUrl.includes('.org') ||
        targetUrl.includes('.net') ||
        targetUrl.includes('.io') ||
        targetUrl.includes('.ai') ||
        targetUrl.includes('.dev') ||
        targetUrl.includes('.app') ||
        targetUrl.includes('.co') ||
        targetUrl.includes('.edu') ||
        targetUrl.includes('.gov') ||
        targetUrl.includes('.tv'));

    if (!isExplicitUrl && !hasDomainExtension) {
      // It's a search query! OPEN ON THE SAME PAGE
      const query = targetUrl.trim();
      setInPageSearchQuery(query);

      if (searchEngine === 'google') {
        const googleIframeUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(query)}`;
        setSearchViewMode('appgo-theme');
        updateActiveTab(googleIframeUrl, `${query} - Google Search`, false);
        return;
      }
      if (searchEngine === 'duckduckgo') {
        const ddgUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        updateActiveTab(ddgUrl, `${query} - DuckDuckGo`, false);
        return;
      }
      if (searchEngine === 'youtube') {
        const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        updateActiveTab(ytUrl, `${query} - YouTube`, false);
        return;
      }
      if (searchEngine === 'wikipedia') {
        const wikiUrl = `https://en.m.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
        updateActiveTab(wikiUrl, `${query} - Wikipedia`, false);
        return;
      }
      if (searchEngine === 'ai') {
        const aiUrl = `https://openrouter.ai/?q=${encodeURIComponent(query)}`;
        updateActiveTab(aiUrl, `${query} - OpenRouter AI`, false);
        return;
      }
    }

    // It's a web address! Format with https:// and open on the same page
    let finalUrl = targetUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const calculatedTitle =
      title || finalUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

    updateActiveTab(finalUrl, calculatedTitle, false);
  };

  const updateActiveTab = (url: string, title: string, isSpeedDial: boolean) => {
    setIframeLoading(true);
    setIframeError(false);
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          const newHistory = t.history.slice(0, t.historyIndex + 1);
          newHistory.push(url);
          return {
            ...t,
            url,
            title,
            isSpeedDial,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            isLoading: false,
          };
        }
        return t;
      })
    );
  };

  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const prevUrl = activeTab.history[newIndex];
      const isSD = prevUrl === 'appgo:speeddial' || prevUrl === 'opera:speeddial';
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: prevUrl,
                title: isSD ? 'Start Page' : prevUrl,
                isSpeedDial: isSD,
                historyIndex: newIndex,
              }
            : t
        )
      );
    }
  };

  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const nextUrl = activeTab.history[newIndex];
      const isSD = nextUrl === 'appgo:speeddial' || nextUrl === 'opera:speeddial';
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                url: nextUrl,
                title: isSD ? 'Start Page' : nextUrl,
                isSpeedDial: isSD,
                historyIndex: newIndex,
              }
            : t
        )
      );
    }
  };

  const handleReload = () => {
    setIsReloading(true);
    setIframeLoading(true);
    setIframeError(false);
    setTimeout(() => {
      setIsReloading(false);
      setIframeLoading(false);
    }, 600);
  };

  const handleOmniboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    handleNavigateActiveTab(addressInput.trim());
  };

  // Pin current site to Speed Dial
  const isCurrentSitePinned = useMemo(() => {
    return speedDialItems.some(
      (item) => item.url === activeTab.url || (activeTab.isSpeedDial && false)
    );
  }, [speedDialItems, activeTab]);

  const handleTogglePinSite = () => {
    if (activeTab.isSpeedDial) return;
    if (isCurrentSitePinned) {
      setSpeedDialItems((prev) => prev.filter((item) => item.url !== activeTab.url));
    } else {
      const newItem: SpeedDialItem = {
        id: `sd-pinned-${Date.now()}`,
        title: activeTab.title,
        url: activeTab.url,
        category: 'custom',
        badge: 'Pinned',
        color: 'from-indigo-600 to-violet-700',
        isCustom: true,
      };
      setSpeedDialItems((prev) => [newItem, ...prev]);
    }
  };

  // Add custom Speed Dial item
  const handleAddCustomSpeedDial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDialTitle.trim() || !newDialUrl.trim()) return;

    let formattedUrl = newDialUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newItem: SpeedDialItem = {
      id: `sd-user-${Date.now()}`,
      title: newDialTitle.trim(),
      url: formattedUrl,
      category: 'custom',
      type: newDialType.trim() || 'Custom Shortcut',
      badge: 'Speed Dial',
      color: 'from-slate-700 to-slate-900',
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

  // Filtered speed dial tiles
  const filteredSpeedDial = useMemo(() => {
    if (speedDialCategory === 'all') return speedDialItems;
    if (speedDialCategory === 'pinned') return speedDialItems.filter((i) => i.isCustom);
    return speedDialItems.filter((i) => i.category === speedDialCategory);
  }, [speedDialItems, speedDialCategory]);

  const renderWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'cloud-sun':
        return <CloudSun className="w-4 h-4 text-amber-300" />;
      default:
        return <Cloud className="w-4 h-4 text-slate-400" />;
    }
  };

  // Detect whether active URL is a Google search URL
  const isGoogleSearchUrl = activeTab.url.includes('google.com/search?');

  return (
    <div className="relative min-h-[calc(100vh-130px)] flex bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. APPG0 BROWSER SIGNATURE LEFT SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`shrink-0 z-30 transition-all duration-300 flex flex-col justify-between py-3 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl ${
          isSidebarPinned ? 'w-14 sm:w-16' : 'w-12'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          {/* AppGo Browser Brand Logo Button with Dropdown Menu */}
          <div className="relative mb-2">
            <button
              onClick={() => setIsAppGoMenuOpen(!isAppGoMenuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/40 border border-indigo-400/30"
              title="AppGo Browser Menu"
            >
              <span className="text-base sm:text-lg font-black tracking-tight">A</span>
            </button>

            {/* AppGo Quick Menu Dropdown */}
            {isAppGoMenuOpen && (
              <div className="absolute left-12 top-0 w-64 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 text-xs text-slate-300 space-y-1 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    AppGo Browser Hub
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">v12.0</span>
                </div>

                <button
                  onClick={() => {
                    handleOpenNewTab();
                    setIsAppGoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    New Tab
                  </span>
                  <kbd className="text-[10px] text-slate-400 bg-slate-950 px-1 rounded">Ctrl+T</kbd>
                </button>

                <button
                  onClick={() => {
                    handleNavigateActiveTab('appgo:speeddial');
                    setIsAppGoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                >
                  <HomeIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Speed Dial Start Page
                </button>

                <button
                  onClick={() => {
                    setActiveSidebarPanel('aria');
                    setIsAppGoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  AI Bots Command Center
                </button>

                <button
                  onClick={() => {
                    setActiveSidebarPanel('player');
                    setIsAppGoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                >
                  <Tv className="w-3.5 h-3.5 text-purple-400" />
                  Live TV & Entertainment Player
                </button>

                <button
                  onClick={() => {
                    onNavigateToStore();
                    setIsAppGoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                  App Store Catalog
                </button>

                <button
                  onClick={() => {
                    onNavigateToLaunchpad();
                    setIsAppGoMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white flex items-center gap-2 transition"
                >
                  <Compass className="w-3.5 h-3.5 text-pink-400" />
                  Launchpad & Social Directory
                </button>

                <div className="pt-1 border-t border-slate-800 flex items-center justify-between px-3 py-1 text-[11px] text-slate-400">
                  <span>Ad & Tracker Blocker</span>
                  <button
                    onClick={() => setIsAdBlockEnabled(!isAdBlockEnabled)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isAdBlockEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800'
                    }`}
                  >
                    {isAdBlockEnabled ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Access Icons in Sidebar */}
          <button
            onClick={() => handleNavigateActiveTab('appgo:speeddial')}
            className={`p-2.5 rounded-2xl transition ${
              activeTab.isSpeedDial
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Start Page (Speed Dial)"
          >
            <HomeIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() =>
              setActiveSidebarPanel(activeSidebarPanel === 'aria' ? 'none' : 'aria')
            }
            className={`p-2.5 rounded-2xl transition ${
              activeSidebarPanel === 'aria'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="AI Bots Hub"
          >
            <Bot className="w-5 h-5" />
          </button>

          <button
            onClick={() =>
              setActiveSidebarPanel(activeSidebarPanel === 'social' ? 'none' : 'social')
            }
            className={`p-2.5 rounded-2xl transition ${
              activeSidebarPanel === 'social'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Messengers & Social"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() =>
              setActiveSidebarPanel(activeSidebarPanel === 'player' ? 'none' : 'player')
            }
            className={`p-2.5 rounded-2xl transition ${
              activeSidebarPanel === 'player'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Live TV & Entertainment Player"
          >
            <Tv className="w-5 h-5" />
          </button>

          <button
            onClick={() =>
              setActiveSidebarPanel(activeSidebarPanel === 'bookmarks' ? 'none' : 'bookmarks')
            }
            className={`p-2.5 rounded-2xl transition ${
              activeSidebarPanel === 'bookmarks'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Speed Dial Bookmarks"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Sidebar Settings */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() =>
              setActiveSidebarPanel(activeSidebarPanel === 'settings' ? 'none' : 'settings')
            }
            className={`p-2.5 rounded-2xl transition ${
              activeSidebarPanel === 'settings'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="AppGo Browser Setup & Wallpapers"
          >
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. SLIDE-OUT PANELS (AI Bots, Social, Player, Settings) */}
      {/* ========================================================= */}
      {activeSidebarPanel !== 'none' && (
        <aside className="w-72 sm:w-80 border-r border-slate-800 bg-slate-900/95 backdrop-blur-2xl z-20 flex flex-col justify-between p-4 shadow-2xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              {activeSidebarPanel === 'aria' && (
                <>
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    AI Command Center
                  </span>
                </>
              )}
              {activeSidebarPanel === 'social' && (
                <>
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Messengers & Social
                  </span>
                </>
              )}
              {activeSidebarPanel === 'player' && (
                <>
                  <Tv className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Entertainment Player
                  </span>
                </>
              )}
              {activeSidebarPanel === 'bookmarks' && (
                <>
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Speed Dial Bookmarks
                  </span>
                </>
              )}
              {activeSidebarPanel === 'settings' && (
                <>
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    AppGo Browser Settings
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveSidebarPanel('none')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
            {/* 1. AI BOTS PANEL */}
            {activeSidebarPanel === 'aria' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
                  <p className="font-semibold text-white mb-0.5">AppGo AI Command Center</p>
                  <p className="text-[11px] text-indigo-300">
                    Quickly launch multi-model playgrounds, fast LPUs, or local offline LLMs.
                  </p>
                </div>

                <div className="space-y-1.5">
                  {[
                    {
                      title: 'OpenRouter',
                      type: 'Multi-Model Playground',
                      url: 'https://openrouter.ai',
                      color: 'bg-indigo-500',
                    },
                    {
                      title: 'Groq Cloud',
                      type: 'High-Speed Inference',
                      url: 'https://groq.com',
                      color: 'bg-amber-500',
                    },
                    {
                      title: 'Puter',
                      type: 'Cloud Desktop OS & AI',
                      url: 'https://puter.com',
                      color: 'bg-blue-500',
                    },
                    {
                      title: 'Bolt.new',
                      type: 'Full-Stack App Gen',
                      url: 'https://bolt.new',
                      color: 'bg-purple-500',
                    },
                    {
                      title: 'Freebuff',
                      type: 'Coding Agent Builder',
                      url: 'https://freebuff.com',
                      color: 'bg-emerald-500',
                    },
                    {
                      title: 'LM Studio',
                      type: 'Offline Local LLM',
                      url: 'https://lmstudio.ai',
                      color: 'bg-slate-600',
                    },
                    {
                      title: 'Jan AI',
                      type: 'Open Source Offline Hub',
                      url: 'https://jan.ai',
                      color: 'bg-violet-600',
                    },
                  ].map((bot) => (
                    <button
                      key={bot.title}
                      onClick={() => handleNavigateActiveTab(bot.url, bot.title)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${bot.color}`} />
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-indigo-400">
                            {bot.title}
                          </p>
                          <p className="text-[10px] text-slate-400">{bot.type}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SOCIAL PANEL */}
            {activeSidebarPanel === 'social' && (
              <div className="space-y-2">
                {[
                  { name: 'X (Twitter)', url: 'https://x.com', handle: '@AppGoHub' },
                  { name: 'Discord', url: 'https://discord.com', handle: 'Community Servers' },
                  { name: 'Reddit', url: 'https://reddit.com', handle: 'Front Page' },
                  { name: 'GitHub', url: 'https://github.com', handle: 'Developer Repos' },
                  { name: 'YouTube', url: 'https://youtube.com', handle: 'Live Video' },
                  { name: 'LinkedIn', url: 'https://linkedin.com', handle: 'Professional' },
                  { name: 'Bluesky', url: 'https://bsky.app', handle: 'Decentralized' },
                ].map((soc) => (
                  <button
                    key={soc.name}
                    onClick={() => handleNavigateActiveTab(soc.url, soc.name)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 flex items-center justify-between transition group"
                  >
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-sky-400">
                        {soc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{soc.handle}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                  </button>
                ))}
              </div>
            )}

            {/* 3. PLAYER & ENTERTAINMENT PANEL */}
            {activeSidebarPanel === 'player' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200">
                  <p className="font-semibold text-white mb-0.5">AppGo Video & Live Player</p>
                  <p className="text-[11px] text-purple-300">
                    Switch regions and countries to stream live entertainment, movie broadcasts,
                    and fashion.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowLiveShelf(true);
                    setActiveSidebarPanel('none');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
                >
                  <Tv className="w-4 h-4" />
                  <span>Open Global Channel Guide</span>
                </button>
              </div>
            )}

            {/* 4. BOOKMARKS PANEL */}
            {activeSidebarPanel === 'bookmarks' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 px-1">Pinned Shortcuts</p>
                {speedDialItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigateActiveTab(item.url, item.title)}
                    className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700/40 flex items-center justify-between cursor-pointer group transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-xs font-medium text-white truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-white font-mono shrink-0">
                      Go →
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 5. SETTINGS PANEL */}
            {activeSidebarPanel === 'settings' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase tracking-wider text-[10px]">
                    Speed Dial Wallpaper
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'aurora', name: 'Aurora Dark', color: 'bg-indigo-950' },
                      { id: 'gradient', name: 'Cosmic Purple', color: 'bg-purple-950' },
                      { id: 'minimal-dark', name: 'OLED Black', color: 'bg-slate-950' },
                      { id: 'clean', name: 'Clean Slate', color: 'bg-slate-900' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setWallpaper(w.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          wallpaper === w.id
                            ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold'
                            : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-full h-8 rounded-lg mb-1.5 ${w.color}`} />
                        <span>{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-300">Default Search Engine</span>
                    <span className="font-semibold text-indigo-400 capitalize">{searchEngine}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-300">Live TV Shelf</span>
                    <button
                      onClick={() => setShowLiveShelf(!showLiveShelf)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        showLiveShelf ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {showLiveShelf ? 'VISIBLE' : 'HIDDEN'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN BROWSER AREA (TAB STRIP + OMNIBOX + VIEWPORT) */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/60">
        {/* TOP TAB STRIP - Styled similar to App Store / Hub navigation */}
        <div className="flex items-center justify-between px-2 pt-2 bg-slate-950/95 border-b border-slate-800/80">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1 max-w-4xl pr-2">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold cursor-pointer select-none transition-all duration-150 max-w-[220px] min-w-[130px] ${
                    isActive
                      ? 'bg-slate-900 text-white border-t-2 border-indigo-500 border-x border-slate-700/80 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Tab Icon */}
                  {tab.isSpeedDial ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}

                  {/* Tab Title */}
                  <span className="truncate flex-1 text-[11px] font-medium">{tab.title}</span>

                  {/* Close Tab Button */}
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="p-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 opacity-70 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            {/* New Tab Button */}
            <button
              onClick={() => handleOpenNewTab()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              title="Open a new tab"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Clock & Weather Pill */}
          <div className="hidden md:flex items-center gap-3 pr-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[11px]">
              {renderWeatherIcon(weather.icon)}
              <span>{weather.temp}°F</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TOOLBAR & OMNIBOX (Address Bar) */}
        <div className="flex items-center gap-2 p-2 px-3 bg-slate-900/90 border-b border-slate-800/80">
          {/* Navigation Buttons: Back, Forward, Reload, Home */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={activeTab.historyIndex <= 0}
              className={`p-1.5 rounded-lg transition ${
                activeTab.historyIndex > 0
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Click to go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleForward}
              disabled={activeTab.historyIndex >= activeTab.history.length - 1}
              className={`p-1.5 rounded-lg transition ${
                activeTab.historyIndex < activeTab.history.length - 1
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
              title="Click to go forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReload}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Reload current page"
            >
              <RotateCw className={`w-4 h-4 ${isReloading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

            <button
              onClick={() => handleNavigateActiveTab('appgo:speeddial')}
              className={`p-1.5 rounded-lg transition ${
                activeTab.isSpeedDial
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Start Page (Speed Dial)"
            >
              <HomeIcon className="w-4 h-4" />
            </button>
          </div>

          {/* OMNIBOX INPUT FORM */}
          <form onSubmit={handleOmniboxSubmit} className="flex-1 relative">
            <div className="relative flex items-center bg-slate-950 border border-slate-700/80 focus-within:border-indigo-500 rounded-xl px-2.5 py-1.5 text-xs text-white shadow-inner transition">
              {/* Security lock & search engine selector */}
              <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsEngineSelectorOpen(!isEngineSelectorOpen)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white uppercase tracking-wider"
                  >
                    <span>{searchEngine}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isEngineSelectorOpen && (
                    <div className="absolute left-0 top-7 w-36 rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-xl z-50 text-[11px] space-y-0.5">
                      {(['google', 'duckduckgo', 'youtube', 'wikipedia', 'ai'] as SearchEngine[]).map(
                        (eng) => (
                          <button
                            key={eng}
                            type="button"
                            onClick={() => {
                              setSearchEngine(eng);
                              setIsEngineSelectorOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize font-medium transition ${
                              searchEngine === eng
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {eng === 'ai' ? 'AI (OpenRouter)' : eng}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Address / Search Input */}
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder={
                  activeTab.isSpeedDial
                    ? 'Search Google or enter web address (e.g. openrouter.ai, github.com)...'
                    : activeTab.url
                }
                className="w-full bg-transparent px-2.5 text-xs text-white placeholder-slate-400 focus:outline-none font-mono"
              />

              {/* Omnibox Action Icons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {addressInput && (
                  <button
                    type="button"
                    onClick={() => setAddressInput('')}
                    className="text-slate-400 hover:text-slate-200 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Star Bookmark / Pin to Speed Dial */}
                {!activeTab.isSpeedDial && (
                  <button
                    type="button"
                    onClick={handleTogglePinSite}
                    className={`p-1 rounded-md transition ${
                      isCurrentSitePinned
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-400 hover:text-amber-400'
                    }`}
                    title={isCurrentSitePinned ? 'Pinned to Speed Dial' : 'Pin to Speed Dial'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isCurrentSitePinned ? 'fill-amber-400' : ''}`} />
                  </button>
                )}

                {/* Ad Blocker Shield Badge */}
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isAdBlockEnabled
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title="AppGo Ad & Tracker Protection Active"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span className="hidden sm:inline">Protected</span>
                </div>

                {/* "Go" Button: Triggers immediate navigation on the SAME PAGE */}
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                >
                  <span>Go</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ========================================================= */}
        {/* 4. VIEWPORT: SPEED DIAL vs IN-BROWSER GOOGLE / WEB PAGE */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {activeTab.isSpeedDial ? (
            /* ========================================================= */
            /* SPEED DIAL (AppGo Start Page) */
            /* ========================================================= */
            <div
              className={`p-5 sm:p-8 min-h-full space-y-8 ${
                wallpaper === 'aurora'
                  ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-slate-950'
                  : wallpaper === 'gradient'
                  ? 'bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950'
                  : wallpaper === 'minimal-dark'
                  ? 'bg-slate-950'
                  : 'bg-slate-900/50'
              }`}
            >
              {/* Start Page Header: Clock, Weather & Quick Search */}
              <div className="max-w-4xl mx-auto space-y-6 pt-2 sm:pt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-xs font-black tracking-wider uppercase text-indigo-400">
                        AppGo Browser Start Page
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                      Speed Dial
                    </h1>
                  </div>

                  {/* Weather and City capsule */}
                  <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-lg">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      {renderWeatherIcon(weather.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">{weather.temp}°F</span>
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="bg-transparent text-xs text-indigo-300 font-bold border-none focus:outline-none cursor-pointer"
                        >
                          {Object.keys(CITIES_WEATHER).map((c) => (
                            <option key={c} value={c} className="bg-slate-900 text-white">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[10px] text-slate-400">{weather.condition}</p>
                    </div>
                  </div>
                </div>

                {/* Central Quick Search Box: "Search Google or enter any URL..." */}
                <form onSubmit={handleOmniboxSubmit} className="relative max-w-2xl mx-auto">
                  <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500 focus-within:border-indigo-500 rounded-2xl p-1.5 shadow-2xl transition">
                    <Search className="w-5 h-5 text-indigo-400 ml-3 pointer-events-none" />
                    <input
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder={`Search ${searchEngine} or enter any URL...`}
                      className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
                    >
                      <span>Go</span>
                    </button>
                  </div>
                </form>

                {/* Trending query tags */}
                <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400 pt-1">
                  <span className="text-slate-400 font-medium">Popular:</span>
                  {TRENDING_TAGS.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleNavigateActiveTab(tag.replace('#', ''))}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Dial Category Selector - Styled to match App Store tabs */}
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Shortcuts' },
                    { id: 'ai', label: 'AI Bots' },
                    { id: 'social', label: 'Social & Chat' },
                    { id: 'entertainment', label: 'Entertainment' },
                    { id: 'dev', label: 'Dev Tools' },
                    { id: 'pinned', label: 'My Pinned' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSpeedDialCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                        speedDialCategory === cat.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddSpeedDialOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Add Site to Speed Dial</span>
                  </button>
                </div>
              </div>

              {/* SPEED DIAL TILES GRID */}
              <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredSpeedDial.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigateActiveTab(item.url, item.title)}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center"
                  >
                    {/* Delete Custom Site Button */}
                    {item.isCustom && (
                      <button
                        onClick={(e) => handleDeleteSpeedDialItem(item.id, e)}
                        className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition"
                        title="Remove from Speed Dial"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {/* Tile Visual Logo Box */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-2 shadow-lg group-hover:scale-105 transition-transform ${
                        item.color ? `bg-gradient-to-tr ${item.color}` : 'bg-gradient-to-tr from-slate-700 to-slate-800'
                      }`}
                    >
                      <AppIconRenderer type="preset" value={item.icon || 'Globe'} className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate max-w-[120px]">
                      {item.title}
                    </span>

                    {/* Subtitle / Type */}
                    <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                      {item.type || item.badge || item.category}
                    </span>
                  </div>
                ))}

                {/* "+" Add Site Tile */}
                <button
                  onClick={() => setIsAddSpeedDialOpen(true)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/30 hover:bg-slate-900/60 transition group text-slate-400 hover:text-white"
                >
                  <div className="w-12 h-12 rounded-2xl border border-slate-700/80 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform bg-slate-800/50">
                    <Plus className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold">Add Site</span>
                  <span className="text-[10px] text-slate-400">Custom shortcut</span>
                </button>
              </div>

              {/* EXPANDABLE GLOBAL LIVE ENTERTAINMENT SHELF */}
              {showLiveShelf && (
                <div className="max-w-6xl mx-auto pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-purple-400" />
                      <h2 className="text-base font-bold text-white">
                        Live Global Entertainment Channels
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowLiveShelf(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Hide Shelf
                    </button>
                  </div>

                  <LiveChannelsSection />
                </div>
              )}

              {/* OPTIONAL APPG0 NEWS / DISCOVER FEED */}
              <div className="max-w-6xl mx-auto pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-base font-bold text-white">AppGo Discover & News</h2>
                  </div>
                  <button
                    onClick={() => setShowNewsFeed(!showNewsFeed)}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    {showNewsFeed ? 'Hide News Feed' : 'Show News Feed ↓'}
                  </button>
                </div>

                {showNewsFeed && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {NEWS_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewsCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                            newsCategory === cat
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {NEWS_FEED_DATA.filter(
                        (n) => newsCategory === 'All' || n.category === newsCategory
                      )
                        .slice(0, 6)
                        .map((news) => (
                          <div
                            key={news.id}
                            onClick={() => setSelectedArticle(news)}
                            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-800">
                                <img
                                  src={news.imageUrl}
                                  alt={news.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white uppercase">
                                  {news.category}
                                </span>
                              </div>
                              <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                                {news.title}
                              </h3>
                              <p className="text-[11px] text-slate-400 line-clamp-2">
                                {news.summary}
                              </p>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-semibold text-indigo-400">{news.source}</span>
                              <span>{news.timeAgo}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* IN-BROWSER PAGE VIEWPORT (Opens on the SAME PAGE!) */
            /* ========================================================= */
            <div className="flex-1 flex flex-col h-full bg-slate-950 min-h-0">
              {/* Browser In-Page Status & Action Toolbar */}
              <div className="flex items-center justify-between p-2 px-4 bg-slate-900 border-b border-slate-800 text-xs shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="font-mono text-slate-300 font-semibold truncate max-w-md">
                    {activeTab.url}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* If it's a search URL, provide instant toggle between AppGo Theme and Raw Google Web */}
                  {isGoogleSearchUrl && (
                    <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                      <button
                        onClick={() => setSearchViewMode('appgo-theme')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                          searchViewMode === 'appgo-theme'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        AppGo Theme
                      </button>
                      <button
                        onClick={() => setSearchViewMode('live-embed')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                          searchViewMode === 'live-embed'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Raw Google Web
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleNavigateActiveTab('appgo:speeddial')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                  >
                    Speed Dial
                  </button>

                  <a
                    href={activeTab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    title="Open in new window"
                  >
                    <span>Pop Out</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* VIEWPORT CONTENT ON THE SAME PAGE */}
              {isGoogleSearchUrl && searchViewMode === 'appgo-theme' ? (
                /* 1. AppGo Theme-Matched Google Search Experience (Feels completely native to the page) */
                <div className="flex-1 overflow-y-auto p-4 sm:p-7 max-w-5xl mx-auto space-y-6 w-full animate-fadeIn">
                  {/* Google Brand Header & In-Page Re-Search Omnibox */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-2xl font-black tracking-tight select-none">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#4285F4]">g</span>
                          <span className="text-[#34A853]">l</span>
                          <span className="text-[#EA4335]">e</span>
                          <span className="ml-2.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            AppGo Theme
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSearchViewMode('live-embed')}
                          className="text-xs text-indigo-400 hover:underline px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/50 flex items-center gap-1"
                        >
                          <span>Switch to Raw Google Web</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Integrated In-Page Search Bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!inPageSearchQuery.trim()) return;
                        handleNavigateActiveTab(inPageSearchQuery.trim());
                      }}
                      className="relative"
                    >
                      <div className="relative flex items-center bg-slate-950 border border-slate-700/80 focus-within:border-indigo-500 rounded-xl px-3 py-1.5 shadow-inner transition">
                        <Search className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
                        <input
                          type="text"
                          value={inPageSearchQuery}
                          onChange={(e) => setInPageSearchQuery(e.target.value)}
                          placeholder="Search anything with Google..."
                          className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none font-medium"
                        />
                        {inPageSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setInPageSearchQuery('')}
                            className="p-1 text-slate-400 hover:text-white mr-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition shadow-xs"
                        >
                          Search
                        </button>
                      </div>
                    </form>

                    {/* Google Category Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 pb-0.5 scrollbar-none border-t border-slate-800/80">
                      {[
                        { id: 'all', label: 'All Results' },
                        { id: 'web', label: 'Web Pages' },
                        { id: 'ai', label: 'AI Overview' },
                        { id: 'videos', label: 'Videos & Media' },
                        { id: 'stories', label: 'Headlines & News' },
                        { id: 'apps', label: 'Apps & Tools' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setGoogleResultTab(tab.id as any)}
                          className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap text-xs ${
                            googleResultTab === tab.id
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. AI Overview / Knowledge Box (Google SGE Style) */}
                  {(googleResultTab === 'all' || googleResultTab === 'ai') &&
                    dynamicSearchResults.aiOverview && (
                      <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 shadow-lg space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                              {dynamicSearchResults.aiOverview.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-indigo-400/80 font-mono">
                            AppGo Smart Summary
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed font-normal">
                          {dynamicSearchResults.aiOverview.summary}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          {dynamicSearchResults.aiOverview.keyTakeaways.map((point, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/10 text-[11px] text-slate-300 flex items-start gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-indigo-500/10 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">
                            Source: {dynamicSearchResults.aiOverview.sourceName}
                          </span>
                          <button
                            onClick={() =>
                              handleNavigateActiveTab(
                                dynamicSearchResults.aiOverview!.sourceUrl,
                                'Wikipedia'
                              )
                            }
                            className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Read Verified Reference</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                  {/* 3. Video Carousel (When viewing All or Videos) */}
                  {(googleResultTab === 'all' || googleResultTab === 'videos') &&
                    dynamicSearchResults.videos && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <Tv className="w-4 h-4 text-red-500" />
                          <span>Video Highlights & Broadcasts</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {dynamicSearchResults.videos.map((vid) => (
                            <div
                              key={vid.id}
                              onClick={() => handleNavigateActiveTab(vid.url, vid.title)}
                              className="group p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                            >
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-800 mb-2">
                                <img
                                  src={vid.thumb}
                                  alt={vid.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  loading="lazy"
                                />
                                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                                  {vid.duration}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 mb-1">
                                {vid.title}
                              </h4>
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span>{vid.channel}</span>
                                <span>{vid.views}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 4. Organic Web Results List */}
                  {(googleResultTab === 'all' ||
                    googleResultTab === 'web' ||
                    googleResultTab === 'apps' ||
                    googleResultTab === 'stories') && (
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <span>Top Web Results</span>
                        <span className="font-mono text-[11px]">
                          Showing {activeResultsList.length} indexed links
                        </span>
                      </div>

                      <div className="space-y-3">
                        {activeResultsList.map((res: any) => (
                          <div
                            key={res.id}
                            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition space-y-2 group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                                <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span className="truncate max-w-md font-mono text-[11px] text-slate-400">
                                  {res.displayUrl}
                                </span>
                              </div>
                              {res.badge && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-indigo-400 font-semibold shrink-0">
                                  {res.badge}
                                </span>
                              )}
                            </div>

                            <h3
                              onClick={() => handleNavigateActiveTab(res.url, res.title)}
                              className="text-base font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors"
                            >
                              {res.title}
                            </h3>

                            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                              {res.snippet}
                            </p>

                            <div className="pt-2 flex items-center gap-2 border-t border-slate-800/80">
                              <button
                                onClick={() => handleNavigateActiveTab(res.url, res.title)}
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition shadow-xs"
                              >
                                <span>Open in AppGo Browser</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>

                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] flex items-center gap-1 transition"
                              >
                                <span>Pop Out</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Related Google Searches ("People also ask") */}
                  {dynamicSearchResults.relatedQueries && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                      <p className="text-xs font-bold text-slate-300">
                        Related Searches for "{inPageSearchQuery}"
                      </p>
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {dynamicSearchResults.relatedQueries.map((rq: string) => (
                          <button
                            key={rq}
                            onClick={() => {
                              setInPageSearchQuery(rq);
                              handleNavigateActiveTab(rq);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition border border-slate-700/60 flex items-center gap-1.5"
                          >
                            <Search className="w-3 h-3 text-indigo-400" />
                            <span>{rq}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : isGoogleSearchUrl && searchViewMode === 'live-embed' ? (
                /* 2. Raw Google Web View - Theme-Adapted so it blends with AppGo dark theme */
                <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden flex flex-col animate-fadeIn">
                  {/* Raw Google In-Page Bar with Dark Mode Adaptation Toggle */}
                  <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-300 z-10 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-white">Google Live Web Frame</span>
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                        (Theme-Adapted)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Dark/Light mode inverter for the raw Google iframe */}
                      <button
                        onClick={() => setIsRawIframeDark(!isRawIframeDark)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                          isRawIframeDark
                            ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                        title="Invert Google iframe colors to match dark theme"
                      >
                        {isRawIframeDark ? '🌙 Dark Inversion: ON' : '☀️ Light Frame'}
                      </button>

                      <button
                        onClick={() => setSearchViewMode('appgo-theme')}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition text-xs"
                      >
                        Switch to AppGo Theme View
                      </button>
                    </div>
                  </div>

                  {iframeLoading && (
                    <div className="absolute inset-x-0 top-10 h-1 bg-indigo-600 animate-pulse z-20" />
                  )}

                  <div className="flex-1 w-full h-full overflow-hidden bg-slate-950">
                    <iframe
                      key={`google-raw-${activeTab.url}`}
                      src={activeTab.url}
                      title={activeTab.title}
                      onLoad={() => setIframeLoading(false)}
                      onError={() => {
                        setIframeLoading(false);
                        setIframeError(true);
                      }}
                      className={`w-full h-full border-none transition-all duration-300 ${
                        isRawIframeDark
                          ? 'filter invert-[0.88] hue-rotate-180 contrast-[1.05] bg-slate-900'
                          : 'bg-white'
                      }`}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
                    />
                  </div>
                </div>
              ) : (
                /* 3. In-Browser Web Page Viewer for regular loaded URLs */
                <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden flex flex-col">
                  {iframeLoading && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-indigo-600 animate-pulse z-20" />
                  )}

                  {/* Security/Frame Notice Banner */}
                  <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 z-10 shrink-0">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Viewing on same page inside AppGo Browser</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReload}
                        className="text-indigo-400 hover:underline"
                      >
                        Reload Frame
                      </button>
                      <span>•</span>
                      <a
                        href={activeTab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <span>Open directly if blocked</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

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
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. ADD CUSTOM SPEED DIAL MODAL */}
      {/* ========================================================= */}
      {isAddSpeedDialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" />
                Add Shortcut to Speed Dial
              </h3>
              <button
                onClick={() => setIsAddSpeedDialOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomSpeedDial} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Shortcut Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Portfolio, Spotify Web"
                  value={newDialTitle}
                  onChange={(e) => setNewDialTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Web Address (URL) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://example.com"
                  value={newDialUrl}
                  onChange={(e) => setNewDialUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tag / Category</label>
                <input
                  type="text"
                  placeholder="e.g. Productivity, Streaming"
                  value={newDialType}
                  onChange={(e) => setNewDialType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSpeedDialOpen(false)}
                  className="px-3 py-2 font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition"
                >
                  Pin to Speed Dial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL (For News) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {selectedArticle.category} • {selectedArticle.source}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white leading-snug">{selectedArticle.title}</h2>

            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full aspect-video rounded-2xl object-cover"
            />

            <p className="text-sm text-slate-300 leading-relaxed">{selectedArticle.summary}</p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{selectedArticle.timeAgo}</span>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
              >
                <span>Read Original Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
