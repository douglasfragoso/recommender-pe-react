import { useContext, useState } from 'react';
import './login.css';
import logo from '../../assets/images/logo.webp';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from "../../context/GlobalContext";
import '../../App.css';


function Login() {
    const { login } = useContext(GlobalContext);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [manterConectado, setManterConectado] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (!email || !senha) {
            setErro("Preencha todos os campos!");
            return;
        }

        setCarregando(true);
        try {
            console.log("Iniciando login..."); // Debug
            const userData = await login(email, senha, manterConectado);
            console.log("Login bem-sucedido:", userData); // Debug

            // Verifica se o login foi realmente bem-sucedido
            if (userData && userData.token) {
                navigate("/");
            } else {
                throw new Error("Autenticação falhou");
            }
        } catch (error) {
            console.error("Erro no login:", error); // Debug
            // Mensagem mais específica do erro
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Credenciais inválidas. Tente novamente.";
            setErro(errorMessage);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="bg-container">
            <div className='container'>
                <div className='row justify-content-center'>
                    <form className='col-md-5 col-10 login-container' onSubmit={handleSubmit}>
                        <div className='row justify-content-center my-4'>
                            <div className='col-8'>
                                <div className='d-flex justify-content-center'>
                                    <img src={logo} className="logo-oval mb-3" alt="Sistema de Gerenciamento de Projetos" />
                                </div>

                                {erro && (
                                    <div className='d-flex justify-content-center'>
                                        <span className='text-danger mb-2'>{erro}</span>
                                    </div>
                                )}

                                <input
                                    type='email'
                                    className='form-control border border-primary mb-2'
                                    placeholder='E-mail'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <input
                                    type='password'
                                    className='form-control border border-primary mb-2'
                                    placeholder='Senha'
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />

                                <div className='form-check text-start my-3'>
                                    <input
                                        className='form-check-input'
                                        type='checkbox'
                                        checked={manterConectado}
                                        onChange={() => setManterConectado(!manterConectado)}
                                    />
                                    <label className='form-check-label text-dark'>
                                        Mantenha-me conectado
                                    </label>
                                </div>

                                <div className='d-flex justify-content-center'>
                                    <Button
                                        type="submit"
                                        cor="primary" 
                                        tamanho="md" 
                                        className="submitButton mt-2 px-4 mx-2"
                                        disabled={carregando}
                                    >
                                        {carregando ? 'Carregando...' : 'Acessar'}
                                    </Button>

                                    <Button
                                        cor="" 
                                        tamanho="md" 
                                        outline={true} 
                                        className="cancelButton mt-2 px-4 mx-2"
                                        aoClicar={() => navigate("/register")}
                                    >
                                        Registrar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;