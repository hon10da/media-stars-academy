import axiosClient from './axiosClient'

export const getAdminPrograms = () => axiosClient.get('/admin/programs')
export const getAdminProgram = (id) => axiosClient.get(`/admin/programs/${id}`)
export const createAdminProgram = (payload) => axiosClient.post('/admin/programs', payload)
export const updateAdminProgram = (id, payload) => axiosClient.put(`/admin/programs/${id}`, payload)
export const deleteAdminProgram = (id) => axiosClient.delete(`/admin/programs/${id}`)
