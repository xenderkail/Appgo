import React from 'react';
import {
  Sparkles,
  Shapes,
  Scissors,
  Palette,
  Code2,
  Presentation,
  Binary,
  Bot,
  Wrench,
  Gauge,
  Layers,
  Cpu,
  Terminal,
  FileCode,
  Compass,
  Zap,
  Globe,
  Radio,
  Sliders,
  FolderGit2,
  Bookmark,
  Gamepad2,
  ShoppingBag,
  Shield,
  Search,
  Image,
  LucideIcon,
} from 'lucide-react';

export const PRESET_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Shapes,
  Scissors,
  Palette,
  Code2,
  Presentation,
  Binary,
  Bot,
  Wrench,
  Gauge,
  Layers,
  Cpu,
  Terminal,
  FileCode,
  Compass,
  Zap,
  Globe,
  Radio,
  Sliders,
  FolderGit2,
  Bookmark,
  Gamepad2,
  ShoppingBag,
  Shield,
  Search,
  Image,
};

export const PRESET_ICON_NAMES = Object.keys(PRESET_ICONS);

export const PRESET_EMOJIS = [
  '⚡', '✨', '🚀', '🛠️', '🎨', '💻', '🔮', '📊', 
  '📝', '🔍', '⚙️', '🌐', '🧩', '💡', '🔥', '🎯'
];

interface IconRendererProps {
  type: 'emoji' | 'image' | 'preset';
  value: string;
  className?: string;
  fallbackIcon?: LucideIcon;
}

export const AppIconRenderer: React.FC<IconRendererProps> = ({
  type,
  value,
  className = 'w-6 h-6',
  fallbackIcon: Fallback = Zap,
}) => {
  if (type === 'emoji') {
    return (
      <span className="flex items-center justify-center select-none text-2xl leading-none" role="img" aria-label="app-icon">
        {value || '⚡'}
      </span>
    );
  }

  if (type === 'image') {
    return (
      <img
        src={value}
        alt="App icon"
        className={`${className} object-cover rounded-lg`}
        onError={(e) => {
          // If image fails, replace with fallback
          const target = e.currentTarget;
          target.style.display = 'none';
          if (target.parentElement) {
            const fallbackEl = target.parentElement.querySelector('.img-fallback');
            if (fallbackEl) (fallbackEl as HTMLElement).style.display = 'flex';
          }
        }}
      />
    );
  }

  // Preset icon
  const IconComponent = PRESET_ICONS[value] || Fallback;
  return <IconComponent className={className} />;
};
