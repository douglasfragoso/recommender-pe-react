import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { getPOIById, updatePOI } from '../../../services/POI';
import Footer from '../../../components/Footer';
import Modal from '../../../components/Modal';

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

const POIUpdateForm = () => {
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
    const { id } = useParams();
    const [status, setStatus] = useState("");

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

    useEffect(() => {
        if (id) {
            loadPOIData();
        }
    }, [id]);

    const loadPOIData = async () => {
        setCarregando(true);
        try {
            const result = await getPOIById(id);
            if (result && result.data) {
                const poiData = result.data;

                setName(poiData.name || "");
                setStatus(poiData.status || "");
                setDescription(poiData.description || "");
                
                // CORREÇÃO CRÍTICA: Garantir que os arrays sejam únicos e válidos
                setMotivations(Array.isArray(poiData.motivations) 
                    ? [...new Set(poiData.motivations.filter(item => motivationOptions.includes(item)))] 
                    : []);
                
                setHobbies(Array.isArray(poiData.hobbies) 
                    ? [...new Set(poiData.hobbies.filter(item => hobbiesOptions.includes(item)))] 
                    : []);
                
                setThemes(Array.isArray(poiData.themes) 
                    ? [...new Set(poiData.themes.filter(item => themesOptions.includes(item)))] 
                    : []);

                // Lógica segura para o endereço
                if (poiData.address) {
                    setStreet(poiData.address.street || "");
                    setNumber(poiData.address.number ? poiData.address.number.toString() : "");
                    setComplement(poiData.address.complement || "");
                    setNeighborhood(poiData.address.neighborhood || "");
                    setCity(poiData.address.city || "");
                    setState(poiData.address.state || "");
                    setZipCode(poiData.address.zipCode || "");
                    setCountry(poiData.address.country || "Brasil");
                } else {
                    // Se não houver endereço, limpa todos os campos
                    setStreet("");
                    setNumber("");
                    setComplement("");
                    setNeighborhood("");
                    setCity("");
                    setState("");
                    setZipCode("");
                    setCountry("Brasil");
                }
            }
        } catch (error) {
            console.error("💥 Erro ao carregar dados do POI:", error);
            setError("Erro ao carregar dados do POI");
        } finally {
            setCarregando(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("✅ handleSubmit iniciado");

        setError("");
        setCarregando(true);

        // CORREÇÃO: Validação com mensagem mais clara
        if (motivations.length !== 5 || hobbies.length !== 5 || themes.length !== 5) {
            const errors = [];
            if (motivations.length !== 5) errors.push(`Motivações (${motivations.length}/5)`);
            if (hobbies.length !== 5) errors.push(`Hobbies (${hobbies.length}/5)`);
            if (themes.length !== 5) errors.push(`Temas (${themes.length}/5)`);
            
            setError(`Selecione exatamente 5 itens em cada categoria: ${errors.join(', ')}`);
            setCarregando(false);
            return;
        }

        const poiData = {
            name,
            description,
            motivations,
            hobbies,
            themes,
            status,
            address: {
                street,
                number: parseInt(number) || 0,
                complement,
                neighborhood,
                city,
                state,
                country,
                zipCode: zipCode.replace(/\D/g, '')
            }
        };

        try {
            const result = await updatePOI(id, poiData);
            if (result.success) {
                setShowSuccessModal(true);
            } else {
                const errorMessage = result.messages?.join(', ') || "Erro ao atualizar POI";
                setError(errorMessage);
            }
        } catch (erro) {
            console.error("Erro na chamada da API:", erro);
            setError(erro.message || "Erro ao processar a atualização do POI");
        } finally {
            setCarregando(false);
        }
    };

    // CORREÇÃO: Função de checkbox completamente revisada
    const handleCheckboxChange = (category, value) => {
        console.log(`Checkbox ${category} alterado:`, value);
        
        const setters = {
            motivations: setMotivations,
            hobbies: setHobbies,
            themes: setThemes
        };
        
        const currentValues = {
            motivations: motivations,
            hobbies: hobbies,
            themes: themes
        };
        
        const setCategory = setters[category];
        const currentList = currentValues[category];
        
        if (!setCategory) return;
        
        setCategory(prev => {
            // Verifica se o valor já está na lista
            if (prev.includes(value)) {
                // Remove o valor
                const newList = prev.filter(item => item !== value);
                console.log(`Removendo ${value} de ${category}. Nova lista:`, newList);
                return newList;
            } else {
                // Adiciona o valor se não exceder o limite
                if (prev.length < 5) {
                    const newList = [...prev, value];
                    console.log(`Adicionando ${value} a ${category}. Nova lista:`, newList);
                    return newList;
                }
                // Não faz nada se já tiver 5 itens
                console.log(`Limite de 5 atingido para ${category}`);
                return prev;
            }
        });
    };

    return (
        <div className="containerForm">
            <div className="formBox">
                <div className="formContent">
                    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                        {/* Header Section */}
                        <div className="text-center mb-5 default-form-header">
                            <h1 className="default-form-header-title">Pontos de Interesse</h1>
                            <p className="default-form-header-subtitle">Atualização no sistema de POIs</p>
                            <div className="default-form-header-divider"></div>
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
                            {/* Informações Básicas */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-info-circle sectionIcon"></i>
                                    Informações Básicas
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="name" className="label">
                                            Nome do POI
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

                                    <div className="inputGroup">
                                        <label htmlFor="status" className="label">
                                            Status 
                                        </label>
                                        <select
                                            id="status"
                                            className="input"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione o status</option>
                                            <option value="ACTIVE">Ativo</option>
                                            <option value="INACTIVE">Inativo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="inputGroup fullWidth">
                                    <label htmlFor="description" className="label">
                                        Descrição
                                    </label>
                                    <textarea
                                        id="description"
                                        className="input textArea"
                                        placeholder="Descreva o ponto de interesse (mínimo 50 caracteres)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        minLength="50"
                                        maxLength="1000"
                                        rows="8"
                                        required
                                    />
                                    <p className="hint">{description.length}/1000 caracteres</p>
                                </div>
                            </div>

                            {/* Motivações */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-heart sectionIcon"></i>
                                    Motivações
                                </h5>
                                <p className="sectionDescription">Selecione exatamente 5 motivações:</p>
                                <div className="checkboxGrid">
                                    {motivationOptions.map((motivation) => (
                                        <div key={motivation} className="checkboxItem">
                                            <input
                                                type="checkbox"
                                                id={`motivation-${motivation}`}
                                                checked={motivations.includes(motivation)}
                                                onChange={() => handleCheckboxChange('motivations', motivation)}
                                                disabled={!motivations.includes(motivation) && motivations.length >= 5}
                                            />
                                            <label htmlFor={`motivation-${motivation}`} className="checkboxLabel">
                                                {motivationLabels[motivation]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className={`selectionCount ${motivations.length > 5 ? 'error' : ''}`}>
                                    Selecionadas: {motivations.length}/5
                                </p>
                            </div>

                            {/* Hobbies */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-palette sectionIcon"></i>
                                    Hobbies
                                </h5>
                                <p className="sectionDescription">Selecione exatamente 5 hobbies:</p>
                                <div className="checkboxGrid">
                                    {hobbiesOptions.map((hobby) => (
                                        <div key={hobby} className="checkboxItem">
                                            <input
                                                type="checkbox"
                                                id={`hobby-${hobby}`}
                                                checked={hobbies.includes(hobby)}
                                                onChange={() => handleCheckboxChange('hobbies', hobby)}
                                                disabled={!hobbies.includes(hobby) && hobbies.length >= 5}
                                            />
                                            <label htmlFor={`hobby-${hobby}`} className="checkboxLabel">
                                                {hobbyLabels[hobby]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className={`selectionCount ${hobbies.length > 5 ? 'error' : ''}`}>
                                    Selecionadas: {hobbies.length}/5
                                </p>
                            </div>

                            {/* Temas */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-tags sectionIcon"></i>
                                    Temas
                                </h5>
                                <p className="sectionDescription">Selecione exatamente 5 temas:</p>
                                <div className="checkboxGrid">
                                    {themesOptions.map((theme) => (
                                        <div key={theme} className="checkboxItem">
                                            <input
                                                type="checkbox"
                                                id={`theme-${theme}`}
                                                checked={themes.includes(theme)}
                                                onChange={() => handleCheckboxChange('themes', theme)}
                                                disabled={!themes.includes(theme) && themes.length >= 5}
                                            />
                                            <label htmlFor={`theme-${theme}`} className="checkboxLabel">
                                                {themeLabels[theme]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <p className={`selectionCount ${themes.length > 5 ? 'error' : ''}`}>
                                    Selecionadas: {themes.length}/5
                                </p>
                            </div>

                            {/* Endereço */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-geo-alt sectionIcon"></i>
                                    Endereço
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="street" className="label">
                                            Rua
                                        </label>
                                        <input
                                            type="text"
                                            id="street"
                                            className="input"
                                            placeholder="Digite o nome da rua"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            maxLength="100"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="number" className="label">
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            id="number"
                                            className="input"
                                            placeholder="Digite o número"
                                            value={number}
                                            onChange={handleNumberChange}
                                            maxLength="10"
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
                                            placeholder="Ex: Apto 101"
                                            value={complement}
                                            onChange={(e) => setComplement(e.target.value)}
                                            maxLength="50"
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="neighborhood" className="label">
                                            Bairro
                                        </label>
                                        <input
                                            type="text"
                                            id="neighborhood"
                                            className="input"
                                            placeholder="Digite o bairro"
                                            value={neighborhood}
                                            onChange={(e) => setNeighborhood(e.target.value)}
                                            maxLength="50"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="city" className="label">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            className="input"
                                            placeholder="Digite a cidade"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            maxLength="50"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="state" className="label">
                                            Estado
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            className="input"
                                            placeholder="Digite o estado (UF)"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            maxLength="2"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="country" className="label">
                                            País
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
                                            CEP
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
                                    disabled={carregando}
                                >
                                    <i className="bi bi-x-circle"></i>
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    cor="primary"
                                    tamanho="md"
                                    className="submitButton"
                                    disabled={carregando}
                                >
                                    <i className="bi bi-check2-circle"></i>
                                    {carregando ? 'Editando...' : 'Editar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
            {showCancelModal && (
                <Modal
                    titulo="Cancelar Atualização"
                    texto="Tem certeza que deseja cancelar a atualização do POI? Todos os dados preenchidos serão perdidos."
                    txtBtn01="Confirmar"
                    onClickBtn01={() => navigate("/POIs/list")}
                    txtBtn02="Voltar"
                    onClickBtn02={() => setShowCancelModal(false)}
                    onClickBtnClose={() => setShowCancelModal(false)}
                />
            )}

            {showSuccessModal && (
                <Modal
                    titulo="Atualização Realizada!"
                    texto="POI atualizado com sucesso!"
                    txtBtn01="Voltar aos POIs"
                    onClickBtn01={() => navigate("/POIs/list")}
                    onClickBtnClose={() => navigate("/POIs/list")}
                />
            )}
        </div>
    );
}

export default POIUpdateForm;