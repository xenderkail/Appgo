import React, { useState, useEffect, useMemo } from 'react';
import { WebApp, NewsItem, LiveChannel } from '../types';
import {
  NEWS_FEED_DATA,
  NEWS_CATEGORIES,
  LIVE_CHANNELS_DATA,
  CITIES_WEATHER,
  TRENDING_TAGS,
  CURATED_SEARCH_INDEX,
  GoogleSearchResult,
  WeatherData,
} from '../data/homeData';
import { INITIAL_APPS } from '../data/seedApps';
import { LiveChannelsSection } from './LiveChannelsSection';
import { AdSenseBanner } from './AdSenseBanner';
import { AppIconRenderer } from '../utils/iconMap';
import {
  Search,
  ExternalLink,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Clock,
  Play,
  Award,
  ArrowRight,
  Globe,
  Radio,
  BookOpen,
  X,
  Tv,
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

export const HomeTab: React.FC<HomeTabProps> = ({
  apps = INITIAL_APPS,
  onNavigateToStore,
  onNavigateToLaunchpad,
  onLaunchApp,
  onOpenAppDetails,
  featuredApp,
  onDirectSearchInStore,
}) => {
  // --- 1. SEARCH STATE & IN-PAGE GOOGLE RESULTS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState<'google' | 'appgo' | 'duckduckgo' | 'youtube'>('google');
  const [googleResultTab, setGoogleResultTab] = useState<'all' | 'apps' | 'channels' | 'stories' | 'web'>('all');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // --- 2. WEATHER & LIVE CLOCK WIDGET ---
  const [selectedCity, setSelectedCity] = useState<string>('San Francisco');
  const weather: WeatherData = CITIES_WEATHER[selectedCity] || CITIES_WEATHER['San Francisco'];
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 3. NEWS FEED STATE ---
  const [newsCategory, setNewsCategory] = useState<string>('All');
  const [newsSearch, setNewsSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const filteredNews = NEWS_FEED_DATA.filter((item) => {
    const matchCat = newsCategory === 'All' || item.category === newsCategory;
    const matchQuery =
      !newsSearch ||
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.source.toLowerCase().includes(newsSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  const heroArticle = filteredNews.find((n) => n.featured) || filteredNews[0];
  const gridArticles = filteredNews.filter((n) => n.id !== heroArticle?.id);

  // --- 4. HANDLE IN-PAGE GOOGLE SEARCH SUBMIT ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchTarget === 'appgo') {
      onDirectSearchInStore(searchQuery.trim());
      return;
    }

    if (searchTarget === 'duckduckgo') {
      window.open(
        `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery.trim())}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (searchTarget === 'youtube') {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery.trim())}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    // Google in-page direct search engine
    setSubmittedQuery(searchQuery.trim());
    setIsSearchActive(true);
  };

  // Google In-Page Matches
  const searchResults = useMemo(() => {
    if (!submittedQuery) return { all: [], apps: [], channels: [], stories: [], web: [] };

    const q = submittedQuery.toLowerCase();

    // 1. App matches
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

    // 2. Live Channel matches
    const matchedChannels = LIVE_CHANNELS_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.currentProgram.toLowerCase().includes(q) ||
        c.genre.toLowerCase().includes(q)
    ).map((c) => ({
      id: c.id,
      title: `${c.name} - 24/7 Live Stream (${c.resolution})`,
      url: c.streamUrl,
      displayUrl: `https://appgo.dev › live › ${c.id.replace('chan-', '')}`,
      snippet: `Broadcasting Live: "${c.currentProgram}". ${c.tagline}. Viewers: ${c.viewers} watching live • Genre: ${c.genre}`,
      type: 'channel' as const,
      badge: 'LIVE ON AIR',
      channelObj: c,
    }));

    // 3. News Story matches
    const matchedStories = NEWS_FEED_DATA.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q)
    ).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      displayUrl: `https://${n.source.toLowerCase().replace(/[^a-z0-9]/g, '')}.com › chronicle › ${n.id}`,
      snippet: `${n.summary.slice(0, 180)}... Published by ${n.source} • ${n.timeAgo} • ${n.readTime}`,
      type: 'article' as const,
      badge: n.category,
      newsObj: n,
    }));

    // 4. Curated Web matches
    const matchedWeb = CURATED_SEARCH_INDEX.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.snippet.toLowerCase().includes(q) ||
        w.badge?.toLowerCase().includes(q)
    );

    const all = [...matchedApps, ...matchedChannels, ...matchedStories, ...matchedWeb];
    return {
      all,
      apps: matchedApps,
      channels: matchedChannels,
      stories: matchedStories,
      web: matchedWeb,
    };
  }, [submittedQuery, apps]);

  const activeResultsList = useMemo(() => {
    if (googleResultTab === 'apps') return searchResults.apps;
    if (googleResultTab === 'channels') return searchResults.channels;
    if (googleResultTab === 'stories') return searchResults.stories;
    if (googleResultTab === 'web') return searchResults.web;
    return searchResults.all;
  }, [searchResults, googleResultTab]);

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

  return (
    <div className="space-y-8 pb-16">
      {/* 1. SMART & COMPACT HERO BANNER (Command Bar & Weather Pill) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-4 sm:p-5 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="w-full lg:max-w-3xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-400" />
                  AppGo Universal Command
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Search web, launch live channels & open tools
                </span>
              </div>

              {/* Target selector */}
              <div className="flex items-center gap-1 text-[11px] bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setSearchTarget('google')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition ${
                    searchTarget === 'google'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTarget('appgo')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition ${
                    searchTarget === 'appgo'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Apps
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTarget('youtube')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition ${
                    searchTarget === 'youtube'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  YouTube
                </button>
              </div>
            </div>

            {/* Smart Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchTarget === 'google'
                      ? 'Search Google, live streams, or global news...'
                      : searchTarget === 'appgo'
                      ? 'Search installed tools, games, utilities...'
                      : 'Search YouTube...'
                  }
                  className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition shadow-inner"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchActive(false);
                    }}
                    className="absolute right-14 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm active:scale-95"
                >
                  Find
                </button>
              </div>
            </form>

            {/* Trending tags bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-0.5 scrollbar-none">
              <span className="text-slate-400 shrink-0 font-medium">Trending:</span>
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const cleanTag = tag.replace('#', '');
                    setSearchQuery(cleanTag);
                    setSubmittedQuery(cleanTag);
                    setIsSearchActive(true);
                  }}
                  className="text-slate-300 hover:text-white hover:underline whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-800/50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Integrated Live Clock & Weather Capsule */}
          <div className="w-full lg:w-auto flex items-center justify-between lg:flex-col lg:items-end gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800/90 border border-slate-700/60">
                {renderWeatherIcon(weather.icon)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight">{weather.temp}°F</span>
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
                <div className="text-[10px] text-slate-400 font-medium">{weather.condition}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300 border-t lg:border-t border-slate-800/80 pt-1 lg:w-full lg:justify-end">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* IN-PAGE GOOGLE SEARCH RESULTS ENGINE */}
      {isSearchActive && submittedQuery && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-fadeIn">
          {/* Header with Google Brand & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-lg sm:text-xl font-bold tracking-tight">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-amber-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Search Results
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Found {activeResultsList.length} matches for "{submittedQuery}"
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(submittedQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span>Google.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setIsSearchActive(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Result Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 scrollbar-none border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setGoogleResultTab('all')}
              className={`pb-2 px-2 font-semibold border-b-2 transition ${
                googleResultTab === 'all'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({searchResults.all.length})
            </button>
            <button
              onClick={() => setGoogleResultTab('apps')}
              className={`pb-2 px-2 font-semibold border-b-2 transition ${
                googleResultTab === 'apps'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Apps & Utilities ({searchResults.apps.length})
            </button>
            <button
              onClick={() => setGoogleResultTab('channels')}
              className={`pb-2 px-2 font-semibold border-b-2 transition ${
                googleResultTab === 'channels'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Live Channels ({searchResults.channels.length})
            </button>
            <button
              onClick={() => setGoogleResultTab('stories')}
              className={`pb-2 px-2 font-semibold border-b-2 transition ${
                googleResultTab === 'stories'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              News & Chronicles ({searchResults.stories.length})
            </button>
            <button
              onClick={() => setGoogleResultTab('web')}
              className={`pb-2 px-2 font-semibold border-b-2 transition ${
                googleResultTab === 'web'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Web Index ({searchResults.web.length})
            </button>
          </div>

          {/* Results List */}
          {activeResultsList.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              <p>No results found for "{submittedQuery}".</p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(submittedQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-xs"
              >
                <span>Search external Google.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="space-y-5">
              {activeResultsList.map((res: any) => (
                <div key={res.id} className="space-y-1 group">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-sm">{res.displayUrl}</span>
                    {res.badge && (
                      <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-indigo-500">
                        {res.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
                    {res.type === 'app' && res.appObj ? (
                      <button onClick={() => onLaunchApp(res.appObj)} className="text-left font-bold">
                        {res.title}
                      </button>
                    ) : res.type === 'channel' && res.channelObj ? (
                      <button className="text-left font-bold">
                        {res.title}
                      </button>
                    ) : res.type === 'article' && res.newsObj ? (
                      <button onClick={() => setSelectedArticle(res.newsObj)} className="text-left font-bold">
                        {res.title}
                      </button>
                    ) : (
                      <a href={res.url} target="_blank" rel="noopener noreferrer">
                        {res.title}
                      </a>
                    )}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {res.snippet}
                  </p>

                  <div className="pt-1 flex items-center gap-2">
                    {res.type === 'app' && res.appObj && (
                      <button
                        onClick={() => onLaunchApp(res.appObj)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1"
                      >
                        <span>Launch App</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                    {res.type === 'article' && res.newsObj && (
                      <button
                        onClick={() => setSelectedArticle(res.newsObj)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center gap-1"
                      >
                        <span>Read Story</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by AppGo Universal Index</span>
            <button
              onClick={() => setIsSearchActive(false)}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Hide Search Results ↑
            </button>
          </div>
        </div>
      )}

      {/* 2. FEATURED SECTION: "App of the Day" Showcase */}
      {featuredApp && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/20 dark:border-amber-500/20 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
                <AppIconRenderer
                  type={featuredApp.iconType}
                  value={featuredApp.iconValue}
                  className="w-6 h-6"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                    <Award className="w-3 h-3 fill-slate-950" />
                    App of the Day
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {featuredApp.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{featuredApp.version}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {featuredApp.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                  {featuredApp.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={() => onOpenAppDetails(featuredApp)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Inspect Details
              </button>

              <button
                onClick={() => onLaunchApp(featuredApp)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition active:scale-[0.98]"
              >
                <span>Launch App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC LIVE CHANNELS SECTION (Replaced Reels) */}
      <LiveChannelsSection />

      {/* 4. GLOBAL MULTI-TOPIC CHRONICLES NEWS BLOG */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Global Chronicles
              </span>
              <span className="text-[11px] text-slate-400">· Curated Worldwide Stories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              World Culture, Nature & Living
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter stories..."
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              {newsSearch && (
                <button
                  onClick={() => setNewsSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setNewsCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                newsCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {heroArticle && (
          <div
            onClick={() => setSelectedArticle(heroArticle)}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px]">
              <div className="lg:col-span-7 relative h-60 lg:h-auto overflow-hidden">
                <img
                  src={heroArticle.imageUrl}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Featured Chronicle
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                    {heroArticle.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {heroArticle.source}
                    </span>
                    <span>{heroArticle.timeAgo} • {heroArticle.readTime}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {heroArticle.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {heroArticle.summary}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {heroArticle.author && (
                    <span className="text-xs text-slate-400 font-medium">
                      By {heroArticle.author}
                    </span>
                  )}

                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gridArticles.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedArticle(news)}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all cursor-pointer group"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                    {news.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {news.source}
                    </span>
                    <span>{news.timeAgo}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {news.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                <span>{news.readTime}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read article &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. GOOGLE ADSENSE & SPONSOR PLACEMENT */}
      <AdSenseBanner slotId="appgo-home-stream-bottom" />

      {/* Quick Article Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col text-slate-900 dark:text-white">
            <div className="relative h-60 w-full overflow-hidden shrink-0">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-xs font-bold uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold mt-1.5 leading-snug drop-shadow-md">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>Source: <strong className="text-indigo-600 dark:text-indigo-400">{selectedArticle.source}</strong></span>
                <span>{selectedArticle.timeAgo} • {selectedArticle.readTime}</span>
              </div>

              <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                {selectedArticle.summary}
              </p>

              <p className="text-slate-600 dark:text-slate-400 leading-loose">
                Across world capitals and cultural hubs, this development highlights the growing renaissance of natural wonder, thoughtful exploration, and human discovery. Scientists and cultural observers note that the preservation of such heritage offers enduring inspiration for communities worldwide.
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {selectedArticle.author && (
                  <span className="text-xs text-slate-400">Reporting by {selectedArticle.author}</span>
                )}
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Visit {selectedArticle.source}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
