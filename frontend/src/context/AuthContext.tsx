import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api';

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
        const checkAuth = async () => {
            try {
                const data = await fetchMe();
                const userData = {
                    userName: data.userName ?? data.UserName ?? '',
                    email: data.email ?? data.Email,
                    role: data.role ?? data.Role ?? 'User',
                };
                setUser(userData);
                setAuthenticated(true);
            } catch (e) {

                setUser(null);
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleAuthSuccess = (resp: any) => {
        const userData = {
            userName: resp.userName || resp.UserName,
            email: resp.email || resp.Email,
            role: resp.role || resp.Role || 'User'
        };

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

    const logout = async () => {
        try {
            await apiLogout();
        } catch (e) {
            console.error('Logout failed', e);
        } finally {
            setUser(null);
            setAuthenticated(false);
        }
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
