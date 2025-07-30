import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">Quiz Master</h3>
            <p className="footer__description">
              A comprehensive MERN stack quiz application for testing knowledge 
              and improving learning outcomes.
            </p>
          </div>
          
          <div className="footer__section">
            <h4 className="footer__subtitle">Quick Links</h4>
            <ul className="footer__links">
              <li><a href="/" className="footer__link">Home</a></li>
              <li><a href="/quizzes" className="footer__link">Quizzes</a></li>
              <li><a href="/dashboard" className="footer__link">Dashboard</a></li>
            </ul>
          </div>
          
          <div className="footer__section">
            <h4 className="footer__subtitle">Technologies</h4>
            <ul className="footer__tech">
              <li>React.js</li>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>MongoDB</li>
            </ul>
          </div>
        </div>
        
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2025 Quiz Master. Created with ❤️ by Aman Chaurasia.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
