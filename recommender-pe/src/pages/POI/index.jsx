import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { deletePOIById, getAllPOI } from "../../services/POI";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/globalContext";
import { useContext } from "react";
import "./POIList.css";

function POIList() {
    const navigate = useNavigate();
    const [pois, setPOIs] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { usuarioLogado } = useContext(GlobalContext);
    const itemsPerPage = 10; // Corresponde ao @PageableDefault(size = 10) no backend
    
    useEffect(() => {
        fetchPOIs();
    }, [currentPage]);

    const fetchPOIs = async () => {
        setIsLoading(true);
        try {
            const response = await getAllPOI(currentPage, itemsPerPage);
            setPOIs(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error("Erro ao buscar POIs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este POI?")) {
            try {
                await deletePOIById(id);
                // Se deletamos o último item da página, voltamos uma página
                if (pois.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchPOIs();
                }
                alert("POI excluído com sucesso!");
            } catch (error) {
                alert("Erro ao excluir POI.");
                console.error("Erro:", error);
            }
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            if (i >= 0 && i < totalPages) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    return (
        <div className="containerForm">
            <Header />

            <div className="formBox">
                <div className="formContent">
                    <div className="header">
                        <h2 className="headerTitle">
                            <i className="bi bi-geo-alt-fill icon"></i>
                            Pontos de Interesse
                        </h2>
                    </div>
                    
                    <div className="formBody">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="sectionHeader">
                                <i className="bi bi-pin-map sectionIcon"></i>
                                Lista de POIs Cadastrados
                            </h5>
                            <div className="d-flex align-items-center">
                                <span className="me-3">
                                    Total: {totalElements} POIs
                                </span>
                                {usuarioLogado && (usuarioLogado.role === "ADMIN" || usuarioLogado.role === "MASTER") && (
                                    <a role="button" href="/novo-poi" className="btn btn-primary submitButton">
                                        <i className="bi bi-plus-circle"></i>
                                        Novo POI
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Endereço</th>
                                        <th scope="col">Motivações</th>
                                        <th scope="col">Hobbies</th>
                                        <th scope="col">Temas</th>
                                        {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                            <th scope="col">Opções</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 8 : 7} 
                                                className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Carregando...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : pois.length > 0 ? (
                                        pois.map((poi) => (
                                            <tr key={poi.id}>
                                                <th scope="row">{poi.id}</th>
                                                <td>{poi.name}</td>
                                                <td>{poi.description.length > 50 ? `${poi.description.substring(0, 50)}...` : poi.description}</td>
                                                <td>
                                                    {poi.address?.street}, {poi.address?.number}<br/>
                                                    {poi.address?.neighborhood}, {poi.address?.city}
                                                </td>
                                                <td>
                                                    {poi.motivations?.slice(0, 3).map(m => m.substring(0, 3)).join(', ')}
                                                    {poi.motivations?.length > 3 && '...'}
                                                </td>
                                                <td>
                                                    {poi.hobbies?.slice(0, 3).map(h => h.substring(0, 3)).join(', ')}
                                                    {poi.hobbies?.length > 3 && '...'}
                                                </td>
                                                <td>
                                                    {poi.themes?.slice(0, 3).map(t => t.substring(0, 3)).join(', ')}
                                                    {poi.themes?.length > 3 && '...'}
                                                </td>
                                                {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={() => navigate(`/poi/${poi.id}`)}
                                                            >
                                                                <i className="bi bi-pencil"></i> Editar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => handleDelete(poi.id)}
                                                            >
                                                                <i className="bi bi-trash"></i> Excluir
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 8 : 7} 
                                                className="text-center">
                                                {currentPage === 0 ? "Nenhum POI encontrado" : "Nenhum POI nesta página"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Componente de Paginação */}
                        {totalPages > 1 && (
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center mt-4">
                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => setCurrentPage(0)}
                                            disabled={currentPage === 0}
                                        >
                                            &laquo; Primeira
                                        </button>
                                    </li>
                                    
                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            disabled={currentPage === 0}
                                        >
                                            Anterior
                                        </button>
                                    </li>
                                    
                                    {getPageNumbers().map(number => (
                                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => setCurrentPage(number)}
                                            >
                                                {number + 1}
                                            </button>
                                        </li>
                                    ))}
                                    
                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            disabled={currentPage === totalPages - 1}
                                        >
                                            Próxima
                                        </button>
                                    </li>
                                    
                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => setCurrentPage(totalPages - 1)}
                                            disabled={currentPage === totalPages - 1}
                                        >
                                            Última &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}

                        <div className="text-center text-muted mt-2">
                            Página {currentPage + 1} de {totalPages} - Mostrando {pois.length} de {totalElements} itens
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default POIList;