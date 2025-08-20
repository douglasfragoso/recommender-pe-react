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

export const savePOI = async (POI) => {
    try {
        const response = await api.post("/poi/register", POI);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const updatePOI = async (id, dadosPOI) => {
    try {
        const response = await api.patch(`/poi/id/${id}`, dadosPOI);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getAllPOI = async (page = 0, size = 10, sort = "id,asc") => {
    try {
        const response = await api.get(`/poi?page=${page}&size=${size}&sort=${sort}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getPOIById = async (id) => {
    try {
        const response = await api.get(`/poi/id/${id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};


