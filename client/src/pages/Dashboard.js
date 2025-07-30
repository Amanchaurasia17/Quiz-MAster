import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import { resultService } from '../services/resultService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalScore: 0,
    totalQuestions: 0,
    averageScore: 0,
    recentResults: []
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch recent quizzes
      const quizzesResponse = await quizService.getQuizzes({ limit: 6 });
      setRecentQuizzes(quizzesResponse || []);

      // Fetch user results if logged in
      if (user) {
        try {
          const resultsResponse = await resultService.getResults({ limit: 5 });
          const results = resultsResponse || [];
          
          // Calculate stats
          const totalQuizzes = results.length;
          const totalCorrectAnswers = results.reduce((sum, result) => sum + (result.score || 0), 0);
          const totalQuestions = results.reduce((sum, result) => sum + (result.totalQuestions || 0), 0);
          const averageScore = totalQuizzes > 0 ? 
            (results.reduce((sum, result) => {
              const percentage = Math.round((result.score / result.totalQuestions) * 100);
              return sum + percentage;
            }, 0) / totalQuizzes).toFixed(1) : 0;

          setStats({
            totalQuizzes,
            totalScore: totalCorrectAnswers,
            totalQuestions,
            averageScore,
            recentResults: results.slice(0, 3)
          });
        } catch (error) {
          console.log('Could not fetch user results:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [user, fetchDashboardData]);

  // Listen for dashboard refresh trigger from quiz completion
  useEffect(() => {
    const handleStorageChange = () => {
      const refreshTrigger = localStorage.getItem('dashboardRefresh');
      if (refreshTrigger) {
        fetchDashboardData();
        localStorage.removeItem('dashboardRefresh');
      }
    };

    // Check on component mount
    handleStorageChange();

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Check periodically in case storage event doesn't fire (same tab)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard__header">
          <h1>Dashboard</h1>
          <p>Welcome back{user ? `, ${user.username}` : ''}! Ready to test your knowledge?</p>
        </div>

        {user && (
          <div className="dashboard__stats">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>{stats.totalQuizzes}</h3>
                  <p>Quizzes Taken</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <h3>{stats.totalScore}</h3>
                  <p>Correct Answers</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>{stats.averageScore}%</h3>
                  <p>Average Score</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard__content">
          <div className="dashboard__section">
            <div className="section-header">
              <h2>🚀 Recent Quizzes</h2>
              <div className="section-actions">
                {user && (
                  <Link to="/quizzes/generate" className="btn btn-primary">
                    🎲 Generate Quiz
                  </Link>
                )}
                <Link to="/quizzes" className="view-all-link">View All</Link>
              </div>
            </div>
            <div className="quiz-grid">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <div key={quiz._id} className="quiz-card">
                    <div className="quiz-card__header">
                      <h3>{quiz.title}</h3>
                      <span className={`difficulty ${quiz.difficulty}`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <p className="quiz-card__description">{quiz.description}</p>
                    <div className="quiz-card__meta">
                      <span className="quiz-time">⏱️ {quiz.timeLimit} min</span>
                      <span className="quiz-questions">❓ {quiz.questions?.length || 0} questions</span>
                    </div>
                    <Link 
                      to={`/quiz/${quiz._id}`} 
                      className="btn btn-primary quiz-card__btn"
                    >
                      Start Quiz
                    </Link>
                  </div>
                ))
              ) : (
                <div className="no-quizzes">
                  <p>No quizzes available at the moment.</p>
                  <div className="no-quizzes-actions">
                    {user && (
                      <Link to="/quizzes/generate" className="btn btn-primary">
                        🎲 Generate Your First Quiz
                      </Link>
                    )}
                    <Link to="/quizzes" className="btn btn-outline">Browse Quizzes</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {user && stats.recentResults.length > 0 && (
            <div className="dashboard__section">
              <div className="section-header">
                <h2>📈 Recent Results</h2>
                <Link to="/results" className="view-all-link">View All</Link>
              </div>
              <div className="results-list">
                {stats.recentResults.map((result, index) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  return (
                    <div key={index} className="result-item">
                      <div className="result-info">
                        <h4>{result.quiz?.title || 'Quiz'}</h4>
                        <p className="result-date">
                          {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="result-score">
                        <span className={`score ${percentage >= 70 ? 'good' : percentage >= 50 ? 'average' : 'poor'}`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!user && (
            <div className="dashboard__cta">
              <h2>Join Quiz Master Today!</h2>
              <p>Create an account to track your progress, save results, and compete with others.</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                <Link to="/login" className="btn btn-outline">Login</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
