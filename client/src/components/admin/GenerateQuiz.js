import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import Button from '../common/Button';
import Input from '../common/Input';
import './GenerateQuiz.css';

const GenerateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    difficulty: 'medium',
    amount: 15,
    timeLimit: 30
  });

  const categories = [
    { value: 'general', label: 'General Knowledge' },
    { value: 'technology', label: 'Technology & Computers' },
    { value: 'science', label: 'Science & Nature' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'history', label: 'History' },
    { value: 'literature', label: 'Literature & Books' },
    { value: 'sports', label: 'Sports' },
    { value: 'programming', label: 'Programming' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await quizService.generateQuiz(formData);
      
      if (response.success) {
        alert(`Quiz "${formData.title}" generated successfully with ${formData.amount} questions!`);
        navigate('/admin/quizzes');
      } else {
        throw new Error(response.message || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Generate quiz error:', error);
      alert(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-quiz">
      <div className="container">
        <div className="generate-quiz__header">
          <h1>🎲 Generate Quiz from Open Trivia DB</h1>
          <p>Create a new quiz using questions from the Open Trivia Database API</p>
        </div>

        <form onSubmit={handleSubmit} className="generate-quiz__form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Quiz Title *</label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter quiz description"
                rows="3"
                required
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="form-select"
                >
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Number of Questions</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  min="5"
                  max="50"
                  placeholder="15"
                />
                <small className="form-help">Between 5 and 50 questions</small>
              </div>

              <div className="form-group">
                <label htmlFor="timeLimit">Time Limit (minutes)</label>
                <Input
                  id="timeLimit"
                  name="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  min="5"
                  max="180"
                  placeholder="30"
                />
                <small className="form-help">Between 5 and 180 minutes</small>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/quizzes')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? '🔄 Generating...' : '🎲 Generate Quiz'}
            </Button>
          </div>
        </form>

        <div className="api-info">
          <h3>📡 About Open Trivia Database</h3>
          <ul>
            <li>Questions are fetched from <strong>opentdb.com</strong></li>
            <li>Questions include <strong>correct_answer</strong> and <strong>incorrect_answers</strong></li>
            <li>All questions are multiple choice format</li>
            <li>Questions are automatically shuffled for variety</li>
            <li>HTML entities are decoded for proper display</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuiz;
