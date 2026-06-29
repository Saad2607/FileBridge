import { createContext, useState } from "react";
import { getToken, getUser } from "../utils/storage";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

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