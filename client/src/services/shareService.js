import API from "./api";

export const getShareInfo = async (token) => {

    const { data } = await API.get(
        `/share/${token}`
    );

    return data;
};

export const downloadSharedFile = async (
    token,
    password = ""
) => {

    const response = await API.get(
        `/share/${token}/download`,
        {
            params: {
                password,
            },
            responseType: "blob",
        }
    );

    return response;
};

export const getSharedFiles = async () => {
    const { data } = await API.get("/share");

    return data;
};

export const disableShare = async (id) => {

    const { data } = await API.patch(
        `/share/${id}/disable`
    );

    return data;
};

export const copyShareLink = (token) => {

    const url = `${window.location.origin}/share/${token}`;

    navigator.clipboard.writeText(url);

    return url;

};

