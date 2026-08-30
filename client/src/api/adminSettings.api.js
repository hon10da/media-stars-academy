import axiosClient from './axiosClient'

export const getAdminSettings = () => axiosClient.get('/admin/settings')
export const updateAdminSettings = (payload) => axiosClient.put('/admin/settings', payload)
