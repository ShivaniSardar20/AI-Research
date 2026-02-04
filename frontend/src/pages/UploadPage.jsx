import { useState, useRef } from 'react'
import { uploadPDF } from '../utils/api'
import { extractTextFromPDF } from '../utils/pdfParser'
import Spinner from '../components/Spinner'

export default function UploadPage({ addToast }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)   // { text, pages }
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const fileRef = useRef()

  const handleFile = async (f) => {
    if (!f || f.type !== 'application/pdf') {
      addToast({ type: 'error', message: 'Only PDF files are supported.' })
      return
    }
    setFile(f)
    setUploaded(false)
    setPreview(null)
    try {
      const { text, pages } = await extractTextFromPDF(f)
      setPreview({ text, pages })
    } catch (e) {
      addToast({ type: 'error', message: 'Failed to parse PDF.' })
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleUpload = async () => {
    if (!file || !preview) return
    setUploading(true)
    try {
      await uploadPDF(file, preview.text)
      setUploaded(true)
      addToast({ type: 'success', message: `"${file.name}" uploaded successfully.` })
      setFile(null)
      setPreview(null)
    } catch (e) {
      addToast({ type: 'error', message: 'Upload failed. Is the backend running?' })
    }
    setUploading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4" style={{ paddingTop: '100px', background: '#0a0a0f' }}>
      {/* Header */}
      <div className="w-full max-w-2xl mb-10">
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '10px' }}>— Upload</p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', color: '#e8e4dc', fontWeight: 400 }}>Add a <em style={{ color: '#c9a84c' }}>paper</em> to your library</h1>
      </div>

      {/* Drop Zone */}
      <div className="w-full max-w-2xl cursor-pointer transition-all duration-300 rounded-lg flex flex-col items-center justify-center"
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current.click()}
        style={{
          minHeight: '240px',
          border: `2px dashed ${dragging ? '#c9a84c' : 'rgba(201,168,76,0.25)'}`,
          background: dragging ? 'rgba(201,168,76,0.06)' : 'rgba(18,18,26,0.6)',
        }}>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        <div className="text-center px-6">
          <div style={{ fontSize: '2.2rem', marginBottom: '12px', opacity: 0.5 }}>📄</div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.72rem', color: '#7a756b', lineHeight: 1.9 }}>
            Drag &amp; drop a <span style={{ color: '#c9a84c' }}>PDF</span> here, or click to browse.<br />
            <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>Parsed client-side — your file stays private.</span>
          </p>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="w-full max-w-2xl mt-6 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.18)', background: '#0e0e16' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: '#c9a84c', letterSpacing: '1px' }}>
              {file?.name}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: '#7a756b' }}>
              {preview.pages} page{preview.pages !== 1 ? 's' : ''} · {preview.text.length.toLocaleString()} chars
            </span>
          </div>
          <div className="p-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.66rem', color: '#7a756b', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {preview.text.slice(0, 1400)}{preview.text.length > 1400 ? '\n\n… (truncated)' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && !uploaded && (
        <button onClick={handleUpload} disabled={uploading}
          className="mt-6 flex items-center gap-3 transition-all duration-200"
          style={{
            background: uploading ? 'rgba(201,168,76,0.35)' : '#c9a84c',
            color: '#0a0a0f', border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
            padding: '13px 34px', fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '4px'
          }}>
          {uploading ? <><Spinner size={16} /> Uploading…</> : 'Send to Library'}
        </button>
      )}

      {uploaded && (
        <p className="mt-6" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem', color: '#2ecc71' }}>
          ✓ Paper added to your library. You can now summarize or chat with it.
        </p>
      )}
    </div>
  )
}
