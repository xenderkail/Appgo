import React, { useState, useMemo, useEffect } from 'react';
import { CuratedLink, CURATED_CATEGORIES, CURATED_LINKS } from '../data/curatedLinks';
import { WebApp } from '../types';
import { AppIconRenderer } from '../utils/iconMap';
import {
  ExternalLink,
  Search,
  Plus,
  Compass,
  Check,
  Sparkles,
  Share2,
  Trash2,
  X,
  Bookmark,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

const STORAGE_CUSTOM_HUB_LINKS = 'appgo_custom_hub_links_v2';
const STORAGE_HUB_FAVORITES = 'appgo_hub_favorites_v2';

interface LaunchpadSocialHubProps {
  onAddAppToCatalog?: (app: WebApp) => void;
  existingAppUrls?: string[];
  onOpenInBrowser?: (url: string, title?: string) => void;
  onPinToSpeedDial?: (link: CuratedLink) => void;
}

export const LaunchpadSocialHub: React.FC<LaunchpadSocialHubProps> = ({
  onAddAppToCatalog,
  existingAppUrls = [],
  onOpenInBrowser,
  onPinToSpeedDial,
}) => {
  // Load custom links from LocalStorage
  const [customLinks, setCustomLinks] = useState<CuratedLink[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_HUB_LINKS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Load favorites
  const [hubFavorites, setHubFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_HUB_FAVORITES);
      return raw ? JSON.parse(raw) : ['ai-openrouter', 'ai-groq', 'soc-x', 'soc-github', 'soc-reddit'];
    } catch {
      return ['ai-openrouter', 'soc-x'];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_HUB_LINKS, JSON.stringify(customLinks));
    } catch (e) {
      console.error(e);
    }
  }, [customLinks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HUB_FAVORITES, JSON.stringify(hubFavorites));
    } catch (e) {
      console.error(e);
    }
  }, [hubFavorites]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [justImportedId, setJustImportedId] = useState<string | null>(null);
  const [justPinnedId, setJustPinnedId] = useState<string | null>(null);

  // Add custom link modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customCategory, setCustomCategory] = useState<CuratedLink['category']>('AI Bots');
  const [customTagline, setCustomTagline] = useState('');
  const [customType, setCustomType] = useState('');

  // Combined links
  const allLinks = useMemo(() => {
    return [...customLinks, ...CURATED_LINKS];
  }, [customLinks]);

  // Filter links
  const filteredLinks = useMemo(() => {
    return allLinks.filter((item) => {
      const matchCat =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'Custom'
          ? item.category === 'Custom' || customLinks.some((c) => c.id === item.id)
          : item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.handle && item.handle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q);

      const matchFav = !onlyFavorites || hubFavorites.includes(item.id);

      return matchCat && matchSearch && matchFav;
    });
  }, [allLinks, selectedCategory, searchQuery, onlyFavorites, hubFavorites, customLinks]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHubFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleImportToCatalog = (item: CuratedLink, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onAddAppToCatalog) return;

    let appCategory: WebApp['category'] = 'Other';
    if (item.category === 'AI Bots') appCategory = 'AI Tools';
    else if (item.category === 'Dev & Sandboxes') appCategory = 'Developer';
    else if (item.category === 'Media & Utilities') appCategory = 'Media';
    else if (item.category === 'Search Engines') appCategory = 'Utilities';
    else if (item.category === 'Product Markets') appCategory = 'Productivity';
    else if (item.category === 'Social & Communities') appCategory = 'Media';

    const newApp: WebApp = {
      id: `imported-${item.id}-${Date.now().toString(36)}`,
      title: item.title,
      tagline: item.tagline,
      description: item.type
        ? `${item.title} (${item.type}): ${item.tagline}. Direct verified link curated for fast launching.`
        : `${item.title}: ${item.tagline}. Direct verified link curated for fast launching.`,
      category: appCategory,
      url: item.url,
      iconType: 'preset',
      iconValue: item.icon || 'Globe',
      version: '1.0.0',
      changelog: `Imported from Launchpad & Social hub (${item.category})`,
      tags: [item.category.toLowerCase().replace(/[^a-z0-9]/g, '-'), 'curated', 'web-hub'],
      author: 'Curated Directory',
      rating: 4.8,
      launches: 1,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddAppToCatalog(newApp);
    setJustImportedId(item.id);
    setTimeout(() => setJustImportedId(null), 2500);
  };

  const handlePin = (item: CuratedLink, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPinToSpeedDial) {
      onPinToSpeedDial(item);
      setJustPinnedId(item.id);
      setTimeout(() => setJustPinnedId(null), 2000);
    }
  };

  const handleOpen = (item: CuratedLink) => {
    if (onOpenInBrowser) {
      onOpenInBrowser(item.url, item.title);
    } else {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customUrl.trim()) return;

    let formattedUrl = customUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newCustom: CuratedLink = {
      id: `custom-hub-${Date.now()}`,
      title: customTitle.trim(),
      tagline: customTagline.trim() || 'Custom user link added to Launchpad & Social Hub',
      type: customType.trim() || undefined,
      category: customCategory,
      url: formattedUrl,
      icon: 'Globe',
      badge: 'Custom',
    };

    setCustomLinks((prev) => [newCustom, ...prev]);
    setIsAddModalOpen(false);
    setCustomTitle('');
    setCustomUrl('');
    setCustomTagline('');
    setCustomType('');
  };

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomLinks((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                Unified Launchpad & Social Hub
              </span>
              <span className="text-xs text-slate-400">
                {allLinks.length} Curated Platforms
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Bots, Communities, Sandboxes & Media
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fast, direct verified links to the world’s top AI models, developer playgrounds,
              social networks, digital libraries, and productivity sandboxes. Pin directly to
              your Opera Speed Dial or import into your personal catalog with one click.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI bots, social networks, sandboxes, types (e.g. LPU, API, Cloud OS)..."
            className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Favorites Filter */}
        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-3">
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              onlyFavorites
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Favorites</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
              {hubFavorites.length}
            </span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CURATED_CATEGORIES.map((cat) => {
          const count =
            cat === 'All'
              ? allLinks.length
              : cat === 'Custom'
              ? customLinks.length
              : allLinks.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategory === cat
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {filteredLinks.length} platforms</span>
        {(searchQuery || onlyFavorites || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setOnlyFavorites(false);
              setSelectedCategory('All');
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredLinks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Layers className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No platforms found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category from above.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setOnlyFavorites(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLinks.map((item) => {
            const isImported =
              existingAppUrls.includes(item.url) || justImportedId === item.id;
            const isFav = hubFavorites.includes(item.id);
            const isCustom = customLinks.some((c) => c.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleOpen(item)}
                className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
              >
                <div>
                  {/* Top Bar: Icon, Category & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                        item.brandColor
                          ? `bg-gradient-to-br ${item.brandColor}`
                          : 'bg-gradient-to-br from-indigo-500 to-indigo-700'
                      }`}
                    >
                      <AppIconRenderer
                        type="preset"
                        value={item.icon || 'Globe'}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleToggleFavorite(item.id, e)}
                        className={`p-1.5 rounded-lg transition ${
                          isFav
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`}
                        />
                      </button>

                      {isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustom(item.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Delete custom link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Type Chip */}
                    {item.type && (
                      <div className="inline-block">
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 line-clamp-1">
                          Type: {item.type}
                        </span>
                      </div>
                    )}

                    {/* Tagline */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-0.5">
                      {item.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Action buttons */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                    {item.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onPinToSpeedDial && (
                      <button
                        onClick={(e) => handlePin(item, e)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                          justPinnedId === item.id
                            ? 'bg-emerald-500 text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title="Pin to Opera Speed Dial"
                      >
                        {justPinnedId === item.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {onAddAppToCatalog && (
                      <button
                        onClick={(e) => handleImportToCatalog(item, e)}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                          isImported
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                        }`}
                        title={isImported ? 'Already in Catalog' : 'Add to App Store Catalog'}
                      >
                        {isImported ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Link Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" />
                Add Custom Platform / Link
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Claude Artifacts, Mastodon Server"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://example.com"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="AI Bots">AI Bots</option>
                  <option value="Social & Communities">Social & Communities</option>
                  <option value="Dev & Sandboxes">Dev & Sandboxes</option>
                  <option value="Books & Libraries">Books & Libraries</option>
                  <option value="Search Engines">Search Engines</option>
                  <option value="Product Markets">Product Markets</option>
                  <option value="Emulators & Retro">Emulators & Retro</option>
                  <option value="Media & Utilities">Media & Utilities</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Type / Classification (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Multi-Model Playground, Discord Server"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  placeholder="Short description of this platform..."
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 transition"
                >
                  Save Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
