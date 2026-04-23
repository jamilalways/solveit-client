import api from './axios'

export const getMessages  = (contractId) => api.get(`/chat/${contractId}`)
export const sendMessage  = (contractId, data) => api.post(`/chat/${contractId}`, data)