import axiosClient from './axiosClient'

// Matches the existing public backend contract from Phase 3:
// GET /api/departments, GET /api/departments/:slug, GET /api/departments/:slug/services
export const getDepartments = (params) => axiosClient.get('/departments', { params })
export const getDepartmentBySlug = (slug) => axiosClient.get(`/departments/${slug}`)
export const getServicesByDepartmentSlug = (slug) => axiosClient.get(`/departments/${slug}/services`)
