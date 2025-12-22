import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const paymentService = {
  createPaymentIntent: async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/payment/create-intent`, {}, config);
    return response.data;
  },

  confirmPayment: async (token, paymentData) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}/payment/confirm`, paymentData, config);
    return response.data;
  }
};
