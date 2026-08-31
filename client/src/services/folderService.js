import api from "./api";

export const getFolders = async (parent = null) => {
    const response = await api.get("/folders", {
        params: {
            parent,
        },
    });

    return response.data;
};

export const createFolder = async (name, parent = null) => {
    const response = await api.post("/folders", {
        name,
        parent,
    });

    return response.data;
};

export const deleteFolder = async (id) => {
    const response = await api.delete(
        `/folders/${id}`
    );
    return response.data;
};

export const renameFolder = async (id, name) => {

    const response = await api.put(
        `/folders/${id}`,
        { name }
    );

    return response.data;

};

export const toggleFavoriteFolder = async (id) => {
    const response = await api.patch(
        `/folders/favorite/${id}`
    );

    return response.data;
};