import { createContext, useState, useEffect } from "react";
import { authService } from "../services/auth"; 

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
            const userData = await authService.login(email, senha);
            setUsuarioLogado(userData);
            
            if (manterConectado) {
                localStorage.setItem("usuarioData", JSON.stringify(userData));
            } else {
                sessionStorage.setItem("usuarioData", JSON.stringify(userData));
            }
            
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUsuarioLogado(null);
        localStorage.removeItem("usuarioData");
        sessionStorage.removeItem("usuarioData");
    };

    return (
        <GlobalContext.Provider value={{ usuarioLogado, carregando, login, logout }}>
            {children}
        </GlobalContext.Provider>
    );
};