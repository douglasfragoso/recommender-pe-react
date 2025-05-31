import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Falha ao decodificar token:', error);
    return null;
  }
};

export const getUsuarioFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    nome: decoded.nome,     
    role: decoded.role,     
    email: decoded.sub      
  };
};