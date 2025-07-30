import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Button from '../../components/common/Button';
import './QuizManagement.css';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizService.getAdminQuizzes();
      setQuizzes(response || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await quizService.deleteQuiz(id);
        setQuizzes(quizzes.filter(quiz => quiz._id !== id));
        alert('Quiz deleted successfully');
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz');
      }
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await quizService.togglePublish(id);
      setQuizzes(quizzes.map(quiz => 
        quiz._id === id 
          ? { ...quiz, isPublished: !quiz.isPublished }
          : quiz
      ));
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status');
    }
  };

  if (loading) {
    return (
      <div className="quiz-management">
        <div className="container">
          <div className="loading">Loading quizzes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-management">
      <div className="container">
        <div className="quiz-management__header">
          <div className="header-content">
            <h1>📚 Quiz Management</h1>
            <p>Manage all quizzes, create new ones, or generate from Open Trivia DB</p>
          </div>
          
          <div className="header-actions">
            <Link to="/admin/quizzes/create">
              <Button>📝 Create Quiz</Button>
            </Link>
            <Link to="/admin/quizzes/generate">
              <Button variant="outline">🎲 Generate from API</Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <Button onClick={fetchQuizzes}>Try Again</Button>
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="no-quizzes">
            <div className="no-quizzes__content">
              <h3>No quizzes found</h3>
              <p>Get started by creating your first quiz or generating one from the API</p>
              <div className="no-quizzes__actions">
                <Link to="/admin/quizzes/create">
                  <Button>📝 Create First Quiz</Button>
                </Link>
                <Link to="/admin/quizzes/generate">
                  <Button variant="outline">🎲 Generate from API</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="quiz-grid">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="quiz-card">
                <div className="quiz-card__header">
                  <h3>{quiz.title}</h3>
                  <div className="quiz-card__badges">
                    <span className={`badge badge--${quiz.difficulty}`}>
                      {quiz.difficulty}
                    </span>
                    <span className={`badge badge--${quiz.isPublished ? 'published' : 'draft'}`}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                <p className="quiz-card__description">{quiz.description}</p>
                
                <div className="quiz-card__meta">
                  <div className="meta-item">
                    <span className="meta-label">Questions:</span>
                    <span className="meta-value">{quiz.questions?.length || 0}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Time:</span>
                    <span className="meta-value">{quiz.timeLimit} min</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{quiz.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Attempts:</span>
                    <span className="meta-value">{quiz.attempts || 0}</span>
                  </div>
                </div>

                <div className="quiz-card__actions">
                  <Link to={`/admin/quizzes/edit/${quiz._id}`}>
                    <Button size="small" variant="outline">Edit</Button>
                  </Link>
                  <Button 
                    size="small" 
                    variant={quiz.isPublished ? "outline" : "primary"}
                    onClick={() => handleTogglePublish(quiz._id)}
                  >
                    {quiz.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="danger"
                    onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;
