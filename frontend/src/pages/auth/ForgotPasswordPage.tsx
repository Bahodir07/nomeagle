import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classes from './ForgotPasswordPage.module.css';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { forgotPasswordRequest } from '../../app/api/auth';

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Email is required');
            return;
        }

        setIsLoading(true);
        try {
            const res = await forgotPasswordRequest(email);
            setSuccess(res.message);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const msg =
                    err.response?.data?.errors?.email?.[0] ??
                    err.response?.data?.message ??
                    'Something went wrong. Please try again.';
                setError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className={classes.container}>
            <CardHeader>
                <h2 className={classes.title}>Forgot Password</h2>
                <p className={classes.subtitle}>
                    Enter your email and we'll send you a reset link.
                </p>
            </CardHeader>

            <CardContent>
                {success ? (
                    <div className={classes.successBox}>{success}</div>
                ) : (
                    <form className={classes.form} onSubmit={handleSubmit} noValidate>
                        {error && <div className={classes.errorBox}>{error}</div>}
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="nomad@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            style={{ marginTop: 'var(--ne-2)' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                )}
            </CardContent>

            <CardFooter className={classes.footer}>
                <p className={classes.footerText}>
                    Remembered it?
                    <Link to="/login" className={classes.footerLink}>
                        Back to Sign In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};
