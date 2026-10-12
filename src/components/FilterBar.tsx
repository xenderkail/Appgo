import React from 'react';
import {
  AppCategory,
  SortOption,
  ViewMode,
} from '../types';
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Heart,
  Sparkles,
  Wrench,
  CheckCircle,
  Shapes,
  Image,
  Code2,
  Folder,
} from 'lucide-react';

interface FilterBarProps {
  categories: AppCategory[];
  activeCategory: AppCategory;
  onSelectCategory: (category: AppCategory) => void;
  categoryCounts: Record<string, number>;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  favoriteCount: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: null,
  'AI Tools': <Sparkles className="w-3.5 h-3.5 text-indigo-500" />,
  Utilities: <Wrench className="w-3.5 h-3.5 text-sky-500" />,
  Productivity: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  Generators: <Shapes className="w-3.5 h-3.5 text-amber-500" />,
  Media: <Image className="w-3.5 h-3.5 text-pink-500" />,
  Developer: <Code2 className="w-3.5 h-3.5 text-cyan-500" />,
  Other: <Folder className="w-3.5 h-3.5 text-slate-500" />,
};

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onlyFavorites,
  onToggleOnlyFavorites,
  favoriteCount,
}) => {
  return (
    <div className="py-4 space-y-3">
      {/* Top row: Category pills slider */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat && !onlyFavorites;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => {
                  if (onlyFavorites) onToggleOnlyFavorites();
                  onSelectCategory(cat);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
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

          {/* Favorites filter tab */}
          <button
            onClick={onToggleOnlyFavorites}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              onlyFavorites
                ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-500/30'
                : 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/50 hover:bg-pink-50 dark:hover:bg-pink-950/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'fill-pink-500/20'}`} />
            <span>Favorites</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                onlyFavorites
                  ? 'bg-pink-500/80 text-white'
                  : 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300'
              }`}
            >
              {favoriteCount}
            </span>
          </button>
        </div>

        {/* Sort & View Mode controls */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline text-slate-400 font-normal">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="recent" className="dark:bg-slate-800">Most Recent</option>
              <option value="rating" className="dark:bg-slate-800">Top Rated</option>
              <option value="launches" className="dark:bg-slate-800">Most Launched</option>
              <option value="name-asc" className="dark:bg-slate-800">Alphabetical (A-Z)</option>
              <option value="name-desc" className="dark:bg-slate-800">Alphabetical (Z-A)</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Compact list view"
              aria-label="Compact list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
