import axiosClient from './axiosClient'

// Matches the existing public backend contract from Phase 3:
// GET /api/services, GET /api/services/:slug
export const getServices = (params) => axiosClient.get('/services', { params })
export const getServiceBySlug = (slug) => axiosClient.get(`/services/${slug}`)
