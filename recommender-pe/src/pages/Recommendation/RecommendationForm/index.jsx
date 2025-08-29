import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import Modal from '../../../components/Modal';
import { getRecommendations } from "../../../services/recommender";

const motivationLabels = {
    ARTISTIC_VALUE: "Valor Artístico", CREATIVITY: "Criatividade", CULTURE: "Cultura",
    ENTERTAINMENT: "Entretenimento", EXPLORATION: "Exploração", EDUCATION: "Educação",
    FAMILY: "Família", GASTRONOMY: "Gastronomia", HERITAGE: "Patrimônio",
    IDENTITY: "Identidade", IMMERSIVE_EXPERIENCE: "Experiência Imersiva", RELAXATION: "Relaxamento",
    SOCIAL: "Social", SPIRITUALITY: "Espiritualidade", TRADITION: "Tradição"
};

const hobbyLabels = {
    ADVENTURE: "Aventura", ART: "Arte", DANCING: "Dança", GASTRONOMY: "Gastronomia",
    GARDENING: "Jardinagem", HIKING: "Caminhada", LEARNING: "Aprendizado", MUSIC: "Música",
    PHOTOGRAPHY: "Fotografia", READING: "Leitura", SOCIAL: "Social", TECH: "Tecnologia",
    THEATER: "Teatro", TRAVELING: "Viagem", VOLUNTEERING: "Voluntariado"
};

const themeLabels = {
    ADVENTURE: "Aventura", AFRO_BRAZILIAN: "Afro-brasileiro", BAROQUE: "Barroco",
    COLONIAL: "Colonial", CULTURAL: "Cultural", FAMILY_FRIENDLY: "Para Família",
    FOLKLORE: "Folclore", GASTRONOMIC: "Gastronômico", HISTORY: "Histórico",
    ARCHITECTURAL_STYLE: "Estilo Arquitetônico", MODERN: "Moderno", NATURE: "Natureza",
    RELIGIOUS: "Religioso", ROMANTIC: "Romântico", URBAN_ART: "Arte Urbana"
};

const RecommendationForm = () => {
    const [motivations, setMotivations] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [themes, setThemes] = useState([]);
    const [error, setError] = useState("");
    const [carregando, setCarregando] = useState(false);

    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("Brasil");

    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);

    const motivationOptions = Object.keys(motivationLabels);
    const hobbiesOptions = Object.keys(hobbyLabels);
    const themesOptions = Object.keys(themeLabels);

    const handleCheckboxChange = (value, list, setList) => {
        if (list.includes(value)) {
            setList(list.filter(item => item !== value));
        } else if (list.length < 5) {
            setList([...list, value]);
        }
    };

    const formatZipCode = (value) => {
        return value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);
    };

    const handleZipCodeChange = (e) => setZipCode(formatZipCode(e.target.value));
    const handleNumberChange = (e) => setNumber(e.target.value.replace(/\D/g, ''));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (motivations.length !== 5 || hobbies.length !== 5 || themes.length !== 5) {
            setError("Para continuar, selecione exatamente 5 itens em cada categoria: Motivações, Hobbies e Temas.");
            return;
        }
        if (!street || !number || !neighborhood || !city || !state || zipCode.replace(/\D/g, '').length !== 8) {
            setError("Por favor, preencha todos os campos de endereço corretamente. O CEP deve conter 8 dígitos.");
            return;
        }

        setCarregando(true);
        const preferencesData = {
            motivations, hobbies, themes,
            currentLocation: {
                street, number: parseInt(number, 10) || 0, neighborhood,
                city, state, zipCode: zipCode.replace(/\D/g, ''), country
            }
        };

        try {
            const result = await getRecommendations(preferencesData);
            if (!result || !result.success) {
                const errorMessage = result?.messages?.join(', ') || "Não foi possível obter as recomendações.";
                throw new Error(errorMessage);
            }
            const { id, pois } = result.data;
            navigate("/recommendation/results", { state: { recommendations: pois, recommendationId: id } });
        } catch (err) {
            setError(err.message || "Ocorreu um erro ao buscar as recomendações. Tente novamente.");
            console.error("Erro ao buscar recomendações:", err);
        } finally {
            setCarregando(false);
        }
    };

    const isFormValid = () => {
        const isZipCodeValid = zipCode.replace(/\D/g, '').length === 8;
        return motivations.length === 5 && hobbies.length === 5 && themes.length === 5 &&
               street && number && neighborhood && city && state && isZipCodeValid;
    };

    return (
        <div className="containerForm">
            <div className="formBox">
                <div className="formContent">
                    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="text-center mb-5 default-list-header">
                            <h1 className="default-list-header-title">Sistema de Recomendações</h1>
                            <p className="default-list-header-subtitle">Obtenha recomendações personalizadas de POIs</p>
                            <div className="default-list-header-divider"></div>
                        </div>
                    </div>
                    <div className="formBody">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="form">
                            {/* Seções de Motivações, Hobbies e Temas */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-heart sectionIcon"></i>
                                    Motivações <span className="required">*</span>
                                </h5>
                                <p className="sectionDescription">Selecione exatamente 5 motivações:</p>
                                <div className="checkboxGrid">
                                    {motivationOptions.map((motivation) => (
                                        <div key={motivation} className="checkboxItem">
                                            <input 
                                                type="checkbox" 
                                                id={`motivation-${motivation}`} 
                                                checked={motivations.includes(motivation)} 
                                                onChange={() => handleCheckboxChange(motivation, motivations, setMotivations)} 
                                                disabled={!motivations.includes(motivation) && motivations.length >= 5} 
                                            />
                                            <label htmlFor={`motivation-${motivation}`} className="checkboxLabel">
                                                {motivationLabels[motivation]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="selectionCount">Selecionadas: {motivations.length}/5</p>
                            </div>

                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-palette sectionIcon"></i>
                                    Hobbies <span className="required">*</span>
                                </h5>
                                <p className="sectionDescription">Selecione exatamente 5 hobbies:</p>
                                <div className="checkboxGrid">
                                    {hobbiesOptions.map((hobby) => (
                                        <div key={hobby} className="checkboxItem">
                                            <input 
                                                type="checkbox" 
                                                id={`hobby-${hobby}`} 
                                                checked={hobbies.includes(hobby)} 
                                                onChange={() => handleCheckboxChange(hobby, hobbies, setHobbies)} 
                                                disabled={!hobbies.includes(hobby) && hobbies.length >= 5} 
                                            />
                                            <label htmlFor={`hobby-${hobby}`} className="checkboxLabel">
                                                {hobbyLabels[hobby]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="selectionCount">Selecionadas: {hobbies.length}/5</p>
                            </div>

                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-tags sectionIcon"></i>
                                    Temas <span className="required">*</span>
                                </h5>
                                <p className="sectionDescription">Selecione exatamente 5 temas:</p>
                                <div className="checkboxGrid">
                                    {themesOptions.map((theme) => (
                                        <div key={theme} className="checkboxItem">
                                            <input 
                                                type="checkbox" 
                                                id={`theme-${theme}`} 
                                                checked={themes.includes(theme)} 
                                                onChange={() => handleCheckboxChange(theme, themes, setThemes)} 
                                                disabled={!themes.includes(theme) && themes.length >= 5} 
                                            />
                                            <label htmlFor={`theme-${theme}`} className="checkboxLabel">
                                                {themeLabels[theme]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="selectionCount">Selecionadas: {themes.length}/5</p>
                            </div>

                            {/* Seção de Localização */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-geo-alt sectionIcon"></i>
                                    Localização Atual <span className="required">*</span>
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="street" className="label">
                                            Rua <span className="required">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="street" 
                                            className="input" 
                                            placeholder="Nome da rua" 
                                            value={street} 
                                            onChange={(e) => setStreet(e.target.value)} 
                                            maxLength="40" 
                                            required 
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="number" className="label">
                                            Número <span className="required">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="number" 
                                            className="input" 
                                            placeholder="Número" 
                                            value={number} 
                                            onChange={handleNumberChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="neighborhood" className="label">
                                            Bairro <span className="required">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="neighborhood" 
                                            className="input" 
                                            placeholder="Nome do bairro" 
                                            value={neighborhood} 
                                            onChange={(e) => setNeighborhood(e.target.value)} 
                                            maxLength="30" 
                                            required 
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="city" className="label">
                                            Cidade <span className="required">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="city" 
                                            className="input" 
                                            placeholder="Nome da cidade" 
                                            value={city} 
                                            onChange={(e) => setCity(e.target.value)} 
                                            maxLength="30" 
                                            required 
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="state" className="label">
                                            Estado <span className="required">*</span>
                                        </label>
                                        <select 
                                            id="state" 
                                            className="input" 
                                            value={state} 
                                            onChange={(e) => setState(e.target.value)} 
                                            required
                                        >
                                            <option value="">Selecione o estado</option>
                                            <option value="AC">Acre</option>
                                            <option value="AL">Alagoas</option>
                                            <option value="AP">Amapá</option>
                                            <option value="AM">Amazonas</option>
                                            <option value="BA">Bahia</option>
                                            <option value="CE">Ceará</option>
                                            <option value="DF">Distrito Federal</option>
                                            <option value="ES">Espírito Santo</option>
                                            <option value="GO">Goiás</option>
                                            <option value="MA">Maranhão</option>
                                            <option value="MT">Mato Grosso</option>
                                            <option value="MS">Mato Grosso do Sul</option>
                                            <option value="MG">Minas Gerais</option>
                                            <option value="PA">Pará</option>
                                            <option value="PB">Paraíba</option>
                                            <option value="PR">Paraná</option>
                                            <option value="PE">Pernambuco</option>
                                            <option value="PI">Piauí</option>
                                            <option value="RJ">Rio de Janeiro</option>
                                            <option value="RN">Rio Grande do Norte</option>
                                            <option value="RS">Rio Grande do Sul</option>
                                            <option value="RO">Rondônia</option>
                                            <option value="RR">Roraima</option>
                                            <option value="SC">Santa Catarina</option>
                                            <option value="SP">São Paulo</option>
                                            <option value="SE">Sergipe</option>
                                            <option value="TO">Tocantins</option>
                                        </select>
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="zipCode" className="label">
                                            CEP <span className="required">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="zipCode" 
                                            className="input" 
                                            placeholder="00000-000" 
                                            value={zipCode} 
                                            onChange={handleZipCodeChange} 
                                            required 
                                        />
                                        {zipCode && zipCode.replace(/\D/g, '').length !== 8 && (
                                            <p className="errorText">O CEP deve conter 8 dígitos.</p>
                                        )}
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="country" className="label">
                                            País <span className="required">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            id="country" 
                                            className="input" 
                                            placeholder="Digite o país" 
                                            value={country} 
                                            onChange={(e) => setCountry(e.target.value)} 
                                            maxLength="20" 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="buttonGroup">
                                <Button 
                                    type="button" 
                                    cor="secondary" 
                                    tamanho="md" 
                                    outline={true} 
                                    className="cancelButton" 
                                    aoClicar={() => setShowCancelModal(true)}
                                >
                                    <i className="bi bi-x-circle"></i> Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    cor="primary" 
                                    tamanho="md" 
                                    className="submitButton" 
                                    disabled={!isFormValid() || carregando}
                                >
                                    {carregando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-search me-2"></i>
                                            Buscar Recomendações
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Modal - Correção da estrutura */}
            {showCancelModal && (
                <Modal
                    titulo="Cancelar Recomendação"
                    texto="Tem certeza que deseja cancelar a recomendação? Todos os dados preenchidos serão perdidos."
                    txtBtn01="Confirmar"
                    onClickBtn01={() => navigate("/")}
                    txtBtn02="Voltar"
                    onClickBtn02={() => setShowCancelModal(false)}
                    onClickBtnClose={() => setShowCancelModal(false)}
                />
            )}
        </div>
    );
}

export default RecommendationForm;