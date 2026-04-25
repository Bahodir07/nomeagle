import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import classes from './ResetPasswordPage.module.css';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { resetPasswordRequest } from '../../app/api/auth';

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token') ?? '';
    const emailFromUrl = searchParams.get('email') ?? '';

    const [email, setEmail] = useState(emailFromUrl);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!passwordConfirmation) newErrors.passwordConfirmation = 'Please confirm your password';
        else if (password !== passwordConfirmation) newErrors.passwordConfirmation = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        if (!validate()) return;

        setIsLoading(true);
        try {
            await resetPasswordRequest({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            navigate('/login?reset=1');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                const backendErrors = err.response.data.errors ?? {};
                const parsed: Record<string, string> = {};
                Object.keys(backendErrors).forEach((key) => {
                    parsed[key] = backendErrors[key][0];
                });
                setErrors(parsed);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <Card className={classes.container}>
                <CardContent>
                    <p className={classes.invalidToken}>
                        Invalid or missing reset token.{' '}
                        <Link to="/forgot-password" className={classes.footerLink}>
                            Request a new link.
                        </Link>
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={classes.container}>
            <CardHeader>
                <h2 className={classes.title}>Reset Password</h2>
                <p className={classes.subtitle}>Choose a new password for your account.</p>
            </CardHeader>

            <CardContent>
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
                        label="New Password"
                        placeholder="Create a new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                    />
                    <Input
                        type="password"
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
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
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className={classes.footer}>
                <p className={classes.footerText}>
                    <Link to="/login" className={classes.footerLink}>
                        Back to Sign In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};
