import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { authenticated, login } = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(userName, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Hibás felhasználónév vagy jelszó');
    }
  };

  return (
    <div className="page">
      <h2 className="title">Bejelentkezés</h2>
      <p>Jelentkezz be a receptgyűjtő felület használatához.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Felhasználónév
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </label>
        <label>
          Jelszó
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Belépés</button>
      </form>
      <p>
        Nincs még fiókod?{' '}
        <Link to="/register">Regisztráció</Link>
      </p>
    </div>
  );
}
