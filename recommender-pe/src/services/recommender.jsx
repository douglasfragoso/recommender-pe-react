import { api } from "./api";

const handleApiError = (error) => {
    if (error.response) {
        const message = error.response.data?.message || error.response.data?.error || "Erro desconhecido.";
        return {
            success: false,
            messages: Array.isArray(message) ? message : [message]
        };
    } else {
        return {
            success: false,
            messages: ["Erro de rede ou conexão. Verifique sua internet."]
        };
    }
};

export const getRecommendations = async (preferencesData) => {
    try {
        const response = await api.post('/recommendation', preferencesData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const sendScores = async (recommendationId, scores) => {
    try {
        const payload = scores.map(score => ({
            recommendationId: Number(recommendationId),
            poiId: score.poiId,
            scoreValue: score.scoreValue
        }));

        const response = await api.post(`/recommendation/${recommendationId}/score`, payload);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getAllRecommendations = async (page = 0, size = 10, sort = "id,asc") => {
    try {
        const response = await api.get(`/recommendation?page=${page}&size=${size}&sort=${sort}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getRecommendationById = async (id) => {
    try {
        const response = await api.get(`/recommendation/id/${id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getRecommendationByUserId = async (userId) => {
    try {
        const response = await api.get(`/recommendation/user/${userId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getSimilarityMetrics = async (id) => {
    try {
        const response = await api.get(`/recommendation/id/${id}/similarities`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};