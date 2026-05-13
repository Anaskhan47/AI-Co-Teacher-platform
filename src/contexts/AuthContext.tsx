import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

interface AuthContextType {
    user: any | null;
    loading: boolean;
    manualLogin: (user: any, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    manualLogin: () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const manualLogin = useCallback((userData: any, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        setUser(null);
        window.location.href = '/login';
    }, []);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user_data');
            const token = localStorage.getItem('token');
            
            if (savedUser && token) {
                setUser(JSON.parse(savedUser));
            } else if (!token) {
                // Initial fallback for first-time visitors in demo mode
                // localStorage.setItem('token', 'guest-bypass-token');
                // setUser({ id: 'guest-bypass', name: 'Guest Admin', role: 'ADMIN' });
            }
        } catch (e) {
            console.error("Auth hydration failed:", e);
        } finally {
            setLoading(false);
        }
    }, []);


    const value = useMemo(() => ({
        user,
        loading,
        manualLogin,
        logout
    }), [user, loading, manualLogin, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
