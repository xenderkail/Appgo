import React from 'react';
import { Rocket, Sparkles, Zap, Heart, Compass, ExternalLink } from 'lucide-react';

interface HeroProps {
  totalApps: number;
  totalCategories: number;
  totalLaunches: number;
  favoriteCount: number;
  onExploreCategory: (category: string) => void;
  onShowFavorites: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalApps,
  totalCategories,
  totalLaunches,
  favoriteCount,
  onExploreCategory,
  onShowFavorites,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-6 sm:pt-12 sm:pb-8">
      {/* Background soft glow gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-pink-500/10 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-2xl">
            {/* Pill highlight */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
              <span>Next-Gen Web Applications Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Launch pad for{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                web tools & utilities
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Discover, launch, and download fast Vercel-hosted tools, developer utilities, and AI generators.
              Manage unlimited apps locally with instant JSON backup.
            </p>
          </div>

          {/* Quick Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
            <div className="px-3.5 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Total Apps</span>
                <Rocket className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalApps}
              </div>
            </div>

            <div className="px-3.5 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Categories</span>
                <Compass className="w-4 h-4 text-violet-500" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCategories}
              </div>
            </div>

            <div className="px-3.5 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Launches</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalLaunches.toLocaleString()}
              </div>
            </div>

            <button
              onClick={onShowFavorites}
              className="px-3.5 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-sm hover:border-pink-300 dark:hover:border-pink-800 transition text-left group"
              title="Filter by liked apps"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1 group-hover:text-pink-500 transition-colors">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Favorites</span>
                <Heart className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform fill-pink-500/20" />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {favoriteCount}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
