const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  options: [{
    text: {
      type: String,
      required: [true, 'Option text is required'],
      trim: true,
      maxlength: [200, 'Option cannot exceed 200 characters']
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  explanation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 1,
    min: [1, 'Points must be at least 1'],
    max: [10, 'Points cannot exceed 10']
  }
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'science', 'mathematics', 'history', 'literature', 'sports', 'general', 'programming'],
    lowercase: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'medium'
  },
  questions: [QuestionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 30,
    min: [1, 'Time limit must be at least 1 minute'],
    max: [180, 'Time limit cannot exceed 180 minutes']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate total points before saving
QuizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  next();
});

// Validate that there's at least one correct answer per question
QuestionSchema.pre('save', function(next) {
  const correctAnswers = this.options.filter(option => option.isCorrect);
  if (correctAnswers.length === 0) {
    next(new Error('Each question must have at least one correct answer'));
  } else {
    next();
  }
});

// Update quiz statistics
QuizSchema.methods.updateStats = async function(score) {
  this.attempts += 1;
  this.averageScore = Math.round(((this.averageScore * (this.attempts - 1)) + score) / this.attempts * 100) / 100;
  return await this.save();
};

// Get quiz without correct answers (for taking quiz)
QuizSchema.methods.getQuizForUser = function() {
  const quiz = this.toObject();
  quiz.questions = quiz.questions.map(question => ({
    _id: question._id,
    question: question.question,
    options: question.options.map(option => ({
      _id: option._id,
      text: option.text
    })),
    difficulty: question.difficulty,
    points: question.points
  }));
  return quiz;
};

module.exports = mongoose.model('Quiz', QuizSchema);
