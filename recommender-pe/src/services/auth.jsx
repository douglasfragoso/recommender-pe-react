import { api } from "./api";
import { jwtDecode } from 'jwt-decode';

export const authService = {
    async login(email, senha, manterConectado) {
        try {
            const response = await api.post('/auth/v1/login', { email, senha });
            if (response.data.token) {
                const token = response.data.token;
                const storage = manterConectado ? localStorage : sessionStorage;
                
                storage.setItem("jwtToken", token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                const userData = {
                    nome: response.data.nome,
                    role: response.data.role,
                    email: email,
                    token: token
                };
                
                storage.setItem("usuarioData", JSON.stringify(userData));
                return userData;
            }
            throw new Error("Token não recebido");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
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
        
        // Fallback para token antigo (se necessário)
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