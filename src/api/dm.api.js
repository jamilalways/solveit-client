import api from './axios'

export const getConversations       = ()   => api.get('/dm')
export const startConversation      = (userId) => api.post(`/dm/start/${userId}`)
export const getDirectMessages      = (conversationId) => api.get(`/dm/${conversationId}/messages`)
export const sendDirectMessage      = (conversationId, data) => api.post(`/dm/${conversationId}/messages`, data)
