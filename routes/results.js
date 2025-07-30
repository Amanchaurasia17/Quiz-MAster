const express = require('express');
const mongoose = require('mongoose');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { validateResult } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/results
// @desc    Submit quiz results
// @access  Private
router.post('/', protect, validateResult, async (req, res) => {
  try {
    const { quizId, answers, totalTime } = req.body;
    const userId = req.user.id;
    
    // Get quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    if (!quiz.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Quiz is not published'
      });
    }
    
    // Calculate score
    let score = 0;
    let correctAnswers = 0;
    const processedAnswers = [];
    
    answers.forEach(answer => {
      const question = quiz.questions.id(answer.questionId);
      if (question) {
        const selectedOption = question.options.id(answer.selectedOptionId);
        const isCorrect = selectedOption ? selectedOption.isCorrect : false;
        
        if (isCorrect) {
          score += question.points;
          correctAnswers++;
        }
        
        processedAnswers.push({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect,
          points: isCorrect ? question.points : 0,
          timeSpent: answer.timeSpent || 0
        });
      }
    });
    
    // Calculate percentage
    const percentage = quiz.totalPoints > 0 ? Math.round((score / quiz.totalPoints) * 100) : 0;
    
    // Create result
    const result = await Result.create({
      user: userId,
      quiz: quizId,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      percentage,
      totalTime,
      status: answers.length === quiz.questions.length ? 'completed' : 'incomplete'
    });
    
    // Update user and quiz statistics
    await Promise.all([
      User.findById(userId).then(user => user.updateStats(score, quiz.questions.length)),
      quiz.updateStats(percentage)
    ]);
    
    // Populate result for response
    await result.populate([
      { path: 'user', select: 'username email' },
      { path: 'quiz', select: 'title description category totalPoints' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Quiz results submitted successfully',
      data: { result }
    });
    
  } catch (error) {
    console.error('Submit result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting results'
    });
  }
});

// @route   GET /api/results
// @desc    Get current user's results
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      quiz,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    let query = { user: req.user.id };
    
    if (quiz) {
      query.quiz = quiz;
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const results = await Result.find(query)
      .populate('quiz', 'title description category difficulty totalPoints')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
    
    const total = await Result.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      data: {
        results,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalResults: total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching results'
    });
  }
});

// @route   GET /api/results/:id
// @desc    Get specific result with detailed answers
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('user', 'username email')
      .populate('quiz');
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }
    
    // Check access permissions
    if (result.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Enhance answers with question and option details
    if (result.quiz && result.quiz.questions) {
      const enhancedAnswers = result.answers.map(answer => {
        const question = result.quiz.questions.id(answer.questionId);
        if (question) {
          const selectedOption = question.options.id(answer.selectedOptionId);
          const correctOption = question.options.find(opt => opt.isCorrect);
          
          return {
            ...answer.toObject(),
            question: question.question,
            selectedAnswer: selectedOption ? selectedOption.text : 'No answer selected',
            correctAnswer: correctOption ? correctOption.text : 'Unknown',
            explanation: question.explanation || ''
          };
        }
        return answer;
      });
      
      const resultObj = result.toObject();
      resultObj.answers = enhancedAnswers;
      
      res.json({
        success: true,
        data: { result: resultObj }
      });
    } else {
      res.json({
        success: true,
        data: { result }
      });
    }
    
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching result'
    });
  }
});

// @route   GET /api/results/quiz/:quizId
// @desc    Get all results for a specific quiz
// @access  Private (Admin only)
router.get('/quiz/:quizId', protect, adminOnly, async (req, res) => {
  try {
    const results = await Result.find({ quiz: req.params.quizId })
      .populate('user', 'username email')
      .populate('quiz', 'title description')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { results }
    });
    
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz results'
    });
  }
});

// @route   GET /api/results/user/:userId
// @desc    Get all results for a specific user
// @access  Private (Admin only or own results)
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check access permissions
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const results = await Result.find({ user: userId })
      .populate('quiz', 'title description category difficulty totalPoints')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { results }
    });
    
  } catch (error) {
    console.error('Get user results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user results'
    });
  }
});

// @route   GET /api/results/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's results statistics
    const stats = await Result.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          highestScore: { $max: '$percentage' },
          totalTimeSpent: { $sum: '$totalTime' }
        }
      }
    ]);
    
    // Get recent results
    const recentResults = await Result.find({ user: userId })
      .populate('quiz', 'title category')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get performance by category
    const categoryPerformance = await Result.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }
      },
      { $unwind: '$quizData' },
      {
        $group: {
          _id: '$quizData.category',
          averageScore: { $avg: '$percentage' },
          totalQuizzes: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          totalQuizzes: 0,
          averageScore: 0,
          highestScore: 0,
          totalTimeSpent: 0
        },
        recentResults,
        categoryPerformance
      }
    });
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard statistics'
    });
  }
});

// @route   DELETE /api/results/:id
// @desc    Delete a result
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }
    
    await Result.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Result deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting result'
    });
  }
});

module.exports = router;
