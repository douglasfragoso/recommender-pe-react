import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './recommendationForm.css';
import Button from '../../../components/Button';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

function RecommendationForm() {
    const [motivations, setMotivations] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [themes, setThemes] = useState([]);
    const [error, setError] = useState("");
    
    // Campos de localização atual
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("Brasil");
    
    const navigate = useNavigate();

    const motivationOptions = [
        "ARTISTIC_VALUE", "CREATIVITY", "CULTURE", "ENTERTAINMENT", "EXPLORATION",
        "EDUCATION", "FAMILY", "GASTRONOMY", "HERITAGE", "IDENTITY",
        "IMMERSIVE_EXPERIENCE", "RELAXATION", "SOCIAL", "SPIRITUALITY", "STUDY", "TRADITION"
    ];

    const hobbiesOptions = [
        "ADVENTURE", "ART", "DANCING", "GASTRONOMY", "GARDENING",
        "HIKING", "LEARNING", "MUSIC", "PHOTOGRAPHY", "READING",
        "SOCIAL", "TECH", "THEATER", "TRAVELING"
    ];

    const themesOptions = [
        "ADVENTURE", "AFRO_BRAZILIAN", "BAROQUE", "COLONIAL", "CULTURAL",
        "FAMILY_FRIENDLY", "FOLKLORE", "GASTRONOMIC", "HISTORY",
        "ARCHITETURAL_STYLE", "MODERN", "NATURE", "RELIGIOUS", "ROMANTIC", "URBAN_ART"
    ];

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

    const getRecommendations = async (preferencesData) => {
        // Esta é uma função mock - substitua pela chamada real à sua API
        console.log("Dados enviados:", preferencesData);
        return { success: true, data: [] };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validação básica
        if (motivations.length === 0 || hobbies.length === 0 || themes.length === 0) {
            setError("Selecione pelo menos 1 item em cada categoria (Motivações, Hobbies e Temas)");
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
            },
            date: new Date().toISOString()
        };

        try {
            const result = await getRecommendations(preferencesData);
            if (result.success) {
                navigate("/recommendations/results", { state: { recommendations: result.data } });
            } else {
                setError(result.message || "Erro ao obter recomendações");
            }
        } catch (erro) {
            setError("Erro ao processar a solicitação de recomendações");
            console.error("Erro:", erro);
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
                                                {motivation}
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
                                                {hobby}
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
                                                {theme}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className="selectionCount">Selecionadas: {themes.length}/5</p>
                            </div>

                            {/* Localização Atual */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-geo-alt sectionIcon"></i>
                                    Sua Localização Atual <span className="required">*</span>
                                </h5>
                                <p className="sectionDescription">
                                    Informe sua localização atual para receber recomendações próximas
                                </p>
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
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="submitButton"
                                    disabled={!isFormValid()}
                                >
                                    <i className="bi bi-search"></i>
                                    Obter Recomendações
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