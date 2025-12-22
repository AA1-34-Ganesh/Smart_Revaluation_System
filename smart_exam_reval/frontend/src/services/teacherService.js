import api from '../api/axios';

export const studentService = {
    getMarks: async (studentId) => {
        try {
            // Backend route is /student/dashboard
            const response = await api.get('/student/dashboard');
            
            // Assuming backend dashboard returns { student: {...}, marks: [...] }
            // or if it returns just the marks array (based on your 'marks' query)
            // We handle both cases safely
            const marksData = response.data.marks || response.data || [];

            // Map Backend Fields to Frontend UI Expectations
            return marksData.map(mark => ({
                subject: mark.subject_name, // Backend: subject_name
                code: mark.subject_code,    // Backend: subject_code
                marks: mark.score,          // Backend: score
                grade: mark.grade,
                status: mark.status
            }));
        } catch (error) {
            console.error("Error fetching student marks:", error);
            throw error;
        }
    }
};