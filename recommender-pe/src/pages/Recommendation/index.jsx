import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './recommendationResults.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { sendScores } from '../../services/recommender';
import '../../App.css';

const RecommendationResults = () => {
    const { state } = useLocation();
    const recommendations = state?.recommendations || [];
    const recommendationId = state?.recommendationId;
    const navigate = useNavigate();

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
            setSubmitMessage('Obrigado por avaliar as recomendações!');

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
        <div className="containerForm">
            <Header />

            <div className="formBox">
                <div className="formContent">
                    <div className="header">
                        <h2 className="headerTitle">
                            <i className="bi bi-stars icon"></i>
                            Suas Recomendações Personalizadas
                        </h2>
                    </div>

                    <div className="formBody">
                        <form onSubmit={handleSubmit} className="recommendationForm">
                            <div className="section">
                                <div className="recommendationIntro">
                                    <h5 className="sectionHeader">
                                        <i className="bi bi-pin-map sectionIcon"></i>
                                        Locais que combinam com você
                                    </h5>
                                    <p className="sectionDescription">
                                        Baseado em suas preferências, encontramos {recommendations.length} pontos de interesse.
                                        Avalie as recomendações para melhorar futuras sugestões:
                                    </p>
                                </div>

                                <div className="recommendationsList">
                                    {recommendations.length > 0 ? (
                                        recommendations.map((poi, index) => (
                                            <div key={poi.id} className="recommendationItem">
                                                <div className="itemHeader">
                                                    <span className="itemRank">#{index + 1}</span>
                                                    <h3 className="itemTitle">{poi.name}</h3>
                                                </div>
                                                <p className="itemDescription">
                                                    {poi.description.length > 1000
                                                        ? `${poi.description.substring(0, 1000)}...`
                                                        : poi.description
                                                    }
                                                </p>
                                                <div className="itemFooter">
                                                    <div className="itemLocation">
                                                        <i className="bi bi-geo-alt"></i>
                                                        <span>{poi.address?.neighborhood || 'Bairro não especificado'}, {poi.address?.city || 'Cidade não especificada'}</span>
                                                    </div>
                                                    <div className="itemFeatures">
                                                        {poi.motivations?.slice(0, 3).map((m, i) => (
                                                            <span key={i} className="featureTag">{m}</span>
                                                        ))}
                                                        {poi.motivations?.length > 3 && (
                                                            <span className="featureMore">+{poi.motivations.length - 3}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="scoreButtons">
                                                    <button
                                                        type="button"
                                                        className={`likeButton ${scores[poi.id] === 1 ? 'active' : ''}`}
                                                        onClick={() => handleScore(poi.id, 1)}
                                                    >
                                                        <i className="bi bi-hand-thumbs-up"></i> Gostei
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`dislikeButton ${scores[poi.id] === 0 ? 'active' : ''}`}
                                                        onClick={() => handleScore(poi.id, 0)}
                                                    >
                                                        <i className="bi bi-hand-thumbs-down"></i> Não gostei
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="noResults">
                                            <i className="bi bi-exclamation-triangle"></i>
                                            <p>Nenhuma recomendação encontrada com suas preferências atuais.</p>
                                            <p>Tente ajustar seus critérios de busca.</p>
                                        </div>
                                    )}
                                </div>

                                {submitMessage && (
                                    <div className={`submitMessage ${submitMessage.includes('Obrigado') ? 'success' : 'error'}`}>
                                        {submitMessage}
                                    </div>
                                )}

                                <div className="buttonGroup">
                                    <Button
                                        type="button"
                                        cor="secondary"
                                        tamanho="md"
                                        outline={true}
                                        onClick={() => navigate('/recommendation')}
                                        className="cancelButton"
                                    >
                                        <i className="bi bi-arrow-left"></i>
                                        Refazer minha busca
                                    </Button>

                                    <Button
                                        type="submit"
                                        cor="primary"
                                        tamanho="md"
                                        outline={false}
                                        disabled={isSubmitting || Object.keys(scores).length === 0}
                                        className="submitButton"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Enviando...
                                            </>
                                        ) : (
                                            'Enviar Avaliações'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default RecommendationResults;