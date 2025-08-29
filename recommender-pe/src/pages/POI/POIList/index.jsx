import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getAllPOI } from "../../../services/POI";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/GlobalContext";
import { useContext } from "react";
import Button from "../../../components/Button";
import './POIList.css';

// Objetos de mapeamento para tradução (os mesmos usados no POIForm)
const motivationLabels = {
    ARTISTIC_VALUE: "Valor Artístico",
    CREATIVITY: "Criatividade",
    CULTURE: "Cultura",
    ENTERTAINMENT: "Entretenimento",
    EXPLORATION: "Exploração",
    EDUCATION: "Educação",
    FAMILY: "Família",
    GASTRONOMY: "Gastronomia",
    HERITAGE: "Patrimônio",
    IDENTITY: "Identidade",
    IMMERSIVE_EXPERIENCE: "Experiência Imersiva",
    RELAXATION: "Relaxamento",
    SOCIAL: "Social",
    SPIRITUALITY: "Espiritualidade",
    TRADITION: "Tradição"
};

const hobbyLabels = {
    ADVENTURE: "Aventura",
    ART: "Arte",
    DANCING: "Dança",
    GASTRONOMY: "Gastronomia",
    GARDENING: "Jardinagem",
    HIKING: "Caminhada",
    LEARNING: "Aprendizado",
    MUSIC: "Música",
    PHOTOGRAPHY: "Fotografia",
    READING: "Leitura",
    SOCIAL: "Social",
    TECH: "Tecnologia",
    THEATER: "Teatro",
    TRAVELING: "Viagem",
    VOLUNTEERING: "Voluntariado"
};

const themeLabels = {
    ADVENTURE: "Aventura",
    AFRO_BRAZILIAN: "Afro-brasileiro",
    BAROQUE: "Barroco",
    COLONIAL: "Colonial",
    CULTURAL: "Cultural",
    FAMILY_FRIENDLY: "Para Família",
    FOLKLORE: "Folclore",
    GASTRONOMIC: "Gastronômico",
    HISTORY: "Histórico",
    ARCHITECTURAL_STYLE: "Estilo Arquitetônico",
    MODERN: "Moderno",
    NATURE: "Natureza",
    RELIGIOUS: "Religioso",
    ROMANTIC: "Romântico",
    URBAN_ART: "Arte Urbana"
};

const POIList = () => {
    const navigate = useNavigate();
    const [pois, setPOIs] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { usuarioLogado } = useContext(GlobalContext);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchPOIs();
    }, [currentPage]);

    const fetchPOIs = async () => {
        setIsLoading(true);
        try {
            const response = await getAllPOI(currentPage, itemsPerPage);
            if (response.success) {
                setPOIs(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || 0);
            } else {
                console.error("Erro ao buscar POIs:", response.messages);
            }
        } catch (error) {
            console.error("Erro ao buscar POIs:", error);
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

    const truncateText = (text, maxLength) => {
        return text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    // Função modificada para traduzir os valores
    const formatArray = (array, maxItems = 2, type = "") => {
        if (!array || array.length === 0) return '-';
        
        // Seleciona o objeto de mapeamento correto baseado no tipo
        let labelsMap = {};
        if (type === "motivations") labelsMap = motivationLabels;
        else if (type === "hobbies") labelsMap = hobbyLabels;
        else if (type === "themes") labelsMap = themeLabels;
        
        // Traduz os itens se um mapeamento for fornecido
        const translatedItems = labelsMap 
            ? array.map(item => labelsMap[item] || item)
            : array;
        
        const items = translatedItems.slice(0, maxItems);
        const result = items.join(', ');
        return array.length > maxItems ? `${result}...` : result;
    };

    return (
        <div className="container-fluid default-list-container">
            <Header />

            <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Header Section */}
                <div className="text-center mb-5 default-list-header">
                    <h1 className="default-list-header-title">Pontos de Interesse</h1>
                    <p className="default-list-header-subtitle">Gerencie todos os locais cadastrados no sistema</p>
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
                                            <h4 className="default-list-card-title">Lista de POIs</h4>
                                            <p className="default-list-card-subtitle">
                                                {totalElements} {totalElements === 1 ? 'item encontrado' : 'itens encontrados'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <span className="default-list-page-badge">
                                            Página {currentPage + 1} de {totalPages}
                                        </span>
                                        {usuarioLogado && (usuarioLogado.role === "ADMIN" || usuarioLogado.role === "MASTER") && (
                                            <Button
                                                cor="dark"
                                                aoClicar={() => navigate("/POIs/register")}
                                                className="default-list-new-button"
                                            >
                                                <i className="bi bi-plus-circle"></i>
                                                Novo POI
                                            </Button>
                                        )}
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
                                                <th scope="col" className="py-3">Nome</th>
                                                <th scope="col" className="py-3">Descrição</th>
                                                <th scope="col" className="py-3">Endereço</th>
                                                <th scope="col" className="py-3">Motivações</th>
                                                <th scope="col" className="py-3">Hobbies</th>
                                                <th scope="col" className="py-3">Temas</th>
                                                <th scope="col" className="py-3">Status</th>
                                                {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                                    <th scope="col" className="py-3">Ações</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr>
                                                    <td
                                                        colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 9 : 8}
                                                        className="text-center py-5"
                                                    >
                                                        <div className="d-flex flex-column align-items-center default-list-loading-container">
                                                            <div className="spinner-border text-dark mb-3 default-list-loading-spinner" role="status">
                                                                <span className="visually-hidden">Carregando...</span>
                                                            </div>
                                                            <span className="text-muted">Carregando POIs...</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : pois.length > 0 ? (
                                                pois.map((poi, index) => (
                                                    <tr
                                                        key={poi.id}
                                                        style={{
                                                            borderBottom: index === pois.length - 1 ? 'none' : '1px solid #f0f0f0'
                                                        }}
                                                    >
                                                        <td className="px-4">
                                                            <span className="default-list-id-badge">
                                                                {poi.id}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="fw-medium text-dark">
                                                                {truncateText(poi.name, 30)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="default-list-truncated-text">
                                                                {truncateText(poi.description, 40)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <div className="default-list-address-line">
                                                                    {poi.address?.street}, {poi.address?.number}
                                                                </div>
                                                                <div className="default-list-address-detail">
                                                                    {poi.address?.neighborhood}, {poi.address?.city}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {formatArray(poi.motivations, 2, "motivations")}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {formatArray(poi.hobbies, 2, "hobbies")}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="default-list-truncated-text">
                                                                {formatArray(poi.themes, 2, "themes")}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`default-list-status-badge ${poi.status === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}>
                                                                {poi.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                                                            </span>
                                                        </td>
                                                        {(usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER") && (
                                                            <td>
                                                                <Button
                                                                    outline
                                                                    cor="dark"
                                                                    tamanho="sm"
                                                                    aoClicar={() => navigate(`/POIs/${poi.id}`)}
                                                                    className="default-list-edit-button"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                    Editar
                                                                </Button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={usuarioLogado?.role === "ADMIN" || usuarioLogado?.role === "MASTER" ? 9 : 8}
                                                        className="text-center py-5"
                                                    >
                                                        <div className="d-flex flex-column align-items-center default-list-empty-container">
                                                            <div className="default-list-empty-icon mb-3">
                                                                <i className="bi bi-inbox display-6 text-muted"></i>
                                                            </div>
                                                            <h5 className="text-dark mb-2 default-list-empty-title">
                                                                {currentPage === 0 ? "Nenhum POI encontrado" : "Nenhum POI nesta página"}
                                                            </h5>
                                                            <p className="text-muted mb-0">
                                                                {currentPage === 0 ? "Cadastre o primeiro POI para começar" : "Tente navegar para outra página"}
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
                                        Mostrando {pois.length} de {totalElements} registros
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
};

export default POIList;