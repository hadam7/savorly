import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchMe, login as apiLogin, register as apiRegister, type LoginResponse } from '../api';

interface User {
    userName: string;
    email?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    authenticated: boolean;
    loading: boolean;
    login: (userName: string, password: string) => Promise<void>;
    register: (userName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('savorly_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [authenticated, setAuthenticated] = useState(() => {
        return !!localStorage.getItem('savorly_token');
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('savorly_token');
        const savedUser = localStorage.getItem('savorly_user');

        if (!token) {
            setLoading(false);
            setAuthenticated(false);
            return;
        }

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setAuthenticated(true);
            } catch (e) {
                console.error('Failed to parse saved user', e);
            }
        }

        (async () => {
            try {
                const data = await fetchMe(token);
                const userData = {
                    userName: data.userName ?? data.UserName ?? '',
                    email: data.email ?? data.Email,
                    role: data.role ?? data.Role ?? 'User',
                };
                setUser(userData);
                localStorage.setItem('savorly_user', JSON.stringify(userData));
                setAuthenticated(true);
            } catch (e) {
                console.error('Auth check failed', e);
                // If we have a saved user, keep them logged in even if backend fails
                // This ensures persistence works even if the backend is stateless or restarts
                if (!savedUser) {
                    setAuthenticated(false);
                    localStorage.removeItem('savorly_token');
                    localStorage.removeItem('savorly_user');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleAuthSuccess = (resp: any) => {
        const userData = {
            userName: resp.userName || resp.UserName,
            email: resp.email || resp.Email, // Ensure email is captured
            role: resp.role || resp.Role || 'User'
        };

        localStorage.setItem('savorly_token', resp.token || resp.Token);
        localStorage.setItem('savorly_user', JSON.stringify(userData));

        setUser(userData);
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
        localStorage.removeItem('savorly_user');
        setUser(null);
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, authenticated, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
