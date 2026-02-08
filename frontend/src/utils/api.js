import axios from 'axios'

const BASE = '/api'

// Auth functions
export async function signup(data) {
  const res = await axios.post(`${BASE}/auth/signup/`, data)
  return res.data
}

export async function login(data) {
  const res = await axios.post(`${BASE}/auth/login/`, data)
  return res.data
}

export async function refreshToken(data) {
  const res = await axios.post(`${BASE}/auth/token/refresh/`, data)
  return res.data
}

export async function uploadPDF(file, text = '') {
  const form = new FormData()
  form.append('file', file)
  form.append('text', text)
  const res = await axios.post(`${BASE}/papers/upload/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export async function listPapers() {
  const res = await axios.get(`${BASE}/papers/`)
  return res.data
}

export async function getPaper(id) {
  const res = await axios.get(`${BASE}/papers/${id}/`)
  return res.data
}

export async function summarize(id) {
  const res = await axios.post(`${BASE}/papers/${id}/summarize/`)
  return res.data
}

export async function extractInsights(id) {
  const res = await axios.post(`${BASE}/papers/${id}/insights/`)
  return res.data
}

export async function searchPapers(query) {
  const res = await axios.get(`${BASE}/papers/search/`, { params: { q: query } })
  return res.data
}

export async function chatQuery(paperId, question, language = 'en') {
  const res = await axios.post(`${BASE}/papers/chat/`, {
    paper_id: paperId,
    question,
    language
  })
  return res.data
}

export async function deletePaper(id) {
  const res = await axios.delete(`${BASE}/papers/${id}/delete/`)
  return res.data
}
