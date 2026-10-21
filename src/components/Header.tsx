import React, { useRef, useEffect } from 'react';
import { NavTab } from '../types';
import {
  Rocket,
  Search,
  Plus,
  Sun,
  Moon,
  Database,
  Download,
  Upload,
  RefreshCw,
  X,
  Activity,
  Compass,
  LayoutGrid,
  Home,
  Share2,
  Globe,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onResetData: () => void;
  onOpenDiagnostic: () => void;
  activeMainTab: NavTab;
  onSelectMainTab: (tab: NavTab) => void;
  totalApps: number;
  totalCategories: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  onOpenAddModal,
  onOpenBackupModal,
  onResetData,
  onOpenDiagnostic,
  activeMainTab,
  onSelectMainTab,
  totalApps,
  totalCategories,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Brand Logo & Tab Toggle */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <a href="#" onClick={(e) => { e.preventDefault(); onSelectMainTab('home'); }} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Rocket className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-100 dark:to-indigo-300 bg-clip-text text-transparent">
                    AppGo
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 tracking-wider uppercase">
                    Hub
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                  Web App Launcher
                </span>
              </div>
            </a>

            {/* Desktop 3-Tab Navigation Bar */}
            <nav className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <button
                onClick={() => onSelectMainTab('home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  activeMainTab === 'home'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>AppGo Browser</span>
              </button>

              <button
                onClick={() => onSelectMainTab('shortcuts')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  activeMainTab === 'shortcuts'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Shortcuts</span>
              </button>

              <button
                onClick={() => onSelectMainTab('store')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  activeMainTab === 'store'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>App Store</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-600 font-mono">
                  {totalApps}
                </span>
              </button>

              <button
                onClick={() => onSelectMainTab('hub')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  activeMainTab === 'hub' || activeMainTab === 'curated' || activeMainTab === 'social'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Launchpad & Social</span>
              </button>
            </nav>
          </div>

          {/* Global Fast Search Bar */}
          <div className="flex-1 max-w-sm hidden xl:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search web apps, tools, or tags..."
                className="w-full pl-10 pr-16 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all shadow-inner"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/70 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 rounded">
                    /
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Diagnostic Button */}
            <button
              onClick={onOpenDiagnostic}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
              title="Run real-time link health and latency diagnostic"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              <span className="hidden sm:inline">Diagnostic</span>
            </button>

            {/* Backup & Data Sync Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition flex items-center gap-1.5"
                title="Manage app database (JSON export / import / reset)"
              >
                <Database className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">Data & Sync</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Catalog Storage</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">LocalStorage & JSON backup</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenBackupModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition"
                  >
                    <Download className="w-4 h-4 text-indigo-500" />
                    <span>Export / Import JSON</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (confirm('Restore catalog to verified real working apps? Your custom apps can be restored if exported.')) {
                        onResetData();
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Repair & Restore Seed Apps</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Add App Modal Trigger (Contextually shown on App Store tab or desktop) */}
            {activeMainTab === 'store' && (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add App</span>
              </button>
            )}
          </div>
        </div>

        {/* Medium and Mobile Navigation Tabs (4 Primary Tabs) */}
        <div className="flex lg:hidden items-center justify-between gap-1 pb-2.5 pt-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs w-full">
            <button
              onClick={() => onSelectMainTab('home')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold transition whitespace-nowrap ${
                activeMainTab === 'home'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Browser</span>
            </button>

            <button
              onClick={() => onSelectMainTab('shortcuts')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-bold transition whitespace-nowrap ${
                activeMainTab === 'shortcuts'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Shortcuts</span>
            </button>

            <button
              onClick={() => onSelectMainTab('store')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-bold transition whitespace-nowrap ${
                activeMainTab === 'store'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>

            <button
              onClick={() => onSelectMainTab('hub')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-bold transition whitespace-nowrap ${
                activeMainTab === 'hub' || activeMainTab === 'curated' || activeMainTab === 'social'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Launchpad & Social</span>
            </button>
          </div>
        </div>

        {/* Mobile Search input bar - Only on Store & Launchpad to avoid double search on Home */}
        {activeMainTab !== 'home' && (
          <div className="pb-3 xl:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search apps, tools, or tags..."
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
