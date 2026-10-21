export type NavTab = 'home' | 'shortcuts' | 'store' | 'hub' | 'curated' | 'social';

export type AppCategory =
  | 'All'
  | 'AI Tools'
  | 'Utilities'
  | 'Productivity'
  | 'Generators'
  | 'Media'
  | 'Developer'
  | 'Other';

export interface WebApp {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: Exclude<AppCategory, 'All'>;
  url: string;
  iconType: 'emoji' | 'image' | 'preset';
  iconValue: string;
  downloadUrl?: string;
  version: string;
  changelog: string;
  tags: string[];
  author?: string;
  rating: number;
  launches: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'recent' | 'rating' | 'launches' | 'name-asc' | 'name-desc';

export type ViewMode = 'grid' | 'list';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  sourceIcon?: string;
  url: string;
  imageUrl: string;
  timeAgo: string;
  readTime: string;
  featured?: boolean;
  author?: string;
}

export type LiveGenre =
  | 'All'
  | 'News'
  | 'Sports'
  | 'Entertainment'
  | 'Gaming'
  | 'Science & Nature'
  | 'Music & Lo-Fi'
  | 'Tech';

export interface LiveProgramSchedule {
  time: string;
  show: string;
  isCurrent?: boolean;
}

export interface LiveChannel {
  id: string;
  name: string;
  tagline: string;
  genre: Exclude<LiveGenre, 'All'>;
  logo: string;
  currentProgram: string;
  description: string;
  viewers: string;
  viewersCount: number;
  resolution: '4K' | '1080p 60' | '1080p' | '720p';
  streamUrl: string;
  channelUrl?: string;
  videoType?: 'html5' | 'embed';
  embedUrl?: string;
  posterUrl: string;
  featured?: boolean;
  country?: string;
  language?: string;
  isCustom?: boolean;
  schedule?: LiveProgramSchedule[];
}

export interface ReelComment {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
}

export interface ReelItem {
  id: string;
  title: string;
  category?: string;
  platform?: string;
  creator: string;
  creatorHandle: string;
  avatarUrl: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoType?: 'html5' | 'youtube';
  platformUrl?: string;
  views: string;
  likes: string;
  duration: string;
  tags: string[];
  soundTitle?: string;
  commentsCount?: string;
  sharesCount?: string;
  bookmarksCount?: string;
  comments?: ReelComment[];
}

export type SocialCategory = 'All' | 'Mainstream' | 'Tech & Dev' | 'Communities' | 'Video & Stream' | 'Custom';

export interface SocialPlatform {
  id: string;
  name: string;
  handle?: string;
  tagline: string;
  category: Exclude<SocialCategory, 'All'>;
  url: string;
  icon: string; // preset icon or image or emoji
  brandColor: string;
  badge?: string;
  isCustom?: boolean;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isSpeedDial?: boolean;
  isLoading?: boolean;
  history: string[];
  historyIndex: number;
}

export interface SpeedDialItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category: 'ai' | 'social' | 'entertainment' | 'dev' | 'tools' | 'custom' | 'news' | 'pinned';
  color?: string;
  tagline?: string;
  type?: string;
  badge?: string;
  isCustom?: boolean;
}

export type SidebarPanelType = 'none' | 'aria' | 'social' | 'player' | 'bookmarks' | 'history' | 'settings';

