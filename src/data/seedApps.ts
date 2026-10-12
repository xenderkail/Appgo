import { WebApp } from '../types';

export const INITIAL_APPS: WebApp[] = [
  // --- AI TOOLS ---
  {
    id: 'app-huggingchat',
    title: 'HuggingChat Open AI',
    tagline: 'Open-source conversational AI assistant by Hugging Face',
    description:
      'HuggingChat provides free access to top open-source large language models including Llama, DeepSeek, and Mistral. Clean interface for coding assistance, reasoning, and document drafting.',
    category: 'AI Tools',
    url: 'https://huggingface.co/chat',
    iconType: 'preset',
    iconValue: 'Bot',
    downloadUrl: '',
    version: 'v2.6.0',
    changelog: `### v2.6.0 (Latest)
- Support for DeepSeek and Llama 3 models
- Web search grounding capabilities
- Community assistant prompts marketplace`,
    tags: ['AI', 'LLM', 'OpenSource', 'Chat', 'Productivity'],
    author: 'Hugging Face Inc',
    rating: 4.9,
    launches: 3410,
    isFeatured: true,
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-01T14:30:00Z',
  },
  {
    id: 'app-phind-ai',
    title: 'Phind Developer Search',
    tagline: 'Conversational search engine & intelligent coding assistant',
    description:
      'Engineered specifically for programmers. Combines live web scraping of technical documentation with powerful reasoning models to provide concise, tested code answers with source links.',
    category: 'AI Tools',
    url: 'https://www.phind.com',
    iconType: 'preset',
    iconValue: 'Terminal',
    downloadUrl: '',
    version: 'v3.2.0',
    changelog: `### v3.2.0 (Latest)
- Instant GitHub repository code indexing
- Terminal command line debugging suggestions
- Fast stream latency enhancements`,
    tags: ['AI', 'Developer', 'Code', 'Search', 'Programming'],
    author: 'Phind AI',
    rating: 4.8,
    launches: 2190,
    isFeatured: true,
    createdAt: '2026-07-10T11:00:00Z',
    updatedAt: '2026-09-24T16:00:00Z',
  },
  {
    id: 'app-perplexity',
    title: 'Perplexity Research Engine',
    tagline: 'Real-time conversational search with cited sources',
    description:
      'Next-generation search platform that answers questions directly with footnoted citations from across the web. Perfect for research, news summaries, and technical problem solving.',
    category: 'AI Tools',
    url: 'https://www.perplexity.ai',
    iconType: 'preset',
    iconValue: 'Sparkles',
    downloadUrl: '',
    version: 'v4.1.0',
    changelog: `### v4.1.0 (Latest)
- Pro search multi-step deep research
- File upload PDF document interrogation
- Collections feature for shared research notes`,
    tags: ['AI', 'Search', 'Research', 'Citations', 'Knowledge'],
    author: 'Perplexity AI',
    rating: 4.9,
    launches: 4120,
    isFeatured: true,
    createdAt: '2026-06-25T09:30:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
  },

  // --- UTILITIES ---
  {
    id: 'app-cyberchef',
    title: 'CyberChef Cyber Swiss Army Knife',
    tagline: 'The essential cyber utility for encryption, encoding, and data parsing',
    description:
      'Created by GCHQ, CyberChef is a web app for carrying out all manner of "cyber" operations within your web browser. Includes AES encryption, Base64/Hex encoding, hashing, regex parsing, and decompression.',
    category: 'Utilities',
    url: 'https://gchq.github.io/CyberChef',
    iconType: 'preset',
    iconValue: 'Wrench',
    downloadUrl: 'https://github.com/gchq/CyberChef/archive/refs/heads/master.zip',
    version: 'v10.19.4',
    changelog: `### v10.19.4 (Latest)
- Added modern cryptographic cipher suites
- Batch processing improvements
- 100% client-side privacy`,
    tags: ['Security', 'Encryption', 'Encoding', 'Hashing', 'Utility'],
    author: 'GCHQ Open Source',
    rating: 4.9,
    launches: 3820,
    isFeatured: true,
    createdAt: '2026-05-14T08:00:00Z',
    updatedAt: '2026-09-29T10:15:00Z',
  },
  {
    id: 'app-coolors',
    title: 'Coolors Palette Studio',
    tagline: 'The super fast color palettes generator for designers and developers',
    description:
      'Generate harmonious color palettes with the press of the spacebar. Inspect color contrast, simulate color blindness, and export color schemes to CSS, SVG, PDF, or Tailwind variables.',
    category: 'Utilities',
    url: 'https://coolors.co',
    iconType: 'preset',
    iconValue: 'Palette',
    downloadUrl: '',
    version: 'v4.5.0',
    changelog: `### v4.5.0 (Latest)
- OKLCH and APCA contrast rating engine
- One-click copy CSS root variables
- Gradient generator palette blending`,
    tags: ['Colors', 'Design', 'CSS', 'Palette', 'Contrast'],
    author: 'Coolors Inc',
    rating: 4.8,
    launches: 2950,
    isFeatured: false,
    createdAt: '2026-08-01T15:00:00Z',
    updatedAt: '2026-09-18T16:20:00Z',
  },
  {
    id: 'app-convertio',
    title: 'Convertio Universal Converter',
    tagline: 'In-browser converter supporting 300+ document, video, and audio formats',
    description:
      'Fast, simple file conversion supporting PDF to Word, video compression, audio transcode, image conversion, and archive extraction with zero software installation.',
    category: 'Utilities',
    url: 'https://convertio.co',
    iconType: 'preset',
    iconValue: 'Sliders',
    downloadUrl: '',
    version: 'v2.8.0',
    changelog: `### v2.8.0 (Latest)
- Fast cloud parallel processing engine
- AVIF and WebP high efficiency compression
- OCR text recognition for scanned PDFs`,
    tags: ['Converter', 'Files', 'PDF', 'Video', 'Utility'],
    author: 'Convertio',
    rating: 4.7,
    launches: 1980,
    isFeatured: false,
    createdAt: '2026-06-18T14:00:00Z',
    updatedAt: '2026-09-20T17:30:00Z',
  },

  // --- PRODUCTIVITY ---
  {
    id: 'app-excalidraw',
    title: 'Excalidraw Virtual Whiteboard',
    tagline: 'Collaborative virtual whiteboard with a distinct hand-drawn aesthetic',
    description:
      'Draw architectural diagrams, wireframes, and workflows with an organic sketchbook style. Features infinite canvas, end-to-end encryption, export to PNG/SVG, and team collaboration.',
    category: 'Productivity',
    url: 'https://excalidraw.com',
    iconType: 'preset',
    iconValue: 'Presentation',
    downloadUrl: '',
    version: 'v0.17.6',
    changelog: `### v0.17.6 (Latest)
- Mermaid.js text diagram syntax parsing
- Enhanced laser pointer presentation mode
- Custom library community assets browser`,
    tags: ['Whiteboard', 'Diagrams', 'Collaboration', 'Productivity', 'Design'],
    author: 'Excalidraw Open Source',
    rating: 4.9,
    launches: 4890,
    isFeatured: true,
    createdAt: '2026-07-04T14:00:00Z',
    updatedAt: '2026-09-12T10:00:00Z',
  },
  {
    id: 'app-stackedit',
    title: 'StackEdit Markdown Editor',
    tagline: 'In-browser Markdown editor with live preview, KaTeX, and synchronization',
    description:
      'A full-featured open-source Markdown editor running entirely in the browser. Features synchronized scroll preview, LaTeX math formula rendering, and direct publishing to GitHub or Google Drive.',
    category: 'Productivity',
    url: 'https://stackedit.io/app',
    iconType: 'preset',
    iconValue: 'FileCode',
    downloadUrl: '',
    version: 'v5.14.0',
    changelog: `### v5.14.0 (Latest)
- Offline cache support with service worker
- Mermaid sequence and flowchart rendering
- Instant HTML and PDF export`,
    tags: ['Markdown', 'Writing', 'Editor', 'LaTeX', 'Notes'],
    author: 'StackEdit Core',
    rating: 4.8,
    launches: 2140,
    isFeatured: false,
    createdAt: '2026-05-02T10:00:00Z',
    updatedAt: '2026-10-02T11:00:00Z',
  },
  {
    id: 'app-pomofocus',
    title: 'Pomofocus Work Interval Timer',
    tagline: 'Customizable Pomodoro timer that helps you focus on any task',
    description:
      'Clean interval timer designed to increase productivity and eliminate burnout. Break work down into manageable 25-minute intervals with customized alarm chimes and daily task lists.',
    category: 'Productivity',
    url: 'https://pomofocus.io',
    iconType: 'preset',
    iconValue: 'Zap',
    downloadUrl: '',
    version: 'v2.1.2',
    changelog: `### v2.1.2 (Latest)
- Task estimated vs actual pomodoro counter
- Dark and minimalist color scheme options
- Browser desktop notification bells`,
    tags: ['Focus', 'Pomodoro', 'Timer', 'Productivity', 'Tasks'],
    author: 'Pomofocus Studio',
    rating: 4.8,
    launches: 3120,
    isFeatured: false,
    createdAt: '2026-06-08T16:00:00Z',
    updatedAt: '2026-09-22T13:40:00Z',
  },

  // --- GENERATORS ---
  {
    id: 'app-svgomg',
    title: 'SVGOMG Vector Optimizer',
    tagline: 'Web GUI for SVGO to optimize, sanitize and minify SVG code',
    description:
      'Clean up bloated SVG vector exports from Illustrator and Figma. Strip editor metadata, convert shapes to compact paths, remove unnecessary precision decimals, and copy clean JSX.',
    category: 'Generators',
    url: 'https://jakearchibald.github.io/svgomg/',
    iconType: 'preset',
    iconValue: 'Shapes',
    downloadUrl: '',
    version: 'v2.2.0',
    changelog: `### v2.2.0 (Latest)
- Live visual comparison slider against original
- Gzip byte savings estimation indicator
- Copy directly as React JSX element`,
    tags: ['SVG', 'Optimizer', 'Vector', 'Icons', 'Minify'],
    author: 'Jake Archibald',
    rating: 4.9,
    launches: 2840,
    isFeatured: true,
    createdAt: '2026-07-20T08:00:00Z',
    updatedAt: '2026-09-28T11:15:00Z',
  },
  {
    id: 'app-jsoncrack',
    title: 'JSON Crack Interactive Visualizer',
    tagline: 'Seamlessly visualize JSON data into interactive graph nodes',
    description:
      'Turn confusing nested JSON structures into beautiful, interactive, zoomable node graphs. Understand complex API payloads, schemas, and relational trees in seconds.',
    category: 'Generators',
    url: 'https://jsoncrack.com/editor',
    iconType: 'preset',
    iconValue: 'Binary',
    downloadUrl: '',
    version: 'v3.5.0',
    changelog: `### v3.5.0 (Latest)
- Search filter to highlight specific node keys
- Export graph as high-resolution PNG or SVG
- YAML, XML, and CSV input format parser`,
    tags: ['JSON', 'Graph', 'Visualization', 'API', 'Developer'],
    author: 'JSON Crack Open',
    rating: 4.9,
    launches: 3670,
    isFeatured: true,
    createdAt: '2026-08-05T12:00:00Z',
    updatedAt: '2026-09-25T14:10:00Z',
  },
  {
    id: 'app-qrcodemonkey',
    title: 'QRCode Monkey Studio',
    tagline: 'High resolution custom QR code generator with logo embedding',
    description:
      'Create custom QR codes with color gradients, unique corner styles, and embedded company or personal logos. High error correction ensures fast scanning from physical cards and banners.',
    category: 'Generators',
    url: 'https://www.qrcode-monkey.com',
    iconType: 'preset',
    iconValue: 'Shapes',
    downloadUrl: '',
    version: 'v3.1.0',
    changelog: `### v3.1.0 (Latest)
- Vector SVG and PDF print ready download
- Wi-Fi credentials one-tap scan configuration
- vCard contact badge generator`,
    tags: ['QR Code', 'Generator', 'Design', 'Vector', 'Print'],
    author: 'QRCode Monkey',
    rating: 4.8,
    launches: 2450,
    isFeatured: false,
    createdAt: '2026-07-15T15:00:00Z',
    updatedAt: '2026-09-30T09:20:00Z',
  },

  // --- MEDIA ---
  {
    id: 'app-photopea',
    title: 'Photopea Online Photo Studio',
    tagline: 'Advanced web-based photo editor supporting PSD, XCF, Sketch, and RAW',
    description:
      'A full-fledged Photoshop alternative in your web browser. Supports layers, blend modes, masks, smart filters, brush engines, and vectors with zero installation needed.',
    category: 'Media',
    url: 'https://www.photopea.com',
    iconType: 'preset',
    iconValue: 'Image',
    downloadUrl: '',
    version: 'v5.4.0',
    changelog: `### v5.4.0 (Latest)
- Full support for Adobe Photoshop PSD smart objects
- WebGL GPU canvas hardware acceleration
- RAW camera profile correction profiles`,
    tags: ['Photo Editor', 'Design', 'PSD', 'Graphics', 'Media'],
    author: 'Ivan Kutskir',
    rating: 4.9,
    launches: 5320,
    isFeatured: true,
    createdAt: '2026-06-11T12:00:00Z',
    updatedAt: '2026-10-05T09:40:00Z',
  },
  {
    id: 'app-audiomass',
    title: 'AudioMass Waveform Studio',
    tagline: 'Client-side waveform audio editor with filters, trim, and effects',
    description:
      'Full waveform editor running entirely in the browser using the Web Audio API. Record or upload MP3/WAV files to cut, fade, apply reverb, normalize volume, and export in seconds.',
    category: 'Media',
    url: 'https://audiomass.co',
    iconType: 'preset',
    iconValue: 'Radio',
    downloadUrl: '',
    version: 'v1.4.1',
    changelog: `### v1.4.1 (Latest)
- Multi-track timeline selection
- Real-time frequency spectrum visualizer
- Non-destructive volume envelope shaping`,
    tags: ['Audio', 'Editor', 'Waveform', 'Sound', 'Recording'],
    author: 'AudioMass Open',
    rating: 4.8,
    launches: 1780,
    isFeatured: false,
    createdAt: '2026-07-28T10:00:00Z',
    updatedAt: '2026-09-19T15:00:00Z',
  },
  {
    id: 'app-squoosh',
    title: 'Squoosh WebAssembly Compressor',
    tagline: 'Google Chrome Labs image compression and format converter',
    description:
      'Reduce file size and convert images using modern WebAssembly encoders (MozJPEG, WebP, AVIF, OxiPNG). Visual side-by-side comparison slider lets you dial in the exact compression balance.',
    category: 'Media',
    url: 'https://squoosh.app',
    iconType: 'preset',
    iconValue: 'Scissors',
    downloadUrl: '',
    version: 'v2.1.0',
    changelog: `### v2.1.0 (Latest)
- AVIF modern codec compression support
- Offline service worker PWA capability
- High resolution Retina canvas rendering`,
    tags: ['Images', 'Compressor', 'WebP', 'AVIF', 'Media'],
    author: 'Google Chrome Labs',
    rating: 4.9,
    launches: 3890,
    isFeatured: true,
    createdAt: '2026-05-20T14:30:00Z',
    updatedAt: '2026-09-27T11:45:00Z',
  },

  // --- DEVELOPER ---
  {
    id: 'app-carbon-code',
    title: 'Carbon Code Screenshots',
    tagline: 'Create and share beautiful images of your source code',
    description:
      'The gold standard for code snippet graphics. Customize syntax highlight themes, fonts, macOS window chrome, background gradients, and export directly as PNG, SVG, or tweet.',
    category: 'Developer',
    url: 'https://carbon.now.sh',
    iconType: 'preset',
    iconValue: 'Code2',
    downloadUrl: '',
    version: 'v3.6.0',
    changelog: `### v3.6.0 (Latest)
- 4K Retina PNG clipboard copy
- Line number and highlight range selectors
- Presets sync with GitHub Gist`,
    tags: ['Code', 'Screenshots', 'Developer', 'Syntax', 'Design'],
    author: 'Carbon Team',
    rating: 4.9,
    launches: 4420,
    isFeatured: true,
    createdAt: '2026-05-19T09:00:00Z',
    updatedAt: '2026-09-30T18:00:00Z',
  },
  {
    id: 'app-regex101',
    title: 'Regex101 Regular Expressions',
    tagline: 'Interactive regex tester, debugger, and syntax explanation engine',
    description:
      'Test and debug regular expressions for PCRE, JavaScript, Python, and Golang. Color-coded capture groups, catastrophic backtracking detector, and step-by-step breakdown.',
    category: 'Developer',
    url: 'https://regex101.com',
    iconType: 'preset',
    iconValue: 'Terminal',
    downloadUrl: '',
    version: 'v2.4.0',
    changelog: `### v2.4.0 (Latest)
- Regex code generator in 10 languages
- Unit test suite feature for expression validation
- Library of community verified expressions`,
    tags: ['Regex', 'Developer', 'Debugging', 'JavaScript', 'PCRE'],
    author: 'Firas Dib',
    rating: 4.9,
    launches: 5120,
    isFeatured: true,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-09-26T16:20:00Z',
  },
  {
    id: 'app-transform-tools',
    title: 'Transform.tools Polyglot',
    tagline: 'Polyglot converter: JSON to TypeScript, Zod, GraphQL, and CSS',
    description:
      'Transform anything into anything! Convert JSON into TypeScript interfaces, Zod validation schemas, JSDoc, Rust structs, Kotlin data classes, and SVG into React JSX elements.',
    category: 'Developer',
    url: 'https://transform.tools',
    iconType: 'preset',
    iconValue: 'Binary',
    downloadUrl: '',
    version: 'v1.8.0',
    changelog: `### v1.8.0 (Latest)
- Support for Zod, Valibot, and TypeBox schemas
- CSS to Tailwind v4 converter module
- HTML to clean Markdown extractor`,
    tags: ['TypeScript', 'Zod', 'JSON', 'Converter', 'Developer'],
    author: 'Ritz078 Open Source',
    rating: 4.9,
    launches: 3260,
    isFeatured: false,
    createdAt: '2026-08-22T17:30:00Z',
    updatedAt: '2026-10-08T13:45:00Z',
  },
  {
    id: 'app-diffchecker',
    title: 'Diffchecker Comparison Studio',
    tagline: 'Compare text, code, images, and PDFs to find differences',
    description:
      'Find the difference between two text files, code snippets, or images. Features split-screen side-by-side view, inline diff highlights, and character-by-character accuracy.',
    category: 'Developer',
    url: 'https://www.diffchecker.com',
    iconType: 'preset',
    iconValue: 'FileCode',
    downloadUrl: '',
    version: 'v3.2.0',
    changelog: `### v3.2.0 (Latest)
- Image pixel-by-pixel diff slider
- PDF document text comparison
- Dark mode high contrast code themes`,
    tags: ['Diff', 'Code', 'Text', 'Compare', 'Developer'],
    author: 'Diffchecker Inc',
    rating: 4.8,
    launches: 2410,
    isFeatured: false,
    createdAt: '2026-07-01T13:00:00Z',
    updatedAt: '2026-10-04T12:00:00Z',
  },

  // --- OTHER (INCLUDING RETRO & EMULATORS LIKE PSX) ---
  {
    id: 'app-psx-emulator',
    title: 'PlayStation (PSX) Online Retro Vault',
    tagline: 'In-browser retro gaming emulator for classic PSX and 32-bit titles',
    description:
      'Play and explore classic PlayStation 1 (PSX) retro games directly in your browser. Supports save states, controller gamepad input, full screen mode, and custom key bindings.',
    category: 'Other',
    url: 'https://www.emulatorgames.net/playstation-roms/',
    iconType: 'preset',
    iconValue: 'Gamepad2',
    downloadUrl: '',
    version: 'v3.0.0',
    changelog: `### v3.0.0 (Latest)
- Full PlayStation 1 (PSX) WebAssembly core
- Gamepad & Bluetooth controller API support
- Local storage save-state backups`,
    tags: ['PSX', 'Gaming', 'Emulator', 'PlayStation', 'Retro'],
    author: 'Emulator Vault',
    rating: 4.9,
    launches: 6840,
    isFeatured: true,
    createdAt: '2026-08-10T14:00:00Z',
    updatedAt: '2026-09-21T09:30:00Z',
  },
  {
    id: 'app-worldtimebuddy',
    title: 'World Time Buddy & Converter',
    tagline: 'World clock, time zone converter, and online meeting scheduler',
    description:
      'Effortlessly visualizes multiple time zones along an interactive horizontal timeline. Eliminates timezone math confusion when coordinating with global teammates and clients.',
    category: 'Other',
    url: 'https://www.worldtimebuddy.com',
    iconType: 'preset',
    iconValue: 'Compass',
    downloadUrl: '',
    version: 'v2.5.0',
    changelog: `### v2.5.0 (Latest)
- Daylight saving time automated highlight
- Instant Google Calendar event export
- Customizable team location groups`,
    tags: ['Timezones', 'Clock', 'Meetings', 'Scheduler', 'Global'],
    author: 'Hellman LLC',
    rating: 4.8,
    launches: 3150,
    isFeatured: false,
    createdAt: '2026-07-12T11:00:00Z',
    updatedAt: '2026-09-17T15:20:00Z',
  },
  {
    id: 'app-wheelofnames',
    title: 'Wheel of Names Randomizer',
    tagline: 'Customizable random name picker wheel for giveaways, choices, and classrooms',
    description:
      'A fun, fair decision wheel. Add custom names, choices, or giveaway contestants, spin the physics-based wheel with sound effects, and remove selected winners automatically.',
    category: 'Other',
    url: 'https://wheelofnames.com',
    iconType: 'preset',
    iconValue: 'Sparkles',
    downloadUrl: '',
    version: 'v4.1.0',
    changelog: `### v4.1.0 (Latest)
- Cryptographically fair random seed selection
- Custom confetti animations and winning fanfares
- Import list from Google Sheets or Excel`,
    tags: ['Randomizer', 'Wheel', 'Decisions', 'Classroom', 'Raffle'],
    author: 'Wheel of Names',
    rating: 4.8,
    launches: 2980,
    isFeatured: false,
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-09-14T10:00:00Z',
  },
];
