import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultService } from '../services/resultService';
import './QuizResult.css';

const QuizResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await resultService.getResult(id);
        setResult(response);
      } catch (error) {
        console.error('Error fetching result:', error);
        setError('Failed to load quiz result. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    } else {
      setError('Invalid result ID');
      setLoading(false);
    }
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'average';
    return 'poor';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Outstanding performance! 🌟';
    if (score >= 60) return 'Good job! You\'re doing well! 👍';
    if (score >= 40) return 'Not bad! Keep practicing! 💪';
    return 'Keep learning and try again! 📚';
  };

  if (loading) {
    return (
      <div className="quiz-result">
        <div className="container">
          <div className="loading">Loading your results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-result">
        <div className="container">
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <div className="error-actions">
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              <Link to="/quizzes" className="btn btn-outline">Browse Quizzes</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="quiz-result">
        <div className="container">
          <div className="error-state">
            <h2>Result Not Found</h2>
            <p>The quiz result you're looking for doesn't exist or has been removed.</p>
            <div className="error-actions">
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              <Link to="/quizzes" className="btn btn-outline">Browse Quizzes</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  return (
    <div className="quiz-result">
      <div className="container">
        <div className="result-card">
          <div className="result-header">
            <div className="result-icon">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : percentage >= 40 ? '👏' : '📖'}
            </div>
            <h1>Quiz Completed!</h1>
            <p className="quiz-title">{result.quiz?.title || 'Quiz'}</p>
          </div>

          <div className="score-display">
            <div className={`score-circle ${getScoreColor(percentage)}`}>
              <div className="score-value">
                <span className="percentage">{percentage}%</span>
                <span className="fraction">{result.correctAnswers}/{result.totalQuestions}</span>
              </div>
            </div>
            <p className="score-message">{getScoreMessage(percentage)}</p>
          </div>

          <div className="result-stats">
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <span className="stat-label">Time Spent</span>
                <span className="stat-value">
                  {result.totalTime ? 
                    `${Math.floor(result.totalTime / 60)}m ${result.totalTime % 60}s` : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Correct Answers</span>
                <span className="stat-value">{result.correctAnswers}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <span className="stat-label">Incorrect Answers</span>
                <span className="stat-value">{result.totalQuestions - result.correctAnswers}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <span className="stat-label">Completed On</span>
                <span className="stat-value">
                  {result.createdAt ? 
                    new Date(result.createdAt).toLocaleString() : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {result.answers && (
            <div className="answer-review">
              <h3>Review Your Answers</h3>
              <div className="answers-list">
                {result.answers.map((answer, index) => (
                  <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="question-number">Q{index + 1}</div>
                    <div className="answer-content">
                      <div className="question-text">
                        {answer.question || `Question ${index + 1}`}
                      </div>
                      <div className="answer-details">
                        <div className="user-answer">
                          <strong>Your Answer:</strong> {answer.selectedAnswer || 'No answer selected'}
                        </div>
                        {!answer.isCorrect && answer.correctAnswer && (
                          <div className="correct-answer">
                            <strong>Correct Answer:</strong> {answer.correctAnswer}
                          </div>
                        )}
                        {answer.explanation && (
                          <div className="explanation">
                            <strong>Explanation:</strong> {answer.explanation}
                          </div>
                        )}
                      </div>
                      <div className="answer-status">
                        {answer.isCorrect ? (
                          <span className="correct-badge">✅ Correct</span>
                        ) : (
                          <span className="incorrect-badge">❌ Incorrect</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="result-actions">
            <Link to={`/quiz/${result.quizId}`} className="btn btn-outline">
              Retake Quiz
            </Link>
            <Link to="/quizzes" className="btn btn-primary">
              Browse More Quizzes
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
