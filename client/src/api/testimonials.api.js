import axiosClient from './axiosClient'

export const getTestimonials = () => axiosClient.get('/testimonials')
