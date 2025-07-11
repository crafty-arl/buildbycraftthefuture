'use client'

import { useState, useEffect } from 'react'
import { Play, Terminal, Wrench, Zap, ArrowRight, X, Code2, ExternalLink, Trophy, Star, CheckCircle } from 'lucide-react'
import LayoutWrapper from './components/layout/LayoutWrapper'
import { getToolsBySeason, getSeasonName } from './data/tools'

export default function HomePage() {
  const [userXP, setUserXP] = useState(0)
  const [completedTools, setCompletedTools] = useState<string[]>([])

  useEffect(() => {
    // Load user progress
    const savedXP = parseInt(localStorage.getItem('user_xp') || '0')
    const completed = JSON.parse(localStorage.getItem('completed_tools') || '[]')
    setUserXP(savedXP)
    setCompletedTools(completed)
  }, [])

  const features = [
    {
      icon: <Wrench className="w-8 h-8 text-build-accent" />,
      title: "Build Real Tools",
      description: "Create CSV cleaners, form generators, AI summarizers, and more. Every tool works in the real world."
    },
    {
      icon: <Terminal className="w-8 h-8 text-python-blue" />,
      title: "Real Python Execution",
      description: "Run authentic Python code with Pyodide. No setup, no servers, just pure Python in your browser."
    },
    {
      icon: <Zap className="w-8 h-8 text-data-orange" />,
      title: "XP & Progress Tracking",
      description: "Earn XP for completing tools, unlock achievements, and track your builder journey."
    },
    {
      icon: <Code2 className="w-8 h-8 text-data-purple" />,
      title: "Season Pass Benefits",
      description: "Unlimited AI assistance, GitHub export, 3x XP multiplier, and early access to new seasons."
    }
  ]

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'python': return 'text-python-blue border-python-blue bg-python-blue/10'
      case 'ai': return 'text-purple-500 border-purple-500 bg-purple-500/10'
      case 'data': return 'text-emerald-500 border-emerald-500 bg-emerald-500/10'
      default: return 'text-build-accent border-build-accent bg-build-accent/10'
    }
  }

  return (
    <LayoutWrapper currentPage="home">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
                .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        `}</style>
      <div className="bg-build-bg build-grid">

      {/* Hero Section */}
      <section className="section-padding text-center">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="text-hero font-bold text-build-text mb-4 sm:mb-6 font-mono leading-tight">
            What do you want to
            <span className="text-build-accent terminal-prompt"> /build</span>
            <span className="typing-cursor"> today?</span>
          </h1>
          <p className="text-lg sm:text-xl text-build-muted mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Master Python by building real tools that solve actual problems. 
            <span className="text-build-accent">No tutorials. Just building.</span>
          </p>
          
          {/* User Progress Display */}
          {userXP > 0 && (
            <div className="bg-build-surface border border-build-border rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-build-accent" />
                  <span className="text-build-text font-mono">Level {Math.floor(userXP / 100) + 1}</span>
                </div>
                <div className="text-build-accent font-mono">{userXP} XP</div>
              </div>
              <div className="text-xs text-build-muted mt-1">
                {completedTools.length}/1 tools completed
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a 
              href="/tool/quickreceipt"
              className="btn-primary btn-mobile group w-full sm:w-auto"
            >
              <span>Start Building Tools</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/profile"
              className="btn-minimal btn-mobile group w-full sm:w-auto"
            >
              <span>View Your Progress</span>
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Season 0: The Toolbelt */}
      <section id="tools" className="section-padding bg-tan-50/50">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-build-accent/10 border border-build-accent/20 rounded-full mb-4">
              <span className="text-build-accent font-mono text-sm font-semibold">SEASON 0</span>
              <span className="mx-2 text-build-accent/60">•</span>
              <span className="text-build-accent font-mono text-sm">THE TOOLBELT</span>
            </div>
            <h2 className="text-section font-bold mb-3 sm:mb-4 text-build-text font-mono">
              Master the Essential Tools
            </h2>
            <p className="text-center text-build-muted mb-8 font-mono max-w-2xl mx-auto">
              Build 5 foundational tools that every Python developer needs in their toolkit. 
              From receipts to charts, these tools solve real problems.
            </p>
          </div>
          
          {getToolsBySeason().map((seasonGroup) => (
            <div key={seasonGroup.seasonId} className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {seasonGroup.tools.map((tool, index) => {
                  const isCompleted = completedTools.includes(tool.id)
                  const cardColor = index % 3 === 0 ? 'card-accent' : index % 3 === 1 ? 'card-pink' : 'card'
                  const hoverColor = index % 3 === 0 ? 'accent-hover' : index % 3 === 1 ? 'pink-hover' : 'minimal-hover'
              
              return (
                <div key={tool.id} className={`${cardColor} p-8 group ${hoverColor} transition-all duration-300 relative min-h-[450px] flex flex-col`}>
                  {isCompleted && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-5 h-5 text-build-accent" />
                    </div>
                  )}
                  
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded touch-target ${getTrackColor(tool.track)}`}>
                      <span className="text-2xl sm:text-3xl">
                        {tool.track === 'python' ? '🐍' : tool.track === 'ai' ? '🤖' : '📊'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <span className="text-build-muted font-mono text-sm">
                        /{tool.track}/tool-{tool.order}
                      </span>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-3 py-1 text-sm rounded font-mono border ${getTrackColor(tool.track)}`}>
                          {tool.difficulty}
                        </span>
                        <span className="text-sm text-build-muted font-mono">
                          +{tool.steppedLesson?.xp || (tool.difficulty === 'Beginner' ? '100' : tool.difficulty === 'Intermediate' ? '150' : '200')} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-build-text">{tool.title}</h3>
                  <p className="text-build-muted leading-relaxed mb-6 text-base flex-1 line-clamp-5">{tool.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-build-muted font-mono mb-6">
                    <span>{tool.estimatedTime}</span>
                    <span>{tool.concepts?.length || 0} concepts</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-1">
                      {(tool.concepts || []).slice(0, 3).map((concept, conceptIndex) => (
                        <div key={conceptIndex} className="w-8 h-8 bg-build-accent/20 rounded-full border-2 border-white text-sm flex items-center justify-center font-mono">
                          {concept.charAt(0)}
                        </div>
                      ))}
                      {(tool.concepts?.length || 0) > 3 && (
                        <div className="w-8 h-8 bg-build-muted/20 rounded-full border-2 border-white text-sm flex items-center justify-center font-mono">
                          +{(tool.concepts?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                    
                    <a 
                      href={`/tool/${tool.slug}`}
                      className={`transition-colors font-mono text-sm uppercase tracking-wider touch-target px-4 py-2 rounded ${
                        index % 3 === 0 ? 'text-build-accent hover:text-build-accent/80 border border-build-accent/20 hover:border-build-accent/40' : 
                        index % 3 === 1 ? 'text-build-pink-neon hover:text-build-pink border border-build-pink/20 hover:border-build-pink/40' : 
                        'text-minimal-green hover:text-minimal-green/80 border border-minimal-green/20 hover:border-minimal-green/40'
                      }`}
                    >
                      {isCompleted ? 'View Tool →' : 'Build Now →'}
                    </a>
                  </div>
                </div>
              )
            })}
              </div>
            </div>
          ))}
          
          <div className="text-center mt-12">
            <div className="bg-build-surface border border-build-border rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-build-text font-mono mb-3">
                🎯 Season 0 Complete
              </h3>
              <p className="text-build-muted mb-4">
                Master all 5 tools in The Toolbelt to unlock advanced seasons with AI tools, 
                data analysis, and complex automation projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/upgrade" className="btn-minimal">
                  Explore Season Pass →
                </a>
                <a href="/profile" className="btn-primary">
                  View Your Progress →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-build-text font-mono">
            Built for Builders
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

      {/* Stats Section */}
      <section className="py-20 bg-tan-50/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-build-text font-mono mb-12">
            Join the Builder Movement
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-build-surface border border-build-border rounded-lg p-8">
              <div className="text-4xl font-bold text-build-accent font-mono mb-2">5</div>
              <div className="text-build-muted font-mono">Tools in Season 0</div>
            </div>
            <div className="bg-build-surface border border-build-border rounded-lg p-8">
              <div className="text-4xl font-bold text-build-accent font-mono mb-2">100%</div>
              <div className="text-build-muted font-mono">Browser-Based</div>
            </div>
            <div className="bg-build-surface border border-build-border rounded-lg p-8">
              <div className="text-4xl font-bold text-build-accent font-mono mb-2">0</div>
              <div className="text-build-muted font-mono">Setup Required</div>
            </div>
          </div>

          <div className="bg-build-surface rounded-lg border border-build-border p-12">
            <h3 className="text-2xl font-bold text-build-text font-mono mb-4">
              Start Building Today
            </h3>
            <p className="text-build-muted mb-8 max-w-2xl mx-auto">
              Every tool you build becomes part of your portfolio. Every line of code teaches you something new. 
              Every completion moves you closer to mastery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/tool/quickreceipt" className="btn-primary btn-large">
                Build Your First Tool
              </a>
              <a href="/upgrade" className="btn-minimal btn-large">
                Explore Season Pass
              </a>
            </div>
          </div>
        </div>
      </section>

      </div>
    </LayoutWrapper>
  )
} 