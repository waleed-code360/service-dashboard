import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
            {/* Branding Section */}
            <div style={{ backgroundColor: 'var(--primary-900)', color: 'var(--white)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'var(--space-12)' }}>
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                        Service<span>Dash</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2, marginBottom: 'var(--space-6)' }}>
                        Manage your service business with ease.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--primary-300)', lineHeight: 1.6 }}>
                        Streamline operations, track orders, and collaborate with your team all in one place.
                    </p>
                </div>
            </div>

            {/* Login Form Section */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--white)' }}>
                <div style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)' }}>
                    <h2 className="font-bold text-primary" style={{ fontSize: '1.875rem', marginBottom: 'var(--space-2)' }}>Welcome back</h2>
                    <p className="text-secondary" style={{ marginBottom: 'var(--space-8)' }}>Please enter your details to sign in.</p>

                    <form>
                        <div className="input-group">
                            <label className="input-label" htmlFor="email">Email Address</label>
                            <input type="email" id="email" className="input-field" placeholder="admin@example.com" />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">Password</label>
                            <input type="password" id="password" className="input-field" placeholder="••••••••" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--primary-700)', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: 'var(--accent-500)' }} />
                                Remember me
                            </label>
                            <a href="#" className="text-sm text-accent font-medium hover:underline">Forgot password?</a>
                        </div>

                        <Link to="/" className="btn btn-primary btn-full" style={{ marginBottom: 'var(--space-4)' }}>
                            Sign In
                        </Link>

                        <button type="button" className="btn btn-secondary btn-full">
                            <i className="ph ph-google-logo" style={{ marginRight: '8px', fontSize: '1.25rem' }}></i>
                            Sign in with Google
                        </button>
                    </form>

                    <p className="text-center text-secondary text-sm" style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
                        Don't have an account? <a href="#" className="font-medium text-accent hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
