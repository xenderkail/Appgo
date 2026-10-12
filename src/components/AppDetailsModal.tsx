import React, { useState } from 'react';
import { WebApp } from '../types';
import { AppIconRenderer } from '../utils/iconMap';
import {
  X,
  ExternalLink,
  Download,
  Heart,
  Star,
  Zap,
  Calendar,
  User,
  Monitor,
  Tablet,
  Smartphone,
  ShieldAlert,
  Edit,
  Trash2,
  Copy,
  Check,
  Tag,
  GitBranch,
} from 'lucide-react';

interface AppDetailsModalProps {
  app: WebApp | null;
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onLaunch: (app: WebApp) => void;
  onDownload: (app: WebApp) => void;
  onToggleFavorite: (appId: string) => void;
  onEdit: (app: WebApp) => void;
  onDelete: (app: WebApp) => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({
  app,
  isOpen,
  isFavorite,
  onClose,
  onLaunch,
  onDownload,
  onToggleFavorite,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'changelog' | 'preview'>('overview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen || !app) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(app.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <AppIconRenderer
                type={app.iconType}
                value={app.iconValue}
                className="w-7 h-7"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {app.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {app.version}
                </span>
                {app.isFeatured && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Featured
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {app.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {app.tagline}
              </p>
            </div>
          </div>

          {/* Top Right Quick Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onToggleFavorite(app.id)}
              className={`p-2.5 rounded-xl border transition ${
                isFavorite
                  ? 'border-pink-300 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/40 text-pink-500'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Toggle Favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500' : ''}`} />
            </button>

            <button
              onClick={() => onLaunch(app)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
            >
              <span>Launch App</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 font-semibold border-b-2 transition -mb-px ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`py-3.5 font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
              activeTab === 'changelog'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Changelog</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {app.version}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3.5 font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Live Web Preview</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About this Web App
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {app.description}
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex-wrap">
                <button
                  onClick={() => onDownload(app)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {app.downloadUrl ? 'Download Package' : 'Download Desktop Shortcut'}
                  </span>
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition shadow-xs"
                >
                  {copiedUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{copiedUrl ? 'Copied URL!' : 'Copy Web URL'}</span>
                </button>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(app);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onDelete(app);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>User Rating</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {app.rating.toFixed(1)} / 5.0
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Total Launches</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {app.launches.toLocaleString()}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <User className="w-3.5 h-3.5 text-violet-500" />
                    <span>Developer</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {app.author || 'Independent Dev'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Updated</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {new Date(app.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Tags & Topics</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* URL preview */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between truncate">
                <span className="truncate">{app.url}</span>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-2"
                >
                  Visit &rarr;
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: CHANGELOG */}
          {activeTab === 'changelog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-indigo-500" />
                  <span>Release Notes & Version History</span>
                </h4>
                <span className="text-xs font-mono text-slate-500">
                  Current: {app.version}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {app.changelog || 'No changelog provided for this release.'}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE PREVIEW IFRAME */}
          {activeTab === 'preview' && (
            <div className="space-y-3">
              {/* Device switcher and banner */}
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                      previewDevice === 'desktop'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                      previewDevice === 'tablet'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                      previewDevice === 'mobile'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    <span>Open direct tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Note on X-Frame-Options */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <span>
                  Live preview loads via browser iframe. Note that third-party sites enforcing strict
                  <code>X-Frame-Options: DENY</code> may restrict embedding; click <strong>Launch App</strong> or <strong>Open direct tab</strong> anytime to run in full screen.
                </span>
              </div>

              {/* Iframe viewport frame */}
              <div className="flex justify-center bg-slate-900 rounded-xl p-2 sm:p-4 border border-slate-800 min-h-[380px] overflow-hidden">
                <div
                  className={`transition-all duration-300 bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-700 ${getPreviewWidth()}`}
                  style={{ height: '440px' }}
                >
                  <iframe
                    src={app.url}
                    title={`${app.title} Live Sandbox`}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>App ID: <code className="font-mono text-[11px]">{app.id}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
