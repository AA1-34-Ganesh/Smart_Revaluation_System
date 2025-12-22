import api from '../api/axios';

export const revaluationService = {
    // Composite function: Creates Request -> Then Payments
    applyForRevaluation: async ({ studentId, studentName, registerNumber, subject, subjectCode, currentMarks, userEmail }) => {
        try {
            // Step 1: Create the Revaluation Request
            // Backend /create expects: subject_name (based on validation schema)
            const createPayload = {
                subject_name: subject
            };

            const createResponse = await api.post('/revaluation/create', createPayload);
            const newRequest = createResponse.data;

            if (!newRequest || !newRequest.id) {
                throw new Error("Failed to create request ID");
            }

            // Step 2: Process Mock Payment
            // Backend /payment expects: requestId, studentEmail
            const paymentPayload = {
                requestId: newRequest.id,
                studentEmail: userEmail
            };

            const paymentResponse = await api.post('/revaluation/payment', paymentPayload);

            return { ...newRequest, ...paymentResponse.data };

        } catch (error) {
            console.error("Revaluation Application Error:", error);
            throw error;
        }
    },

    getRequests: async () => {
        // For student's "My Requests"
        const response = await api.get('/revaluation/my-requests');
        return response.data;
    },

    uploadAnswerSheet: async (requestId, files) => {
        const formData = new FormData();
        formData.append('requestId', requestId);

        // Append all files to the same field name 'files'
        // 'files' must match upload.array('files') in backend
        if (files && files.length > 0) {
            Array.from(files).forEach((file) => {
                formData.append('files', file);
            });
        }

        const response = await api.post('/upload/answer-sheet', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    appealRequest: async (requestId, reason) => {
        const response = await api.post('/revaluation/appeal', { requestId, reason });
        return response.data;
    }
};