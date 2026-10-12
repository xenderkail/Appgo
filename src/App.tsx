import React, { useState, useEffect, useMemo } from 'react';
import {
  WebApp,
  AppCategory,
  SortOption,
  ViewMode,
  ToastMessage,
  NavTab,
} from './types';
import { INITIAL_APPS } from './data/seedApps';
import {
  loadStoredApps,
  saveApps,
  loadFavorites,
  saveFavorites,
  loadTheme,
  saveTheme,
  triggerAppDownload,
} from './utils/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { AppCard } from './components/AppCard';
import { AppListRow } from './components/AppListRow';
import { AppDetailsModal } from './components/AppDetailsModal';
import { AppFormModal } from './components/AppFormModal';
import { DataBackupModal } from './components/DataBackupModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { ToastContainer } from './components/Toast';
import { CuratedHub } from './components/CuratedHub';
import { DiagnosticModal } from './components/DiagnosticModal';
import { HomeTab } from './components/HomeTab';
import { SocialTab } from './components/SocialTab';
import { AdSenseBanner } from './components/AdSenseBanner';

const ALL_CATEGORIES: AppCategory[] = [
  'All',
  'AI Tools',
  'Utilities',
  'Productivity',
  'Generators',
  'Media',
  'Developer',
  'Other',
];

export default function App() {
  // 4 Primary Navigation Tabs: 'home' | 'store' | 'curated' | 'social'
  const [activeMainTab, setActiveMainTab] = useState<NavTab>('home');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadTheme());

  // App data state
  const [apps, setApps] = useState<WebApp[]>(() => loadStoredApps());
  const [favorites, setFavorites] = useState<string[]>(() => loadFavorites());

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AppCategory>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<WebApp | null>(null);
  const [detailsApp, setDetailsApp] = useState<WebApp | null>(null);
  const [deletingApp, setDeletingApp] = useState<WebApp | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme to HTML root element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Sync apps to LocalStorage whenever modified
  useEffect(() => {
    saveApps(apps);
  }, [apps]);

  // Sync favorites to LocalStorage
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Launch handler (increments launch count and opens link)
  const handleLaunch = (appToLaunch: WebApp) => {
    // Increment launches locally
    setApps((prev) =>
      prev.map((a) =>
        a.id === appToLaunch.id ? { ...a, launches: (a.launches || 0) + 1 } : a
      )
    );

    // If details modal is open with this app, update it
    if (detailsApp && detailsApp.id === appToLaunch.id) {
      setDetailsApp((prev) => prev ? { ...prev, launches: (prev.launches || 0) + 1 } : null);
    }

    addToast('Launching Web App', `Opening "${appToLaunch.title}" in a new tab...`, 'success');
    window.open(appToLaunch.url, '_blank', 'noopener,noreferrer');
  };

  // Download handler
  const handleDownload = (appToDownload: WebApp) => {
    triggerAppDownload(appToDownload);
    if (appToDownload.downloadUrl) {
      addToast('Download Started', `Triggering direct download for ${appToDownload.title}`, 'info');
    } else {
      addToast(
        'Shortcut Generated',
        `Downloaded 1-click Desktop Web Launcher for ${appToDownload.title}`,
        'success'
      );
    }
  };

  // Favorite toggle handler
  const handleToggleFavorite = (appId: string) => {
    const isFav = favorites.includes(appId);
    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== appId));
      addToast('Removed from Favorites', undefined, 'info');
    } else {
      setFavorites((prev) => [...prev, appId]);
      addToast('Added to Favorites', undefined, 'success');
    }
  };

  // Add / Edit save handler
  const handleSaveApp = (savedApp: WebApp) => {
    const existingIndex = apps.findIndex((a) => a.id === savedApp.id);
    if (existingIndex >= 0) {
      // Update
      const updated = [...apps];
      updated[existingIndex] = savedApp;
      setApps(updated);
      addToast('Web App Updated', `Successfully updated "${savedApp.title}"`, 'success');
    } else {
      // Create new
      setApps([savedApp, ...apps]);
      addToast('New App Added', `"${savedApp.title}" published to your directory`, 'success');
    }

    setIsFormModalOpen(false);
    setEditingApp(null);
  };

  // Delete handler
  const handleConfirmDelete = () => {
    if (!deletingApp) return;
    const title = deletingApp.title;
    setApps((prev) => prev.filter((a) => a.id !== deletingApp.id));
    setFavorites((prev) => prev.filter((id) => id !== deletingApp.id));
    if (detailsApp?.id === deletingApp.id) setDetailsApp(null);
    setDeletingApp(null);
    addToast('App Removed', `"${title}" was removed from your directory`, 'warning');
  };

  // Reset to seed data
  const handleResetData = () => {
    setApps(INITIAL_APPS);
    const defaultFavs = [
      'app-psx-emulator',
      'app-photopea',
      'app-excalidraw',
      'app-carbon-code',
    ];
    setFavorites(defaultFavs);
    addToast('Catalog Reset', `Restored directory to all ${INITIAL_APPS.length} tools across all categories`, 'info');
  };

  // Handle adding curated link to personal catalogue
  const handleAddCuratedApp = (newApp: WebApp) => {
    setApps((prev) => [newApp, ...prev]);
    addToast('Added to Store', `"${newApp.title}" added to your App Store!`, 'success');
  };

  // Repair seed apps with verified working links
  const handleRepairSeedApps = () => {
    setApps(INITIAL_APPS);
    const defaultFavs = ['app-psx-emulator', 'app-photopea', 'app-excalidraw', 'app-carbon-code'];
    setFavorites(defaultFavs);
    addToast('Diagnostic Repair', `All ${INITIAL_APPS.length} links restored to 100% verified working suite!`, 'success');
  };

  // Import apps
  const handleImportApps = (imported: WebApp[], mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      setApps(imported);
      addToast('Catalog Restored', `Replaced entire catalogue with ${imported.length} imported apps`, 'success');
    } else {
      // Merge: replace existing ids, add new ones
      const map = new Map<string, WebApp>();
      apps.forEach((a) => map.set(a.id, a));
      imported.forEach((a) => map.set(a.id, a));
      const merged = Array.from(map.values());
      setApps(merged);
      addToast('Catalog Merged', `Merged ${imported.length} imported apps into directory`, 'success');
    }
  };

  // Tag click handler to quickly filter
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  // Stats calculation (guaranteed 100% actual live data)
  const totalApps = apps.length;
  const totalLaunches = useMemo(
    () => apps.reduce((acc, curr) => acc + (curr.launches || 0), 0),
    [apps]
  );
  const totalCategories = useMemo(() => {
    const uniqueCats = new Set(apps.map((a) => a.category));
    return uniqueCats.size;
  }, [apps]);

  const activeFavoritesCount = useMemo(() => {
    return apps.filter((a) => favorites.includes(a.id)).length;
  }, [apps, favorites]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: apps.length };
    for (const cat of ALL_CATEGORIES) {
      if (cat !== 'All') {
        counts[cat] = apps.filter((a) => a.category === cat).length;
      }
    }
    return counts;
  }, [apps]);

  // Filtered & Sorted Apps
  const filteredApps = useMemo(() => {
    let result = [...apps];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory);
    }

    // Favorites only filter
    if (onlyFavorites) {
      result = result.filter((a) => favorites.includes(a.id));
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          (a.author && a.author.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'launches':
          return (b.launches || 0) - (a.launches || 0);
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'recent':
        default:
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      }
    });

    return result;
  }, [apps, activeCategory, onlyFavorites, searchQuery, sortBy, favorites]);

  // Featured App of the Day for Home Tab
  const featuredApp = useMemo(() => {
    return apps.find((a) => a.isFeatured) || apps[0];
  }, [apps]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAddModal={() => {
          setEditingApp(null);
          setIsFormModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onResetData={handleResetData}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        activeMainTab={activeMainTab}
        onSelectMainTab={setActiveMainTab}
        totalApps={totalApps}
        totalCategories={totalCategories}
      />

      {/* Main Content Area: 4 Primary Tabs */}
      <main className="flex-1">
        {/* TAB 1: HOME (Yahoo / YouTube Portal Style) */}
        {activeMainTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <HomeTab
              apps={apps}
              onNavigateToStore={() => setActiveMainTab('store')}
              onNavigateToLaunchpad={() => setActiveMainTab('curated')}
              onLaunchApp={handleLaunch}
              onOpenAppDetails={(a) => setDetailsApp(a)}
              featuredApp={featuredApp}
              onDirectSearchInStore={(query) => {
                setSearchQuery(query);
                setActiveMainTab('store');
              }}
            />
          </div>
        )}

        {/* TAB 2: APP STORE (Catalog, Filters, Grid/List) */}
        {activeMainTab === 'store' && (
          <>
            {/* Hero Section */}
            <Hero
              totalApps={totalApps}
              totalCategories={totalCategories}
              totalLaunches={totalLaunches}
              favoriteCount={activeFavoritesCount}
              onExploreCategory={(cat) => {
                setActiveCategory(cat as AppCategory);
                setOnlyFavorites(false);
              }}
              onShowFavorites={() => {
                setOnlyFavorites(true);
                setActiveCategory('All');
              }}
            />

            {/* Catalog Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              {/* Filter, Search & View Controls */}
              <FilterBar
                categories={ALL_CATEGORIES}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                categoryCounts={categoryCounts}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onlyFavorites={onlyFavorites}
                onToggleOnlyFavorites={() => setOnlyFavorites(!onlyFavorites)}
                favoriteCount={activeFavoritesCount}
              />

              {/* Active Search & Filter Indicator */}
              {(searchQuery || onlyFavorites || activeCategory !== 'All') && (
                <div className="flex items-center gap-2 py-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Showing {filteredApps.length} results</span>
                  {searchQuery && (
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      for query "{searchQuery}"
                    </span>
                  )}
                  {onlyFavorites && (
                    <span className="font-semibold text-pink-600 dark:text-pink-400">
                      (Favorites only)
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                      setOnlyFavorites(false);
                    }}
                    className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Apps Display: Grid or List */}
              {filteredApps.length === 0 ? (
                <EmptyState
                  hasSearchQuery={Boolean(searchQuery || onlyFavorites || activeCategory !== 'All')}
                  onClearFilters={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                    setOnlyFavorites(false);
                  }}
                  onOpenAddModal={() => {
                    setEditingApp(null);
                    setIsFormModalOpen(true);
                  }}
                />
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
                  {filteredApps.map((app) => (
                    <AppCard
                      key={app.id}
                      app={app}
                      isFavorite={favorites.includes(app.id)}
                      onLaunch={handleLaunch}
                      onDownload={handleDownload}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetails={(a) => setDetailsApp(a)}
                      onEdit={(a) => {
                        setEditingApp(a);
                        setIsFormModalOpen(true);
                      }}
                      onDelete={(a) => setDeletingApp(a)}
                      onTagClick={handleTagClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  {filteredApps.map((app) => (
                    <AppListRow
                      key={app.id}
                      app={app}
                      isFavorite={favorites.includes(app.id)}
                      onLaunch={handleLaunch}
                      onDownload={handleDownload}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetails={(a) => setDetailsApp(a)}
                      onEdit={(a) => {
                        setEditingApp(a);
                        setIsFormModalOpen(true);
                      }}
                      onDelete={(a) => setDeletingApp(a)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 3: WEB LAUNCHPAD (AI Bots, Books, Search, Markets, Emulators) */}
        {activeMainTab === 'curated' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
            <CuratedHub
              onAddAppToCatalog={handleAddCuratedApp}
              existingAppUrls={apps.map((a) => a.url)}
            />
          </div>
        )}

        {/* TAB 4: SOCIAL MEDIA (Mainstream, Dev, Communities, Streaming, Custom CRUD) */}
        {activeMainTab === 'social' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
            <SocialTab />
          </div>
        )}

        {/* Global Google AdSense placement across Store, Launchpad, and Social tabs */}
        {activeMainTab !== 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <AdSenseBanner slotId="appgo-footer-leaderboard" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">AppGo</span>
            <span>•</span>
            <span>Unified Web Portal & Application Store</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => setActiveMainTab('home')}
              className={`transition font-semibold ${activeMainTab === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600'}`}
            >
              Home
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveMainTab('store')}
              className={`transition font-semibold ${activeMainTab === 'store' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600'}`}
            >
              App Store
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveMainTab('curated')}
              className={`transition font-semibold ${activeMainTab === 'curated' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600'}`}
            >
              Web Launchpad
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveMainTab('social')}
              className={`transition font-semibold ${activeMainTab === 'social' ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600'}`}
            >
              Social Media
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="hover:text-emerald-500 transition font-semibold"
            >
              Diagnostic
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Export JSON
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setEditingApp(null);
                setIsFormModalOpen(true);
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Add App
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="hover:text-rose-500 transition"
            >
              Reset Seed
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. App Details Modal */}
      <AppDetailsModal
        app={detailsApp}
        isOpen={Boolean(detailsApp)}
        isFavorite={Boolean(detailsApp && favorites.includes(detailsApp.id))}
        onClose={() => setDetailsApp(null)}
        onLaunch={handleLaunch}
        onDownload={handleDownload}
        onToggleFavorite={handleToggleFavorite}
        onEdit={(a) => {
          setDetailsApp(null);
          setEditingApp(a);
          setIsFormModalOpen(true);
        }}
        onDelete={(a) => {
          setDetailsApp(null);
          setDeletingApp(a);
        }}
      />

      {/* 2. Add / Edit App Modal */}
      <AppFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
        initialApp={editingApp}
      />

      {/* 3. Data Backup & Import Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        apps={apps}
        onImportApps={handleImportApps}
      />

      {/* 4. Delete Confirmation Modal */}
      <DeleteConfirmModal
        app={deletingApp}
        isOpen={Boolean(deletingApp)}
        onClose={() => setDeletingApp(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* 5. Health & Link Diagnostic Modal */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        apps={apps}
        onRepairSeedApps={handleRepairSeedApps}
      />
    </div>
  );
}
