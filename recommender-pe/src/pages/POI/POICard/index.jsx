import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from '../../../components/Footer';
import { getAllPOI } from "../../../services/POI";
import '../../../App.css';

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
            const itemsPerPage = 100; // Usar um número alto para buscar muitos por vez

            while (hasMorePages) {
                const response = await getAllPOI(currentPage, itemsPerPage);
                if (response.success && response.data) { // Verifica se response.data existe
                    const content = response.data.content || [];
                    allPOIs = [...allPOIs, ...content];

                    // Determina se há mais páginas
                    // Se totalPages for 0 ou 1, ou se a página atual for a última página, para.
                    // Se content estiver vazio, significa que não há mais dados, então para.
                    hasMorePages = content.length > 0 && (currentPage < (response.data.totalPages || 0) - 1);
                    currentPage++;
                } else {
                    hasMorePages = false; // Para se não for bem-sucedido ou não houver dados
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
        <div className="ListContainer">
            <Header />

            <div className="ListBox">
                <div className="ListContent">
                    <div className="formHeader">
                        <h2 className="formHeaderTitle">
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
                            <span className="badge bg-primary fs-6">
                                Total: {totalElements} POIs
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Carregando...</span>
                                </div>
                                <p className="mt-3">Carregando POIs...</p>
                            </div>
                        ) : pois.length > 0 ? (
                            <div className="row g-4">
                                {pois.map((poi) => (
                                    <div key={poi.id} className="col-12 col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px' }}>
                                            <div className="card-header bg-primary text-white" style={{ borderRadius: '15px 15px 0 0' }}>
                                                <h5 className="card-title mb-0 d-flex align-items-center">
                                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                                    {poi.name}
                                                </h5>
                                            </div>
                                            <div className="card-body d-flex flex-column">
                                                <div className="mb-3 flex-grow-1">
                                                    <h6 className="text-muted mb-2">
                                                        <i className="bi bi-info-circle me-1"></i>
                                                        Descrição
                                                    </h6>
                                                    <p className="card-text">{poi.description}</p>
                                                </div>
                                                
                                                <div className="mt-auto">
                                                    <h6 className="text-muted mb-2">
                                                        <i className="bi bi-house-door me-1"></i>
                                                        Endereço
                                                    </h6>
                                                    <div className="address-info">
                                                        <p className="mb-1 fw-semibold">
                                                            {poi.address?.street}, {poi.address?.number}
                                                        </p>
                                                        <p className="mb-0 text-muted small">
                                                            {poi.address?.neighborhood}, {poi.address?.city}
                                                        </p>
                                                        {poi.address?.state && (
                                                            <p className="mb-0 text-muted small">
                                                                {poi.address.state}
                                                                {poi.address?.zipCode && ` - CEP: ${poi.address.zipCode}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <i className="bi bi-geo-alt display-1 text-muted"></i>
                                <h4 className="mt-3 text-muted">Nenhum POI encontrado</h4>
                                <p className="text-muted">
                                    Não há pontos de interesse cadastrados no momento.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default POICards;
