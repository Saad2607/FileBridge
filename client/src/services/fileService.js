import api from "./api";

export const uploadFile = async (file, folder = null) => {

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