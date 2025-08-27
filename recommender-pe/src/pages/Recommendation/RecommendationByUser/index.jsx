import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import { getUserRecommendations } from "../../../services/recommender";
import '../../../App.css';

const RecommendationByUser = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUserRecommendations();
    }, [currentPage]);

    const fetchUserRecommendations = async () => {
        setIsLoading(true);
        try {
            const response = await getUserRecommendations(currentPage, itemsPerPage);
            if (response.success) {
                setRecommendations(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || 0);
            } else {
                console.error("Erro ao buscar recomendações do usuário:", response.messages);
            }
        } catch (error) {
            console.error("Erro ao buscar recomendações do usuário:", error);
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
                            Minhas Recomendações
                        </h2>
                    </div>

                    <div className="formBody">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="sectionHeader">
                                Histórico de Recomendações
                            </h5>
                            <div className="d-flex align-items-center">
                                <span className="me-3">
                                    Total: {totalElements} Recomendações
                                </span>
                                <Button
                                    aoClicar={() => navigate("/recommendation")}
                                    cor="primary"
                                    tamanho="md"
                                    className="submitButton"
                                >
                                    <i className="bi bi-plus-circle"></i>
                                    Nova Recomendação
                                </Button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: '10%' }}>ID</th>
                                        <th scope="col" style={{ width: '60%' }}>POIs Recomendados</th>
                                        <th scope="col" style={{ width: '15%' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center">
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
                                                            aoClicar={() => navigate(`/recommendation/${recommendation.id}?from=user`)}
                                                            className="me-2"
                                                        >
                                                            Detalhes
                                                        </Button>
                                                        <Button
                                                            cor="secondary"
                                                            outline={true}
                                                            tamanho="sm"
                                                            aoClicar={() => navigate(`/recommendation/preferences`)}
                                                        >
                                                            Preferências
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-5">
                                                <div className="d-flex flex-column align-items-center">
                                                    <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                                                    <h5 className="text-muted mb-2">Nenhuma recomendação encontrada</h5>
                                                    <p className="text-muted mb-3">
                                                        Você ainda não possui recomendações. Que tal criar uma nova?
                                                    </p>
                                                    <Button
                                                        aoClicar={() => navigate("/recommendation")}
                                                        cor="primary"
                                                        tamanho="md"
                                                        className="submitButton"
                                                    >
                                                        <i className="bi bi-plus-circle"></i>
                                                        Nova Recomendação
                                                    </Button>
                                                </div>
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

export default RecommendationByUser;