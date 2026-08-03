import API from "./api";

export const getDashboardStats = async () => {
    const { data } = await API.get("/dashboard/stats");

    return data;
};