import { useEffect, useState, useCallback } from 'react'
import UploadForm from '../components/UploadForm'
import { useAuth } from '../context/AuthContext'
import { Progress } from '@/components/ui/progress'
import api from '../services/api'

export default function Dashboard() {
  const [docs, setDocs] = useState([])
  const [storage, setStorage] = useState({
    usedMB: 0,
    remainingMB: 500,
    usagePercent: 0,
    maxMB: 500,
  })
  const { user } = useAuth()

  const getThumioThumbnail = useCallback((doc) => {
    if (doc?.publicUrl?.endsWith('.pdf')) {
      const encodedUrl = doc.publicUrl
      return `https://image.thum.io/get/pdfSource/width/400/page/1/${encodedUrl}`
    }
    return null
  }, [])

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { documents, storage } = await api.getAllDocs()
        setDocs(documents)
        setStorage(storage)
      } catch (err) {
        console.error('Error fetching documents:', err)
      }
    }

    fetchDocs()
  }, [])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const parseTitle = (title) => {
    try {
      const len = title.length
      if (len > 25) {
        title = `${title.slice(0, 22)}...`
      }
      return title
    } catch {
      return 'Unknown'
    }
  }

  const formatSize = (bytes) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const openDocument = async (docId) => {
    try {
      const res = await fetch(api.getDocViewUrl(docId), {
        method: 'GET',
        credentials: 'include', // Include auth cookies
      })

      if (!res.ok) throw new Error('Failed to fetch document')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      // Open in same tab
      window.location.href = url
    } catch (err) {
      console.error('❌ Failed to open document:', err)
      alert('Unable to load document. Please try again.')
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-mono">
          Welcome{user?.username ? `, ${user.username}` : ''} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-mono">
          Manage and analyze your documents efficiently.
        </p>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-lg p-6 space-y-3">
        <h2 className="text-xl font-semibold font-mono">Storage Usage</h2>
        <div className="flex justify-between text-sm font-mono text-muted-foreground">
          <span>
            {storage.usedMB} MB of {storage.maxMB} MB used ({storage.usagePercent}%)
          </span>
          <span>{storage.remainingMB} MB left</span>
        </div>
        <Progress value={storage.usagePercent} className="h-3 rounded-full" />
      </div>

      <div className="bg-card border border-border shadow-sm rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold font-mono">Upload New Document</h2>
        <UploadForm onDone={() => window.location.reload()} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 font-mono">Your Documents</h2>
        {docs.length === 0 ? (
          <div className="text-muted-foreground italic text-center py-10 font-mono">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => {
              const thumbnail = getThumioThumbnail(doc)
              return (
                <div
                  key={doc.id}
                  className="bg-card p-4 border rounded-lg shadow-sm space-y-2 font-mono"
                >
                  <h3 className="font-bold text-lg break-words">{parseTitle(doc.title)}</h3>

                  {thumbnail && (
                    <div className="w-full h-44 aspect-[3/4] bg-white rounded-md overflow-hidden border">
                      <img
                        src={thumbnail}
                        alt={`Thumbnail for ${doc.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📅 {formatDate(doc.created_at)}</p>
                    <p>🌐 Language: {doc.language}</p>
                    <p>💾 Size: {formatSize(doc.size || 0)}</p>
                  </div>

                  <button
                    onClick={() => openDocument(doc.id)}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
