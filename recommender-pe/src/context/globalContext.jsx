import { createContext, useState, useEffect } from "react";
import { authService } from "../services/auth";
import { api } from "../services/api"; // Importação necessária que estava faltando

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const verificarAutenticacao = () => {
            const userData = authService.getCurrentUser(); 
            if (userData) {
                setUsuarioLogado(userData);
                // Configura o token na API
                api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            }
            setCarregando(false);
        };

        verificarAutenticacao();
    }, []);

    const login = async (email, senha, manterConectado) => {
        try {
            const userData = await authService.login(email, senha, manterConectado);
            setUsuarioLogado(userData);
            
            // Configura o token na API após login bem-sucedido
            api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUsuarioLogado(null);
        // Remove o token do cabeçalho da API
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <GlobalContext.Provider value={{ usuarioLogado, carregando, login, logout }}>
            {children}
        </GlobalContext.Provider>
    );
};

