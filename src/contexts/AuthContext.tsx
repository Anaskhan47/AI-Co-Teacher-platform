import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

interface AuthContextType {
    user: any | null;
    loading: boolean;
    manualLogin: (user: any, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
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
        setLoading(false); // Force loading false on login
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        setUser(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user_data');
                
                if (storedToken && storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // AUTO-LOGIN BYPASS: Default to a system admin user if none exists
                    const guestUser = {
                        id: "guest-teacher-id",
                        name: "System Administrator",
                        email: "admin@aicoteacher.com",
                        role: "TEACHER"
                    };
                    setUser(guestUser);
                    localStorage.setItem('token', 'guest-bypass-token');
                    localStorage.setItem('user_data', JSON.stringify(guestUser));
                }
            } catch (error) {
                console.error("Auth Initialization Error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
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
