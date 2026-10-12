import React, { useState, useEffect } from 'react';
import { WebApp, AppCategory } from '../types';
import { PRESET_ICON_NAMES, PRESET_EMOJIS, AppIconRenderer } from '../utils/iconMap';
import {
  X,
  Plus,
  Sparkles,
  Link as LinkIcon,
  Download,
  Tag,
  GitBranch,
  Layers,
  Smile,
  Image as ImageIcon,
  Check,
  Eye,
} from 'lucide-react';

interface AppFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: WebApp) => void;
  initialApp?: WebApp | null; // If provided, edit mode; otherwise, create mode
}

const CATEGORIES: Exclude<AppCategory, 'All'>[] = [
  'AI Tools',
  'Utilities',
  'Productivity',
  'Generators',
  'Media',
  'Developer',
  'Other',
];

export const AppFormModal: React.FC<AppFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialApp,
}) => {
  const isEditing = Boolean(initialApp);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Exclude<AppCategory, 'All'>>('AI Tools');
  const [url, setUrl] = useState('');
  const [iconType, setIconType] = useState<'preset' | 'emoji' | 'image'>('preset');
  const [iconValue, setIconValue] = useState('Sparkles');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [changelog, setChangelog] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('4.8');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialApp) {
      setTitle(initialApp.title);
      setTagline(initialApp.tagline);
      setDescription(initialApp.description);
      setCategory(initialApp.category);
      setUrl(initialApp.url);
      setIconType(initialApp.iconType);
      setIconValue(initialApp.iconValue);
      setDownloadUrl(initialApp.downloadUrl || '');
      setVersion(initialApp.version);
      setChangelog(initialApp.changelog);
      setTags(initialApp.tags || []);
      setAuthor(initialApp.author || '');
      setRating(String(initialApp.rating || 4.8));
    } else {
      // Defaults for new app
      setTitle('');
      setTagline('');
      setDescription('');
      setCategory('AI Tools');
      setUrl('https://');
      setIconType('preset');
      setIconValue('Sparkles');
      setDownloadUrl('');
      setVersion('v1.0.0');
      setChangelog(`### v1.0.0 (Initial Release)\n- Initial deployment on Vercel\n- Core feature set and responsive interface`);
      setTags(['Web', 'Tool']);
      setAuthor('');
      setRating('4.8');
    }
    setErrors({});
  }, [initialApp, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!tagline.trim()) newErrors.tagline = 'Tagline is required';

    let normalizedUrl = url.trim();
    if (!normalizedUrl) {
      newErrors.url = 'URL is required';
    } else if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
      setUrl(normalizedUrl);
    }

    try {
      new URL(normalizedUrl.startsWith('http') ? normalizedUrl : `https://${normalizedUrl}`);
    } catch {
      newErrors.url = 'Please provide a valid web address';
    }

    if (!version.trim()) newErrors.version = 'Version number is required';
    if (tags.length === 0) setTags(['Web App']);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const parsedRating = Math.min(5, Math.max(1, parseFloat(rating) || 4.8));
    const now = new Date().toISOString();

    const appToSave: WebApp = {
      id: initialApp?.id || `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim() || tagline.trim(),
      category,
      url: finalUrl,
      iconType,
      iconValue,
      downloadUrl: downloadUrl.trim() || undefined,
      version: version.trim() || 'v1.0.0',
      changelog: changelog.trim() || `### Initial Version\n- Deployed web application`,
      tags: tags.length > 0 ? tags : ['Web App'],
      author: author.trim() || 'Community Creator',
      rating: parsedRating,
      launches: initialApp?.launches || 0,
      isFeatured: initialApp?.isFeatured || false,
      createdAt: initialApp?.createdAt || now,
      updatedAt: now,
    };

    onSave(appToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Web App' : 'Add New Web App'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? 'Update details, URLs, or version changelog'
                  : 'Add a new Vercel tool or web application to your AppGo directory'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                App Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Text Summarizer"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  errors.title ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<AppCategory, 'All'>)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Short Tagline / Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Instant document and research paper TL;DR generator"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                errors.tagline ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
              } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.tagline && <p className="text-xs text-rose-500 mt-1">{errors.tagline}</p>}
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Full Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the capabilities, features, and target users..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* URLs: Vercel/Web URL & Download URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Vercel / Web URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://my-app.vercel.app"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                    errors.url ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono`}
                />
              </div>
              {errors.url && <p className="text-xs text-rose-500 mt-1">{errors.url}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Download URL <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Download className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://.../app-setup.zip or .exe"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Leave empty to auto-generate an instant 1-click desktop web launcher.
              </p>
            </div>
          </div>

          {/* Icon Selector */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                App Icon & Graphic
              </label>
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setIconType('preset')}
                  className={`px-2.5 py-1 rounded-md ${
                    iconType === 'preset'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Preset Icons
                </button>
                <button
                  type="button"
                  onClick={() => setIconType('emoji')}
                  className={`px-2.5 py-1 rounded-md ${
                    iconType === 'emoji'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Emoji
                </button>
                <button
                  type="button"
                  onClick={() => setIconType('image')}
                  className={`px-2.5 py-1 rounded-md ${
                    iconType === 'image'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {/* Preset Icon Grid */}
            {iconType === 'preset' && (
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Select a vector icon:</p>
                <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
                  {PRESET_ICON_NAMES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setIconValue(name)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center transition ${
                        iconValue === name
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                      }`}
                      title={name}
                    >
                      <AppIconRenderer type="preset" value={name} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Emoji Grid / Input */}
            {iconType === 'emoji' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={iconValue}
                    onChange={(e) => setIconValue(e.target.value)}
                    placeholder="Enter emoji e.g. 🚀"
                    className="w-32 px-3 py-1.5 text-center text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <span className="text-xs text-slate-500">Or pick a quick emoji below:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIconValue(emoji)}
                      className={`w-9 h-9 rounded-lg border text-lg flex items-center justify-center ${
                        iconValue === emoji
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image URL Input */}
            {iconType === 'image' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={iconValue}
                  onChange={(e) => setIconValue(e.target.value)}
                  placeholder="https://example.com/icon.png"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <AppIconRenderer type="image" value={iconValue} className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-slate-400">Live preview thumbnail</span>
                </div>
              </div>
            )}
          </div>

          {/* Version, Rating, and Developer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Version Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Initial Rating (1.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Developer / Studio
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Acme Labs"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tags <span className="text-slate-400 font-normal">(Press Enter or Comma to add)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                placeholder="e.g. AI, React, Productivity"
                className="flex-1 px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="p-0.5 hover:text-rose-500 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Changelog / Release Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Changelog / Release Notes
            </label>
            <textarea
              rows={4}
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              placeholder={`### ${version} (Latest)\n- Added feature X\n- Performance improvements`}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Publish to Directory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
