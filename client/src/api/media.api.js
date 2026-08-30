import axiosClient from './axiosClient'

export const getMediaPosts = (params) => axiosClient.get('/media', { params })
export const getMediaPostBySlug = (slug) => axiosClient.get(`/media/${slug}`)
