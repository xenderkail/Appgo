import React, { useState } from 'react';
import { SocialPlatform } from '../types';
import {
  X,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  ShieldAlert,
  Globe,
  Radio,
} from 'lucide-react';
import { AppIconRenderer } from '../utils/iconMap';

interface SocialEmbedModalProps {
  platform: SocialPlatform | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialEmbedModal: React.FC<SocialEmbedModalProps> = ({
  platform,
  isOpen,
  onClose,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen || !platform) return null;

  const getWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[400px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.brandColor} flex items-center justify-center text-white shadow-md`}>
              <AppIconRenderer type="preset" value={platform.icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {platform.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {platform.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono truncate">{platform.url}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition"
            >
              <span>Launch Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Device Switcher Toolbar */}
        <div className="p-2.5 px-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                device === 'desktop'
                  ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                device === 'tablet'
                  ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                device === 'mobile'
                  ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400">Sandbox Embedded Webview</span>
        </div>

        {/* Security frame notice */}
        <div className="px-6 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Most major social platforms (like X, Reddit, Discord) enforce browser <code>frame-ancestors</code> security headers that prevent full rendering inside third-party iframes. Click <strong>Launch Live</strong> anytime for full access.
          </span>
        </div>

        {/* Frame container */}
        <div className="flex-1 bg-slate-900 p-4 flex justify-center items-center min-h-[420px] overflow-hidden">
          <div
            className={`w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 transition-all duration-300 ${getWidth()}`}
            style={{ height: '480px' }}
          >
            <iframe
              src={platform.url}
              title={platform.name}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
