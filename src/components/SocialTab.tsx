import React, { useState, useEffect, useMemo } from 'react';
import { SocialPlatform, SocialCategory } from '../types';
import { SOCIAL_PLATFORMS_INITIAL } from '../data/socialData';
import { SocialEmbedModal } from './SocialEmbedModal';
import { AppIconRenderer } from '../utils/iconMap';
import {
  ExternalLink,
  Plus,
  Search,
  Heart,
  Eye,
  Trash2,
  Edit,
  Globe,
  Radio,
  Gamepad2,
  Image,
  FolderGit2,
  Code2,
  Compass,
  Layers,
  Terminal,
  Bookmark,
  Presentation,
  Check,
  X,
  Share2,
  Sparkles,
} from 'lucide-react';

const STORAGE_CUSTOM_SOCIAL = 'appgo_custom_social_links_v1';
const STORAGE_SOCIAL_FAVORITES = 'appgo_social_favorites_v1';

const CATEGORIES: SocialCategory[] = [
  'All',
  'Mainstream',
  'Tech & Dev',
  'Communities',
  'Video & Stream',
  'Custom',
];

export const SocialTab: React.FC = () => {
  // Load custom platforms from LocalStorage
  const [customPlatforms, setCustomPlatforms] = useState<SocialPlatform[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_SOCIAL);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Load social favorites
  const [socialFavorites, setSocialFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SOCIAL_FAVORITES);
      return raw ? JSON.parse(raw) : ['soc-x', 'soc-github', 'soc-youtube', 'soc-reddit'];
    } catch {
      return ['soc-x', 'soc-github'];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_SOCIAL, JSON.stringify(customPlatforms));
    } catch (e) {
      console.error(e);
    }
  }, [customPlatforms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SOCIAL_FAVORITES, JSON.stringify(socialFavorites));
    } catch (e) {
      console.error(e);
    }
  }, [socialFavorites]);

  // Combined platforms list
  const allPlatforms = useMemo(() => {
    return [...customPlatforms, ...SOCIAL_PLATFORMS_INITIAL];
  }, [customPlatforms]);

  // Filter & Search state
  const [activeCategory, setActiveCategory] = useState<SocialCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modals state
  const [embedModalPlatform, setEmbedModalPlatform] = useState<SocialPlatform | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<SocialCategory, 'All'>>('Tech & Dev');
  const [formTagline, setFormTagline] = useState('');
  const [formIcon, setFormIcon] = useState('Globe');
  const [formError, setFormError] = useState('');

  const toggleFavorite = (id: string) => {
    setSocialFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenAddForm = () => {
    setEditingPlatform(null);
    setFormName('');
    setFormHandle('');
    setFormUrl('https://');
    setFormCategory('Tech & Dev');
    setFormTagline('');
    setFormIcon('Globe');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (platform: SocialPlatform) => {
    setEditingPlatform(platform);
    setFormName(platform.name);
    setFormHandle(platform.handle || '');
    setFormUrl(platform.url);
    setFormCategory(platform.category);
    setFormTagline(platform.tagline);
    setFormIcon(platform.icon);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleDeleteCustomPlatform = (id: string) => {
    if (confirm('Delete this custom social link?')) {
      setCustomPlatforms((prev) => prev.filter((p) => p.id !== id));
      setSocialFavorites((prev) => prev.filter((favId) => favId !== id));
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Platform name is required');
      return;
    }

    let url = formUrl.trim();
    if (!url) {
      setFormError('URL is required');
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    if (editingPlatform) {
      // Edit
      setCustomPlatforms((prev) =>
        prev.map((p) =>
          p.id === editingPlatform.id
            ? {
                ...p,
                name: formName.trim(),
                handle: formHandle.trim() || undefined,
                url,
                category: formCategory,
                tagline: formTagline.trim() || 'Custom community or personal link',
                icon: formIcon,
              }
            : p
        )
      );
    } else {
      // Add
      const newCustom: SocialPlatform = {
        id: `custom-soc-${Date.now()}`,
        name: formName.trim(),
        handle: formHandle.trim() || undefined,
        tagline: formTagline.trim() || 'Custom community or personal link',
        category: formCategory,
        url,
        icon: formIcon,
        brandColor: 'from-indigo-600 to-purple-700 text-white',
        badge: 'Custom',
        isCustom: true,
      };
      setCustomPlatforms([newCustom, ...customPlatforms]);
    }

    setIsFormOpen(false);
  };

  // Filtered platforms
  const filteredPlatforms = useMemo(() => {
    return allPlatforms.filter((p) => {
      // Category filter
      let matchCategory = true;
      if (activeCategory === 'Custom') {
        matchCategory = Boolean(p.isCustom);
      } else if (activeCategory !== 'All') {
        matchCategory = p.category === activeCategory;
      }

      // Favorites filter
      const matchFav = onlyFavorites ? socialFavorites.includes(p.id) : true;

      // Search query
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.handle && p.handle.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      return matchCategory && matchFav && matchSearch;
    });
  }, [allPlatforms, activeCategory, onlyFavorites, socialFavorites, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              <Share2 className="w-3.5 h-3.5" />
              <span>Social Media Directory & Launchpad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Connect Across Global Platforms & Communities
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Quickly launch mainstream social networks, developer hubs, video streams, and discussion forums. Add your own custom profiles, company handles, or private group links with 1-click persistent storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat && !onlyFavorites;
            let count = 0;
            if (cat === 'All') count = allPlatforms.length;
            else if (cat === 'Custom') count = customPlatforms.length;
            else count = allPlatforms.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setOnlyFavorites(false);
                  setActiveCategory(cat);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
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

          {/* Favorites filter toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              onlyFavorites
                ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/50 hover:bg-pink-50 dark:hover:bg-pink-950/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'fill-pink-500/20'}`} />
            <span>Favorites</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                onlyFavorites ? 'bg-pink-500 text-white' : 'bg-pink-100 dark:bg-pink-950 text-pink-600'
              }`}
            >
              {socialFavorites.length}
            </span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search social platforms or handles..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid of Social Platform Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlatforms.map((platform) => {
          const isFav = socialFavorites.includes(platform.id);

          return (
            <div
              key={platform.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                {/* Card Top: Logo, Category, Favorite & Edit */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${platform.brandColor} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0`}
                    >
                      <AppIconRenderer
                        type="preset"
                        value={platform.icon}
                        className="w-6 h-6"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80">
                          {platform.category}
                        </span>
                        {platform.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {platform.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {platform.name}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(platform.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isFav
                          ? 'text-pink-500 bg-pink-50 dark:bg-pink-950/40'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isFav ? 'Remove favorite' : 'Add favorite'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-500' : ''}`} />
                    </button>

                    {platform.isCustom && (
                      <>
                        <button
                          onClick={() => handleOpenEditForm(platform)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit link"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomPlatform(platform.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Handle & Tagline */}
                {platform.handle && (
                  <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold mb-1 truncate">
                    {platform.handle}
                  </p>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                  {platform.tagline}
                </p>
              </div>

              {/* Action Buttons: Launch & Embed Preview */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-5 gap-2">
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-4 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition active:scale-[0.98]"
                >
                  <span>Launch Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setEmbedModalPlatform(platform)}
                  className="col-span-1 flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition"
                  title="Open live webview preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embed Modal */}
      <SocialEmbedModal
        platform={embedModalPlatform}
        isOpen={Boolean(embedModalPlatform)}
        onClose={() => setEmbedModalPlatform(null)}
      />

      {/* Add / Edit Custom Social Platform Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingPlatform ? 'Edit Custom Social Link' : 'Add Custom Social Link'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Platform / Community Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. My Telegram Channel, Mastodon, Substack"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Target URL *
                </label>
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Handle / Username
                  </label>
                  <input
                    type="text"
                    value={formHandle}
                    onChange={(e) => setFormHandle(e.target.value)}
                    placeholder="@myhandle"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  >
                    <option value="Mainstream">Mainstream</option>
                    <option value="Tech & Dev">Tech & Dev</option>
                    <option value="Communities">Communities</option>
                    <option value="Video & Stream">Video & Stream</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tagline / Description
                </label>
                <input
                  type="text"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="Short summary of this community or link"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Icon Preset
                </label>
                <select
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                >
                  <option value="Globe">Globe</option>
                  <option value="Radio">Radio</option>
                  <option value="Gamepad2">Gamepad</option>
                  <option value="Image">Image</option>
                  <option value="FolderGit2">Git</option>
                  <option value="Code2">Code</option>
                  <option value="Compass">Compass</option>
                  <option value="Sparkles">Sparkles</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 font-bold shadow-md transition"
                >
                  {editingPlatform ? 'Save Changes' : 'Add to Social Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
