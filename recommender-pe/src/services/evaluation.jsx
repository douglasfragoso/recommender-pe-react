import { api } from "./api";

export const getGlobalEvaluation = async () => {
    try {
        const response = await api.get(`/evaluation/global`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};