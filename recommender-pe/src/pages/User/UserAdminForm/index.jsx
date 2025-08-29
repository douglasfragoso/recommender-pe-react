import { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from '../../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUserById, getUserById } from '../../../services/user';
import Modal from '../../../components/Modal';
import Footer from '../../../components/Footer';

const UserAdminForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Dados Pessoais
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");

    // Documentos e Contato
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    // Campos administrativos (apenas para edição por admin)
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");

    const [error, setError] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Mapeamentos para tradução
    const roleLabels = {
        ADMIN: "Administrador",
        USER: "Usuário",
        MASTER: "Master"
    };

    const statusLabels = {
        ACTIVE: "Ativo",
        INACTIVE: "Inativo"
    };

    const genderLabels = {
        MALE: "Masculino",
        FEMALE: "Feminino",
        OTHER: "Outro"
    };

    useEffect(() => {
        if (id) {
            loadUserData();
        }
    }, [id]);

    const loadUserData = async () => {
        setCarregando(true);
        try {
            const response = await getUserById(id);
            if (response.success) {
                const user = response.data;
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setBirthDate(user.birthDate);
                setGender(user.gender);
                setCpf(user.cpf);
                setPhone(user.phone);
                setEmail(user.email);
                setRole(user.role);
                setStatus(user.status);
            }
        } catch (error) {
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

        if (!id) {
            setError("ID do usuário não encontrado");
            setCarregando(false);
            return;
        }

        const userData = {
            firstName,
            lastName,
            birthDate,
            gender,
            cpf: cpf.replace(/\D/g, ''),
            phone: phone.replace(/\D/g, ''),
            email,
            role,
            status
        };

        userData.id = id;

        try {
            const result = await updateUserById(id, userData);

            if (result.success) {
                setShowSuccessModal(true);
            } else {
                const errorMessage = result.messages?.join(', ') || 'Erro ao atualizar usuário';
                setError(errorMessage);
            }
        } catch (erro) {
            setError(erro.message || 'Erro ao processar atualização');
        } finally {
            setCarregando(false);
        }
    };

    // Funções de formatação
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

    const handleSuccessConfirm = () => {
        setShowSuccessModal(false);
        navigate("/users/list");
    };

    return (
        <div className="containerForm">
            <div className="formBox">
                <div className="formContent">
                    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
                        {/* Header Section */}
                        <div className="text-center mb-5 default-list-header">
                            <h1 className="default-list-header-title">Editar Usuário</h1>
                            <p className="default-list-header-subtitle">Editar informações do usuário no sistema</p>
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
                                            Nome 
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="input"
                                            placeholder="Digite o primeiro nome"
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
                                            placeholder="Digite o sobrenome"
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
                                            <option value="MALE">Masculino</option>
                                            <option value="FEMALE">Feminino</option>
                                            <option value="OTHER">Outro</option>
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
                                            CPF 
                                        </label>
                                        <input
                                            type="text"
                                            id="cpf"
                                            className="input"
                                            placeholder="000.000.000-00"
                                            value={cpf}
                                            onChange={handleCPFChange}
                                        />
                                    </div>
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
                                    <div className="inputGroup">
                                        <label htmlFor="email" className="label">
                                            E-mail 
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="input"
                                            placeholder="email@exemplo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            maxLength="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Configurações Administrativas - apenas para edição */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-gear sectionIcon"></i>
                                    Configurações Administrativas
                                </h5>
                                <div className="gridContainer">
                                    <div className="inputGroup">
                                        <label htmlFor="role" className="label">
                                            Perfil 
                                        </label>
                                        <select
                                            id="role"
                                            className="input"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="">Selecione o perfil</option>
                                            <option value="USER">Usuário</option>
                                            <option value="ADMIN">Administrador</option>
                                            <option value="MASTER">Master</option>
                                        </select>
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
                                        >
                                            <option value="">Selecione o status</option>
                                            <option value="ACTIVE">Ativo</option>
                                            <option value="INACTIVE">Inativo</option>
                                        </select>
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
                                            Atualizar
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
                    titulo="Cancelar Operação"
                    texto={`Tem certeza que deseja cancelar a edição? Todos os dados preenchidos serão perdidos.`}
                    txtBtn01="Confirmar"
                    onClickBtn01={() => navigate("/users/list")}
                    txtBtn02="Voltar"
                    onClickBtn02={() => setShowCancelModal(false)}
                    onClickBtnClose={() => setShowCancelModal(false)}
                />
            )}

            {showSuccessModal && (
                <Modal
                    titulo={"Usuário Atualizado!"}
                    texto={"Usuário atualizado com sucesso!"}
                    txtBtn01={"Voltar à Lista"}
                    onClickBtn01={handleSuccessConfirm}
                    onClickBtnClose={handleSuccessConfirm}
                />
            )}
        </div>
    );
}

export default UserAdminForm;