'use client'

import { useState } from 'react'
import LayoutWrapper from '../components/layout/LayoutWrapper'
import { Check, X, Star, Zap, Download, Sparkles, Cpu, Crown } from 'lucide-react'

export default function UpgradePage() {
  const [isPassHolder, setIsPassHolder] = useState(false)

  const freeFeatures = [
    'Build all Season 1 tools',
    'Real Python execution with Pyodide',
    'Basic XP tracking',
    'Tool completion certificates',
    '5 AI assists per day',
    'Save your progress locally'
  ]

  const passFeatures = [
    'Everything in Free',
    'Unlimited AI assistance',
    'Priority Python execution',
    '3x XP multiplier boost',
    'Export tools to GitHub',
    'Remix and share tools',
    'Advanced analytics dashboard',
    'Early access to Season 2',
    'Exclusive Season Pass community',
    'Direct feedback from creators'
  ]

  const handleUpgrade = () => {
    // In a real app, this would integrate with payment processing
    alert('Season Pass coming soon! We\'ll notify you when it\'s available.')
  }

  const handleActivatePass = () => {
    // For demo purposes - in real app would verify purchase
    const passCode = prompt('Enter your Season Pass code:')
    if (passCode === 'EARLYBUILDER') {
      localStorage.setItem('season_pass', 'true')
      setIsPassHolder(true)
      alert('🎉 Season Pass activated! Welcome to the builder community!')
    } else if (passCode) {
      alert('Invalid pass code. Try EARLYBUILDER for demo.')
    }
  }

  return (
    <LayoutWrapper currentPage="upgrade">
      <div className="min-h-screen bg-build-bg">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-build-accent/20 via-transparent to-purple-500/20"></div>
          <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
            <div className="mb-8">
              <Crown className="w-16 h-16 text-build-accent mx-auto mb-4" />
              <h1 className="text-5xl font-bold text-build-text font-mono mb-4">
                Season Pass
              </h1>
              <p className="text-xl text-build-muted max-w-2xl mx-auto">
                Unlock the full potential of /build. More XP, unlimited AI, and exclusive features for serious builders.
              </p>
            </div>

            {isPassHolder ? (
              <div className="bg-build-accent/10 border border-build-accent rounded-lg p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Crown className="w-5 h-5 text-build-accent" />
                  <span className="text-build-accent font-semibold font-mono">Season Pass Active</span>
                </div>
                <p className="text-build-muted text-sm">
                  Welcome to the builder community! Enjoy unlimited AI assistance and exclusive features.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleUpgrade}
                  className="btn-primary btn-large group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Get Season Pass
                </button>
                <button
                  onClick={handleActivatePass}
                  className="btn-minimal btn-large"
                >
                  Have a code? Activate here
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-build-surface rounded-lg border border-build-border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Free Column */}
              <div className="p-8 border-r border-build-border">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-build-text font-mono mb-2">Free Builder</h3>
                  <p className="text-build-muted">Perfect for getting started</p>
                  <div className="text-3xl font-bold text-build-accent font-mono mt-4">$0</div>
                  <div className="text-build-muted text-sm">Forever</div>
                </div>

                <div className="space-y-4">
                  {freeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-build-accent flex-shrink-0" />
                      <span className="text-build-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <a href="/tool/receipt-generator" className="btn-minimal w-full text-center block">
                    Start Building Free
                  </a>
                </div>
              </div>

              {/* Season Pass Column */}
              <div className="p-8 bg-gradient-to-br from-build-accent/5 to-purple-500/5 relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-build-accent text-white px-3 py-1 rounded-full text-xs font-mono">
                    RECOMMENDED
                  </span>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-build-text font-mono mb-2">Season Pass</h3>
                  <p className="text-build-muted">For serious builders</p>
                  <div className="text-3xl font-bold text-build-accent font-mono mt-4">
                    $12<span className="text-lg text-build-muted">/season</span>
                  </div>
                  <div className="text-build-muted text-sm">~3 months per season</div>
                </div>

                <div className="space-y-4">
                  {passFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-build-accent flex-shrink-0" />
                      <span className="text-build-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  {isPassHolder ? (
                    <div className="btn-primary w-full text-center block opacity-50 cursor-not-allowed">
                      ✓ Already Active
                    </div>
                  ) : (
                    <button onClick={handleUpgrade} className="btn-primary w-full group">
                      <Crown className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Upgrade Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-build-text text-center mb-12 font-mono">
              Frequently Asked Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-build-text font-mono mb-2">
                    What's included in Season 1?
                  </h4>
                  <p className="text-build-muted">
                    5 hands-on tools: CSV Cleaner, Form Filler Generator, AI Note Summarizer, 
                    Flashcard Generator, and Ask My PDF. All with real Python execution.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-build-text font-mono mb-2">
                    How does the AI assistance work?
                  </h4>
                  <p className="text-build-muted">
                    Get instant help with debugging, code explanations, and implementation hints. 
                    Free users get 5 assists per day, Season Pass holders get unlimited.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-build-text font-mono mb-2">
                    Can I export my tools?
                  </h4>
                  <p className="text-build-muted">
                    Season Pass holders can export their completed tools to GitHub repositories, 
                    making them part of your professional portfolio.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-build-text font-mono mb-2">
                    What if I'm not satisfied?
                  </h4>
                  <p className="text-build-muted">
                    We offer a 30-day money-back guarantee. If you're not building better tools 
                    within 30 days, we'll refund your Season Pass completely.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-build-text font-mono mb-2">
                    When does Season 2 start?
                  </h4>
                  <p className="text-build-muted">
                    Season 2 will focus on JavaScript tools, web APIs, and full-stack projects. 
                    Season Pass holders get early access and special pricing.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-build-text font-mono mb-2">
                    Is there a student discount?
                  </h4>
                  <p className="text-build-muted">
                    Yes! Students get 50% off Season Pass with valid student email. 
                    Contact us for your discount code.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-build-surface rounded-lg border border-build-border p-12">
            <h3 className="text-2xl font-bold text-build-text font-mono mb-4">
              Ready to Build at Full Speed?
            </h3>
            <p className="text-build-muted mb-8 max-w-2xl mx-auto">
              Join thousands of builders who are mastering Python by creating real tools. 
              Start free, upgrade when you're ready to accelerate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <a href="/tool/receipt-generator" className="btn-minimal btn-large">
                Start Building Free
              </a>
              {!isPassHolder && (
                <button onClick={handleUpgrade} className="btn-primary btn-large group">
                  <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Get Season Pass
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
} 