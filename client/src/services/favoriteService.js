import api from "./api";

export const getFavorites = async () => {
    
    const response = await api.get("/favorites");

    return response.data;
};