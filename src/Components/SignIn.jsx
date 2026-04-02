import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
// NEW: Imported signInWithRedirect
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added for consistency with SignUp
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

  // UPDATED: Smart Mobile Detection for Google Login
  const handleGoogleLogin = async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile device: Use redirect to bypass popup blockers
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Desktop: Use the standard popup
        await signInWithPopup(auth, googleProvider);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.code === 'auth/popup-blocked') {
        setError("Please allow pop-ups for this website to sign in with Google.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="blob b1"></div><div className="blob b2"></div>
      <div className="blob b3"></div><div className="blob b4"></div>
      <div className="blob b5"></div><div className="blob b6"></div>
      <div className="blob b7"></div><div className="blob b8"></div>

      <div className="auth-brand mb-4 text-center">
         <span style={{ color: '#10b981' }}>Market</span>Watch
      </div>

      <div className="card auth-card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: '400px', width: '90%' }}>
        <h2 className="fw-bold text-center mb-4" style={{color: '#0f172a'}}>Welcome Back</h2>
        
        {/* UPDATED: Consistent modern error styling */}
        {error && (
          <div className="alert py-2 small border-0 d-flex align-items-center gap-2 mb-4" 
               style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '10px' }}>
            <i className="bi bi-exclamation-circle-fill"></i>
            <span className="fw-medium">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email</label>
            <input 
              type="email" 
              className="form-control bg-light border-0 py-2" 
              autoComplete="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            {/* UPDATED: Added Eye Icon Toggle for consistency */}
            <div className="position-relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control bg-light border-0 py-2 pe-5" 
                autoComplete="current-password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <span 
                className="position-absolute top-50 end-0 translate-middle-y pe-3" 
                style={{ cursor: 'pointer', color: '#94a3b8' }}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} fs-5`}></i>
              </span>
            </div>
          </div>
          
          <button type="submit" className="btn text-white w-100 rounded-pill fw-bold mb-3 py-2 shadow-sm" style={{ backgroundColor: '#10b981' }}>
            Sign In
          </button>
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