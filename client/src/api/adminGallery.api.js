import axiosClient from './axiosClient'

export const getAdminGallery = () =>
  axiosClient.get('/admin/gallery')

export const getAdminGalleryItem = (id) =>
  axiosClient.get(`/admin/gallery/${id}`)

export const createAdminGalleryItem = (formData) =>
  axiosClient.post('/admin/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const updateAdminGalleryItem = (id, formData) =>
  axiosClient.put(`/admin/gallery/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const deleteAdminGalleryItem = (id) =>
  axiosClient.delete(`/admin/gallery/${id}`)