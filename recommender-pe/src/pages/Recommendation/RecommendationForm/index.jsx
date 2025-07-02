import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './RecommendationForm.css';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getRecommendations } from "../../../services/recommender";

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
    STUDY: "Estudo",
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
    TRAVELING: "Viagem"
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
    ARCHITETURAL_STYLE: "Estilo Arquitetônico",
    MODERN: "Moderno",
    NATURE: "Natureza",
    RELIGIOUS: "Religioso",
    ROMANTIC: "Romântico",
    URBAN_ART: "Arte Urbana"
};

function RecommendationForm() {
    const [motivations, setMotivations] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [themes, setThemes] = useState([]);
    const [error, setError] = useState("");

    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("Brasil");

    const navigate = useNavigate();

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
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const handleZipCodeChange = (e) => {
        const formatted = formatZipCode(e.target.value);
        if (formatted.replace(/\D/g, '').length <= 8) {
            setZipCode(formatted);
        }
    };

    const handleNumberChange = (e) => {
        setNumber(e.target.value);
    };

    const cancelar = (e) => {
        e.preventDefault();
        setMotivations([]);
        setHobbies([]);
        setThemes([]);
        setStreet("");
        setNumber("");
        setNeighborhood("");
        setCity("");
        setState("");
        setZipCode("");
        setCountry("Brasil");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (motivations.length === 0 || hobbies.length === 0 || themes.length === 0) {
            setError("Selecione pelo menos 1 item em cada categoria");
            return;
        }

        if (!street || !number || !neighborhood || !city || !state || !zipCode) {
            setError("Preencha todos os campos de endereço");
            return;
        }

        const preferencesData = {
            motivations,
            hobbies,
            themes,
            currentLocation: {
                street,
                number: parseInt(number) || 0,
                neighborhood,
                city,
                state,
                zipCode: zipCode.replace(/\D/g, ''),
                country
            }
        };

        try {
            const response = await getRecommendations(preferencesData);
            navigate('/recommendation/results', {
                state: {
                    recommendations: response.pois,
                    recommendationId: response.id 
                }
            });
        } catch (error) {
            setError("Erro ao obter recomendações. Por favor, tente novamente.");
            console.error("Erro:", error);
        }
    };

    const isFormValid = () => {
        return motivations.length > 0 &&
            hobbies.length > 0 &&
            themes.length > 0 &&
            street && number && neighborhood && city && state && zipCode;
    };

    return (
        <div className="containerForm">
            <Header />
            <div className="formBox">
                <div className="formContent">
                    <div className="header">
                        <h2 className="headerTitle">
                            <i className="bi bi-stars icon"></i>
                            Preferências de Recomendação
                        </h2>
                    </div>
                    <div className="formBody">
                        {error && <div className="errorMessage">{error}</div>}
                        <form onSubmit={handleSubmit} className="form">

                            {/* Motivações */}
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

                            {/* Hobbies */}
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

                            {/* Temas */}
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
                                        {zipCode.replace(/\D/g, '').length !== 8 && zipCode && (
                                            <p className="errorText">CEP deve ter 8 dígitos</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="buttonGroup">
                                <Button
                                    type="button"
                                    className="cancelButton"
                                    aoClicar={cancelar}
                                >
                                    <i className="bi bi-x-circle"></i>
                                    Limpar
                                </Button>

                                <Button
                                    type="submit"
                                    className="submitButton"
                                    disabled={!isFormValid()}
                                >
                                    <i className="bi bi-search"></i>
                                    Buscar Recomendações
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default RecommendationForm;
