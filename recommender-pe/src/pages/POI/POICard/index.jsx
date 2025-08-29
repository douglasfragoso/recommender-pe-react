import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from '../../../components/Footer';
import { getAllPOI } from "../../../services/POI";
import '../../../App.css';
import './POICard.css'; 

const POICards = () => {
    const [pois, setPOIs] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAllPOIs();
    }, []);

    const fetchAllPOIs = async () => {
        setIsLoading(true);
        try {
            let allPOIs = [];
            let currentPage = 0;
            let hasMorePages = true;
            const itemsPerPage = 100;

            while (hasMorePages) {
                const response = await getAllPOI(currentPage, itemsPerPage);
                if (response.success && response.data) {
                    const content = response.data.content || [];
                    allPOIs = [...allPOIs, ...content];

                    hasMorePages = content.length > 0 && (currentPage < (response.data.totalPages || 0) - 1);
                    currentPage++;
                } else {
                    hasMorePages = false;
                    if (!response.success) {
                        console.error("Erro ao buscar POIs:", response.messages);
                    } else {
                        console.error("Erro: response.data é indefinido ou nulo.");
                    }
                }
            }

            setPOIs(allPOIs);
            setTotalElements(allPOIs.length);
        } catch (error) {
            console.error("Erro ao buscar POIs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid poi-container">
            <Header />

            <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Header Section */}
                <div className="text-center mb-5 poi-header">
                    <h1 className="poi-header-title">Pontos de Interesse</h1>
                    <p className="poi-header-subtitle">Explore todos os locais cadastrados no sistema</p>
                    <div className="poi-header-divider"></div>
                </div>

                {/* Stats Card */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card poi-stats-card">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="poi-stats-icon-container me-4">
                                            <i className="bi bi-geo-alt-fill poi-stats-icon"></i>
                                        </div>
                                        <div>
                                            <h4 className="fw-bold text-dark mb-1">POIs Cadastrados</h4>
                                            <p className="text-muted mb-0">Total de pontos de interesse no sistema</p>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="poi-stats-count">
                                            {totalElements.toLocaleString()}
                                        </div>
                                        <small className="poi-stats-label">
                                            Locais únicos
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center poi-loading-container">
                        <div className="text-center">
                            <div className="spinner-border text-dark mb-3 poi-spinner" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                            <h5 className="text-muted">Carregando pontos de interesse...</h5>
                        </div>
                    </div>
                ) : pois.length > 0 ? (
                    /* POI Cards Grid */
                    <div className="row g-4">
                        {pois.map((poi) => (
                            <div key={poi.id} className="col-12 col-md-6 col-xl-4">
                                <div className="card poi-card">
                                    {/* Card Header */}
                                    <div className="card-header poi-card-header">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="poi-card-icon me-3">
                                                    <i className="bi bi-geo-alt-fill text-dark"></i>
                                                </div>
                                                <div>
                                                    <h5 className="poi-card-title">
                                                        {poi.name}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="card-body p-4 d-flex flex-column">
                                        {/* Description Section */}
                                        <div className="mb-4 flex-grow-1 poi-card-section">
                                            <div className="poi-card-section-header">
                                                <i className="bi bi-info-circle text-muted me-2"></i>
                                                <h6 className="poi-card-section-title">Descrição</h6>
                                            </div>
                                            <p className="poi-description text-muted">
                                                {poi.description}
                                            </p>
                                        </div>

                                        {/* Address Section */}
                                        <div className="mt-auto">
                                            <div className="poi-card-section-header">
                                                <i className="bi bi-house-door text-muted me-2"></i>
                                                <h6 className="poi-card-section-title">Localização</h6>
                                            </div>

                                            <div className="poi-address-container">
                                                <div className="poi-address-line">
                                                    <i className="bi bi-geo-alt text-muted me-2 mt-1"></i>
                                                    <div>
                                                        <div className="poi-address-text">
                                                            {poi.address?.street}, {poi.address?.number}
                                                        </div>
                                                        <div className="poi-address-detail mb-1">
                                                            {poi.address?.neighborhood}, {poi.address?.city}
                                                        </div>
                                                        {poi.address?.state && (
                                                            <div className="poi-address-detail">
                                                                {poi.address.state}
                                                                {poi.address?.zipCode && ` - CEP: ${poi.address.zipCode}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="poi-card-divider"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <div className="poi-empty-icon-container">
                                <i className="bi bi-geo-alt poi-empty-icon text-muted"></i>
                            </div>
                        </div>
                        <h3 className="poi-empty-title">Nenhum POI encontrado</h3>
                        <p className="text-muted mb-4">
                            Não há pontos de interesse cadastrados no momento.
                        </p>
                        <div className="poi-empty-action">
                            <i className="bi bi-plus-circle text-muted poi-empty-action-icon"></i>
                            <p className="text-muted fw-medium mb-0">Cadastre o primeiro POI</p>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default POICards;