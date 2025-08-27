import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import { getRecommendationById, getSimilarityMetrics } from "../../../services/recommender";
import '../../../App.css';

const RecommendationDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recommendation, setRecommendation] = useState(null);
    const [similarityMetrics, setSimilarityMetrics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from') || 'list';

    const getBackUrl = () => {
        switch (from) {
            case 'user':
                return '/recommendation/user';
            case 'list':
                return '/recommendation/list';
            default:
                return '/recommendation/list';
        }
    };

    const getBackButtonText = () => {
        switch (from) {
            case 'user':
                return '← Voltar para Minhas Recomendações';
            case 'list':
                return '← Voltar para Lista de Recomendações';
            default:
                return '← Voltar para Lista';
        }
    };

    useEffect(() => {
        if (id) {
            fetchRecommendationDetails();
        }
    }, [id]);

    const fetchRecommendationDetails = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Buscar dados da recomendação e métricas em paralelo
            const [recommendationResponse, metricsResponse] = await Promise.all([
                getRecommendationById(id),
                getSimilarityMetrics(id)
            ]);

            if (recommendationResponse.success) {
                setRecommendation(recommendationResponse.data);
            } else {
                setError(`Erro ao buscar recomendação: ${recommendationResponse.messages?.join(', ')}`);
            }

            if (metricsResponse.success) {
                setSimilarityMetrics(metricsResponse.data || []);
            } else {
                console.error("Erro ao buscar métricas:", metricsResponse.messages);
                // Não definir como erro crítico, pois a recomendação ainda pode ser mostrada
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setError("Erro inesperado ao carregar os dados da recomendação");
        } finally {
            setIsLoading(false);
        }
    };

    // Preparar dados para o gráfico radar
    const prepareRadarData = () => {
        if (!similarityMetrics || similarityMetrics.length === 0) return [];

        return similarityMetrics.map(metric => ({
            poiId: `POI ${metric.poiId}`,
            Cosine: Number((metric.cosine * 100).toFixed(2)),
            Euclidean: Number((metric.euclidean * 100).toFixed(2)),
            Pearson: Number((metric.pearson * 100).toFixed(2)),
            Jaccard: Number((metric.jaccard * 100).toFixed(2)),
            Média: Number((metric.average * 100).toFixed(2))
        }));
    };

    const radarData = prepareRadarData();

    // Cores para as diferentes métricas
    const metricColors = {
        Cosine: '#8884d8',
        Euclidean: '#82ca9d',
        Pearson: '#ffc658',
        Jaccard: '#ff7300',
        Média: '#ff0000'
    };

    if (isLoading) {
        return (
            <div className="ListContainer">
                <Header />
                <div className="ListBox">
                    <div className="ListContent">
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="ListContainer">
                <Header />
                <div className="ListBox">
                    <div className="ListContent">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                        <div className="text-center mt-3">
                            <Button
                                cor="secondary"
                                outline={true}
                                aoClicar={() => navigate(getBackUrl())}
                            >
                                {getBackButtonText()}
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="ListContainer">
            <Header />

            <div className="ListBox">
                <div className="ListContent">
                    <div className="formHeader">
                        <h2 className="formHeaderTitle">
                            Detalhes da Recomendação
                        </h2>
                    </div>

                    <div className="formBody">
                        <div className="mb-4">
                            <Button
                                cor="secondary"
                                outline={true}
                                aoClicar={() => navigate(getBackUrl())}
                            >
                                {getBackButtonText()}
                            </Button>
                        </div>

                        {recommendation && (
                            <>
                                {/* Informações da Recomendação */}
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="card-title mb-0">
                                                    Recomendação #{recommendation.id}
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-3 text-muted">
                                                    POIs Recomendados ({recommendation.pois?.length || 0} itens)
                                                </h6>

                                                {recommendation.pois && recommendation.pois.length > 0 ? (
                                                    <div className="recommendationsList">
                                                        {recommendation.pois.map((poi, index) => (
                                                            <div key={poi.id} className="recommendationItem">
                                                                <div className="itemHeader">
                                                                    <span className="itemRank">#{index + 1}</span>
                                                                    <h3 className="itemTitle">{poi.name}</h3>
                                                                </div>
                                                                <p className="itemDescription">
                                                                    {poi.description?.length > 1000
                                                                        ? `${poi.description.substring(0, 1000)}...`
                                                                        : poi.description
                                                                    }
                                                                </p>
                                                                <div className="itemFooter">
                                                                    <div className="itemLocation">
                                                                        <i className="bi bi-geo-alt"></i>
                                                                        <span>{poi.address?.neighborhood || 'Bairro não especificado'}, {poi.address?.city || 'Cidade não especificada'}</span>
                                                                    </div>
                                                                    {poi.motivations && poi.motivations.length > 0 && (
                                                                        <div className="itemFeatures">
                                                                            {poi.motivations.slice(0, 3).map((m, i) => (
                                                                                <span key={i} className="featureTag">{m}</span>
                                                                            ))}
                                                                            {poi.motivations.length > 3 && (
                                                                                <span className="featureMore">+{poi.motivations.length - 3}</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted">Nenhum POI encontrado nesta recomendação.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gráfico Radar das Métricas de Similaridade */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="card-title mb-0">
                                                    Métricas de Similaridade
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                {radarData && radarData.length > 0 ? (
                                                    <>
                                                        <div style={{ width: '100%', height: '500px' }}>
                                                            <ResponsiveContainer>
                                                                <RadarChart data={radarData}>
                                                                    <PolarGrid />
                                                                    <PolarAngleAxis
                                                                        dataKey="poiId"
                                                                        tick={{ fontSize: 12 }}
                                                                    />
                                                                    <PolarRadiusAxis
                                                                        angle={90}
                                                                        domain={[0, 100]}
                                                                        tick={{ fontSize: 10 }}
                                                                        tickFormatter={(value) => `${value}%`}
                                                                    />
                                                                    <Radar
                                                                        name="Cosine"
                                                                        dataKey="Cosine"
                                                                        stroke={metricColors.Cosine}
                                                                        fill={metricColors.Cosine}
                                                                        fillOpacity={0.1}
                                                                        strokeWidth={2}
                                                                    />
                                                                    <Radar
                                                                        name="Euclidean"
                                                                        dataKey="Euclidean"
                                                                        stroke={metricColors.Euclidean}
                                                                        fill={metricColors.Euclidean}
                                                                        fillOpacity={0.1}
                                                                        strokeWidth={2}
                                                                    />
                                                                    <Radar
                                                                        name="Pearson"
                                                                        dataKey="Pearson"
                                                                        stroke={metricColors.Pearson}
                                                                        fill={metricColors.Pearson}
                                                                        fillOpacity={0.1}
                                                                        strokeWidth={2}
                                                                    />
                                                                    <Radar
                                                                        name="Jaccard"
                                                                        dataKey="Jaccard"
                                                                        stroke={metricColors.Jaccard}
                                                                        fill={metricColors.Jaccard}
                                                                        fillOpacity={0.1}
                                                                        strokeWidth={2}
                                                                    />
                                                                    <Radar
                                                                        name="Média"
                                                                        dataKey="Média"
                                                                        stroke={metricColors.Média}
                                                                        fill={metricColors.Média}
                                                                        fillOpacity={0.2}
                                                                        strokeWidth={3}
                                                                    />
                                                                    <Legend />
                                                                    <Tooltip
                                                                        formatter={(value, name) => [`${value}%`, name]}
                                                                        labelFormatter={(label) => `POI: ${label}`}
                                                                    />
                                                                </RadarChart>
                                                            </ResponsiveContainer>
                                                        </div>

                                                        {/* Tabela de Métricas */}
                                                        <div className="mt-4">
                                                            <h6 className="mb-3">Detalhes das Métricas (%)</h6>
                                                            <div className="table-responsive">
                                                                <table className="table table-sm table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>POI ID</th>
                                                                            <th>Cosine</th>
                                                                            <th>Euclidean</th>
                                                                            <th>Pearson</th>
                                                                            <th>Jaccard</th>
                                                                            <th>Média</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {similarityMetrics.map((metric) => (
                                                                            <tr key={metric.poiId}>
                                                                                <td><strong>{metric.poiId}</strong></td>
                                                                                <td>{(metric.cosine * 100).toFixed(2)}%</td>
                                                                                <td>{(metric.euclidean * 100).toFixed(2)}%</td>
                                                                                <td>{(metric.pearson * 100).toFixed(2)}%</td>
                                                                                <td>{(metric.jaccard * 100).toFixed(2)}%</td>
                                                                                <td><strong>{(metric.average * 100).toFixed(2)}%</strong></td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center text-muted">
                                                        <i className="bi bi-bar-chart fs-1 mb-3"></i>
                                                        <p>Nenhuma métrica de similaridade disponível para esta recomendação.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default RecommendationDetails;