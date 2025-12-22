// src/services/authService.js
import api from '../api/axios';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  signup: async (data) => {
    // Build payload dynamically
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    // Add student fields
    if (data.role === "student") {
      payload.reg_no = data.reg_no;
      payload.department = data.department;
      // Subject is NOT added for students → fixes error
    }

    // Add teacher fields
    if (data.role === "teacher" && data.subject) {
      payload.subject = data.subject;
    }

    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('user');
    return true;
  }
};
