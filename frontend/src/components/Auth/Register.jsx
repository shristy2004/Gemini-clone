import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRegister } from '../../config/api';
import { Context } from '../../context/context';
import './Auth.css';
import { assets } from '../../assets/assets';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser, loadSessions } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await apiRegister(email, username, password);
            setUser({ email: data.email, username: data.username });
            await loadSessions();
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <img src={assets.gemini_icon} alt="Logo" />
                    <h1>Create an account</h1>
                    <p>Join and start chatting with AI</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            id="register-username"
                        />
                    </div>
                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            id="register-email"
                        />
                    </div>
                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            id="register-password"
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading} id="register-btn">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
