import axiosClient from './axiosClient'

export const getAdminTrainers = () => axiosClient.get('/admin/trainers')
export const getAdminTrainer = (id) => axiosClient.get(`/admin/trainers/${id}`)
export const createAdminTrainer = (payload) => axiosClient.post('/admin/trainers', payload)
export const updateAdminTrainer = (id, payload) => axiosClient.put(`/admin/trainers/${id}`, payload)
export const deleteAdminTrainer = (id) => axiosClient.delete(`/admin/trainers/${id}`)
