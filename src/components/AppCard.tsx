import React from 'react';
import { WebApp } from '../types';
import { AppIconRenderer } from '../utils/iconMap';
import {
  ExternalLink,
  Download,
  Heart,
  Info,
  MoreVertical,
  Star,
  Zap,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';

interface AppCardProps {
  app: WebApp;
  isFavorite: boolean;
  onLaunch: (app: WebApp) => void;
  onDownload: (app: WebApp) => void;
  onToggleFavorite: (appId: string) => void;
  onOpenDetails: (app: WebApp) => void;
  onEdit: (app: WebApp) => void;
  onDelete: (app: WebApp) => void;
  onTagClick?: (tag: string) => void;
}

// Category accent colors for dynamic visual personality
const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; iconBg: string }
> = {
  'AI Tools': {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200/80 dark:border-indigo-800/80',
    iconBg: 'from-indigo-600 to-violet-600 text-white',
  },
  Utilities: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200/80 dark:border-sky-800/80',
    iconBg: 'from-sky-500 to-blue-600 text-white',
  },
  Productivity: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-800/80',
    iconBg: 'from-emerald-500 to-teal-600 text-white',
  },
  Generators: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-800/80',
    iconBg: 'from-amber-500 to-orange-600 text-white',
  },
  Media: {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200/80 dark:border-pink-800/80',
    iconBg: 'from-pink-500 to-rose-600 text-white',
  },
  Developer: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200/80 dark:border-cyan-800/80',
    iconBg: 'from-cyan-600 to-blue-700 text-white',
  },
  Other: {
    bg: 'bg-slate-50 dark:bg-slate-800/50',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    iconBg: 'from-slate-600 to-slate-800 text-white',
  },
};

export const AppCard: React.FC<AppCardProps> = ({
  app,
  isFavorite,
  onLaunch,
  onDownload,
  onToggleFavorite,
  onOpenDetails,
  onEdit,
  onDelete,
  onTagClick,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const categoryStyle = CATEGORY_STYLES[app.category] || CATEGORY_STYLES.Other;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all duration-300">
      {/* Top row: Icon, Category & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* App Icon */}
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryStyle.iconBg} flex items-center justify-center shadow-md shadow-indigo-500/10 shrink-0 group-hover:scale-105 transition-transform overflow-hidden`}
            >
              <AppIconRenderer
                type={app.iconType}
                value={app.iconValue}
                className="w-6 h-6"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                >
                  {app.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {app.version}
                </span>
              </div>
              <h3
                onClick={() => onOpenDetails(app)}
                className="mt-1 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
                title={app.title}
              >
                {app.title}
              </h3>
            </div>
          </div>

          {/* Quick Favorite & Overflow Menu */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite(app.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-pink-500 bg-pink-50 dark:bg-pink-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-pink-500' : ''}`}
              />
            </button>

            {/* Admin More Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="App options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-30 text-xs animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenDetails(app);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Info className="w-3.5 h-3.5 text-indigo-500" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(app);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Edit className="w-3.5 h-3.5 text-sky-500" />
                    <span>Edit App</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(app.url);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copy URL</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(app);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete App</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {app.tagline || app.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.tags.slice(0, 3).map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition"
            >
              #{tag}
            </button>
          ))}
          {app.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{app.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata and Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-800 dark:text-slate-200">{app.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>{app.launches} launches</span>
          </div>
        </div>

        {/* Action Buttons: Launch Web App, Download, Details */}
        <div className="grid grid-cols-5 gap-1.5">
          {/* Launch Web App (Primary) */}
          <button
            onClick={() => onLaunch(app)}
            className="col-span-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all"
            title={`Launch ${app.title} in a new tab`}
          >
            <span>Launch</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Download Button */}
          <button
            onClick={() => onDownload(app)}
            className="col-span-1 flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition"
            title={app.downloadUrl ? 'Direct Download' : 'Download Desktop Web Shortcut'}
            aria-label="Download app package"
          >
            <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Details Modal Button */}
          <button
            onClick={() => onOpenDetails(app)}
            className="col-span-1 flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition"
            title="View app details & live preview"
            aria-label="App details"
          >
            <Info className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
