import axios from 'axios'

const RAW_BASE = process.env.REACT_APP_API_BASE_URL?.trim()
const BASE = RAW_BASE || '/api'

const api = axios.create({
  baseURL: BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const refresh = localStorage.getItem('refresh_token')

    if (error.response?.status === 401 && refresh && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const response = await axios.post(`${BASE}/auth/token/refresh/`, { refresh })
        const nextAccess = response.data.access
        localStorage.setItem('access_token', nextAccess)
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${nextAccess}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export async function signup(data) {
  const res = await api.post('/auth/signup/', data)
  return res.data
}

export async function login(data) {
  const res = await api.post('/auth/login/', data)
  return res.data
}

export async function refreshToken(data) {
  const res = await api.post('/auth/token/refresh/', data)
  return res.data
}

export async function uploadPDF(file, text = '') {
  const form = new FormData()
  form.append('file', file)
  form.append('text', text)
  const res = await api.post('/upload/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function listPapers() {
  const res = await api.get('/')
  return res.data
}

export async function getPaper(id) {
  const res = await api.get(`/${id}/`)
  return res.data
}

export async function summarize(id) {
  const res = await api.post(`/${id}/summarize/`)
  return res.data
}

export async function extractInsights(id) {
  const res = await api.post(`/${id}/insights/`)
  return res.data
}

export async function searchPapers(query) {
  const res = await api.get('/search/', { params: { q: query } })
  return res.data
}

export async function chatQuery(paperId, question, language = 'en') {
  const res = await api.post('/chat/', {
    paper_id: paperId,
    question,
    language,
  })
  return res.data
}

export async function deletePaper(id) {
  const res = await api.delete(`/${id}/delete/`)
  return res.data
}
