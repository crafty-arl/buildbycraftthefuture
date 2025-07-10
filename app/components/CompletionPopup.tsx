import { Trophy, Star, X } from 'lucide-react'

interface CompletionPopupProps {
  isOpen: boolean
  onClose: () => void
  onClaim: () => void
  xpAmount: number
  toolTitle: string
  isLoading: boolean
}

export default function CompletionPopup({
  isOpen,
  onClose,
  onClaim,
  xpAmount,
  toolTitle,
  isLoading
}: CompletionPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-build-muted hover:text-build-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-build-text mb-2 font-mono">
            Congratulations!
          </h2>
          
          <p className="text-build-muted mb-4">
            You've completed all steps of {toolTitle}!
          </p>

          <div className="bg-build-surface border border-build-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-bold text-build-text font-mono">
                +{xpAmount} XP
              </span>
            </div>
            <p className="text-sm text-build-muted">
              You've earned a completion badge and XP!
            </p>
          </div>

          <button
            onClick={onClaim}
            disabled={isLoading}
            className="w-full btn-primary py-3 font-mono relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Claim Rewards</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              'Claim Rewards'
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 