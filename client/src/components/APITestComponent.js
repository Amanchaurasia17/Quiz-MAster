import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quizService';

const APITestComponent = () => {
  const [status, setStatus] = useState('Testing...');
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API connection...');
        console.log('API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');
        
        const response = await quizService.getQuizzes();
        console.log('API Response:', response);
        
        if (Array.isArray(response)) {
          setQuizzes(response);
          setStatus(`✅ API Connected! Found ${response.length} quizzes`);
          setError(null);
        } else {
          setStatus('✅ API Connected but unexpected response format');
          setError('Response is not an array: ' + typeof response);
          console.log('Response type:', typeof response);
          console.log('Response:', response);
        }
      } catch (error) {
        console.error('API Test Error:', error);
        setError(`${error.message} - ${error.response?.status || 'No status'}: ${error.response?.data?.message || 'No details'}`);
        setStatus('❌ API Connection Failed');
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ddd', 
      margin: '20px', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔧 API Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {quizzes.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4>📚 Available Quizzes:</h4>
          <ul>
            {quizzes.map((quiz, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <strong>{quiz.title}</strong> ({quiz.difficulty}) - {quiz.questions?.length || 0} questions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default APITestComponent;
