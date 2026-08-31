import api from "./api";

export const login = async (username, password) => {
    const response = await api.post("/auth/login", {
        username,
        password,
    });

    return response.data;
};

export const register = async (name, username, email, password) => {
    const response = await api.post("/auth/register", {
        name,
        username,
        email,
        password,
    });

    return response.data;
};