import axiosClient from './axiosClient'

export const getAdminTestimonials = () =>
  axiosClient.get('/admin/testimonials')

export const getAdminTestimonial = (id) =>
  axiosClient.get(`/admin/testimonials/${id}`)

export const createAdminTestimonial = (payload) =>
  axiosClient.post('/admin/testimonials', payload)

export const updateAdminTestimonial = (id, payload) =>
  axiosClient.put(`/admin/testimonials/${id}`, payload)

export const deleteAdminTestimonial = (id) =>
  axiosClient.delete(`/admin/testimonials/${id}`)