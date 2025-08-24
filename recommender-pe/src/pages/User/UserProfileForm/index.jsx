import { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { updateUser, getOwnProfile } from '../../../services/user';
import '../../../App.css';
import Modal from '../../../components/Modal';
import Footer from '../../../components/Footer';
import { useContext } from 'react';
import { GlobalContext } from '../../../context/GlobalContext';

const UserProfileForm = () => {
    const navigate = useNavigate();
    const { usuarioLogado } = useContext(GlobalContext);

    // Dados Pessoais (apenas campos permitidos para updateUser)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");

    // Contato
    const [phone, setPhone] = useState("");

    // Endereço
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [complement, setComplement] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("Brasil");
    const [zipCode, setZipCode] = useState("");

    const [error, setError] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (usuarioLogado) {
            loadUserData();
        }
    }, [usuarioLogado]);

    const loadUserData = async () => {
        setCarregando(true);
        try {
            const response = await getOwnProfile();
            if (response.success) {
                const user = response.data;
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setBirthDate(user.birthDate);
                setGender(user.gender);
                setPhone(user.phone);
                setStreet(user.address.street || "");
                setNumber(user.address.number ? user.address.number.toString() : "");
                setComplement(user.address.complement || "");
                setNeighborhood(user.address.neighborhood || "");
                setCity(user.address.city || "");
                setState(user.address.state || "");
                setCountry(user.address.country || "Brasil");
                setZipCode(user.address.zipCode || "");
            }
        }
        catch (error) {
            setError("Erro ao carregar dados do usuário");
            console.error("Erro:", error);
        } finally {
            setCarregando(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCarregando(true);

        const userData = {
            firstName,
            lastName,
            birthDate,
            gender,
            phone: phone.replace(/\D/g, ''),
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
            const result = await updateUser(userData);

            if (result.success) {
                setShowSuccessModal(true);
            } else {
                const errorMessage = result.messages?.join(', ') || "Erro ao atualizar perfil";
                setError(errorMessage);
            }
        } catch (erro) {
            setError(erro.message || "Erro ao processar atualização");
        } finally {
            setCarregando(false);
        }
    };

    // Funções de formatação
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatCEP = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        if (formatted.replace(/\D/g, '').length <= 11) {
            setPhone(formatted);
        }
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

    const handleSuccessConfirm = () => {
        setShowSuccessModal(false);
        navigate("/");
    };

    return (
        <div className="containerForm">
            <div className="formBox">
                <div className="formContent">
                    <div className="header">
                        <h2 className="formHeaderTitle">
                            <i className="bi bi-person-gear icon"></i>
                            Editar Meu Perfil
                        </h2>
                    </div>
                    <div className="formBody">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="form">
                            {/* Dados Pessoais */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-person-vcard sectionIcon"></i>
                                    Dados Pessoais
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="firstName" className="label">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="input"
                                            placeholder="Digite seu primeiro nome"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            maxLength="20"

                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="lastName" className="label">
                                            Sobrenome
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className="input"
                                            placeholder="Digite seu sobrenome"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            maxLength="20"

                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="birthDate" className="label">
                                            Data de Nascimento 
                                        </label>
                                        <input
                                            type="date"
                                            id="birthDate"
                                            className="input"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}

                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="gender" className="label">
                                            Gênero 
                                        </label>
                                        <select
                                            id="gender"
                                            className="input"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}

                                        >
                                            <option value="">Selecione o gênero</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Contato */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-telephone sectionIcon"></i>
                                    Contato
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="phone" className="label">
                                            Telefone 
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="input"
                                            placeholder="(00) 00000-0000"
                                            value={phone}
                                            onChange={handlePhoneChange}

                                        />
                                    </div>
                                </div>
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
                                            Rua 
                                        </label>
                                        <input
                                            type="text"
                                            id="street"
                                            className="input"
                                            placeholder="Digite o nome da rua"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            maxLength="40"

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
                                            maxLength="20"
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
                                            maxLength="30"

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
                                            maxLength="30"

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
                                            placeholder="Digite o estado"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            maxLength="30"

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
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            maxLength="30"

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

                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Botões */}
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
                                    disabled={carregando}
                                >
                                    {carregando ? 'Carregando...' : 'Atualizar Perfil'}
                                    <i className="bi bi-check2-circle"></i>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />

            {showCancelModal && (
                <Modal
                    titulo="Cancelar Edição"
                    texto="Tem certeza que deseja cancelar a edição? Todas as alterações serão perdidas."
                    txtBtn01="Confirmar"
                    onClickBtn01={() => navigate("/")}
                    txtBtn02="Voltar"
                    onClickBtn02={() => setShowCancelModal(false)}
                    onClickBtnClose={() => setShowCancelModal(false)}
                />
            )}

            {showSuccessModal && (
                <Modal
                    titulo="Perfil Atualizado!"
                    texto="Seu perfil foi atualizado com sucesso!"
                    txtBtn01="OK"
                    onClickBtn01={handleSuccessConfirm}
                    onClickBtnClose={handleSuccessConfirm}
                />
            )}
        </div>
    );
}

export default UserProfileForm;