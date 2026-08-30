import axiosClient from './axiosClient'

export const getAdminMediaPosts = () => axiosClient.get('/admin/media')
export const getAdminMediaPost = (id) => axiosClient.get(`/admin/media/${id}`)
export const createAdminMediaPost = (payload) => axiosClient.post('/admin/media', payload)
export const updateAdminMediaPost = (id, payload) => axiosClient.put(`/admin/media/${id}`, payload)
export const deleteAdminMediaPost = (id) => axiosClient.delete(`/admin/media/${id}`)
