import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import api from '@/services/api'

export default function Document() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.getCurrentUser()
        const allDocs = res.data?.user?.documents || []
        const current = allDocs.find(d => d.id === id)
        if (!current) throw new Error('Document not found')
        setDoc(current)
      } catch (err) {
        setError('❌ Failed to load document')
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [id])

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true)
      const res = await api.analyzeDoc(id)
      setDoc(res.data.document)
    } catch (err) {
      setError('❌ Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) return <p className="text-muted">Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        {doc.language && (
          <Badge className="mt-2">{doc.language.toUpperCase()}</Badge>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? 'Analyzing...' : 'Detect Language'}
        </Button>
        <Button variant="outline">Add Tags</Button>
        <Button variant="secondary">Create Share Link</Button>
      </div>

      <div className="text-sm text-muted-foreground">
        📦 Stored as: <code>{doc.supabase_key}</code>
      </div>
    </div>
  )
}
