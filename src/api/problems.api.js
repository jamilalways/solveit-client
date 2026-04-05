import api from './axios'

export const getProblems    = (params) => api.get('/problems', { params })
export const getProblem     = (id)     => api.get(`/problems/${id}`)
export const createProblem  = (data)   => api.post('/problems', data)
export const updateProblem  = (id, data) => api.put(`/problems/${id}`, data)
export const deleteProblem  = (id)     => api.delete(`/problems/${id}`)