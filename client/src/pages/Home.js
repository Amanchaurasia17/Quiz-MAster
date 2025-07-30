import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <h1 className="hero__title">
                Master Your Knowledge with
                <span className="hero__highlight"> Quiz Master</span>
              </h1>
              <p className="hero__description">
                Challenge yourself with our comprehensive quiz platform. Test your knowledge 
                across multiple subjects, track your progress, and compete with others in an 
                engaging learning environment built with cutting-edge technology.
              </p>
              <div className="hero__stats">
                <div className="hero__stat">
                  <span className="hero__stat-number">1000+</span>
                  <span className="hero__stat-label">Questions</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-number">50+</span>
                  <span className="hero__stat-label">Topics</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-number">24/7</span>
                  <span className="hero__stat-label">Available</span>
                </div>
              </div>
              <div className="hero__actions">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button size="large">🚀 Go to Dashboard</Button>
                    </Link>
                    <Link to="/quizzes">
                      <Button variant="outline" size="large">📚 Browse Quizzes</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="large">🎯 Start Learning</Button>
                    </Link>
                    <Link to="/quizzes">
                      <Button variant="outline" size="large">👀 Preview Quizzes</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="hero__visual">
              <div className="hero__card">
                <div className="hero__card-header">
                  <h3>Sample Quiz Question</h3>
                </div>
                <div className="hero__card-body">
                  <p>What is the capital of France?</p>
                  <div className="hero__options">
                    <div className="hero__option">A) London</div>
                    <div className="hero__option hero__option--correct">B) Paris</div>
                    <div className="hero__option">C) Berlin</div>
                    <div className="hero__option">D) Madrid</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <div className="features__header">
            <h2>🏆 Elevate Your Learning Experience</h2>
            <p>Discover what makes Quiz Master the ultimate knowledge testing platform</p>
          </div>
          
          <div className="features__grid">
            <div className="feature">
              <div className="feature__icon">🔐</div>
              <h3 className="feature__title">Secure & Private</h3>
              <p className="feature__description">
                Your data is protected with enterprise-grade JWT authentication 
                and secure user management systems
              </p>
            </div>
            
            <div className="feature">
              <div className="feature__icon">📊</div>
              <h3 className="feature__title">Smart Analytics</h3>
              <p className="feature__description">
                Get instant feedback, detailed performance metrics, and personalized 
                insights to track your learning journey
              </p>
            </div>
            
            <div className="feature">
              <div className="feature__icon">🎯</div>
              <h3 className="feature__title">Diverse Content</h3>
              <p className="feature__description">
                Choose from programming, science, general knowledge, and more. 
                New quizzes added regularly to keep you challenged
              </p>
            </div>
            
            <div className="feature">
              <div className="feature__icon">⚡</div>
              <h3 className="feature__title">Lightning Fast</h3>
              <p className="feature__description">
                Optimized for speed across all devices. Take quizzes seamlessly 
                on desktop, tablet, or mobile
              </p>
            </div>
            
            <div className="feature">
              <div className="feature__icon">🏅</div>
              <h3 className="feature__title">Achievement System</h3>
              <p className="feature__description">
                Earn badges, track streaks, and compete on leaderboards. 
                Gamify your learning experience
              </p>
            </div>
            
            <div className="feature">
              <div className="feature__icon">�</div>
              <h3 className="feature__title">Modern Tech Stack</h3>
              <p className="feature__description">
                Built with MongoDB, Express.js, React.js, and Node.js for 
                reliability, scalability, and performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits section">
        <div className="container">
          <div className="benefits__content">
            <h2>🎓 Transform Your Learning Journey</h2>
            <div className="benefits__grid">
              <div className="benefit">
                <h3>📈 Track Progress</h3>
                <p>Monitor your improvement with detailed analytics and personalized insights</p>
              </div>
              <div className="benefit">
                <h3>🏆 Compete & Excel</h3>
                <p>Challenge yourself with leaderboards and achievement systems</p>
              </div>
              <div className="benefit">
                <h3>📱 Study Anywhere</h3>
                <p>Access quizzes on any device, anytime, with seamless synchronization</p>
              </div>
              <div className="benefit">
                <h3>🧠 Retain Knowledge</h3>
                <p>Spaced repetition and adaptive learning to maximize retention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section">
        <div className="container">
          <div className="cta__content">
            <h2 className="cta__title">🚀 Ready to Become a Quiz Master?</h2>
            <p className="cta__description">
              Join our community of knowledge seekers and start your learning adventure today. 
              It's free, fun, and incredibly rewarding!
            </p>
            {!isAuthenticated ? (
              <div className="cta__actions">
                <Link to="/register">
                  <Button size="large">🎯 Create Free Account</Button>
                </Link>
                <p className="cta__note">No credit card required • Instant access • 100% free</p>
              </div>
            ) : (
              <div className="cta__actions">
                <Link to="/quizzes">
                  <Button size="large">🔥 Start a Quiz Now</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="large">📊 View Dashboard</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
