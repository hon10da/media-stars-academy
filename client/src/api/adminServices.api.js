import axiosClient from './axiosClient'

export const getAdminServices = () => axiosClient.get('/admin/services')
export const getAdminService = (id) => axiosClient.get(`/admin/services/${id}`)
export const createAdminService = (payload) => axiosClient.post('/admin/services', payload)
export const updateAdminService = (id, payload) => axiosClient.put(`/admin/services/${id}`, payload)
export const deleteAdminService = (id) => axiosClient.delete(`/admin/services/${id}`)
