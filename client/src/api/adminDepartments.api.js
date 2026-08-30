import axiosClient from './axiosClient'

export const getAdminDepartments = () => axiosClient.get('/admin/departments')
export const getAdminDepartment = (id) => axiosClient.get(`/admin/departments/${id}`)
export const createAdminDepartment = (payload) => axiosClient.post('/admin/departments', payload)
export const updateAdminDepartment = (id, payload) => axiosClient.put(`/admin/departments/${id}`, payload)
export const deleteAdminDepartment = (id) => axiosClient.delete(`/admin/departments/${id}`)
