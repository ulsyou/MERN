import { useContext, useEffect, createContext, useState } from 'react';
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ user: null });

    useEffect(() => {
        const data = localStorage.getItem('auth');
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                ...auth,
                user: parseData.user,
            });
        }
        // eslint-disable-next-line
    }, []);
    return <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
