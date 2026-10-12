import React, { useState, useMemo } from 'react';
import {
  CURATED_LINKS,
  CURATED_CATEGORIES,
  CuratedLink,
} from '../data/curatedLinks';
import { WebApp } from '../types';
import { AppIconRenderer } from '../utils/iconMap';
import {
  ExternalLink,
  Plus,
  Search,
  Sparkles,
  Bot,
  Bookmark,
  Globe,
  ShoppingBag,
  Terminal,
  Gamepad2,
  Image,
  Check,
  Star,
  ArrowRight,
} from 'lucide-react';

interface CuratedHubProps {
  onAddAppToCatalog: (newApp: WebApp) => void;
  existingAppUrls: string[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: null,
  'AI Bots': <Bot className="w-3.5 h-3.5 text-indigo-500" />,
  'Books & Libraries': <Bookmark className="w-3.5 h-3.5 text-emerald-500" />,
  'Search Engines': <Search className="w-3.5 h-3.5 text-sky-500" />,
  'Product Markets': <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />,
  'Dev & Sandboxes': <Terminal className="w-3.5 h-3.5 text-cyan-500" />,
  'Emulators & Retro': <Gamepad2 className="w-3.5 h-3.5 text-purple-500" />,
  'Media & Utilities': <Image className="w-3.5 h-3.5 text-pink-500" />,
};

export const CuratedHub: React.FC<CuratedHubProps> = ({
  onAddAppToCatalog,
  existingAppUrls,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const filteredLinks = useMemo(() => {
    return CURATED_LINKS.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchFilter.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchFilter]);

  const handleImportToCatalog = (item: CuratedLink) => {
    // Map curated category to directory category
    let catalogCategory: WebApp['category'] = 'Other';
    if (item.category === 'AI Bots') catalogCategory = 'AI Tools';
    else if (item.category === 'Books & Libraries') catalogCategory = 'Productivity';
    else if (item.category === 'Search Engines') catalogCategory = 'Utilities';
    else if (item.category === 'Product Markets') catalogCategory = 'Other';
    else if (item.category === 'Dev & Sandboxes') catalogCategory = 'Developer';
    else if (item.category === 'Emulators & Retro') catalogCategory = 'Other';
    else if (item.category === 'Media & Utilities') catalogCategory = 'Media';

    const newApp: WebApp = {
      id: `imported-${item.id}-${Date.now().toString(36)}`,
      title: item.title,
      tagline: item.tagline,
      description: `${item.title}: ${item.tagline}. Direct verified link curated for fast launching.`,
      category: catalogCategory,
      url: item.url,
      iconType: 'preset',
      iconValue: item.icon,
      version: 'v1.0',
      changelog: `### Initial Import\n- Added from AppGo Curated Launchpad`,
      tags: [item.category.replace(/[^a-zA-Z]/g, ''), 'Curated', 'Verified'],
      rating: 4.9,
      launches: 1,
      isFeatured: Boolean(item.popular),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddAppToCatalog(newApp);
    setAddedIds((prev) => [...prev, item.id]);
  };

  return (
    <div className="space-y-6">
      {/* Hero Mini Banner for Launchpad */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Web Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Curated Web Launchpad
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Explore 100% verified functional links: AI Bots (ChatGPT, Claude), Free Books Libraries, Search Engines, Product Markets (Amazon, Temu), Retro Emulators (PSX), and Dev Sandboxes. Launch directly or add to your local AppGo store with 1 click.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="block text-lg font-bold text-indigo-400">{CURATED_LINKS.length}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active Links</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="block text-lg font-bold text-emerald-400">7</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CURATED_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === 'All'
                ? CURATED_LINKS.length
                : CURATED_LINKS.filter((l) => l.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {CATEGORY_ICONS[cat]}
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-indigo-500/80 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search links, brands, or categories..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Curated Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((item) => {
          const isAlreadyInCatalog =
            existingAppUrls.some((u) => u.toLowerCase() === item.url.toLowerCase()) ||
            addedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-lg transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                      <AppIconRenderer
                        type="preset"
                        value={item.icon}
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-500 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                  {item.tagline}
                </p>

                <div className="mt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                  {item.url}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {/* 1-Click Launch */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition active:scale-[0.98]"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Add to directory */}
                <button
                  onClick={() => handleImportToCatalog(item)}
                  disabled={isAlreadyInCatalog}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                    isAlreadyInCatalog
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 cursor-default'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                  }`}
                  title={isAlreadyInCatalog ? 'Added to AppGo directory' : 'Add to your AppGo editable directory'}
                >
                  {isAlreadyInCatalog ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">In Directory</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add to Directory</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
