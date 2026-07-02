import api from "./api";

export const uploadFile = async (file, folder = null) => {
    
    const formData = new FormData();
    
    formData.append("file", file);

    if(folder) {
        formData.append("folder", folder);
    }

    const response = await api.post(
        "/files/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getFiles = async (folder = null) => {
    const response = await api.get("/files", {
        params: {
            folder,
        },
    });

    return response.data;
};