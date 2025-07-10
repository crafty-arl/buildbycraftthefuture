export default function IDELoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-build-surface">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-build-accent mx-auto"></div>
        <div className="text-build-text font-mono">Loading Future Builder Studio...</div>
        <div className="text-sm text-build-muted font-mono">Professional Python IDE • CDN Runtime</div>
      </div>
    </div>
  )
} 