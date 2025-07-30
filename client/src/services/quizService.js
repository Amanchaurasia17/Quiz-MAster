import API from './api';

export const quizService = {
  // Get all quizzes
  getQuizzes: async (params = {}) => {
    try {
      const response = await API.get('/quizzes', { params });
      return response.data.data.quizzes; // Extract quizzes from nested response
    } catch (error) {
      console.error('Quiz service error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  },

  // Get specific quiz
  getQuiz: async (id) => {
    const response = await API.get(`/quizzes/${id}`);
    return response.data.data.quiz; // Extract quiz from nested response
  },

  // Get quiz categories
  getCategories: async () => {
    const response = await API.get('/quizzes/categories');
    return response.data.data; // Extract data from response
  },

  // Create quiz (admin only)
  createQuiz: async (quizData) => {
    const response = await API.post('/quizzes', quizData);
    return response.data.data; // Extract data from response
  },

  // Update quiz (admin only)
  updateQuiz: async (id, quizData) => {
    const response = await API.put(`/quizzes/${id}`, quizData);
    return response.data.data; // Extract data from response
  },

  // Delete quiz (admin only)
  deleteQuiz: async (id) => {
    const response = await API.delete(`/quizzes/${id}`);
    return response.data; // Success response
  },

  // Toggle quiz publish status (admin only)
  togglePublish: async (id) => {
    const response = await API.put(`/quizzes/${id}/publish`);
    return response.data.data; // Extract data from response
  },

  // Get all quizzes for admin
  getAdminQuizzes: async () => {
    const response = await API.get('/quizzes/admin/all');
    return response.data.data.quizzes; // Extract quizzes from nested response
  },

  // Generate quiz from Open Trivia DB API
  generateQuiz: async (quizData) => {
    try {
      const response = await API.post('/quizzes/generate', quizData);
      return response.data; // Return full response including success message
    } catch (error) {
      console.error('Generate quiz error:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate quiz');
    }
  },

  // Get trivia categories from Open Trivia DB
  getTriviaCategories: async () => {
    const response = await API.get('/quizzes/trivia-categories');
    return response.data.data; // Extract data from response
  }
};
