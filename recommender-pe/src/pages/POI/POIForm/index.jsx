import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { savePOI } from '../../../services/POI';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Modal from '../../../components/Modal';
import '../../../App.css';

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
    TRAVELING: "Viagem",
    VOLUNTEERING: "Voluntariado"
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
    ARCHITECTURAL_STYLE: "Estilo Arquitetônico",
    MODERN: "Moderno",
    NATURE: "Natureza",
    RELIGIOUS: "Religioso",
    ROMANTIC: "Romântico",
    URBAN_ART: "Arte Urbana"
};

const POIForm = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [description, setDescription] = useState("");
    const [motivations, setMotivations] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [themes, setThemes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [complement, setComplement] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("Brasil");
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const motivationOptions = Object.keys(motivationLabels);
    const hobbiesOptions = Object.keys(hobbyLabels);
    const themesOptions = Object.keys(themeLabels);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("✅ 1. handleSubmit iniciado. O recarregamento da página foi prevenido.");

        setError("");
        setCarregando(true);

        if (motivations.length !== 5 || hobbies.length !== 5 || themes.length !== 5) {
            console.error("❌ Erro: Quantidade incorreta de seleções. Devem ser 5 motivações, hobbies e temas.");
            setError("Selecione exatamente 5 itens em cada categoria (Motivações, Hobbies e Temas)");
            setCarregando(false);
            return;
        }

        console.log("✅ 2. Validação de seleção passou.");

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

        console.log("✅ 3. Objeto 'poiData' foi criado. Dados que serão enviados:", poiData);

        try {
            console.log("⏳ 4. Tentando chamar 'savePOI'. Enviando dados ao backend...");
            const result = await savePOI(poiData);

            console.log("🎉 5. 'savePOI' retornou um resultado:", result);

            if (result.success) {
                setShowSuccessModal(true);
            } else {
                const errorMessage = result.messages?.join(', ') || "Erro ao cadastrar POI";
                console.error("❌ 6. Erro retornado pelo backend:", errorMessage);
                setError(errorMessage);
            }
        } catch (erro) {
            console.error("💥 7. Ocorreu um erro CRÍTICO na chamada da API:", erro);
            setError(erro.message || "Erro ao processar o cadastro do POI");
        } finally {
            setCarregando(false);
            console.log("🏁 8. Fim da execução de handleSubmit.");
        }
    };


    const handleCheckboxChange = (value, list, setList) => {
        if (list.includes(value)) {
            setList(list.filter(item => item !== value));
        } else if (list.length < 5) {
            setList([...list, value]);
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
                                    cor="secondary"
                                    tamanho="md"
                                    outline={true}
                                    className="cancelButton"
                                    aoClicar={() => setShowCancelModal(true)}
                                >
                                    <i className="bi bi-x-circle"></i>
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    cor="primary"
                                    tamanho="md"
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
            {showCancelModal && (
                <Modal
                    titulo="Cancelar Cadastro"
                    texto="Tem certeza que deseja cancelar o cadastro? Todos os dados preenchidos serão perdidos."
                    txtBtn01="Confirmar"
                    onClickBtn01={() => navigate("/")}
                    txtBtn02="Voltar"
                    onClickBtn02={() => setShowCancelModal(false)}
                    onClickBtnClose={() => setShowCancelModal(false)}
                />
            )}

            {showSuccessModal && (
                <Modal
                    titulo="Cadastro Realizado!"
                    texto="POI cadastrado com sucesso!"
                    txtBtn01="Voltar à Página Inicial"
                    onClickBtn01={() => navigate("/")}
                    onClickBtnClose={() => navigate("/")} 
                />
            )}
        </div >
    );
}

export default POIForm;