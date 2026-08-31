import { createContext, useState, useEffect } from "react";
import { getToken, getUser } from "../utils/storage";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    useEffect(() => {
        if (window.electronAPI?.sync) {
            if (token) {
                window.electronAPI.sync.setToken(token);
                window.electronAPI.sync.start().catch((err) => console.log("Electron sync start:", err));
            } else {
                window.electronAPI.sync.stop().catch(() => {});
            }
        }
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;