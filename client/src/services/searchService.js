import api from "./api";

export const search = async (query) => {

    const response = await api.get("/search", {
        params: {
            q: query,
        },
    });

    return response.data;
};