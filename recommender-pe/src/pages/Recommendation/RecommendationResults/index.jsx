import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal';
import { sendScores } from '../../../services/recommender';
import '../../../App.css';
import './recommendationResults.css';

const RecommendationResults = () => {
    const { state } = useLocation();
    const recommendations = state?.recommendations || [];
    const recommendationId = state?.recommendationId;
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [scores, setScores] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleScore = (poiId, scoreValue) => {
        setScores(prev => ({
            ...prev,
            [poiId]: scoreValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recommendationId) {
            setSubmitMessage('Erro: ID de recomendação não encontrado');
            return;
        }

        if (Object.keys(scores).length === 0) {
            setSubmitMessage('Por favor, avalie pelo menos uma recomendação');
            return;
        }

        setIsSubmitting(true);
        try {
            const scoresArray = Object.entries(scores).map(([poiId, scoreValue]) => ({
                poiId: Number(poiId),
                scoreValue: scoreValue,
                recommendationId: Number(recommendationId)
            }));

            await sendScores(recommendationId, scoresArray);
            setShowSuccessModal(true);
            setSubmitMessage('');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Erro ao enviar avaliações:', error);
            setSubmitMessage('Erro ao enviar avaliações. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid default-list-container">
            <Header />

            <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                {/* Header Section */}
                <div className="text-center mb-5 default-list-header">
                    <h1 className="default-list-header-title">
                        Suas Recomendações Personalizadas
                    </h1>
                    <p className="default-list-header-subtitle">
                        Locais que combinam perfeitamente com suas preferências
                    </p>
                    <div className="default-list-header-divider"></div>
                </div>

                {/* Stats Card */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card default-list-card">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="default-list-card-icon me-3">
                                            <i className="bi bi-pin-map-fill text-dark"></i>
                                        </div>
                                        <div>
                                            <h4 className="default-list-card-title mb-1">Recomendações Encontradas</h4>
                                            <p className="default-list-card-subtitle mb-0">Baseado em suas preferências pessoais</p>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold text-dark" style={{ fontSize: '2.5rem' }}>
                                            {recommendations.length}
                                        </div>
                                        <small className="text-muted">
                                            Locais selecionados
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Form */}
                <form onSubmit={handleSubmit} className="recommendation-form">
                    {recommendations.length > 0 ? (
                        <>
                            {/* Introduction */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card recommendation-intro-card">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <i className="bi bi-info-circle text-muted me-2"></i>
                                                <h5 className="fw-bold mb-0">Como avaliar</h5>
                                            </div>
                                            <p className="text-muted mb-0">
                                                Avalie as recomendações abaixo para melhorar futuras sugestões. 
                                                Suas avaliações nos ajudam a entender melhor suas preferências.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations Grid */}
                            <div className="row g-4 mb-5">
                                {recommendations.map((poi, index) => (
                                    <div key={poi.id} className="col-12">
                                        <div className="card recommendation-card">
                                            {/* Card Header */}
                                            <div className="card-header recommendation-card-header">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="recommendation-rank-badge me-3">
                                                            #{index + 1}
                                                        </div>
                                                        <div>
                                                            <h5 className="recommendation-card-title mb-0">
                                                                {poi.name}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="card-body p-4">
                                                {/* Description Section */}
                                                <div className="mb-4 recommendation-card-section">
                                                    <div className="recommendation-card-section-header">
                                                        <i className="bi bi-info-circle text-muted me-2"></i>
                                                        <h6 className="recommendation-card-section-title">Descrição</h6>
                                                    </div>
                                                    <p className="recommendation-description text-muted">
                                                        {poi.description.length > 1000
                                                            ? `${poi.description.substring(0, 1000)}...`
                                                            : poi.description
                                                        }
                                                    </p>
                                                </div>

                                                {/* Location Section */}
                                                <div className="mb-4 recommendation-card-section">
                                                    <div className="recommendation-card-section-header">
                                                        <i className="bi bi-geo-alt text-muted me-2"></i>
                                                        <h6 className="recommendation-card-section-title">Localização</h6>
                                                    </div>
                                                    <div className="recommendation-location">
                                                        <i className="bi bi-geo-alt text-muted me-2"></i>
                                                        <span>
                                                            {poi.address?.neighborhood || 'Bairro não especificado'}, {poi.address?.city || 'Cidade não especificada'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Features Section */}
                                                {poi.motivations && poi.motivations.length > 0 && (
                                                    <div className="mb-4 recommendation-card-section">
                                                        <div className="recommendation-card-section-header">
                                                            <i className="bi bi-tags text-muted me-2"></i>
                                                            <h6 className="recommendation-card-section-title">Características</h6>
                                                        </div>
                                                        <div className="recommendation-features">
                                                            {poi.motivations.slice(0, 3).map((motivation, i) => (
                                                                <span key={i} className="recommendation-feature-tag">
                                                                    {motivation}
                                                                </span>
                                                            ))}
                                                            {poi.motivations.length > 3 && (
                                                                <span className="recommendation-feature-more">
                                                                    +{poi.motivations.length - 3} mais
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Score Buttons */}
                                                <div className="recommendation-score-section">
                                                    <div className="recommendation-card-section-header mb-3">
                                                        <i className="bi bi-hand-thumbs-up text-muted me-2"></i>
                                                        <h6 className="recommendation-card-section-title">Sua avaliação</h6>
                                                    </div>
                                                    <div className="recommendation-score-buttons">
                                                        <button
                                                            type="button"
                                                            className={`recommendation-like-button ${scores[poi.id] === 1 ? 'active' : ''}`}
                                                            onClick={() => handleScore(poi.id, 1)}
                                                        >
                                                            <i className="bi bi-hand-thumbs-up"></i>
                                                            <span>Gostei</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`recommendation-dislike-button ${scores[poi.id] === 0 ? 'active' : ''}`}
                                                            onClick={() => handleScore(poi.id, 0)}
                                                        >
                                                            <i className="bi bi-hand-thumbs-down"></i>
                                                            <span>Não gostei</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom accent line */}
                                            <div className="recommendation-card-divider"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <div className="recommendation-empty-icon-container">
                                    <i className="bi bi-exclamation-triangle recommendation-empty-icon text-muted"></i>
                                </div>
                            </div>
                            <h3 className="recommendation-empty-title">Nenhuma recomendação encontrada</h3>
                            <p className="text-muted mb-4">
                                Não encontramos locais que correspondam às suas preferências atuais.
                                Tente ajustar seus critérios de busca.
                            </p>
                            <Button
                                type="button"
                                cor="primary"
                                tamanho="md"
                                onClick={() => navigate('/recommendation')}
                                className="recommendation-empty-action-button"
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Refazer busca
                            </Button>
                        </div>
                    )}

                    {/* Submit Message */}
                    {submitMessage && (
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className={`alert ${submitMessage.includes('Erro') ? 'alert-danger' : 'alert-success'} recommendation-submit-message`}>
                                    <i className={`bi ${submitMessage.includes('Erro') ? 'bi-exclamation-circle' : 'bi-check-circle'} me-2`}></i>
                                    {submitMessage}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {recommendations.length > 0 && (
                        <div className="row">
                            <div className="col-12">
                                <div className="card recommendation-actions-card">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                            <Button
                                                type="button"
                                                cor="secondary"
                                                tamanho="md"
                                                outline={true}
                                                onClick={() => navigate('/recommendation')}
                                                className="recommendation-cancel-button"
                                            >
                                                <i className="bi bi-arrow-left me-2"></i>
                                                Refazer busca
                                            </Button>

                                            <Button
                                                type="submit"
                                                cor="primary"
                                                tamanho="md"
                                                outline={false}
                                                disabled={isSubmitting || Object.keys(scores).length === 0}
                                                className="recommendation-submit-button"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Enviando avaliações...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-send me-2"></i>
                                                        Enviar Avaliações ({Object.keys(scores).length})
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        {Object.keys(scores).length === 0 && recommendations.length > 0 && (
                                            <div className="recommendation-score-hint mt-3">
                                                <i className="bi bi-info-circle text-muted me-2"></i>
                                                <small className="text-muted">
                                                    Avalie pelo menos uma recomendação para enviar
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <Footer />
            
            {showSuccessModal && (
                <Modal
                    titulo="Avaliações Enviadas!"
                    texto="Obrigado por avaliar as recomendações! Sua contribuição ajuda a melhorar nosso sistema."
                    txtBtn01="Voltar à Página Inicial"
                    onClickBtn01={() => navigate("/")}
                    onClickBtnClose={() => navigate("/")} 
                />
            )}
        </div>
    );
}

export default RecommendationResults;