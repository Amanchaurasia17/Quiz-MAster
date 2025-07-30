import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { resultService } from '../services/resultService';
import { authService } from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Auth.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, [updateUser]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
    fetchUserStats();
    fetchCurrentUser(); // Fetch latest user data to ensure we have createdAt
  }, [user, fetchCurrentUser]);

  const fetchUserStats = async () => {
    try {
      const response = await resultService.getDashboardStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSuccess('');

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await authService.updateProfile(updateData);
      updateUser(response.user);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData(prev => ({
      ...prev,
      username: user.username || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setErrors({});
    setSuccess('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account settings and view your quiz performance</p>
        </div>

        {/* User Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Account Information</h2>
            {!isEditing && (
              <Button 
                variant="outline" 
                size="small" 
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </Button>
            )}
          </div>

          {success && (
            <div className="success-message">
              <p>{success}</p>
            </div>
          )}

          {errors.general && (
            <div className="error-message">
              <p>{errors.general}</p>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
                  required
                />
              </div>

              <div className="form-group">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />
              </div>

              <div className="form-divider">
                <h3>Change Password (Optional)</h3>
              </div>

              <div className="form-group">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  error={errors.currentPassword}
                  placeholder="Enter current password to change"
                />
              </div>

              <div className="form-group">
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  error={errors.newPassword}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="form-group">
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm new password"
                />
              </div>

              <div className="form-actions">
                <Button 
                  type="submit" 
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Username:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role:</span>
                <span className={`role-badge ${user?.role}`}>
                  {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        {stats && !isEditing && (
          <div className="profile-section">
            <div className="section-header">
              <h2>📊 Quiz Statistics</h2>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalQuizzes || 0}</div>
                  <div className="stat-label">Quizzes Taken</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div 
                    className="stat-number"
                    style={{ color: getScoreColor(stats.averageScore || 0) }}
                  >
                    {stats.averageScore ? Math.round(stats.averageScore) : 0}%
                  </div>
                  <div className="stat-label">Average Score</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div 
                    className="stat-number"
                    style={{ color: getScoreColor(stats.highestScore || 0) }}
                  >
                    {stats.highestScore || 0}%
                  </div>
                  <div className="stat-label">Best Score</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-number">
                    {stats.totalTimeSpent ? Math.round(stats.totalTimeSpent / 60) : 0}m
                  </div>
                  <div className="stat-label">Time Spent</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
