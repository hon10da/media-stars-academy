import axiosClient from './axiosClient'

export const getAdminMessages = (params) => axiosClient.get('/admin/messages', { params })
export const updateAdminMessageStatus = (id, status) => axiosClient.patch(`/admin/messages/${id}`, { status })
