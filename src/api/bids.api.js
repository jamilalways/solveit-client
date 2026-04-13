import api from './axios'

export const getBids       = (problemId) => api.get(`/problems/${problemId}/bids`)
export const getMyBids     = ()          => api.get('/bids/mine')
export const getIncomingBids = ()        => api.get('/bids/incoming')
export const submitBid     = (problemId, data) => api.post(`/problems/${problemId}/bids`, data)
export const acceptBid     = (bidId)     => api.put(`/bids/${bidId}/accept`)
export const rejectBid     = (bidId)     => api.put(`/bids/${bidId}/reject`)