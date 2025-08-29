import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import { getAllRecommendations } from "../../../services/recommender";
import '../../../App.css';

const RecommendationList = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchRecommendations();
    }, [currentPage]);

    const fetchRecommendations = async () => {
        setIsLoading(true);
        try {
            const response = await getAllRecommendations(currentPage, itemsPerPage);
            if (response.success) {
                setRecommendations(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || 0);
            } else {
                console.error("Erro ao buscar recomendações:", response.messages);
            }
        } catch (error) {
            console.error("Erro ao buscar recomendações:", error);
        } finally {
            setIsLoading(false);
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
        <div className="ListContainer">
            <Header />

            <div className="ListBox">
                <div className="ListContent">
                    <div className="formHeader">
                        <h2 className="formHeaderTitle">
                            Recomendações
                        </h2>
                    </div>

                    <div className="formBody">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="sectionHeader">
                                Lista de Recomendações
                            </h5>
                            <div className="d-flex align-items-center">
                                <span className="me-3">
                                    Total: {totalElements} Recomendações
                                </span>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{width: '10%'}}>ID</th>
                                        <th scope="col" style={{width: '70%'}}>POIs Recomendados</th>
                                        <th scope="col" style={{width: '20%'}}>Opções</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={3} className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Carregando...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : recommendations.length > 0 ? (
                                        recommendations.map((recommendation) => (
                                            <tr key={recommendation.id}>
                                                <th scope="row">{recommendation.id}</th>
                                                <td>
                                                    <div className="d-flex flex-wrap">
                                                        {recommendation.pois?.map(poi => (
                                                            <span key={poi.id} className="mb-2 p-2 bg-light rounded">
                                                                {poi.name}
                                                            </span>
                                                        ))}
                                                        {(!recommendation.pois || recommendation.pois.length === 0) && (
                                                            <span className="text-muted">Nenhum POI</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <Button
                                                            cor="secondary"
                                                            outline={true}
                                                            tamanho="sm"
                                                            aoClicar={() => navigate(`/recommendation/${recommendation.id}?from=list`)}
                                                            className="me-2"
                                                        >
                                                            Detalhes
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center">
                                                {currentPage === 0 ? "Nenhuma recomendação encontrada" : "Nenhuma recomendação nesta página"}
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
                            Página {currentPage + 1} de {totalPages} - Mostrando {recommendations.length} de {totalElements} itens
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
 
export default RecommendationList;