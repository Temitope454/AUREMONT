import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();
  
  const [view, setView] = useState<'login' | 'register' | 'forgot'>(
    location.pathname === '/register' ? 'register' : 
    location.pathname === '/forgot-password' ? 'forgot' : 'login'
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/account';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    // Update view if URL changes
    if (location.pathname === '/register') setView('register');
    if (location.pathname === '/login') setView('login');
    if (location.pathname === '/forgot-password') setView('forgot');
  }, [isAuthenticated, navigate, from, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (view === 'login') {
        if (!email || !password) throw new Error('Please enter email and password.');
        await login(email);
        // Navigation handled by effect
      } else if (view === 'register') {
        if (!email || !password || !firstName || !lastName) throw new Error('Please fill all required fields.');
        if (password.length < 8) throw new Error('Password must be at least 8 characters.');
        await register({ email, firstName, lastName });
      } else if (view === 'forgot') {
        if (!email) throw new Error('Please enter your email address.');
        await new Promise(resolve => setTimeout(resolve, 800));
        alert('A password reset link has been sent to ' + email + ' (Frontend Mock)');
        setView('login');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h1 className="h2">{view === 'login' ? 'Sign in' : view === 'register' ? 'Create account' : 'Reset password'}</h1>
            <p className="text-meta" style={{marginTop: 'var(--space-2)'}}>
              {view === 'login' ? 'Welcome back to Auremont.' : 
               view === 'register' ? 'Join Auremont to save properties and manage bookings.' :
               'Enter your email to receive a password reset link.'}
            </p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            
            {view === 'register' && (
              <div className="form-row grid-2">
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <input type="text" id="firstName" className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input type="text" id="lastName" className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            {view !== 'forgot' && (
              <div className="form-group">
                <div className="label-row" style={{display:'flex', justifyContent:'space-between'}}>
                  <label htmlFor="password">Password</label>
                  {view === 'login' && (
                    <Link to="/forgot-password" onClick={() => setView('forgot')} className="text-meta link">Forgot password?</Link>
                  )}
                </div>
                <input type="password" id="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
                {view === 'register' && <p className="field-hint">Must be at least 8 characters.</p>}
              </div>
            )}

            {view === 'register' && (
              <div className="form-group checkbox-group" style={{marginTop: 'var(--space-4)'}}>
                <label style={{alignItems:'flex-start'}}>
                  <input type="checkbox" required style={{marginTop:'4px'}} />
                  <span className="text-meta" style={{lineHeight: 1.5}}>
                    I agree to the Auremont <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>.
                  </span>
                </label>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary w-full" style={{marginTop: 'var(--space-6)'}} disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : view === 'login' ? 'Sign in' : view === 'register' ? 'Create account' : 'Send reset link'}
            </button>
          </form>
          
          <div className="auth-footer text-meta">
            {view === 'login' ? (
              <span>Don't have an account? <Link to="/register" onClick={() => setView('register')} className="link text-ink">Register</Link></span>
            ) : view === 'register' ? (
              <span>Already have an account? <Link to="/login" onClick={() => setView('login')} className="link text-ink">Sign in</Link></span>
            ) : (
              <span>Return to <Link to="/login" onClick={() => setView('login')} className="link text-ink">Sign in</Link></span>
            )}
          </div>
        </div>
      </div>
      
      <div className="auth-imagery desktop-only">
        {/* Placeholder for editorial imagery on larger screens */}
        <img src="/images/paris_apartment.jpg" alt="Auremont Architecture" />
      </div>
    </div>
  );
}
