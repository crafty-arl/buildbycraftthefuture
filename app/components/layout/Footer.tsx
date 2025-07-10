import { Terminal, ExternalLink } from 'lucide-react'

interface FooterProps {
  showFullFooter?: boolean
  className?: string
}

export default function Footer({ showFullFooter = true, className = "" }: FooterProps) {
  return (
    <footer className={`bg-build-surface border-t border-build-border ${className}`}>
      <div className="max-w-6xl mx-auto container-padding py-8 sm:py-12 lg:py-16">
        {showFullFooter ? (
          <>
            {/* Full Footer */}
            <div className="text-center">
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
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                  <a href="https://craftthefuture.xyz" target="_blank" rel="noopener noreferrer" className="text-build-muted hover:text-build-accent transition-colors font-mono">
                    Visit craftthefuture.xyz
                  </a>
                  <span className="hidden sm:inline text-build-muted">•</span>
                  <a href="https://buildbycraftthefuture.substack.com/" target="_blank" rel="noopener noreferrer" className="text-build-muted hover:text-build-accent transition-colors font-mono">
                    Subscribe to Newsletter
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Minimal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="bg-build-accent p-1.5 rounded-lg shadow-sm orange-glow">
                  <Terminal className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-build-text font-mono">/build</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-build-muted">
                <a href="https://craftthefuture.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-build-accent transition-colors font-mono">
                  Craft The Future
                </a>
                <span>•</span>
                <a href="https://buildbycraftthefuture.substack.com/" target="_blank" rel="noopener noreferrer" className="hover:text-build-accent transition-colors font-mono">
                  Newsletter
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  )
} 