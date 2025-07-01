import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import './POIForm.css';
import { savePOI } from '../../../services/POI';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

function POIForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [motivations, setMotivations] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [themes, setThemes] = useState([]);
    // Estados para o endereço 
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [complement, setComplement] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("Brasil");
    const navigate = useNavigate();

    const formatCEP = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const handleCEPChange = (e) => {
        const formatted = formatCEP(e.target.value);
        if (formatted.replace(/\D/g, '').length <= 8) {
            setZipCode(formatted);
        }
    };

    const handleNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setNumber(value);
    };

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

    const cancelar = (e) => {
        e.preventDefault();
        setName("");
        setDescription("");
        setMotivations([]);
        setHobbies([]);
        setThemes([]);
        setStreet("");
        setNumber("");
        setNeighborhood("");
        setCity("");
        setState("");
        setZipCode("");
        setCountry("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validação básica
        if (motivations.length !== 5 || hobbies.length !== 5 || themes.length !== 5) {
            setError("Selecione exatamente 5 itens em cada categoria (Motivações, Hobbies e Temas)");
            return;
        }

        const poiData = {
            name,
            description,
            motivations,
            hobbies,
            themes,
            address: {
                street,
                number: parseInt(number),
                complement,
                neighborhood,
                city,
                state,
                country,
                zipCode: zipCode.replace(/\D/g, '')
            }
        };

        try {
            const result = await savePOI(poiData);
            if (result.success) {
                alert(result.message);
                navigate("/");
            } else {
                setError(result.message);
            }
        } catch (erro) {
            setError("Erro ao processar o cadastro do POI");
            console.error("Erro:", erro);
        }
    };

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

    return (
        <div className="containerForm">
            <Header />
            <div className="formBox">
                <div className="formContent">
                    <div className="header">
                        <h2 className="headerTitle">
                            <i className="bi bi-geo-alt-fill icon"></i>
                            Cadastro de POI (Ponto de Interesse)
                        </h2>
                    </div>
                    <div className="formBody">
                        <form onSubmit={handleSubmit} className="form">
                            {/* Informações Básicas */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-info-circle sectionIcon"></i>
                                    Informações Básicas
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="name" className="label">
                                            Nome do POI <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="input"
                                            placeholder="Digite o nome do ponto de interesse"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            maxLength="50"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup fullWidth">
                                        <label htmlFor="description" className="label">
                                            Descrição <span className="required">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            className="input textArea"
                                            placeholder="Descreva o ponto de interesse (mínimo 50 caracteres)"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            minLength="50"
                                            maxLength="1000"
                                            rows="4"
                                            required
                                        />
                                        <p className="hint">{description.length}/1000 caracteres</p>
                                    </div>
                                </div>
                            </div>

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

                            {/* Endereço */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-house-door sectionIcon"></i>
                                    Endereço
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
                                            placeholder="Digite o nome da rua"
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
                                            placeholder="Digite o número"
                                            value={number}
                                            onChange={handleNumberChange}
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="complement" className="label">
                                            Complemento
                                        </label>
                                        <input
                                            type="text"
                                            id="complement"
                                            className="input"
                                            placeholder="Apto, bloco, etc."
                                            value={complement}
                                            onChange={(e) => setComplement(e.target.value)}
                                            maxLength="50"
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
                                            placeholder="Digite o bairro"
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
                                            placeholder="Digite a cidade"
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
                                            onChange={handleCEPChange}
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
                                    aoClicar={() => navigate("/")}
                                >
                                    <i className="bi bi-x-circle"></i>
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="submitButton"
                                >
                                    <i className="bi bi-check2-circle"></i>
                                    Cadastrar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
}

export default POIForm;