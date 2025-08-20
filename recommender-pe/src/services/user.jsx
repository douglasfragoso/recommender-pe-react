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


export const saveUser = async (user) => {
    try {
        const response = await api.post('/user/register', user);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getAllUsers = async (page = 0, size = 10, sort = "id,asc") => {
    try {
        const response = await api.get(`/user?page=${page}&size=${size}&sort=${sort}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/user/id/${id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const updateUser = async (dadosUser) => {
    try {
        const response = await api.patch(`user/profile/me`, dadosUser);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const updateUserById = async (id, dadosUser) => {
    try {
        const response = await api.patch(`/user/id/${id}`, dadosUser);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};


export const deleteUserById = async (id) => {
    try {
        const response = await api.delete(`/user/id/${id}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return handleApiError(error);
    }
};
