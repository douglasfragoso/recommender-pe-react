import { useState, useContext } from 'react';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { saveUser } from '../../../services/user';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Modal from '../../../components/Modal';
import Footer from '../../../components/Footer';
import { GlobalContext } from '../../../context/globalContext';

const UserForm = () => {
    // Dados Pessoais
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const { usuarioLogado } = useContext(GlobalContext);

    // Documentos e Contato
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // Segurança
    const [userPassword, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Obter parâmetro 'from' da URL
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from') || '';

    const getBackUrl = () => {
        switch (from) {
            case 'users':
                return '/users/list';
            case 'list':
                return '/users/list';
            default:
                return '/login';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("✅ 1. handleSubmit iniciado. O recarregamento da página foi prevenido.");

        setError("");
        setCarregando(true);

        // Validação da senha
        if (userPassword !== confirmPassword) {
            console.error("❌ Erro: As senhas não coincidem.");
            setError("As senhas não coincidem");
            setCarregando(false);
            return;
        }

        console.log("✅ 2. Validação de senhas (coincidência) passou.");

        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=*])(?=\S+$).{8,}$/;
        if (!passwordRegex.test(userPassword)) {
            console.error("❌ Erro: A senha não atende aos requisitos do regex.");
            setError("A senha deve conter maiúsculas, minúsculas, números e caracteres especiais.");
            setCarregando(false);
            return;
        }

        console.log("✅ 3. Validação de complexidade da senha (regex) passou.");

        const userData = {
            firstName,
            lastName,
            birthDate,
            gender,
            cpf: cpf.replace(/\D/g, ''),
            phone: phone.replace(/\D/g, ''),
            email,
            userPassword,
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

        console.log("✅ 4. Objeto 'userData' foi criado. Dados que serão enviados:", userData);

        try {
            console.log("⏳ 5. Tentando chamar 'saveUser'. A requisição para o backend será feita agora...");
            const result = await saveUser(userData);

            console.log("🎉 6. 'saveUser' retornou um resultado do backend:", result);

            if (result.success) {
                setShowSuccessModal(true);
            } else {
                const errorMessage = result.messages?.join(', ') || "Erro ao cadastrar";
                console.error("❌ Erro retornado pelo backend:", errorMessage);
                setError(errorMessage);
            }
        } catch (erro) {
            console.error("💥 7. Ocorreu um erro CRÍTICO na chamada da API (bloco catch):", erro);
            setError(erro.message || "Erro ao processar o cadastro");
        }
        finally {
            setCarregando(false);
            console.log("🏁 8. Fim da execução de handleSubmit.");
        }
    };

    const formatCPF = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const handleCPFChange = (e) => {
        const formatted = formatCPF(e.target.value);
        if (formatted.replace(/\D/g, '').length <= 11) {
            setCpf(formatted);
        }
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        if (formatted.replace(/\D/g, '').length <= 11) {
            setPhone(formatted);
        }
    };

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

    return (
        <div className="containerForm">
            <div className="formBox">
                <div className="formContent">
                    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                        {/* Header Section */}
                        <div className="text-center mb-5 default-list-header">
                            <h1 className="default-list-header-title">Cadastro de Usuário</h1>
                            <p className="default-list-header-subtitle">Cadastre um novo usuário no sistema</p>
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
                            {/* Dados Pessoais */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-person-vcard sectionIcon"></i>
                                    Dados Pessoais
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="firstName" className="label">
                                            Nome <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="input"
                                            placeholder="Digite seu primeiro nome"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            maxLength="20"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="lastName" className="label">
                                            Sobrenome <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className="input"
                                            placeholder="Digite seu sobrenome"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            maxLength="20"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="birthDate" className="label">
                                            Data de Nascimento <span className="required">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="birthDate"
                                            className="input"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="gender" className="label">
                                            Gênero <span className="required">*</span>
                                        </label>
                                        <select
                                            id="gender"
                                            className="input"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione o gênero</option>
                                            <option value="Male">Masculino</option>
                                            <option value="Female">Feminino</option>
                                            <option value="Other">Outro</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Documentos e Contato */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-card-checklist sectionIcon"></i>
                                    Documentos e Contato
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="cpf" className="label">
                                            CPF <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="cpf"
                                            className="input"
                                            placeholder="000.000.000-00"
                                            value={cpf}
                                            onChange={handleCPFChange}
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="phone" className="label">
                                            Telefone <span className="required">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="input"
                                            placeholder="(00) 00000-0000"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="email" className="label">
                                            E-mail <span className="required">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="input"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            maxLength="50"
                                            required
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

                            {/* Segurança */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-shield-lock sectionIcon"></i>
                                    Segurança
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="userPassword" className="label">
                                            Senha <span className="required">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="userPassword"
                                            className="input"
                                            placeholder="Digite uma senha segura"
                                            value={userPassword}
                                            onChange={(e) => setUserPassword(e.target.value)}
                                            minLength="8"
                                            maxLength="100"
                                            required
                                        />
                                        <p className="passwordHint">
                                            A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.
                                        </p>
                                    </div>
                                    <div className="inputGroup">
                                        <label htmlFor="confirmPassword" className="label">
                                            Confirmar Senha <span className="required">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            className="input"
                                            placeholder="Confirme sua senha"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            minLength="8"
                                            maxLength="100"
                                            required
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
                                    {carregando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Carregando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check2-circle me-2"></i>
                                            Cadastrar
                                        </>
                                    )}
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
                    onClickBtn01={() => navigate(getBackUrl())}
                    txtBtn02="Voltar"
                    onClickBtn02={() => setShowCancelModal(false)}
                    onClickBtnClose={() => setShowCancelModal(false)}
                />
            )}

            {showSuccessModal && (
                <Modal
                    titulo="Cadastro Realizado!"
                    texto="Usuário cadastrado com sucesso!"
                    txtBtn01="OK"
                    onClickBtn01={() => navigate(getBackUrl())}
                    onClickBtnClose={() => navigate(getBackUrl())}
                />
            )}
        </div>
    );
}

export default UserForm;