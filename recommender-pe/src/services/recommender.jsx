import { api } from "./api";

export async function getRecommendations(preferencesData) {
    try {
        const response = await api.post('/recommendation', preferencesData);
        return response.data;
    } catch (error) {
        console.error("Erro ao obter recomendações:", error);
        throw error;
    }
}