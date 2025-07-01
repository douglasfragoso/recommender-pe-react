import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './recommendationResults.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';

function RecommendationResults() {
    const { state } = useLocation();
    const recommendations = state?.recommendations || [];
    const navigate = useNavigate();

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
                        <div className="section">
                            <div className="recommendationIntro">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-pin-map sectionIcon"></i>
                                    Locais que combinam com você
                                </h5>
                                <p className="sectionDescription">
                                    Baseado em suas preferências, encontramos {recommendations.length} pontos de interesse:
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

                            <div className="recommendationActions">
                                <Button
                                    cor="primary"
                                    tamanho="lg"
                                    outline={false}
                                    aoClicar={() => navigate('/recommendation')}
                                    className="btnBackToSearch"
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    Refazer minha busca
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default RecommendationResults;