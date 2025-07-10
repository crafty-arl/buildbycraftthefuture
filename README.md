# ⚡ /build - Learn by Doing

What do you want to build today? Interactive coding modules where you run it, break it, and learn why. No setup, no fluff—just pure building.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start building:**
   ```bash
   npm run dev
   ```

3. **Launch the builder:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
build-platform/
├── app/                          # Next.js 14 App Router
│   ├── components/
│   │   ├── LessonViewer.tsx     # Module preview component
│   │   └── GamefiedPythonIDE.tsx # Main gamified IDE (Professional future builder studio)
│   ├── learn/                   # 🔧 Builder Interface
│   │   ├── page.tsx            # Main builder page
│   │   └── [lessonId]/page.tsx # Individual module builder
│   ├── data/
│   │   └── lessons.ts          # Build modules content
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Build-themed styles
├── lessons/                     # 📝 Module Content (Markdown)
│   ├── 01-hello-world.md      # First tool build
│   └── 02-variables.md        # Data management tools
├── brandguidelines.md           # Brand voice & positioning
└── instructions.md             # Original project goals
```

## 🎨 Design Philosophy

### 🎯 Core Principles
- **Direct**: Talk like a mentor, not a manual
- **Bold**: Say what matters. No filler. No fluff.
- **Curious**: Invite users to explore, build, break things
- **Empowering**: Position users as builders from Day 1

### 🌙 Visual Theme
- **Dark Mode Default**: Charcoal backgrounds with neon accents
- **Neon Color Palette**: 
  - Blue: `#00d9ff` (primary actions)
  - Green: `#00ff88` (success/code)
  - Yellow: `#ffd700` (highlights)
  - Purple: `#8b5cf6` (special features)
- **Typography**: JetBrains Mono + Inter for tech aesthetic
- **Icons**: Terminal prompts (▊), wrenches, sparks

## 🏗️ Build Modules

### 🆕 Current Modules
- **`/build/python`**: Hello World → Script-driven workflows
- **`/build/js`**: Coming soon - Web logic → DOM hacks  
- **`/build/data`**: Coming soon - CSVs → Dashboards

### 🎯 Module Features
- **Browser-based execution**: Real Python via Pyodide/WebAssembly
- **No setup required**: Start building immediately
- **Progressive building**: From tools to workflows to systems
- **Real outcomes**: Build a portfolio of working code

## 🔧 Technical Features

### 🚀 Core Tech Stack
- **Next.js 14** with App Router
- **Tailwind CSS** with dark theme & neon accents
- **TypeScript** for builder safety
- **Pyodide/WebAssembly** for Python execution
- **Monaco Editor** for code building interface

### 🎨 Brand Colors

```css
/* /build Brand Colors */
--build-neon-blue: #00d9ff
--build-neon-green: #00ff88
--build-bg: #0f0f0f
--build-surface: #1a1a1a
--build-border: #2d2d2d
--build-text: #e5e5e5
--build-muted: #888888
```

## 📱 Responsive Design

- **Mobile**: Touch-optimized builder interface
- **Tablet**: Split-view code and output
- **Desktop**: Full multi-panel development environment

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style
- Use TypeScript for all new files
- Follow /build voice: direct, empowering, action-oriented
- Dark theme with neon accents throughout
- Monospace fonts for technical elements

## 🚧 Current Status

### ✅ Completed (Phase 1)
- [x] Complete rebrand to /build
- [x] Dark theme with neon accents
- [x] Builder-focused voice and messaging
- [x] **Python module**: Complete interactive builder
- [x] **Module system**: Scalable content architecture
- [x] **Real execution**: Pyodide integration working

### 🔄 Next Builds
- [ ] `/build/js` module for web development
- [ ] `/build/data` module for data analysis
- [ ] Progress tracking and build portfolio
- [ ] Enhanced code editor with themes
- [ ] Mobile-optimized builder interface

### 🎯 Future Architecture
- [ ] Multi-language support (JS, Python, data tools)
- [ ] Build portfolio and sharing features
- [ ] Advanced Pyodide capabilities
- [ ] Real-time collaboration features

## 🌐 Deployment

### Recommended Platforms
- **Vercel** (optimal for Next.js)
- **Netlify** (great for static builds)
- **Cloudflare Pages** (fast global CDN)

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 👨‍💻 Creator

**`/build`** is led by **Carl**, founder of *Craft The Future*, built to help makers, thinkers, and learners move fast with modern tools and mindsets.

## 🎯 Success Metrics

### Primary Goals
- **Builder Conversion**: Visitors who start building immediately
- **Module Completion**: Users who finish building real tools
- **Return Rate**: Builders who come back to build more

### Philosophy
- Every interaction leads to **building something real**
- Users leave with **working code**, not just knowledge
- **"What do you want to build today?"** drives everything

---

*This isn't a lesson. It's a launchpad. Start building.* 