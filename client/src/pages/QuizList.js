import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { quizService } from '../services/quizService';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      console.log('Fetching quizzes...');
      const response = await quizService.getQuizzes();
      console.log('Quizzes response:', response);
      setQuizzes(response);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#28a745';
      case 'medium': return '#ffc107';
      case 'hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="quiz-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-list-error">
        <h2>Unable to Load Quizzes</h2>
        <p>{error}</p>
        <button onClick={fetchQuizzes} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-list-container">
      <div className="quiz-list-header">
        <h1>Available Quizzes</h1>
        <p>Test your knowledge with our curated collection of quizzes</p>
      </div>

      <div className="quiz-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <label htmlFor="difficulty-filter">Difficulty:</label>
          <select
            id="difficulty-filter"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="no-quizzes">
          <h3>No quizzes found</h3>
          <p>
            {searchTerm || difficultyFilter !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Check back later for new quizzes!'}
          </p>
        </div>
      ) : (
        <>
          <div className="quiz-stats">
            <span className="quiz-count">{filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'es' : ''} available</span>
          </div>

          <div className="quiz-grid">
            {filteredQuizzes.map(quiz => (
              <div key={quiz._id} className="quiz-card">
                <div className="quiz-card-header">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
                  >
                    {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                  </span>
                </div>

                <p className="quiz-description">{quiz.description}</p>

                <div className="quiz-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📝</span>
                    <span>{quiz.questions.length} questions</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>{formatDuration(quiz.timeLimit)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👤</span>
                    <span>By {quiz.createdBy?.name || 'Admin'}</span>
                  </div>
                </div>

                <div className="quiz-actions">
                  <Link 
                    to={`/quiz/${quiz._id}`} 
                    className="btn-take-quiz"
                  >
                    Start Quiz
                  </Link>
                  {user && user.role === 'admin' && (
                    <Link 
                      to={`/admin/quiz/edit/${quiz._id}`} 
                      className="btn-edit-quiz"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {user && user.role === 'admin' && (
        <div className="admin-actions">
          <Link to="/admin/quiz/create" className="btn-create-quiz">
            <span className="plus-icon">+</span>
            Create New Quiz
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuizList;
