import { api } from "./api";
import { jwtDecode } from 'jwt-decode';

export const authService = {
    async login(email, senha, manterConectado) {
        try {
            const response = await api.post('/auth/v1/login', {
                email,
                userPassword: senha
            });

            if (!response.data.token) {
                throw new Error("Token não recebido na resposta");
            }

            const token = response.data.token;
            const storage = manterConectado ? localStorage : sessionStorage;

            storage.setItem("jwtToken", token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const decodedToken = jwtDecode(token);

            const userData = {
                nome: response.data.firstName ?
                    `${response.data.firstName} ${response.data.lastName}` :
                    decodedToken.sub,
                role: response.data.role || decodedToken.role || "USER",
                email: email,
                token: token
            };

            storage.setItem("usuarioData", JSON.stringify(userData));

            return userData;
        } catch (error) {
            if (error.response?.status === 401) {
                return {
                    success: false,
                    message: "Email ou senha incorretos"
                };
            } else if (error.response?.status >= 500) {
                return {
                    success: false,
                    message: "Serviço indisponível. Tente novamente mais tarde."
                };
            }
            return {
                success: false,
                message: error.message || "Erro ao fazer login"
            };
        }
    },
    logout() {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("usuarioData");
        sessionStorage.removeItem("jwtToken");
        sessionStorage.removeItem("usuarioData");
        delete api.defaults.headers.common['Authorization'];
    },

    getCurrentUser() {
        let userData = localStorage.getItem("usuarioData") ||
            sessionStorage.getItem("usuarioData");

        if (userData) {
            return JSON.parse(userData);
        }

        const token = localStorage.getItem("jwtToken") ||
            sessionStorage.getItem("jwtToken");
        if (token) {
            const decoded = jwtDecode(token);
            return {
                nome: decoded.nome,
                role: decoded.role,
                email: decoded.sub,
                token: token
            };
        }

        return null;
    }
};