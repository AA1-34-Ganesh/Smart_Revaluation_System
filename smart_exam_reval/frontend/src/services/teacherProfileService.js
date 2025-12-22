// src/services/teacherProfileService.js
import api from '../api/axios';

export const teacherProfileService = {
  // Get teacher profile
  getProfile: async () => {
    try {
      const response = await api.get('/teacher/profile'); // Backend API for teacher profile
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      throw error;
    }
  },
};
