import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TenantBranding from './components/TenantBranding';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityBadges from './components/SecurityBadges';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (user && token) {
      try {
        const userData = JSON.parse(user);
        if (userData?.token === token) {
          navigate('/dashboard');
        }
      } catch (err) {
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
  }, [navigate]);

  const handleLogin = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Login handled in LoginForm component
      console.log('User logged in:', userData);
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-xl shadow-card-elevation-2 p-8">
          {/* Tenant Branding */}
          <TenantBranding tenant={{}} />
          
          {/* Login Header */}
          <LoginHeader />
          
          {/* Login Form */}
          <LoginForm 
            onLogin={handleLogin}
            loading={loading}
            error={error}
          />
          
          {/* Security Badges */}
          <SecurityBadges />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} TenantNotes SaaS. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Privacy Policy
            </a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Terms of Service
            </a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-micro">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;