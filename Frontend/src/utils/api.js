// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8000',
// })

// export const getNotes = (section, page = 1, limit = 5, search = '') =>
//   api.get('/notes', { params: { section, page, limit, search: search || undefined } }).then(r => r.data)

// export const getNote = (id) => api.get(`/notes/${id}`).then(r => r.data)

// export const createNote = (data) => api.post('/notes', data).then(r => r.data)

// export const updateNote = (id, data) => api.put(`/notes/${id}`, data).then(r => r.data)

// export const deleteNote = (id) => api.delete(`/notes/${id}`).then(r => r.data)

// export const getStreak = () => api.get('/streak').then(r => r.data)

// export const getStats = () => api.get('/stats').then(r => r.data)




import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

// Attach token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If token expired redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const register = (data)  => api.post('/auth/register', data).then(r => r.data)
export const login    = (data)  => api.post('/auth/login', data, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(r => r.data)
export const getMe    = ()      => api.get('/auth/me').then(r => r.data)

// Notes
export const getNotes    = (section, page=1, limit=5, search='') =>
  api.get('/notes', { params: { section, page, limit, search: search || undefined } }).then(r => r.data)
export const getNote     = (id)    => api.get(`/notes/${id}`).then(r => r.data)
export const createNote  = (data)  => api.post('/notes', data).then(r => r.data)
export const updateNote  = (id, d) => api.put(`/notes/${id}`, d).then(r => r.data)
export const deleteNote  = (id)    => api.delete(`/notes/${id}`).then(r => r.data)

// Stats & Streak
export const getStreak = () => api.get('/streak').then(r => r.data)
export const getStats  = () => api.get('/stats').then(r => r.data)
