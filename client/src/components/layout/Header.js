import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <Link to="/" className="header__logo">
            <span className="header__logo-text">Quiz Master</span>
          </Link>

          <nav className="header__nav">
            <Link to="/quizzes" className="header__link">
              Quizzes
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="header__link">
                  Dashboard
                </Link>
                <Link to="/quizzes/generate" className="header__link">
                  Generate Quiz
                </Link>
              </>
            )}
          </nav>

          <div className="header__actions">
            {isAuthenticated ? (
              <div className="header__user">
                <Link to="/profile" className="header__profile">
                  <span className="header__username">{user?.username}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="small" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="header__auth">
                <Link to="/login">
                  <Button variant="ghost" size="small">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="small">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
