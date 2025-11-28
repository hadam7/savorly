import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { authenticated, register } = useAuth();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(userName, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('A regisztráció nem sikerült');
    }
  };

  return (
    <div className="page">
      <h2 className="title">Regisztráció</h2>
      <p>Hozz létre egy fiókot, hogy elmenthesd a kedvenc receptjeidet.</p>
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
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Regisztráció</button>
      </form>
      <p>
        Már van fiókod?{' '}
        <Link to="/login">Bejelentkezés</Link>
      </p>
    </div>
  );
}
