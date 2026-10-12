import React from 'react';
import { WebApp } from '../types';
import { AppIconRenderer } from '../utils/iconMap';
import {
  ExternalLink,
  Download,
  Heart,
  Info,
  Star,
  Zap,
  Edit,
  Trash2,
} from 'lucide-react';

interface AppListRowProps {
  app: WebApp;
  isFavorite: boolean;
  onLaunch: (app: WebApp) => void;
  onDownload: (app: WebApp) => void;
  onToggleFavorite: (appId: string) => void;
  onOpenDetails: (app: WebApp) => void;
  onEdit: (app: WebApp) => void;
  onDelete: (app: WebApp) => void;
}

export const AppListRow: React.FC<AppListRowProps> = ({
  app,
  isFavorite,
  onLaunch,
  onDownload,
  onToggleFavorite,
  onOpenDetails,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700/60 shadow-xs hover:shadow-md transition-all">
      {/* Left: Icon, Title, Category, Tagline */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <AppIconRenderer
            type={app.iconType}
            value={app.iconValue}
            className="w-5 h-5"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              onClick={() => onOpenDetails(app)}
              className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition truncate"
            >
              {app.title}
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {app.category}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {app.version}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-lg">
            {app.tagline || app.description}
          </p>
        </div>
      </div>

      {/* Right: Stats & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto shrink-0">
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 mr-2">
          <span className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-700 dark:text-slate-300">{app.rating.toFixed(1)}</span>
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Zap className="w-3 h-3 text-indigo-400" />
            {app.launches}
          </span>
        </div>

        {/* Favorite */}
        <button
          onClick={() => onToggleFavorite(app.id)}
          className={`p-2 rounded-lg transition ${
            isFavorite
              ? 'text-pink-500 bg-pink-50 dark:bg-pink-950/40'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Favorite"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500' : ''}`} />
        </button>

        {/* Details */}
        <button
          onClick={() => onOpenDetails(app)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
          title="Details"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(app)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>

        {/* Download */}
        <button
          onClick={() => onDownload(app)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Launch */}
        <button
          onClick={() => onLaunch(app)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
        >
          <span>Launch</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
