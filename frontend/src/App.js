import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ClassroomMode from './pages/ClassroomMode';
import Reports from './pages/Reports';
import Students from './pages/Students';
import SchoolSetup from './pages/SchoolSetup';
import AuthCallback from './pages/AuthCallback';
import CurriculumManager from './pages/CurriculumManager';
import About from './pages/About';
import StaffManagement from './pages/StaffManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import GlobalLayaChat from './components/GlobalLayaChat';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return user ? (
    <>
      {children}
      <GlobalLayaChat />
    </>
  ) : (
    <Navigate to="/" />
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/setup" element={<PrivateRoute><SchoolSetup /></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
          <Route path="/classroom" element={<PrivateRoute><ClassroomMode /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/curriculum" element={<PrivateRoute><CurriculumManager /></PrivateRoute>} />
          <Route path="/staff" element={<PrivateRoute><StaffManagement /></PrivateRoute>} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
