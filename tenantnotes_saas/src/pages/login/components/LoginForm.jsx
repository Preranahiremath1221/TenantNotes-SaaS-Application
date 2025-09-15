import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Test accounts as per requirements
  const testAccounts = [
    { email: 'admin@acme.test', password: 'password', role: 'Admin', tenant: 'Acme' },
    { email: 'user@acme.test', password: 'password', role: 'Member', tenant: 'Acme' },
    { email: 'admin@globex.test', password: 'password', role: 'Admin', tenant: 'Globex' },
    { email: 'user@globex.test', password: 'password', role: 'Member', tenant: 'Globex' }
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors?.[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      // Store user data in localStorage
      const userData = {
        id: user.id,
        name: user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1),
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenantSlug,
          name: user.tenantSlug.charAt(0).toUpperCase() + user.tenantSlug.slice(1),
        },
        token,
        rememberMe: formData.rememberMe,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);

      onLogin?.(userData);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setFormErrors({
        general: message,
      });
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your email address.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {(error || formErrors?.general) && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error font-medium">
              {error || formErrors?.general}
            </p>
          </div>
        </div>
      )}
      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your work email"
        value={formData?.email}
        onChange={handleInputChange}
        error={formErrors?.email}
        required
        disabled={loading}
        className="w-full"
      />
      {/* Password Field */}
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData?.password}
        onChange={handleInputChange}
        error={formErrors?.password}
        required
        disabled={loading}
        className="w-full"
        autoComplete="current-password"
      />
      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={loading}
        />
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-micro font-medium"
          disabled={loading}
        >
          Forgot password?
        </button>
      </div>
      {/* Sign In Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        disabled={loading}
        iconName="LogIn"
        iconPosition="right"
        iconSize={18}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
      {/* Demo Credentials Info */}
      <div className="mt-6 p-4 bg-muted/50 border border-border rounded-md">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2 text-primary" />
          Test Accounts
        </h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div>
            <strong>Acme Admin:</strong> admin@acme.test / password
          </div>
          <div>
            <strong>Acme Member:</strong> user@acme.test / password
          </div>
          <div>
            <strong>Globex Admin:</strong> admin@globex.test / password
          </div>
          <div>
            <strong>Globex Member:</strong> user@globex.test / password
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;