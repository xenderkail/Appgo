import { WebApp } from '../types';
import { INITIAL_APPS } from '../data/seedApps';

const STORAGE_KEY_APPS = 'appgo_catalog_apps_v3';
const STORAGE_KEY_V2 = 'appgo_catalog_apps_v2';
const STORAGE_KEY_LEGACY = 'appgo_catalog_apps_v1';
const STORAGE_KEY_FAVORITES = 'appgo_favorite_ids_v2';
const STORAGE_KEY_THEME = 'appgo_theme_mode';

export function loadStoredApps(): WebApp[] {
  try {
    const rawV3 = localStorage.getItem(STORAGE_KEY_APPS);
    if (rawV3) {
      const parsed = JSON.parse(rawV3);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Check if user had custom apps in v2 or v1 to preserve
    const rawV2 = localStorage.getItem(STORAGE_KEY_V2) || localStorage.getItem(STORAGE_KEY_LEGACY);
    if (rawV2) {
      const parsedPrev = JSON.parse(rawV2);
      if (Array.isArray(parsedPrev) && parsedPrev.length > 0) {
        // Find custom apps created by user (e.g. id doesn't match default app-* prefix or is custom)
        const customUserApps = parsedPrev.filter(
          (p: WebApp) => !INITIAL_APPS.some((init) => init.id === p.id)
        );
        const merged = [...customUserApps, ...INITIAL_APPS];
        saveApps(merged);
        return merged;
      }
    }

    // Default initialization with real verified apps
    saveApps(INITIAL_APPS);
    return INITIAL_APPS;
  } catch (err) {
    console.error('Failed to parse stored apps from localStorage:', err);
    return INITIAL_APPS;
  }
}

export function saveApps(apps: WebApp[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save apps to localStorage:', err);
  }
}

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (!raw) return ['app-psx-emulator', 'app-photopea', 'app-excalidraw', 'app-carbon-code'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

export function saveFavorites(favs: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favs));
  } catch (err) {
    console.error('Failed to save favorites:', err);
  }
}

export function loadTheme(): 'dark' | 'light' {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_THEME);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch {
    // Ignore error
  }
}

/**
 * Triggers JSON download of the current app catalogue
 */
export function exportAppsToJson(apps: WebApp[]): void {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    generator: 'AppGo Web App Directory',
    count: apps.length,
    apps,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStamp = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `appgo-catalog-${dateStamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Generates and triggers download for an app launcher shortcut or package
 */
export function triggerAppDownload(app: WebApp): void {
  if (app.downloadUrl && app.downloadUrl.trim().length > 0) {
    const link = document.createElement('a');
    link.href = app.downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = '';
    document.body.appendChild(link);
    link.click();
    link.remove();
    return;
  }

  // Fallback: Generate an instant Desktop Web Launcher (.html launcher with offline splash and redirect)
  const launcherHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${app.title} - AppGo Launcher</title>
  <meta http-equiv="refresh" content="1; url=${app.url}">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; max-width: 420px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    h1 { margin: 0 0 0.5rem 0; font-size: 1.5rem; }
    p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.5; }
    .btn { background: #6366f1; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block; transition: background 0.2s; }
    .btn:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Launching ${app.title}</h1>
    <p>${app.tagline}</p>
    <a class="btn" href="${app.url}" target="_blank">Open Web Application &rarr;</a>
  </div>
</body>
</html>`;

  const blob = new Blob([launcherHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeFilename = app.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  a.href = url;
  a.download = `${safeFilename}-launcher.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
