// Base URL for the backend API - same domain in production
export const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '' : 'http://localhost:3000'
)

// Helper to build full URL for frame images stored on backend
export const frameImageUrl = (path) => {
  if (!path) return ''
  // If path already has http, return as-is
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}
