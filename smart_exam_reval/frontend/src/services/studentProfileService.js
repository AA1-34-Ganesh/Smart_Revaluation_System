// src/services/studentProfileService.js
import api from '../api/axios';

export const studentProfileService = {
  // Get student profile
  getProfile: async () => {
    try {
      const response = await api.get('/student/profile'); // Backend API for student profile
      return response.data;
    } catch (error) {
      console.error("Error fetching student profile:", error);
      throw error;
    }
  },
};
