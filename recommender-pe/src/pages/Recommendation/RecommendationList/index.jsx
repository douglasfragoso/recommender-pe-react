import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import { getAllRecommendations } from "../../../services/recommender";

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

    const formatPOIs = (pois) => {
        if (!pois || pois.length === 0) return '-';
        
        return pois.map(poi => poi.name).join(', ');
    };

    return (
        <div className="container-fluid default-list-container">
            <Header />

            <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Header Section */}
                <div className="text-center mb-5 default-list-header">
                    <h1 className="default-list-header-title">Todas as Recomendações</h1>
                    <p className="default-list-header-subtitle">Gerencie todas as recomendações do sistema</p>
                    <div className="default-list-header-divider"></div>
                </div>

                {/* Main Content Card */}
                <div className="row">
                    <div className="col-12">
                        <div className="card default-list-card">
                            {/* Card Header with Actions */}
                            <div className="card-header default-list-card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="default-list-card-icon me-3">
                                            <i className="bi bi-list-ul text-dark"></i>
                                        </div>
                                        <div>
                                            <h4 className="default-list-card-title">Lista de Recomendações</h4>
                                            <p className="default-list-card-subtitle">
                                                {totalElements} {totalElements === 1 ? 'recomendação encontrada' : 'recomendações encontradas'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <span className="default-list-page-badge">
                                            Página {currentPage + 1} de {totalPages}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 default-list-table">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="py-3 px-4">ID</th>
                                                <th scope="col" className="py-3" style={{ width: '70%' }}>POIs Recomendados</th>
                                                <th scope="col" className="py-3">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="text-center py-5"
                                                    >
                                                        <div className="d-flex flex-column align-items-center default-list-loading-container">
                                                            <div className="spinner-border text-dark mb-3 default-list-loading-spinner" role="status">
                                                                <span className="visually-hidden">Carregando...</span>
                                                            </div>
                                                            <span className="text-muted">Carregando recomendações...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : recommendations.length > 0 ? (
                                                recommendations.map((recommendation, index) => (
                                                    <tr
                                                        key={recommendation.id}
                                                        style={{
                                                            borderBottom: index === recommendations.length - 1 ? 'none' : '1px solid #f0f0f0'
                                                        }}
                                                    >
                                                        <td className="px-4">
                                                            <span className="default-list-id-badge badge bg-light text-dark px-2 py-1">
                                                                #{recommendation.id}
                                                            </span>
                                                        </td>
                                                        <td style={{ maxWidth: '500px' }}>
                                                            <div className="fw-medium text-dark mb-1" style={{ 
                                                                lineHeight: '1.4',
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                {formatPOIs(recommendation.pois)}
                                                            </div>
                                                            <div className="default-list-truncated-text">
                                                                {recommendation.pois && recommendation.pois.length > 0 && (
                                                                    <small className="text-muted">
                                                                        <i className="bi bi-geo-alt me-1"></i>
                                                                        {recommendation.pois.length} POI(s) recomendado(s)
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                outline
                                                                cor="dark"
                                                                tamanho="sm"
                                                                aoClicar={() => navigate(`/recommendation/${recommendation.id}?from=list`)}
                                                                className="default-list-edit-button"
                                                            >
                                                                <i className="bi bi-eye me-1"></i>
                                                                Detalhes
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="text-center py-5"
                                                    >
                                                        <div className="d-flex flex-column align-items-center default-list-empty-container">
                                                            <div className="default-list-empty-icon mb-3">
                                                                <i className="bi bi-inbox display-6 text-muted"></i>
                                                            </div>
                                                            <h5 className="text-dark mb-2 default-list-empty-title">
                                                                {currentPage === 0 ? "Nenhuma recomendação encontrada" : "Nenhuma recomendação nesta página"}
                                                            </h5>
                                                            <p className="text-muted mb-0">
                                                                {currentPage === 0 ? "Aguarde até que os usuários gerem recomendações" : "Tente navegar para outra página"}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination Footer */}
                            {totalPages > 1 && (
                                <div className="card-footer default-list-pagination">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination justify-content-center mb-0">
                                            <li className={`default-list-page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(0)}
                                                    disabled={currentPage === 0}
                                                >
                                                    <i className="bi bi-chevron-double-left"></i>
                                                </button>
                                            </li>

                                            <li className={`default-list-page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                                    disabled={currentPage === 0}
                                                >
                                                    <i className="bi bi-chevron-left"></i>
                                                </button>
                                            </li>

                                            {getPageNumbers().map(number => (
                                                <li key={number} className={`default-list-page-item ${currentPage === number ? 'active' : ''}`}>
                                                    <button
                                                        className="default-list-page-link"
                                                        onClick={() => setCurrentPage(number)}
                                                    >
                                                        {number + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            <li className={`default-list-page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    disabled={currentPage === totalPages - 1}
                                                >
                                                    <i className="bi bi-chevron-right"></i>
                                                </button>
                                            </li>

                                            <li className={`default-list-page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="default-list-page-link"
                                                    onClick={() => setCurrentPage(totalPages - 1)}
                                                    disabled={currentPage === totalPages - 1}
                                                >
                                                    <i className="bi bi-chevron-double-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>

                                    <div className="text-center default-list-pagination-info">
                                        Mostrando {recommendations.length} de {totalElements} registros
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
 
export default RecommendationList;