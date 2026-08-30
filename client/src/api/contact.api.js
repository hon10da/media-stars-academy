import axiosClient from './axiosClient'

// These endpoints will be implemented on the backend in Phase 3.
// Kept here now so the frontend forms already target the final contract.
export const submitRegistration = (payload) => axiosClient.post('/registrations', payload)

export const submitContactMessage = (payload) => axiosClient.post('/contact', payload)
