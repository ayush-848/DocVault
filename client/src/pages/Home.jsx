import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ShieldCheck,
  FileText,
  UploadCloud,
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
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-primary opacity-10 rounded-full blur-2xl" />

      {/* Navbar */}
      <Navbar setTheme={setTheme} theme={theme} />

      {/* Hero Section */}
      <header id='about' className="relative z-10 text-center px-4 sm:px-6 py-20 sm:py-24 max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6 font-heading">
          <span className="text-primary">Store & Access</span>
          <br />
          <span className="text-foreground">Your PDFs Seamlessly</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          DocuFlow lets you upload and manage your PDF documents privately and efficiently, with clean UI and simple access.
        </p>

        {/* Upload CTA Box */}
        <div
          className={`w-full max-w-xl mx-auto mb-8 bg-muted/30 backdrop-blur-md rounded-xl p-6 sm:p-10 shadow-xl hover:shadow-primary/10 transition border ${borderColor}`}
        >
          <div className="flex flex-col items-center space-y-4">
            <UploadCloud className="w-10 h-10 text-primary" />
            <p className="text-sm sm:text-base text-muted-foreground font-mono">
              Ready to get started?
            </p>
            <Button
              className="w-full bg-primary cursor-pointer text-black font-semibold py-3 rounded-md"
              onClick={() => navigate('/signup')}
            >
              Upload Your First PDF
            </Button>
          </div>
        </div>

        {/* PDF Support Banner */}
        <div className="mt-2 sm:mt-4 flex justify-center">
          <div className="bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-md border border-primary/30 font-mono text-sm">
            📄 Currently supports .pdf only
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id='features' className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          <FeatureCard
            theme={theme}
            icon={<FileText className="text-blue-500 w-8 h-8" />}
            title="PDF Upload"
            content="Upload PDF files to your dashboard and access them anytime."
          />
          <FeatureCard
            theme={theme}
            icon={<ShieldCheck className="text-green-500 w-8 h-8" />}
            title="Private Access"
            content="Your documents stay encrypted and are only accessible to you."
          />
          <FeatureCard
            theme={theme}
            icon={<UploadCloud className="text-purple-500 w-8 h-8" />}
            title="Simple Interface"
            content="No clutter. Just clean UI to upload, view, and manage PDFs."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-border px-4">
        <p className="text-muted-foreground text-sm font-mono">
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
        <CardTitle className="text-secondary text-lg sm:text-xl font-semibold font-heading text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground leading-relaxed font-mono text-sm sm:text-base">
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
