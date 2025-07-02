// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner' // ✅ import Sonner Toaster
import { AuthProvider } from './context/AuthContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Document from './pages/Document'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
  position="top-right"
  toastOptions={{
    className:
      'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-lg border border-border rounded-lg px-4 py-2',
    unstyled: true,
  }}
  visibleToasts={5}
/>

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private routes wrapped in Layout */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/documents" element={<Document />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<div className="p-8">404 Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
