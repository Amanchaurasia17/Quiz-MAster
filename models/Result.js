const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOptionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

const ResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalTime: {
    type: Number, // in seconds
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'incomplete', 'timeout'],
    default: 'completed'
  },
  feedback: {
    type: String,
    trim: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    default: 'F'
  }
}, {
  timestamps: true
});

// Calculate grade based on percentage
ResultSchema.pre('save', function(next) {
  const percentage = this.percentage;
  
  if (percentage >= 95) this.grade = 'A+';
  else if (percentage >= 90) this.grade = 'A';
  else if (percentage >= 85) this.grade = 'B+';
  else if (percentage >= 80) this.grade = 'B';
  else if (percentage >= 75) this.grade = 'C+';
  else if (percentage >= 70) this.grade = 'C';
  else if (percentage >= 60) this.grade = 'D';
  else this.grade = 'F';
  
  // Set feedback based on performance
  if (percentage >= 90) {
    this.feedback = 'Excellent work! Outstanding performance!';
  } else if (percentage >= 80) {
    this.feedback = 'Great job! Very good performance!';
  } else if (percentage >= 70) {
    this.feedback = 'Good work! Keep practicing to improve!';
  } else if (percentage >= 60) {
    this.feedback = 'Fair performance. Consider reviewing the material.';
  } else {
    this.feedback = 'Needs improvement. Please review the topics and try again.';
  }
  
  next();
});

// Index for efficient queries
ResultSchema.index({ user: 1, quiz: 1 });
ResultSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Result', ResultSchema);
