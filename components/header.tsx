export default function Header() {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-white font-bold text-lg">❤️</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-primary">CardioCheck</h1>
            <p className="text-xs text-muted-foreground">Health Risk Assessment</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Evidence-Based Analysis</p>
        </div>
      </div>
    </header>
  )
}
