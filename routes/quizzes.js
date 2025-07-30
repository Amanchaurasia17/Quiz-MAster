const express = require('express');
const Quiz = require('../models/Quiz');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateQuiz } = require('../middleware/validation');
const openTriviaService = require('../services/openTriviaService');

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all published quizzes
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    let query = { isPublished: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'username')
      .select('-questions.options.isCorrect -questions.explanation')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
    
    const total = await Quiz.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      data: {
        quizzes,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalQuizzes: total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quizzes'
    });
  }
});

// @route   GET /api/quizzes/categories
// @desc    Get quiz categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Quiz.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: { categories }
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get specific quiz
// @access  Public (for taking quiz) / Private (for full details)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'username');
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Check if quiz is published or user is admin/creator
    if (!quiz.isPublished && (!req.user || (req.user.role !== 'admin' && quiz.createdBy._id.toString() !== req.user.id))) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is not published'
      });
    }
    
    // If user is taking the quiz, hide correct answers
    if (!req.user || (req.user.role !== 'admin' && quiz.createdBy._id.toString() !== req.user.id)) {
      const quizForUser = quiz.getQuizForUser();
      return res.json({
        success: true,
        data: { quiz: quizForUser }
      });
    }
    
    // Return full quiz for admin/creator
    res.json({
      success: true,
      data: { quiz }
    });
    
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz'
    });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private (Admin only)
router.post('/', protect, adminOnly, validateQuiz, async (req, res) => {
  try {
    const quizData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const quiz = await Quiz.create(quizData);
    
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: { quiz }
    });
    
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating quiz'
    });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, validateQuiz, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Update quiz
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');
    
    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: { quiz: updatedQuiz }
    });
    
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating quiz'
    });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    await Quiz.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting quiz'
    });
  }
});

// @route   PUT /api/quizzes/:id/publish
// @desc    Toggle quiz publish status
// @access  Private (Admin only)
router.put('/:id/publish', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    quiz.isPublished = !quiz.isPublished;
    await quiz.save();
    
    res.json({
      success: true,
      message: `Quiz ${quiz.isPublished ? 'published' : 'unpublished'} successfully`,
      data: { quiz }
    });
    
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating quiz status'
    });
  }
});

// @route   GET /api/quizzes/admin/all
// @desc    Get all quizzes for admin
// @access  Private (Admin only)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { quizzes }
    });
    
  } catch (error) {
    console.error('Get admin quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quizzes'
    });
  }
});

// @route   POST /api/quizzes/generate
// @desc    Generate quiz from Open Trivia DB API
// @access  Private (Any logged-in user)
router.post('/generate', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      category = 'general',
      difficulty = 'medium',
      amount = 15,
      timeLimit = 30
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Fetch questions from Open Trivia DB
    console.log('Generating quiz with options:', { amount, category, difficulty });
    const questions = await openTriviaService.fetchQuestions({
      amount: parseInt(amount),
      category: category,
      difficulty: difficulty
    });

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions available for the specified criteria'
      });
    }

    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    // Create new quiz
    const quiz = new Quiz({
      title: title,
      description: description,
      category: category,
      difficulty: difficulty,
      questions: questions,
      timeLimit: parseInt(timeLimit),
      isPublished: true,
      totalPoints: totalPoints,
      createdBy: req.user._id,
      tags: ['generated', 'trivia', category]
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      data: { quiz },
      message: `Quiz generated successfully with ${questions.length} questions from Open Trivia DB`
    });

  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating quiz'
    });
  }
});

// @route   GET /api/quizzes/trivia-categories
// @desc    Get available categories from Open Trivia DB
// @access  Private (Any logged-in user)
router.get('/trivia-categories', protect, async (req, res) => {
  try {
    const categories = await openTriviaService.getCategories();
    
    res.json({
      success: true,
      data: { 
        categories,
        mappedCategories: {
          'technology': 'Science: Computers',
          'science': 'Science & Nature', 
          'mathematics': 'Science: Mathematics',
          'history': 'History',
          'literature': 'Entertainment: Books',
          'sports': 'Sports',
          'general': 'General Knowledge',
          'programming': 'Science: Computers'
        }
      }
    });
    
  } catch (error) {
    console.error('Get trivia categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
});

module.exports = router;
