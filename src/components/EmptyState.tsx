import React from 'react';
import { SearchX, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  onClearFilters: () => void;
  onOpenAddModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchQuery,
  onClearFilters,
  onOpenAddModal,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        No matching web apps found
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {hasSearchQuery
          ? 'No apps match your search keywords or active category. Try adjusting your search query or reset filters.'
          : 'Your catalogue has no apps in this category yet. Add a new web app or import an existing JSON backup.'}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Filters</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Web App</span>
        </button>
      </div>
    </div>
  );
};
