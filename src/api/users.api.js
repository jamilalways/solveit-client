import api from './axios'

export const getProfile    = (id) => api.get(`/users/${id}`)
export const updateProfile = (formData) => api.put('/users/me', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
