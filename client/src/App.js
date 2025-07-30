import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import QuizResult from './pages/QuizResult';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import QuizManagement from './pages/admin/QuizManagement';
import CreateQuiz from './pages/admin/CreateQuiz';
import EditQuiz from './pages/admin/EditQuiz';
import GenerateQuiz from './components/admin/GenerateQuiz';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quizzes" element={<QuizList />} />
              
              {/* Private Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/quiz/:id" element={
                <PrivateRoute>
                  <QuizTake />
                </PrivateRoute>
              } />
              
              <Route path="/result/:id" element={
                <PrivateRoute>
                  <QuizResult />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/quizzes" element={
                <AdminRoute>
                  <QuizManagement />
                </AdminRoute>
              } />
              
              <Route path="/admin/quizzes/create" element={
                <AdminRoute>
                  <CreateQuiz />
                </AdminRoute>
              } />
              
              <Route path="/admin/quizzes/generate" element={
                <AdminRoute>
                  <GenerateQuiz />
                </AdminRoute>
              } />
              
              <Route path="/admin/quizzes/edit/:id" element={
                <AdminRoute>
                  <EditQuiz />
                </AdminRoute>
              } />
              
              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
