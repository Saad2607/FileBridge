import api from "./api";

export const getRecentActivities = async (limit = 10) => {
    const response = await api.get("/activities", {
        params: { limit },
    });
    return response.data;
};
