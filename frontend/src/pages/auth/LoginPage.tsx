import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import classes from './LoginPage.module.css';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { useAuth } from '../../app/store/auth.store';
import axios from 'axios';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const wasReset = searchParams.get('reset') === '1';
  const { login, isLoading, globalError, clearError } = useAuth();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Field-level Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setErrors({}); // Reset previous errors
    
    // 1. Client-side Validation (Empty fields or invalid emails)
    if (!validateForm()) return;
    
    // 2. Submit to Backend
    try {
      await login({ 
        email, 
        password, 
        remember: rememberMe 
      });
      navigate('/app/dashboard');
    } catch (err) {
      // 3. Handle Backend Error Messages
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        // Map Laravel array errors (e.g., {'email': ['Email already taken']}) into single strings
        const backendErrors = err.response.data.errors || {};
        const parsedErrors: Record<string, string> = {};
        
        Object.keys(backendErrors).forEach(key => {
          parsedErrors[key] = backendErrors[key][0]; // Take the first error string provided
        });
        setErrors(parsedErrors);
      }
    }
  };

  return (
    <Card className={classes.container}>
      <CardHeader>
        <h2 className={classes.title}>Welcome Back</h2>
        <p className={classes.subtitle}>Continue your cultural journey.</p>
      </CardHeader>
      
      <CardContent>
        {wasReset && (
          <div style={{ color: '#166534', backgroundColor: '#dcfce7', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
            Password reset successfully. You can now sign in.
          </div>
        )}
        {/* Render global API errors like 'Invalid credentials' */}
        {globalError && (
          <div style={{ color: 'var(--ne-danger)', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
            {globalError}
          </div>
        )}

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Input 
            type="email" 
            label="Email Address" 
            placeholder="nomad@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Input 
            type="password" 
            label="Password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          
          <div className={classes.actionRow}>
            <Checkbox 
              label="Remember me" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link to="/forgot-password" className={classes.forgotPasswordLink}>Forgot password?</Link>
          </div>

          <Button type="submit" variant="primary" size="lg" style={{ marginTop: 'var(--ne-2)' }} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className={classes.footer}>
        <p className={classes.footerText}>
          Don't have an account? 
          <Link to="/register" className={classes.footerLink}>
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
