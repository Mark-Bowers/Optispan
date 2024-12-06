import { useState, FormEvent } from 'react';
import '../styles/Login.css';

interface LoginProps {
  onLogin: (userData: { name: string; email: string; isAuthenticated: boolean }) => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate authentication
      if (email === 'demo@opt.health' && password === 'password') {
        onLogin({
          name: 'John Doe',
          email: email,
          isAuthenticated: true
        });
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Opt Health</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login; 