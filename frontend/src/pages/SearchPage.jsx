import { useState } from 'react'
import { searchPapers } from '../utils/api'
import Spinner from '../components/Spinner'

const searchPrompts = [
  'What are the main findings on neural scaling?',
  'Which paper discusses reinforcement learning limitations?',
  'Show research mentioning multimodal benchmarks.',
]

export default function SearchPage({ addToast }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (nextQuery = query) => {
    const normalizedQuery = nextQuery.trim()
    if (!normalizedQuery) return
    setLoading(true)
    setQuery(normalizedQuery)
    try {
      const data = await searchPapers(normalizedQuery)
      setResults(data)
    } catch {
      addToast({ type: 'error', message: 'Search failed. Is the backend running?' })
    }
    setLoading(false)
  }

  return (
    <div className="feature-shell">
      <div className="feature-header">
        <div>
          <p className="feature-eyebrow">Search</p>
          <h2 className="feature-title">Run natural-language retrieval across your paper library</h2>
          <p className="feature-copy">
            This uses your backend search endpoint and surfaces matches with snippets and placeholder relevance scores.
          </p>
        </div>
      </div>

      <div className="glass-panel feature-panel">
        <div className="search-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask a retrieval question about your uploaded papers"
          />
          <button type="button" onClick={() => handleSearch()} disabled={loading || !query.trim()}>
            {loading ? <><Spinner size={14} /> Searching...</> : 'Search'}
          </button>
        </div>
        <div className="prompt-row">
          {searchPrompts.map((prompt) => (
            <button key={prompt} type="button" className="ghost-chip" onClick={() => handleSearch(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="result-list">
        {results === null && (
          <div className="glass-panel empty-state">
            <h3>Start with a question</h3>
            <p>Search inspects titles, filenames, extracted text, summaries, and insights.</p>
          </div>
        )}

        {results !== null && results.length === 0 && (
          <div className="glass-panel empty-state">
            <h3>No matching papers found</h3>
            <p>Try broader wording or generate summaries and insights first so more fields are searchable.</p>
          </div>
        )}

        {results?.length > 0 && results.map((result, index) => (
          <div key={`${result.id}-${index}`} className="glass-panel result-card">
            <div className="panel-row">
              <h3>{result.title || result.filename}</h3>
              <span className="score-pill">{Math.round((result.score || 0) * 100)}% match</span>
            </div>
            <p className="result-snippet">{result.snippet || result.filename}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
