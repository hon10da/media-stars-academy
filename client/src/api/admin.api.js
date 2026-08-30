import axiosClient from './axiosClient'

// Admin auth + resource management endpoints — implemented on the backend in Phase 3.
export const adminLogin = (credentials) => axiosClient.post('/admin/auth/login', credentials)
export const adminLogout = () => axiosClient.post('/admin/auth/logout')
export const getAdminProfile = () => axiosClient.get('/admin/auth/me')
