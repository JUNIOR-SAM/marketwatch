import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Keeping your preferred Popup style
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      // Friendly error if the browser blocks it again
      if (err.code === 'auth/popup-blocked') {
        setError("Please allow pop-ups for this website to sign in with Google.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Background Blobs */}
      <div className="blob b1"></div><div className="blob b2"></div>
      <div className="blob b3"></div><div className="blob b4"></div>
      <div className="blob b5"></div><div className="blob b6"></div>
      <div className="blob b7"></div><div className="blob b8"></div>

      <div className="auth-brand mb-4 text-center">
         <span style={{ color: '#10b981' }}>Market</span>Watch
      </div>

      <div className="card auth-card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: '400px', width: '90%' }}>
        <h2 className="fw-bold text-center mb-4">Welcome Back</h2>
        {error && <div className="alert alert-danger small border-0">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email</label>
            <input 
              type="email" 
              className="form-control bg-light border-0" 
              autoComplete="email" // Added for browser optimization
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control bg-light border-0" 
              autoComplete="current-password" // Added to fix console warning
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold mb-3 py-2 shadow-sm">Sign In</button>
        </form>

        <button onClick={handleGoogleLogin} className="btn btn-outline-dark w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G" />
          Sign in with Google
        </button>

        <p className="text-center mt-4 small">
          New to MarketWatch? <Link to="/" className="text-success fw-bold text-decoration-none">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;