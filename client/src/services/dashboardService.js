import API from "./api";

export const getDashboardStats = async () => {
    const { data } = await API.get("/dashboard/stats");

    return data;
};

export const getDashboardAnalytics = async () => {
    const { data } = await API.get("/dashboard/analytics");

    return data;
};