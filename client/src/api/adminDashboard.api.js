import axiosClient from './axiosClient'

export const getAdminDashboardStats = () => axiosClient.get('/admin/dashboard/stats')
