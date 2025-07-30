import API from './api';

export const resultService = {
  // Submit quiz results
  submitResult: async (resultData) => {
    const response = await API.post('/results', resultData);
    return response.data.data.result; // Extract result from nested response
  },

  // Get user's results
  getResults: async (params = {}) => {
    const response = await API.get('/results', { params });
    return response.data.data.results; // Extract results from nested response
  },

  // Get specific result
  getResult: async (id) => {
    const response = await API.get(`/results/${id}`);
    return response.data.data.result; // Extract result from nested response
  },

  // Get results for specific quiz (admin only)
  getQuizResults: async (quizId) => {
    const response = await API.get(`/results/quiz/${quizId}`);
    return response.data.data; // Extract data from response
  },

  // Get results for specific user
  getUserResults: async (userId) => {
    const response = await API.get(`/results/user/${userId}`);
    return response.data.data; // Extract data from response
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await API.get('/results/stats/dashboard');
    return response.data.data; // Extract data from response
  },

  // Delete result (admin only)
  deleteResult: async (id) => {
    const response = await API.delete(`/results/${id}`);
    return response.data; // Success response
  }
};
