import React, { useState } from 'react';
import { auth, googleProvider } from '../src/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!hasUpperCase || !hasLowerCase || !hasNumber) return "Use Uppercase, Lowercase, and a Number.";
    return null;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/signin'); 
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? "This email is already registered." : err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background Circles */}
    <div className="blob b1"></div>
    <div className="blob b2"></div>
    <div className="blob b3"></div>
    <div className="blob b4"></div>
    <div className="blob b5"></div>
    <div className="blob b6"></div>
    <div className="blob b7"></div>
    <div className="blob b8"></div>

      <div className="auth-brand pb-lg-5 text-center">
         <span style={{ color: '#10b981' }}>Market</span>Watch
      </div>
      
      <div className="card auth-card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: '400px', width: '90%' }}>
        <h2 className="fw-bold text-center mb-4" style={{color: '#0f172a'}}>Create Account</h2>
        {error && <div className="alert alert-danger py-2 small border-0">{error}</div>}
        
        <form onSubmit={handleEmailSignup}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email</label>
            <input type="email" className="form-control bg-light border-0" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" className="form-control bg-light border-0" placeholder="StrongPassword123" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="form-text mt-2" style={{fontSize: '11px'}}>Min 8 chars, including A, a, and 123.</div>
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold mb-3 py-2">Sign Up</button>
        </form>

        <div className="text-center my-3 text-muted small">OR</div>
        
        <button onClick={handleGoogleLogin} className="btn btn-outline-dark w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G" />
          Continue with Google
        </button>
        
        <p className="text-center mt-4 small">
          Already have an account? <Link to="/signin" className="text-success fw-bold text-decoration-none">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;