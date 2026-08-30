import axiosClient from './axiosClient'

export const getTrainers = (params) => axiosClient.get('/trainers', { params })
export const getTrainerBySlug = (slug) => axiosClient.get(`/trainers/${slug}`)
