import { useEffect, useState } from 'react';
import { fetchMe, login as apiLogin, register as apiRegister, type LoginResponse } from '../api';

interface User {
  userName: string;
  email?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('savorly_token');
    if (!token) {
      setLoading(false);
      setAuthenticated(false);
      return;
    }

    (async () => {
      try {
        const data = await fetchMe(token);
        setUser({
          userName: data.userName ?? data.UserName ?? '',
          email: data.email ?? data.Email,
          role: data.role ?? data.Role ?? 'User',
        });
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAuthSuccess = (resp: LoginResponse) => {
    localStorage.setItem('savorly_token', resp.token);
    setUser({ userName: resp.userName, role: resp.role });
    setAuthenticated(true);
  };

  const login = async (userName: string, password: string) => {
    const resp = await apiLogin(userName, password);
    handleAuthSuccess(resp);
  };

  const register = async (userName: string, email: string, password: string) => {
    const resp = await apiRegister(userName, email, password);
    handleAuthSuccess(resp);
  };

  const logout = () => {
    localStorage.removeItem('savorly_token');
    setUser(null);
    setAuthenticated(false);
  };

  return { user, authenticated, loading, login, register, logout };
}
