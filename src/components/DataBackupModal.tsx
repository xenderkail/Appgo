import React, { useState, useRef } from 'react';
import { WebApp } from '../types';
import { exportAppsToJson } from '../utils/storage';
import {
  X,
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: WebApp[];
  onImportApps: (importedApps: WebApp[], mode: 'replace' | 'merge') => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  apps,
  onImportApps,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [jsonText, setJsonText] = useState('');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [parsedPreview, setParsedPreview] = useState<WebApp[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportAppsToJson(apps);
  };

  const processJsonString = (raw: string) => {
    setJsonText(raw);
    setParseError(null);
    setParsedPreview(null);

    if (!raw.trim()) return;

    try {
      const data = JSON.parse(raw);
      let list: any[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.apps)) {
        list = data.apps;
      } else {
        throw new Error('JSON must contain an array of apps or an object with an "apps" list.');
      }

      // Basic validation
      const validApps: WebApp[] = list.map((item, idx) => {
        if (!item.title || !item.url) {
          throw new Error(`Item at position #${idx + 1} is missing required title or url.`);
        }
        return {
          id: item.id || `imported-${Date.now()}-${idx}`,
          title: item.title,
          tagline: item.tagline || item.description || '',
          description: item.description || item.tagline || '',
          category: item.category || 'Utilities',
          url: item.url,
          iconType: item.iconType || 'preset',
          iconValue: item.iconValue || 'Sparkles',
          downloadUrl: item.downloadUrl,
          version: item.version || 'v1.0.0',
          changelog: item.changelog || 'Imported release',
          tags: Array.isArray(item.tags) ? item.tags : ['Imported'],
          author: item.author,
          rating: typeof item.rating === 'number' ? item.rating : 4.8,
          launches: typeof item.launches === 'number' ? item.launches : 0,
          isFeatured: Boolean(item.isFeatured),
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };
      });

      setParsedPreview(validApps);
    } catch (err: any) {
      setParseError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processJsonString(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!parsedPreview || parsedPreview.length === 0) return;
    onImportApps(parsedPreview, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Data Backup & Catalog Sync
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safely backup your catalogue or import apps from another device
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 gap-6 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3.5 font-bold border-b-2 flex items-center gap-2 transition -mb-px ${
              activeTab === 'export'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Data (JSON)</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3.5 font-bold border-b-2 flex items-center gap-2 transition -mb-px ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import Data (JSON)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                Download a clean, structured JSON file of your entire directory including all titles,
                categories, URLs, icons, version numbers, and changelogs.
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Current Catalog Snapshot
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {apps.length} web applications ready to download
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .json file</span>
                </button>
              </div>

              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-500">File format:</span> UTF-8 formatted JSON with version metadata and timestamp.
              </div>
            </div>
          )}

          {/* IMPORT TAB */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* File upload dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 transition group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
                <FileUp className="w-8 h-8 mx-auto text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" />
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Click to upload catalog JSON file
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports AppGo backup JSON or any valid web app array</p>
              </div>

              {/* Paste JSON directly */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Or Paste JSON Text:
                </label>
                <textarea
                  rows={4}
                  value={jsonText}
                  onChange={(e) => processJsonString(e.target.value)}
                  placeholder={`[\n  {\n    "title": "My Tool",\n    "url": "https://my-tool.vercel.app",\n    "category": "Utilities"\n  }\n]`}
                  className="w-full p-3 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Parsing status banner */}
              {parseError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {parsedPreview && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Successfully detected {parsedPreview.length} web applications!</span>
                    </div>
                  </div>

                  {/* Mode options */}
                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 text-xs space-y-2">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                      Select how to apply the imported data:
                    </p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'merge'}
                          onChange={() => setImportMode('merge')}
                          className="accent-indigo-600"
                        />
                        <span>
                          <strong>Merge:</strong> Append new apps & update matching IDs
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="accent-indigo-600"
                        />
                        <span>
                          <strong>Replace:</strong> Overwrite whole catalog
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmImport}
                    className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-[0.98]"
                  >
                    Restore & Import {parsedPreview.length} Apps Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
