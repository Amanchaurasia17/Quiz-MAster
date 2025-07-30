const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Quiz creation validation
const validateQuiz = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('category')
    .isIn(['technology', 'science', 'mathematics', 'history', 'literature', 'sports', 'general', 'programming'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .isIn(['easy', 'medium', 'hard', 'mixed'])
    .withMessage('Invalid difficulty level'),
  
  body('timeLimit')
    .isInt({ min: 1, max: 180 })
    .withMessage('Time limit must be between 1 and 180 minutes'),
  
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Quiz must have at least one question'),
  
  body('questions.*.question')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Question must be between 5 and 500 characters'),
  
  body('questions.*.options')
    .isArray({ min: 2, max: 6 })
    .withMessage('Each question must have between 2 and 6 options'),
  
  body('questions.*.options.*.text')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Option text must be between 1 and 200 characters'),
  
  body('questions.*.difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid question difficulty'),
  
  body('questions.*.points')
    .isInt({ min: 1, max: 10 })
    .withMessage('Points must be between 1 and 10'),
  
  handleValidationErrors
];

// Quiz result validation
const validateResult = [
  body('quizId')
    .isMongoId()
    .withMessage('Invalid quiz ID'),
  
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers array is required'),
  
  body('answers.*.questionId')
    .isMongoId()
    .withMessage('Invalid question ID'),
  
  body('answers.*.selectedOptionId')
    .isMongoId()
    .withMessage('Invalid option ID'),
  
  body('totalTime')
    .isInt({ min: 1 })
    .withMessage('Total time must be a positive integer'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateQuiz,
  validateResult,
  handleValidationErrors
};
