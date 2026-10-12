import React, { useState } from 'react';
import {
  ExternalLink,
  Info,
  X,
  Code,
  Check,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  className?: string;
}

interface SponsorAd {
  id: string;
  brand: string;
  tagline: string;
  headline: string;
  description: string;
  url: string;
  badge: string;
  buttonText: string;
  iconBg: string;
  logoText: string;
}

const SAMPLE_ADS: SponsorAd[] = [
  {
    id: 'ad-google-cloud',
    brand: 'Google Cloud Platform',
    tagline: 'google.com/cloud/free',
    headline: 'Build & Scale Intelligent Web Apps on Google Cloud',
    description: 'Get $300 in free credits and 20+ always-free products. Deploy containerized web services with zero server maintenance.',
    url: 'https://cloud.google.com',
    badge: 'Cloud Hosting',
    buttonText: 'Claim $300 Credits',
    iconBg: 'from-blue-600 to-indigo-600',
    logoText: 'GCP',
  },
  {
    id: 'ad-vercel',
    brand: 'Vercel Edge Platform',
    tagline: 'vercel.com/deploy',
    headline: 'Deploy Instant Global Next.js & React Web Apps',
    description: 'Automatic CI/CD git deployments, serverless functions, and instant global CDN invalidation.',
    url: 'https://vercel.com',
    badge: 'Web Deployment',
    buttonText: 'Deploy Now Free',
    iconBg: 'from-slate-900 to-zinc-800',
    logoText: '▲',
  },
  {
    id: 'ad-github',
    brand: 'GitHub Enterprise',
    tagline: 'github.com/features/copilot',
    headline: 'Accelerate Development with GitHub Copilot AI',
    description: 'Turn natural language prompts into working code. Trusted by millions of software developers and open source teams.',
    url: 'https://github.com',
    badge: 'Developer Tools',
    buttonText: 'Start Free Trial',
    iconBg: 'from-purple-600 to-indigo-700',
    logoText: 'GH',
  },
];

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = 'home-bottom-responsive',
  className = '',
}) => {
  const [adIndex, setAdIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showCodeSetup, setShowCodeSetup] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [publisherId, setPublisherId] = useState('ca-pub-9847120394857291');
  const [adSlotNumber, setAdSlotNumber] = useState('5839201948');

  if (isDismissed) {
    return (
      <div className="py-2 text-center text-xs text-slate-400">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
        >
          Show Sponsor Banner
        </button>
      </div>
    );
  }

  const currentAd = SAMPLE_ADS[adIndex % SAMPLE_ADS.length];

  const adsenseSnippet = `<!-- Google AdSense Unit (Place in public/index.html or component) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${publisherId}"
     data-ad-slot="${adSlotNumber}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(adsenseSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <aside
      aria-label="Sponsored Advertisement"
      className={`my-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}
    >
      {/* Top Meta Bar */}
      <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
            Advertisement
          </span>
          <span>·</span>
          <a
            href="https://www.google.com/adsense/start/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <span>Google AdSense</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCodeSetup(!showCodeSetup)}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            title="Configure your live Google AdSense Publisher ID"
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">AdSense Config</span>
          </button>
          <span>·</span>
          <button
            onClick={() => setAdIndex((prev) => (prev + 1) % SAMPLE_ADS.length)}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            title="Next Sponsor"
          >
            Switch Ad
          </button>
          <span>·</span>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Hide Advertisement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional AdSense Code Setup Drawer */}
      {showCodeSetup && (
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs animate-slideDown">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Live Google AdSense Integration Settings
            </h4>
            <span className="text-[10px] text-slate-500">Ready for Vercel / Production</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">
            Enter your Google AdSense Publisher ID & Ad Slot number. When deployed, Google serves automated banner ads to monetize traffic.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Publisher ID (ca-pub-XXXXXXXX)
              </label>
              <input
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ad Slot ID (10 digits)
              </label>
              <input
                type="text"
                value={adSlotNumber}
                onChange={(e) => setAdSlotNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition text-xs shadow-xs"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Ad Snippet Copied!' : 'Copy AdSense Tag Snippet'}</span>
            </button>
            <button
              onClick={() => setShowCodeSetup(false)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Main Sponsor Card (Responsive Leaderboard format) */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Brand Avatar / Logo */}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${currentAd.iconBg} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md`}
          >
            {currentAd.logoText}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {currentAd.brand}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold">
                {currentAd.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {currentAd.tagline}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {currentAd.headline}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {currentAd.description}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <a
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition active:scale-[0.98]"
          >
            <span>{currentAd.buttonText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
};
