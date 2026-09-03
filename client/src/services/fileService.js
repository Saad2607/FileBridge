import api from "./api";

export const uploadFile = async (
    file,
    folder = null,
    onProgress = null
) => {

    const formData = new FormData();

    formData.append("file", file);

    if (folder) {
        formData.append("folder", folder);
    }

    const response = await api.post(
        "/files/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },

            onUploadProgress: (progressEvent) => {

                if (!progressEvent.total) return;

                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) /
                    progressEvent.total
                );

                if (onProgress) {
                    onProgress(percentCompleted);
                }

            },
        }
    );

    return response.data;
};

export const getFiles = async (folder = null) => {

    const response = await api.get(
        "/files",
        {
            params: {
                folder,
            },
        }
    );

    return response.data;
};

export const downloadFile = async (fileId, fileName) => {

    const response = await api.get(
        `/files/download/${fileId}`,
        {
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

};

export const deleteFile = async (id) => {

    const response = await api.delete(
        `/files/${id}`
    );

    return response.data;

};

export const renameFile = async (
    id,
    originalName
) => {

    const response = await api.put(
        `/files/${id}`,
        {
            originalName,
        }
    );

    return response.data;

};

export const toggleFavoriteFile = async (id) => {
    const response = await api.patch(
        `/files/favorite/${id}`
    );
    return response.data;
};

export const getFileBlob = async (fileId) => {
    const response = await api.get(`/files/download/${fileId}`, {
        responseType: "blob",
    });
    return response.data;
};

export const getFileText = async (fileId) => {
    const response = await api.get(`/files/download/${fileId}`, {
        responseType: "text",
        transformResponse: [(data) => data],
    });
    return response.data;
};

export const updateFileContent = async (id, content) => {
    const { data } = await api.put(`/files/${id}/content`, { content });
    return data;
};

export const createShareLink = async (
    id,
    expiry = "never",
    password = "",
    burnAfterDownload = false
) => {
    const { data } = await api.post(
        `/share/${id}`,
        {
            expiry,
            password,
            burnAfterDownload,
        }
    );

    return data;
};

export const disableShare = async (id) => {
    const { data } = await api.patch(
        `/share/${id}/disable`
    );

    return data;
};