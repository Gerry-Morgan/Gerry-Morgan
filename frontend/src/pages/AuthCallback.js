import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processAuth = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get('session_id');

      if (sessionId) {
        const success = await login(sessionId);
        if (success) {
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
        }
      } else {
        setError('No session ID found');
      }
    };

    processAuth();
  }, [login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-16 w-16 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Authenticating...</p>
      </div>
    </div>
  );
}
