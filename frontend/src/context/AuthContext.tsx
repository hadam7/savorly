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
                localStorage.removeItem('savorly_token');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleAuthSuccess = (resp: any) => {
        localStorage.setItem('savorly_token', resp.token || resp.Token);
        setUser({
            userName: resp.userName || resp.UserName,
            role: resp.role || resp.Role || 'User'
        });
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
