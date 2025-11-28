const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginResponse {
  token: string;
  userName: string;
  role: string;
}

export async function login(userName: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid username or password');
  }

  return res.json();
}

export async function register(userName: string, email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, email, password }),
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }

  return res.json();
}

export async function fetchMe(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
}
