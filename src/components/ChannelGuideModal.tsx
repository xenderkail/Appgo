import React, { useState } from 'react';
import { LiveChannel, LiveGenre } from '../types';
import {
  X,
  Search,
  Tv,
  Radio,
  Eye,
  Plus,
  Play,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  LayoutGrid,
  List,
  Film,
  Trash2,
} from 'lucide-react';

interface ChannelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: LiveChannel[];
  genres: LiveGenre[];
  activeGenre: LiveGenre;
  onSelectChannel: (channel: LiveChannel) => void;
  onAddCustomChannel: (channel: Partial<LiveChannel>) => void;
  onDeleteCustomChannel?: (channelId: string) => void;
}

export const ChannelGuideModal: React.FC<ChannelGuideModalProps> = ({
  isOpen,
  onClose,
  channels,
  genres,
  activeGenre,
  onSelectChannel,
  onAddCustomChannel,
  onDeleteCustomChannel,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<LiveGenre>(activeGenre || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [viewMode, setViewMode] = useState<'directory' | 'grid'>('directory');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // New channel form state
  const [customName, setCustomName] = useState('');
  const [customStreamUrl, setCustomStreamUrl] = useState('');
  const [customOfficialUrl, setCustomOfficialUrl] = useState('');
  const [customGenre, setCustomGenre] = useState<Exclude<LiveGenre, 'All'>>('News');
  const [customProgram, setCustomProgram] = useState('');

  if (!isOpen) return null;

  const filteredChannels = channels.filter((ch) => {
    const matchesGenre = selectedGenre === 'All' || ch.genre === selectedGenre;
    const matchesSearch =
      !searchQuery.trim() ||
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.currentProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ch.streamUrl && ch.streamUrl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ch.channelUrl && ch.channelUrl.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customStreamUrl.trim()) return;

    onAddCustomChannel({
      name: customName.trim(),
      streamUrl: customStreamUrl.trim(),
      channelUrl: customOfficialUrl.trim() || customStreamUrl.trim(),
      genre: customGenre,
      currentProgram: customProgram.trim() || 'Live Broadcast Transmission',
      tagline: 'Custom Verified Live Stream',
      logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80',
      posterUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      resolution: '1080p',
      viewers: '2.4K',
      viewersCount: 2400,
      isCustom: true,
    });

    setCustomName('');
    setCustomStreamUrl('');
    setCustomOfficialUrl('');
    setCustomProgram('');
    setIsAddingChannel(false);
  };

  const handleCopy = (link: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl h-[88vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-900/90 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Live Channels Directory & Links
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                  {channels.length} Total Channels
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Names and links of all live channels. Click any channel to watch instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Directory Table vs Visual Grid */}
            <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('directory')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
                  viewMode === 'directory'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Names & Links Directory List"
              >
                <List className="w-3.5 h-3.5" />
                <span>Links & Names</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Visual Cards Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Visual Cards</span>
              </button>
            </div>

            {/* "Add Channels" button (replacing "Add Stream") */}
            <button
              onClick={() => setIsAddingChannel(!isAddingChannel)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingChannel ? 'Cancel' : 'Add Channels'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Channels Form Drawer */}
        {isAddingChannel && (
          <form
            onSubmit={handleCreateChannel}
            className="p-4 sm:p-5 bg-zinc-900/95 border-b border-zinc-800 animate-slideDown shrink-0"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Add New Live Broadcast Channel
              </h4>
              <span className="text-[11px] text-zinc-400">Supports direct MP4, HLS, or YouTube stream links</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Channel Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. EuroNews English or ISS Live"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Stream Link / Video URL *
                </label>
                <input
                  type="url"
                  placeholder="https://... (MP4 or YouTube URL)"
                  value={customStreamUrl}
                  onChange={(e) => setCustomStreamUrl(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Official Website Link
                </label>
                <input
                  type="url"
                  placeholder="https://channel-website.com"
                  value={customOfficialUrl}
                  onChange={(e) => setCustomOfficialUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                  Channel Genre
                </label>
                <select
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {genres.filter((g) => g !== 'All').map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <input
                type="text"
                placeholder="Current Program Title (e.g. World Breaking Desk)"
                value={customProgram}
                onChange={(e) => setCustomProgram(e.target.value)}
                className="w-full max-w-sm bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingChannel(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Save & Launch Channel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter Bar & Search */}
        <div className="p-3.5 bg-zinc-900/60 border-b border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
          {/* Genre Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, show, or link..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Channels Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 min-h-0">
          {filteredChannels.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-400 text-center">
              <Radio className="w-10 h-10 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold">No live channels matched</p>
              <p className="text-xs text-zinc-500 mt-1">
                Try searching another channel name or reset your filter.
              </p>
            </div>
          ) : viewMode === 'directory' ? (
            /* DIRECTORY VIEW: Names and Links of channels prominently listed */
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-2 flex items-center justify-between">
                <span>Channel Name & Current Show</span>
                <span className="hidden md:inline">Stream Link & Official Source</span>
                <span>Action</span>
              </div>

              {filteredChannels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    onSelectChannel(ch);
                    onClose();
                  }}
                  className="group bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 sm:p-3.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer shadow-xs hover:shadow-md"
                >
                  {/* Left: Logo, Name, Show, Genre */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-zinc-800 ring-2 ring-red-500/30">
                      <img
                        src={ch.logo}
                        alt={ch.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-red-500 ring-2 ring-zinc-900"></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                          {ch.name}
                        </h3>
                        <span className="px-1.5 py-0.2 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                          LIVE
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[10px] font-medium">
                          {ch.genre}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {ch.resolution}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 truncate mt-0.5 font-medium">
                        {ch.currentProgram}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Eye className="w-3 h-3 text-red-500" />
                          {ch.viewers} watching
                        </span>
                        <span>·</span>
                        <span>{ch.country || 'Global'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Names & Links Display */}
                  <div className="flex flex-col gap-1 min-w-0 md:max-w-xs shrink-0 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="text-zinc-500 font-medium">Stream URL:</span>
                      <button
                        onClick={(e) => handleCopy(ch.streamUrl, `${ch.id}-stream`, e)}
                        className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[10px] truncate max-w-[170px]"
                        title={ch.streamUrl}
                      >
                        <span className="truncate">{ch.streamUrl}</span>
                        {copiedLink === `${ch.id}-stream` ? (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3 h-3 shrink-0" />
                        )}
                      </button>
                    </div>

                    {ch.channelUrl && (
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="text-zinc-500 font-medium">Official Site:</span>
                        <a
                          href={ch.channelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1 font-mono text-[10px] truncate max-w-[170px]"
                        >
                          <span className="truncate">{ch.channelUrl.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right: Direct Watch Button */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {ch.isCustom && onDeleteCustomChannel && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCustomChannel(ch.id);
                        }}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 transition"
                        title="Remove custom channel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectChannel(ch);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredChannels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    onSelectChannel(ch);
                    onClose();
                  }}
                  className="group bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col shadow-sm hover:shadow-xl"
                >
                  <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                    <img
                      src={ch.posterUrl}
                      alt={ch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      LIVE
                    </div>

                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-mono border border-white/10">
                      {ch.resolution}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg pl-0.5">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white">
                      <span className="font-semibold text-xs truncate max-w-[70%]">
                        {ch.genre}
                      </span>
                      <span className="text-[11px] text-zinc-300 flex items-center gap-1">
                        <Eye className="w-3 h-3 text-red-400" />
                        {ch.viewers}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-start gap-3 flex-1">
                    <img
                      src={ch.logo}
                      alt={ch.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                        {ch.name}
                      </h3>
                      <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5 font-medium">
                        {ch.currentProgram}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-mono truncate mt-1">
                        {ch.streamUrl}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
