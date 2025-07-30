import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { resultService } from '../services/resultService';
import './QuizTake.css';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await quizService.getQuiz(id);
      setQuiz(response);
      setTimeLeft(response.timeLimit * 60); // Convert minutes to seconds
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load quiz. Please try again.');
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!autoSubmit) {
      const confirmSubmit = window.confirm(
        'Are you sure you want to submit your quiz? This action cannot be undone.'
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    
    try {
      const submissionData = {
        quizId: id,
        answers: Object.keys(answers).map(questionIndex => {
          const questionId = quiz.questions[parseInt(questionIndex)]._id;
          const selectedOptionIndex = answers[questionIndex];
          const selectedOptionId = quiz.questions[parseInt(questionIndex)].options[selectedOptionIndex]._id;
          
          return {
            questionId: questionId,
            selectedOptionId: selectedOptionId
          };
        }),
        totalTime: (quiz.timeLimit * 60) - timeLeft
      };

      const response = await resultService.submitResult(submissionData);
      
      // Trigger dashboard refresh
      localStorage.setItem('dashboardRefresh', Date.now().toString());
      
      navigate(`/result/${response._id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  }, [id, answers, quiz, timeLeft, navigate]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmit(true); // Auto-submit when time runs out
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, handleSubmit]);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/quizzes')} className="btn-primary">
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-error">
        <h2>Quiz not found</h2>
        <button onClick={() => navigate('/quizzes')} className="btn-primary">
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-intro">
        <div className="quiz-intro-card">
          <h1>{quiz.title}</h1>
          <p className="quiz-description">{quiz.description}</p>
          
          <div className="quiz-info">
            <div className="info-item">
              <span className="info-label">Questions:</span>
              <span className="info-value">{quiz.questions.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time Limit:</span>
              <span className="info-value">{quiz.timeLimit} minutes</span>
            </div>
            <div className="info-item">
              <span className="info-label">Difficulty:</span>
              <span className={`info-value difficulty-${quiz.difficulty}`}>
                {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="quiz-instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Read each question carefully before selecting an answer</li>
              <li>You can navigate between questions using the Previous/Next buttons</li>
              <li>Your progress is automatically saved</li>
              <li>Once you submit, you cannot change your answers</li>
              <li>The quiz will auto-submit when time runs out</li>
            </ul>
          </div>
          
          <button onClick={startQuiz} className="btn-start-quiz">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        
        <div className="quiz-timer">
          <span className={`timer ${timeLeft < 300 ? 'timer-warning' : ''}`}>
            ⏱️ {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <h2 className="question-text">{currentQ.question}</h2>
          
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <label 
                key={index} 
                className={`option-label ${answers[currentQuestion] === index ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(currentQuestion, index)}
                />
                <span className="option-text">{option.text || option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button 
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="btn-nav btn-previous"
          >
            ← Previous
          </button>
          
          <div className="question-numbers">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`question-number ${
                  index === currentQuestion ? 'current' : ''
                } ${answers[index] !== undefined ? 'answered' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <button 
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn-submit"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="btn-nav btn-next"
            >
              Next →
            </button>
          )}
        </div>
      </div>
      
      <div className="quiz-sidebar">
        <div className="answered-count">
          <h4>Progress</h4>
          <p>{Object.keys(answers).length} of {quiz.questions.length} answered</p>
        </div>
        
        <button 
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="btn-submit-sidebar"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizTake;
