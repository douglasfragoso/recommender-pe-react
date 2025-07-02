import logo from '../../assets/images/logo.webp';
import './header.css';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

function Header() {
    const navigate = useNavigate();
    const { usuarioLogado, logout } = useContext(GlobalContext);

    const handleAuthAction = () => {
        if (usuarioLogado) {
            logout();
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src={logo} className="logo-oval-header" alt="Bootstrap"/>
                        <span className="fw-semibold brand-name ms-2">Alavancando o Turismo em Recife</span>
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto mx-5 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Usuários</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/POIs">Pontos de Interesse</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/recommendation">Recomendações</a>
                            </li>
                            <li className="nav-item">
                                <Button
                                    cor="primary"
                                    outline
                                    tamanho="md"
                                    aoClicar={handleAuthAction}
                                    className="loginButton px-3"
                                >
                                    <i className={`bi ${usuarioLogado ? 'bi-box-arrow-right' : 'bi-person-circle'}`}></i>
                                    <span className="d-none d-md-inline">
                                        {usuarioLogado ? 'Sair' : 'Fazer Login'}
                                    </span>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header;