import api from './axios'

export const getContracts      = ()       => api.get('/contracts')
export const getContract       = (id)     => api.get(`/contracts/${id}`)
export const submitSolution    = (id, data) => api.post(`/contracts/${id}/submit`, data)
export const completeContract  = (id)     => api.put(`/contracts/${id}/complete`)