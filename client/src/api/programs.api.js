import axiosClient from './axiosClient'

// Implemented on the backend in Phase 3. Pages currently render from
// local placeholder data (src/lib/placeholderData.js) until these are wired in.
export const getPrograms = (params) => axiosClient.get('/programs', { params })
export const getProgramBySlug = (slug) => axiosClient.get(`/programs/${slug}`)
