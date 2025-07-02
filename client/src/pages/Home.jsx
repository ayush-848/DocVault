import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FileText,
  LockKeyhole,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Navbar from '@/components/Navbar'

export default function Home() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigate = (path) => {
    window.location.href = path
  }

  if (!mounted) return null

  const borderColor = theme === 'light' ? 'border-emerald-700' : 'border-emerald-300'

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-mono transition-colors duration-300">
      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary opacity-10 rounded-full blur-2xl" />

      {/* Navbar */}
      <Navbar setTheme={setTheme} theme={theme} />

      {/* Hero Section */}
      <header className="relative z-10 text-center px-6 py-24 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 font-heading">
          <span className="text-primary">Effortless Document</span>
          <br />
          <span className="text-foreground">Storage & Organization</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
          Upload and organize your files securely with our clean interface. DocuFlow helps you stay focused, without the clutter.
        </p>

        {/* Upload Box */}
        <div
          className={`max-w-2xl mx-auto mb-10 bg-muted/30 backdrop-blur-md rounded-xl p-10 shadow-xl hover:shadow-primary/10 transition ${borderColor} border`}
        >
          <div className="border-2 border-dashed border-primary/60 bg-background/30 backdrop-blur-sm rounded-lg p-6 text-muted-foreground hover:bg-muted/30 transition cursor-pointer">
            <p className="mb-2">📄 Drag & drop your document here</p>
            <p className="text-sm text-muted-foreground">or click below to get started</p>
          </div>
          <Button
            className="mt-6 w-full bg-primary hover:bg-accent text-black font-semibold py-3 rounded-md"
            onClick={() => navigate('/signup')}
          >
            Upload Your First File
          </Button>
        </div>

        {/* Supported Formats */}
        <div className="flex justify-center gap-3 mt-4">
          {['PDF', 'DOCX', 'TXT', 'CSV'].map((format) => (
            <span
              key={format}
              className="px-3 py-1 text-sm border border-primary text-primary rounded-md bg-muted/30 font-mono"
            >
              {format}
            </span>
          ))}
        </div>
      </header>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            theme={theme}
            icon={<Sparkles className="text-primary w-8 h-8" />}
            title="Smart Tagging"
            content="Quickly label and tag documents for easy categorization and retrieval."
          />
          <FeatureCard
            theme={theme}
            icon={<FileText className="text-cyan-400 w-8 h-8" />}
            title="Flexible Format Support"
            content="Upload PDFs, Word files, plain text, and more — no conversions needed."
          />
          <FeatureCard
            theme={theme}
            icon={<LockKeyhole className="text-red-400 w-8 h-8" />}
            title="Private & Secure"
            content="Your files stay encrypted and accessible only by you — always."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 border-t border-border">
        <p className="text-muted-foreground font-mono">
          Already using DocuFlow?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            Sign in here
          </button>
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, content, theme }) {
  const borderColor = theme === 'light' ? 'border-emerald-700' : 'border'

  return (
    <Card
      className={`bg-background/40 backdrop-blur-md transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10 ${borderColor} border hover:border-primary/30`}
    >
      <CardHeader className="flex flex-col items-center space-y-4 pb-4">
        <div className="p-3 bg-muted/30 border border-border rounded-lg group-hover:bg-muted transition-colors">
          {icon}
        </div>
        <CardTitle className="text-secondary text-xl font-semibold font-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground leading-relaxed font-mono">{content}</p>
      </CardContent>
    </Card>
  )
}
