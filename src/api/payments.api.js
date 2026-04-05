import api from './axios'

export const getWallet       = ()        => api.get('/wallet')
export const depositFunds    = (data)    => api.post('/wallet/deposit', data)
export const withdrawFunds   = (data)    => api.post('/wallet/withdraw', data)
export const lockEscrow      = (contractId) => api.post(`/payments/escrow/${contractId}`)
export const releaseEscrow   = (contractId) => api.post(`/payments/release/${contractId}`)