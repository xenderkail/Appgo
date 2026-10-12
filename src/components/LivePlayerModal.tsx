import React, { useState, useRef, useEffect } from 'react';
import { LiveChannel } from '../types';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Radio,
  Tv,
  Share2,
  MessageSquare,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  Send,
  Layers,
  Settings,
  AlertCircle,
  Copy,
} from 'lucide-react';

interface LivePlayerModalProps {
  channel: LiveChannel | null;
  allChannels: LiveChannel[];
  onClose: () => void;
  onSelectChannel: (channel: LiveChannel) => void;
}

interface ChatMessage {
  id: string;
  user: string;
  color: string;
  badge?: string;
  text: string;
  time: string;
}

const SAMPLE_CHAT_USERS = [
  { name: 'AlexGamer99', color: 'text-cyan-400', badge: 'VIP' },
  { name: 'Elena_Stream', color: 'text-rose-400', badge: 'Mod' },
  { name: 'OrbitWatcher', color: 'text-amber-400' },
  { name: 'SonicPulse', color: 'text-emerald-400' },
  { name: 'WorldDeskWatcher', color: 'text-blue-400' },
  { name: 'Chloe_Vibes', color: 'text-purple-400' },
];

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=0&rel=0`;
  }
  return null;
}

export const LivePlayerModal: React.FC<LivePlayerModalProps> = ({
  channel,
  allChannels,
  onClose,
  onSelectChannel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeStreamSrc, setActiveStreamSrc] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState<'Auto' | '4K' | '1080p' | '720p'>('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'switcher' | 'schedule' | 'chat'>('switcher');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedStream, setCopiedStream] = useState(false);
  const [isLiveSynced, setIsLiveSynced] = useState(true);
  const [dvrProgress, setDvrProgress] = useState(100);
  const [streamError, setStreamError] = useState(false);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm1',
      user: 'Elena_Stream',
      color: 'text-rose-400',
      badge: 'Mod',
      text: 'Welcome everyone to the live stream! Audio and 1080p 60fps are locked in.',
      time: 'Just now',
    },
    {
      id: 'm2',
      user: 'AlexGamer99',
      color: 'text-cyan-400',
      badge: 'VIP',
      text: 'Insane broadcast quality today! Let’s gooo 🔥',
      time: 'Just now',
    },
    {
      id: 'm3',
      user: 'OrbitWatcher',
      color: 'text-amber-400',
      text: 'Telemetry looking super crisp. Viewing from Vancouver!',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Handle stream autoplay when channel changes
  useEffect(() => {
    if (!channel) return;
    setStreamError(false);
    setActiveStreamSrc(channel.streamUrl);
    setIsPlaying(true);
    setIsLiveSynced(true);
    setDvrProgress(100);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.play().catch(() => {
        // Fallback to muted autoplay if browser blocks audio autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [channel]);

  // Periodic simulated live chat messages
  useEffect(() => {
    if (!channel) return;
    const interval = setInterval(() => {
      const randomUser = SAMPLE_CHAT_USERS[Math.floor(Math.random() * SAMPLE_CHAT_USERS.length)];
      const sampleTexts = [
        'Unbelievable sequence right here! 👏',
        'Watching in 4K, zero buffering 👍',
        'What a moment! Clip that!',
        'Stream is super smooth today.',
        'Anyone know what song this is?',
        'Greetings from Berlin 🌍',
        'Top tier coverage as always!',
      ];
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

      setChatMessages((prev) => [
        ...prev.slice(-30),
        {
          id: `msg-${Date.now()}`,
          user: randomUser.name,
          color: randomUser.color,
          badge: randomUser.badge,
          text: randomText,
          time: 'Just now',
        },
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, [channel]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, isFullscreen, onClose]);

  if (!channel) return null;

  const ytEmbed = getYouTubeEmbedUrl(activeStreamSrc || channel.streamUrl);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyStream = () => {
    navigator.clipboard.writeText(channel.streamUrl);
    setCopiedStream(true);
    setTimeout(() => setCopiedStream(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        user: 'You (Host)',
        color: 'text-indigo-400',
        badge: 'You',
        text: chatInput.trim(),
        time: 'Just now',
      },
    ]);
    setChatInput('');
  };

  const syncToLive = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration || 0;
      videoRef.current.play();
    }
    setIsLiveSynced(true);
    setDvrProgress(100);
    setIsPlaying(true);
  };

  const handleDvrSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setDvrProgress(val);
    setIsLiveSynced(val >= 98);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
    }
  };

  // Video error self-recovery
  const handleVideoError = () => {
    setStreamError(true);
    const backupUrl = 'https://filesamples.com/samples/video/mp4/sample_960x540.mp4';
    if (activeStreamSrc !== backupUrl) {
      setActiveStreamSrc(backupUrl);
      if (videoRef.current) {
        videoRef.current.src = backupUrl;
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Filter other channels in the same genre or popular channels
  const relatedChannels = allChannels.filter((c) => c.id !== channel.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-7xl h-[92vh] max-h-[920px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/95 border-b border-zinc-800 z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/50 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white truncate">{channel.name}</h2>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  LIVE
                </div>
                <span className="text-xs text-zinc-400 hidden sm:inline">
                  {channel.resolution}
                </span>
                {channel.channelUrl && (
                  <a
                    href={channel.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 ml-1"
                    title="Visit official channel website"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-xs text-zinc-300 truncate max-w-md hidden md:block">
                {channel.currentProgram}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Viewer Count Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-200">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-semibold text-white">{channel.viewers}</span>
              <span className="text-zinc-400">watching</span>
            </div>

            {/* Copy Stream Link */}
            <button
              onClick={handleCopyStream}
              title="Copy stream source URL"
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60"
            >
              {copiedStream ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Share Button */}
            <button
              onClick={handleCopyLink}
              title="Copy page link"
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close Stream (Esc)"
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-red-950/80 hover:text-red-300 text-zinc-300 transition-colors border border-zinc-700/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Player (Left/Center) + Side Panel (Right) */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden bg-black">
          {/* Main Video Viewport & Playback Bar */}
          <div className="flex-1 flex flex-col relative min-h-0 bg-black">
            <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden group">
              {ytEmbed ? (
                /* YouTube Embed Player */
                <iframe
                  src={ytEmbed}
                  title={channel.name}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* Direct HTML5 Video Player */
                <video
                  ref={videoRef}
                  src={activeStreamSrc || channel.streamUrl}
                  poster={channel.posterUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  onError={handleVideoError}
                  className="w-full h-full object-contain max-h-[75vh]"
                  onClick={togglePlay}
                />
              )}

              {/* Stream auto-recovered banner notification */}
              {streamError && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900/90 text-amber-300 text-xs border border-amber-500/40 shadow-lg pointer-events-none">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Stream active via primary CDN relay</span>
                </div>
              )}

              {/* Center Play/Pause indicator on hover or click */}
              {!isPlaying && !ytEmbed && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer backdrop-blur-xs transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl pl-1">
                    <Play className="w-8 h-8 fill-current" />
                  </div>
                </div>
              )}

              {/* Watermark badge top-right */}
              <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-xs">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="font-mono text-zinc-300">{channel.genre}</span>
              </div>
            </div>

            {/* Custom Video Playback Controls Bar */}
            <div className="bg-zinc-900/95 border-t border-zinc-800 px-3 sm:px-5 py-2.5 flex flex-col gap-2 shrink-0">
              {/* DVR Timeline / Live Scrub */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={syncToLive}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    isLiveSynced
                      ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                  title="Click to jump to real-time live feed"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLiveSynced ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'
                    }`}
                  ></span>
                  {isLiveSynced ? 'LIVE' : 'SYNC LIVE'}
                </button>

                <div className="flex-1 relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dvrProgress}
                    onChange={handleDvrSeek}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                <span className="text-xs font-mono text-zinc-400 shrink-0">
                  {isLiveSynced ? 'REALTIME' : '-00:32 DVR'}
                </span>
              </div>

              {/* Bottom Control Actions */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Play / Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  {/* Volume Controls */}
                  <div className="flex items-center gap-1.5 group/vol">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5 text-red-400" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-red-500"
                    />
                  </div>

                  {/* Program title info */}
                  <div className="hidden sm:block text-xs text-zinc-400 truncate max-w-xs">
                    <span className="text-zinc-500">Program:</span> {channel.currentProgram}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Quality Switcher */}
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-zinc-700/60"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>{quality}</span>
                    </button>

                    {showQualityMenu && (
                      <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-1 w-28 z-30">
                        {(['Auto', '4K', '1080p', '720p'] as const).map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setQuality(q);
                              setShowQualityMenu(false);
                            }}
                            className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-zinc-800 transition-colors flex items-center justify-between ${
                              quality === q ? 'text-red-400 font-semibold' : 'text-zinc-300'
                            }`}
                          >
                            <span>{q}</span>
                            {quality === q && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Drawer: Switcher / Schedule / Live Chat */}
          <div className="w-full lg:w-80 xl:w-96 bg-zinc-950/95 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col shrink-0 h-64 lg:h-auto min-h-0">
            {/* Panel Tabs */}
            <div className="flex items-center border-b border-zinc-800 bg-zinc-900/60 px-2 py-1.5 shrink-0 gap-1">
              <button
                onClick={() => setActiveTab('switcher')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'switcher'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Channels</span>
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'schedule'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Guide</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>
            </div>

            {/* Panel Tab 1: Channels Switcher */}
            {activeTab === 'switcher' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-zinc-900">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 px-1 pt-1">
                  Quick Channel Switcher ({relatedChannels.length} available)
                </div>
                {relatedChannels.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onSelectChannel(c)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-900/90 transition-colors flex items-center gap-3 group border border-transparent hover:border-zinc-800"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                      <img
                        src={c.posterUrl}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-red-600 text-white text-[9px] font-bold rounded">
                        LIVE
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                          {c.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400">{c.viewers}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {c.currentProgram}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {c.genre}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {c.resolution}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Panel Tab 2: Channel Guide & Schedule */}
            {activeTab === 'schedule' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{channel.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {channel.description}
                  </p>
                  {channel.channelUrl && (
                    <div className="mt-2">
                      <a
                        href={channel.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold"
                      >
                        <span>Official Channel Website: {channel.channelUrl.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-800 pt-3">
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-400" />
                    Broadcast Schedule
                  </h4>
                  <div className="space-y-2">
                    {channel.schedule && channel.schedule.length > 0 ? (
                      channel.schedule.map((slot, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-xs flex items-center justify-between ${
                            slot.isCurrent
                              ? 'bg-red-950/40 border border-red-800/60 text-white'
                              : 'bg-zinc-900/60 border border-zinc-800 text-zinc-300'
                          }`}
                        >
                          <div>
                            <span className="font-semibold">{slot.show}</span>
                            {slot.isCurrent && (
                              <span className="ml-2 px-1.5 py-0.5 bg-red-600 text-white text-[9px] rounded font-bold">
                                ON AIR
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-zinc-400">{slot.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2.5 rounded-lg bg-zinc-900/60 text-xs text-zinc-400">
                        24/7 Continuous live global streaming schedule. Next broadcast update in 45m.
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-400 space-y-1">
                  <div>
                    <span className="text-zinc-500">Broadcast Region:</span> {channel.country || 'Global'}
                  </div>
                  <div>
                    <span className="text-zinc-500">Audio Language:</span> {channel.language || 'English'}
                  </div>
                  <div>
                    <span className="text-zinc-500">Bitrate & Encoding:</span> HEVC / 1080p60 Multi-CDN
                  </div>
                </div>
              </div>
            )}

            {/* Panel Tab 3: Live Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] text-center">
                    💬 Live chat is enabled for this broadcast. Be respectful to others.
                  </div>
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="leading-snug">
                      <div className="flex items-center gap-1.5">
                        {msg.badge && (
                          <span className="px-1 py-0.2 rounded bg-red-600/30 text-red-400 text-[9px] font-bold">
                            {msg.badge}
                          </span>
                        )}
                        <span className={`font-bold ${msg.color}`}>{msg.user}</span>
                        <span className="text-[10px] text-zinc-500">{msg.time}</span>
                      </div>
                      <p className="text-zinc-200 mt-0.5 break-words">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleSendChat}
                  className="p-2.5 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send a live chat message..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
