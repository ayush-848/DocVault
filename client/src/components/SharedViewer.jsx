import { useParams } from 'react-router-dom'

export default function SharedViewer() {
  const { shareId } = useParams()
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  return (
    <iframe
      src={`${apiBaseUrl}/documents/share/${shareId}`}
      className="w-full h-screen border rounded-md"
      title="Shared Document"
    />
  )
}
