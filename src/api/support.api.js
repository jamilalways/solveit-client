import axiosInstance from './axios';

export const supportApi = {
  createTicket: async (ticketData) => {
    const res = await axiosInstance.post('/support', ticketData);
    return res.data;
  },

  getAllTicketsForAdmin: async () => {
    const res = await axiosInstance.get('/support/admin');
    return res.data;
  },

  updateTicketStatus: async (id, data) => {
    const res = await axiosInstance.put(`/support/${id}/status`, data);
    return res.data;
  },
  
  getMyTickets: async () => {
    const res = await axiosInstance.get('/support/my-tickets');
    return res.data;
  }
};
