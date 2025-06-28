import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './userForm.css';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';


function UserForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const navigate = useNavigate();

    const cancelar = (e) => {
        e.preventDefault();
        // lógica para redirecionar ou limpar o formulário
        setFirstName("");
        setLastName("");
        setAge("");
        setGender("");
        setCpf("");
        setPhone("");
        setEmail("");
        setUserPassword("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            firstName,
            lastName,
            age: parseInt(age),
            gender,
            cpf,
            phone,
            email,
            userPassword
        };
        console.log("Dados do usuário:", userData);
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


    return (
        <div className="containerForm">
            <div className="formBox">
                <div className="formContent">
                    <div className="header">
                        <h2 className="headerTitle">
                            <i className="bi bi-person-circle icon"></i>
                            Cadastro de Usuário
                        </h2>
                    </div>
                    <div className="formBody">
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
                                        <label htmlFor="age" className="label">
                                            Idade <span className="required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="age"
                                            className="input"
                                            placeholder="Digite sua idade"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            min="1"
                                            max="120"
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
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
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

                            {/* Segurança */}
                            <div className="section">
                                <h5 className="sectionHeader">
                                    <i className="bi bi-shield-lock sectionIcon"></i>
                                    Segurança
                                </h5>
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
                                        minLength="6"
                                        maxLength="100"
                                        required
                                    />
                                    <p className="passwordHint">
                                        A senha deve ter pelo menos 6 caracteres.
                                    </p>
                                </div>
                            </div>

                            {/* Botões */}
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
        </div>
    );
}

export default UserForm;
