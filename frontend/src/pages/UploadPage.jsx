import { useState, useRef } from 'react'
import { uploadPDF } from '../utils/api'
import { extractTextFromPDF } from '../utils/pdfParser'
import Spinner from '../components/Spinner'

const uploadTips = [
  'Drag a PDF directly into the drop zone.',
  'Preview extracted text before sending it to the backend.',
  'After upload, jump straight into your library for summary or chat.',
]

export default function UploadPage({ addToast, onUploadSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const fileRef = useRef()

  const handleFile = async (nextFile) => {
    if (!nextFile || nextFile.type !== 'application/pdf') {
      addToast({ type: 'error', message: 'Only PDF files are supported.' })
      return
    }

    setFile(nextFile)
    setUploaded(false)
    setPreview(null)
    try {
      const { text, pages } = await extractTextFromPDF(nextFile)
      setPreview({ text, pages })
    } catch {
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
      const uploadedPaper = await uploadPDF(file, preview.text)
      setUploaded(true)
      addToast({ type: 'success', message: `"${file.name}" uploaded successfully.` })
      setFile(null)
      setPreview(null)
      if (onUploadSuccess) {
        setTimeout(() => onUploadSuccess(uploadedPaper), 700)
      }
    } catch {
      addToast({ type: 'error', message: 'Upload failed. Is the backend running?' })
    }
    setUploading(false)
  }

  return (
    <div className="feature-shell">
      <div className="feature-header">
        <div>
          <p className="feature-eyebrow">Upload</p>
          <h2 className="feature-title">Add a paper and extract text before analysis</h2>
          <p className="feature-copy">
            This flow mirrors the reference app structure but keeps your existing client-side PDF parsing and Django upload endpoint.
          </p>
        </div>
        <div className="feature-sidecard">
          <p className="feature-sidecard-label">Workflow Notes</p>
          {uploadTips.map((tip) => (
            <div key={tip} className="mini-note">{tip}</div>
          ))}
        </div>
      </div>

      <div
        className={`glass-panel upload-dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        <div className="dropzone-icon">PDF</div>
        <h3>Drop a paper here or click to browse</h3>
        <p>Client-side extraction keeps the file readable before upload and gives you a text preview immediately.</p>
      </div>

      {preview && (
        <div className="feature-grid-2">
          <div className="glass-panel feature-panel">
            <div className="panel-row">
              <span>{file?.name}</span>
              <span>{preview.pages} page{preview.pages !== 1 ? 's' : ''}</span>
            </div>
            <div className="stat-strip">
              <div><strong>{preview.text.length.toLocaleString()}</strong><span>Characters</span></div>
              <div><strong>{Math.ceil(preview.text.split(/\s+/).filter(Boolean).length)}</strong><span>Words</span></div>
            </div>
            <button type="button" onClick={handleUpload} disabled={uploading}>
              {uploading ? <><Spinner size={16} /> Uploading...</> : 'Send to Library'}
            </button>
          </div>

          <div className="glass-panel feature-panel">
            <p className="feature-panel-title">Extracted Preview</p>
            <pre className="preview-block">
              {preview.text.slice(0, 1800)}
              {preview.text.length > 1800 ? '\n\n... (truncated)' : ''}
            </pre>
          </div>
        </div>
      )}

      {uploaded && (
        <div className="status-banner success">
          Paper uploaded. Continue to the summarizer or insights workspace to generate analysis.
        </div>
      )}
    </div>
  )
}
