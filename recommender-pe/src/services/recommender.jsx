import { api } from "./api";

export const getRecommendations = async (preferencesData) => {
    try {
        const response = await api.post('/recommendation', preferencesData);
        return response.data;
    } catch (error) {
        console.error("Erro ao obter recomendações:", error);
        throw error;
    }
};

export const sendScores = async (recommendationId, scores) => {
    try {
        const response = await api.post(`/recommendation/${recommendationId}/score`, scores);
        return response.data;
    } catch (error) {
        console.error("Erro ao enviar scores:", error);
        throw error;
    }
};