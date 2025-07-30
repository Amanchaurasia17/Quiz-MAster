const axios = require('axios');

class OpenTriviaService {
  constructor() {
    this.baseURL = 'https://opentdb.com/api.php';
    this.categoryMap = {
      'technology': 18, // Science: Computers
      'science': 17, // Science & Nature
      'mathematics': 19, // Science: Mathematics
      'history': 23, // History
      'literature': 10, // Entertainment: Books
      'sports': 21, // Sports
      'general': 9, // General Knowledge
      'programming': 18 // Science: Computers (closest match)
    };
    this.difficultyMap = {
      'easy': 'easy',
      'medium': 'medium',
      'hard': 'hard'
    };
  }

  /**
   * Fetch questions from Open Trivia Database
   * @param {Object} options - Options for fetching questions
   * @param {number} options.amount - Number of questions (default: 15)
   * @param {string} options.category - Category name
   * @param {string} options.difficulty - Difficulty level
   * @param {string} options.type - Question type (default: 'multiple')
   * @returns {Promise<Array>} Array of formatted questions
   */
  async fetchQuestions(options = {}) {
    try {
      const {
        amount = 15,
        category = null,
        difficulty = null,
        type = 'multiple'
      } = options;

      // Build API URL
      let apiUrl = `${this.baseURL}?amount=${amount}&type=${type}`;
      
      if (category && this.categoryMap[category]) {
        apiUrl += `&category=${this.categoryMap[category]}`;
      }
      
      if (difficulty && this.difficultyMap[difficulty]) {
        apiUrl += `&difficulty=${this.difficultyMap[difficulty]}`;
      }

      console.log('Fetching questions from:', apiUrl);
      
      const response = await axios.get(apiUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Quiz-Master-App/1.0'
        }
      });

      if (response.data.response_code !== 0) {
        throw new Error(`Open Trivia DB API error: ${this.getErrorMessage(response.data.response_code)}`);
      }

      return this.formatQuestions(response.data.results);
    } catch (error) {
      console.error('Error fetching questions from Open Trivia DB:', error.message);
      throw new Error(`Failed to fetch questions: ${error.message}`);
    }
  }

  /**
   * Format Open Trivia DB questions to match our quiz schema
   * @param {Array} questions - Raw questions from API
   * @returns {Array} Formatted questions
   */
  formatQuestions(questions) {
    return questions.map((q, index) => {
      // Decode HTML entities
      const question = this.decodeHtml(q.question);
      const correctAnswer = this.decodeHtml(q.correct_answer);
      const incorrectAnswers = q.incorrect_answers.map(answer => this.decodeHtml(answer));
      
      // Combine and shuffle answers
      const allAnswers = [correctAnswer, ...incorrectAnswers];
      const shuffledAnswers = this.shuffleArray(allAnswers);
      
      // Find the correct answer index after shuffling
      const correctIndex = shuffledAnswers.indexOf(correctAnswer);
      
      // Create options array with isCorrect flags
      const options = shuffledAnswers.map((answer, idx) => ({
        text: answer,
        isCorrect: idx === correctIndex
      }));

      return {
        question: question,
        options: options,
        explanation: `The correct answer is: ${correctAnswer}`,
        difficulty: q.difficulty,
        points: this.getPointsByDifficulty(q.difficulty)
      };
    });
  }

  /**
   * Decode HTML entities in strings
   * @param {string} str - String with HTML entities
   * @returns {string} Decoded string
   */
  decodeHtml(str) {
    const htmlEntities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&ldquo;': '"',
      '&rdquo;': '"',
      '&rsquo;': "'",
      '&lsquo;': "'",
      '&hellip;': '...',
      '&ndash;': '–',
      '&mdash;': '—'
    };
    
    return str.replace(/&[#\w]+;/g, (entity) => {
      return htmlEntities[entity] || entity;
    });
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get points based on difficulty
   * @param {string} difficulty - Question difficulty
   * @returns {number} Points for the question
   */
  getPointsByDifficulty(difficulty) {
    const pointsMap = {
      'easy': 1,
      'medium': 2,
      'hard': 3
    };
    return pointsMap[difficulty] || 1;
  }

  /**
   * Get error message for API response codes
   * @param {number} code - Response code from API
   * @returns {string} Error message
   */
  getErrorMessage(code) {
    const errorMessages = {
      1: 'No Results - Could not return results. The API doesn\'t have enough questions for your query.',
      2: 'Invalid Parameter - Contains an invalid parameter. Arguments passed in aren\'t valid.',
      3: 'Token Not Found - Session Token does not exist.',
      4: 'Token Empty - Session Token has returned all possible questions for the specified query.'
    };
    return errorMessages[code] || `Unknown error (Code: ${code})`;
  }

  /**
   * Get available categories from the API
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    try {
      const response = await axios.get('https://opentdb.com/api_category.php', {
        timeout: 5000
      });
      return response.data.trivia_categories;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      return [];
    }
  }
}

module.exports = new OpenTriviaService();
