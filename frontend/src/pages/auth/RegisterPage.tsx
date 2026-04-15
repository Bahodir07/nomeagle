import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './RegisterPage.module.css';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/store/auth.store';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading, globalError, clearError } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!passwordConfirmation) {
            newErrors.passwordConfirmation = 'Please confirm your password';
        } else if (password !== passwordConfirmation) {
            newErrors.passwordConfirmation = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setErrors({});

        if (!validateForm()) return;

        try {
            await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            navigate('/app/dashboard');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                const backendErrors = err.response.data.errors || {};
                const parsedErrors: Record<string, string> = {};

                Object.keys(backendErrors).forEach((key) => {
                    parsedErrors[key] = backendErrors[key][0];
                });

                setErrors(parsedErrors);
            }
        }
    };

    return (
        <Card className={classes.container}>
            <CardHeader>
                <h2 className={classes.title}>Start Your Journey</h2>
                <p className={classes.subtitle}>Join travelers mapping the world's cultures.</p>
            </CardHeader>

            <CardContent>
                {globalError && (
                    <div
                        style={{
                            color: 'var(--ne-danger)',
                            backgroundColor: '#fee2e2',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontSize: '0.875rem',
                        }}
                    >
                        {globalError}
                    </div>
                )}

                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <Input
                        type="text"
                        label="Full Name"
                        placeholder="Marco Polo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                    />

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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />

                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        error={errors.passwordConfirmation}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        style={{ marginTop: 'var(--ne-2)' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className={classes.footer}>
                <p className={classes.footerText}>
                    Already have an account?
                    <Link to="/login" className={classes.footerLink}>
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};