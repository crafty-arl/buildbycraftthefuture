'use client'

import { useState } from 'react'
import { Play, Terminal, Wrench, Zap, ArrowRight, X, Code2, ExternalLink } from 'lucide-react'
import LessonViewer from './components/LessonViewer'
import { courses, Module } from './data/lessons'

export default function HomePage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  const features = [
    {
      icon: <Terminal className="w-8 h-8 text-build-accent" />,
      title: "Run It. Break It.",
      description: "Execute Python code instantly in your browser. No downloads, no setup, no excuses."
    },
    {
      icon: <Wrench className="w-8 h-8 text-minimal-green" />,
      title: "Build Real Tools",
      description: "Skip the theory. Build scripts, automation, and tools that solve actual problems."
    },
    {
      icon: <Zap className="w-8 h-8 text-build-pink-neon" />,
      title: "Learn by Doing",
      description: "This isn't a lesson. It's a launchpad. Every module gets you building immediately."
    },
    {
      icon: <Code2 className="w-8 h-8 text-minimal-purple" />,
      title: "Real Outcomes",
      description: "Track progress locally. Build a portfolio of working code, not just certificates."
    }
  ]

  return (
    <div className="min-h-screen bg-build-bg build-grid">
      {/* Header */}
      <header className="bg-build-surface/80 backdrop-blur-sm border-b border-build-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto container-padding py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-build-accent p-1.5 sm:p-2 rounded-lg shadow-sm orange-glow">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-build-text font-mono">/build</span>
            </div>
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <a href="#modules" className="text-build-muted hover:text-build-accent transition-colors font-mono text-sm lg:text-base">Modules</a>
              <a href="#approach" className="text-build-muted hover:text-build-accent transition-colors font-mono text-sm lg:text-base">Approach</a>
              <a href="https://craftthefuture.xyz" target="_blank" rel="noopener noreferrer" className="hidden lg:block text-build-muted hover:text-build-accent transition-colors font-mono">
                Craft The Future
              </a>
              <a href="https://buildbycraftthefuture.substack.com/" target="_blank" rel="noopener noreferrer" className="hidden lg:block text-build-muted hover:text-build-accent transition-colors font-mono">
                Newsletter
              </a>
              <a href="/sandbox" className="btn-pink btn-mobile">
                <span>Start Building</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </nav>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <a href="/sandbox" className="btn-pink btn-mobile">
                <span className="sm:hidden">Build</span>
                <span className="hidden sm:inline">Start Building</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
          {/* Mobile navigation */}
          <nav className="md:hidden mt-3 pt-3 border-t border-build-border nav-mobile">
            <a href="#modules" className="text-build-muted hover:text-build-accent transition-colors font-mono touch-target">Modules</a>
            <a href="#approach" className="text-build-muted hover:text-build-accent transition-colors font-mono touch-target">Approach</a>
            <a href="https://craftthefuture.xyz" target="_blank" rel="noopener noreferrer" className="text-build-muted hover:text-build-accent transition-colors font-mono touch-target">
              Craft The Future
            </a>
            <a href="https://buildbycraftthefuture.substack.com/" target="_blank" rel="noopener noreferrer" className="text-build-muted hover:text-build-accent transition-colors font-mono touch-target">
              Newsletter
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding text-center">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="text-hero font-bold text-build-text mb-4 sm:mb-6 font-mono leading-tight">
            What do you want to 
            <span className="text-build-accent terminal-prompt"> build</span>
            <span className="typing-cursor"> today?</span>
          </h1>
          <p className="text-lg sm:text-xl text-build-muted mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Talk like a mentor, not a manual. Run code instantly. Break things safely. 
            Learn why it works. No setup, no fluff—just pure building.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a 
              href="/sandbox"
              className="btn-primary btn-mobile group w-full sm:w-auto"
            >
              <span>Launch /build/sandbox</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={() => setSelectedModule(courses[0]?.modules[0] || null)}
              className="btn-pink btn-mobile group w-full sm:w-auto"
            >
              <span>Preview Build</span>
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="section-padding bg-tan-50/50">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-section font-bold text-center mb-3 sm:mb-4 text-build-text font-mono">
            Choose Your Build Path
          </h2>
          <p className="text-center text-build-muted mb-8 sm:mb-12 font-mono">Pick a module. Start building. Scale naturally into projects.</p>
          <div className="grid-modules">
            {courses.map((course, index) => (
              <div key={course.id} className={`${index % 2 === 0 ? 'card-accent' : 'card-pink'} p-4 sm:p-6 group ${course.status === 'available' ? 'accent-hover cursor-pointer' : 'opacity-60'} transition-all duration-300`}>
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className={`${index % 2 === 0 ? 'bg-build-accent/10' : 'bg-build-pink/10'} p-2 rounded touch-target`}>
                    <span className="text-xl sm:text-2xl">{course.icon}</span>
                  </div>
                  <div className="ml-3">
                    <span className="text-build-muted font-mono text-xs sm:text-sm">/build/{course.id.split('-')[0]}</span>
                    {course.status === 'coming-soon' && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-tan-200 text-build-muted rounded font-mono">
                        SOON
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-card font-semibold mb-2 sm:mb-3 text-build-text">{course.title}</h3>
                <p className="text-build-muted leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{course.description}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm text-build-muted font-mono">
                  <span>{course.level} • {course.totalTime}</span>
                  {course.status === 'available' ? (
                    <button 
                      onClick={() => setSelectedModule(course.modules[0])}
                      className={`${index % 2 === 0 ? 'text-build-accent hover:text-build-accent/80' : 'text-build-pink-neon hover:text-build-pink'} transition-colors font-mono text-xs sm:text-sm uppercase tracking-wider touch-target`}
                    >
                      Start Here →
                    </button>
                  ) : (
                    <span className="text-build-muted font-mono text-xs sm:text-sm">Coming Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="approach" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-build-text font-mono">
            Built Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`text-center p-6 group transition-all duration-300 ${index % 2 === 0 ? 'card-accent accent-hover' : 'card-pink pink-hover'}`}>
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-build-text font-mono">{feature.title}</h3>
                <p className="text-build-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Builds Section */}
      <section className="py-20 bg-tan-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-build-text font-mono">
            Available Build Modules
          </h2>
          <p className="text-center text-build-muted mb-12 font-mono">Real projects. Real code. Real outcomes.</p>
          
          {courses.filter(course => course.status === 'available').map((course) => (
            <div key={course.id} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">{course.icon}</span>
                <h3 className="text-2xl font-bold text-build-text font-mono">{course.title}</h3>
                <span className="text-sm text-build-muted font-mono">({course.modules.length} modules)</span>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.modules.map((module, index) => (
                  <div key={module.id} className={`overflow-hidden group transition-all duration-300 ${index % 3 === 0 ? 'card-accent accent-hover' : index % 3 === 1 ? 'card-pink pink-hover' : 'card minimal-hover'}`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-mono px-3 py-1 rounded-full uppercase tracking-wider ${
                          index % 3 === 0 ? 'text-build-accent bg-build-accent/10' : 
                          index % 3 === 1 ? 'text-build-pink-neon bg-build-pink/10' : 
                          'text-minimal-green bg-minimal-green/10'
                        }`}>
                          Module {index + 1}
                        </span>
                        <span className="text-sm text-build-muted font-mono">{module.time}</span>
                      </div>
                      <h4 className={`text-xl font-semibold mb-2 text-build-text transition-colors font-mono ${
                        index % 3 === 0 ? 'group-hover:text-build-accent' : 
                        index % 3 === 1 ? 'group-hover:text-build-pink-neon' : 
                        'group-hover:text-minimal-green'
                      }`}>
                        {module.title}
                      </h4>
                      <p className="text-build-muted mb-4 leading-relaxed">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-build-muted font-mono">
                          {module.slides.length} steps • {module.difficulty}
                        </span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedModule(module)}
                            className={`flex items-center space-x-1 transition-colors font-mono text-sm ${
                              index % 3 === 0 ? 'text-build-accent hover:text-build-accent/80' : 
                              index % 3 === 1 ? 'text-build-pink-neon hover:text-build-pink' : 
                              'text-minimal-green hover:text-minimal-green/80'
                            }`}
                          >
                            <span>Preview</span>
                            <Play className="w-4 h-4" />
                          </button>
                          <a 
                            href="/learn"
                            className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors font-mono text-sm font-medium ${
                              index % 3 === 0 ? 'bg-build-accent hover:bg-build-accent-dark text-white' : 
                              index % 3 === 1 ? 'bg-build-pink-neon hover:bg-build-pink text-white' : 
                              'bg-minimal-green hover:bg-emerald-600 text-white'
                            }`}
                          >
                            <span>Build</span>
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-build-surface border-t border-build-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-build-accent p-2 rounded-lg shadow-sm orange-glow">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-build-text font-mono">/build</span>
          </div>
          <p className="text-build-muted mb-6 font-mono">Learn by doing. Build by coding. Scale by shipping.</p>
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm text-build-muted">
              Created with 🔧 by <a href="https://craftthefuture.xyz" target="_blank" rel="noopener noreferrer" className="font-mono text-build-accent hover:text-build-accent/80 transition-colors">Carl from Craft The Future</a>
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <a href="https://craftthefuture.xyz" target="_blank" rel="noopener noreferrer" className="text-build-muted hover:text-build-accent transition-colors font-mono">
                Visit craftthefuture.xyz
              </a>
              <span className="text-build-muted">•</span>
              <a href="https://buildbycraftthefuture.substack.com/" target="_blank" rel="noopener noreferrer" className="text-build-muted hover:text-build-accent transition-colors font-mono">
                Subscribe to Newsletter
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Module Preview Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-build-bg rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-build-border">
              <h2 className="text-2xl font-bold text-build-text font-mono">{selectedModule.title}</h2>
              <button 
                onClick={() => setSelectedModule(null)}
                className="text-build-muted hover:text-build-text transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <LessonViewer 
                lesson={selectedModule} 
                onClose={() => setSelectedModule(null)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 