import API from "./api";

export const getDeletedFolders = async () => {
    const { data } = await API.get("/recycle-bin/folders");

    return data;
};

export const getDeletedFiles = async () => {
    const { data } = await API.get("/recycle-bin/files");

    return data;
};

export const restoreFolder = async (id) => {
    const { data } = await API.patch(
        `/recycle-bin/folders/${id}/restore`
    );

    return data;
};

export const restoreFile = async (id) => {
    const { data } = await API.patch(
        `/recycle-bin/files/${id}/restore`
    );

    return data;
};

export const deleteFolderForever = async (id) => {
    const { data } = await API.delete(
        `/recycle-bin/folders/${id}`
    );

    return data;
};

export const deleteFileForever = async (id) => {
    const { data } = await API.delete(
        `/recycle-bin/files/${id}`
    );

    return data;
};