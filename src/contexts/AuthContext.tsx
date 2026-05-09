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
    // FORCE GUEST SESSION FOR STABILIZATION
    const [user, setUser] = useState<any | null>({
        id: 'guest-bypass',
        name: 'Guest Administrator',
        email: 'guest@ai-coteacher.local',
        role: 'ADMIN'
    });
    const [loading, setLoading] = useState(false);

    const manualLogin = useCallback((userData: any, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        // Disabled logout for bypass mode
    }, []);

    useEffect(() => {
        // Ensure token is present for API calls
        if (!localStorage.getItem('token')) {
            localStorage.setItem('token', 'guest-bypass-token');
        }
        setLoading(false);
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
