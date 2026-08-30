import axiosClient from './axiosClient'

export const getAdminRegistrations = (params) => axiosClient.get('/admin/registrations', { params })
export const updateAdminRegistrationStatus = (id, status) =>
  axiosClient.patch(`/admin/registrations/${id}`, { status })
