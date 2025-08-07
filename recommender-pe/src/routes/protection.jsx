import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

const Protection = ({ children, allowedRoles }) => {
    const { usuarioLogado, carregando } = useContext(GlobalContext);

    // Se ainda está verificando autenticação
    if (carregando) {
        return <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
        </div>;
    }

    // Se não está autenticado
    if (!usuarioLogado) {
        return <Navigate to="/" replace />;
    }

    // Se tem restrição de role e o usuário não tem permissão
    if (allowedRoles && !allowedRoles.includes(usuarioLogado.role)) {
        return <Navigate to="/" replace />;
    }

    // Se passou em todas as verificações
    return children;
};

export default Protection;