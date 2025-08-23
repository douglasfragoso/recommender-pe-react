import 'bootstrap-icons/font/bootstrap-icons.css';
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import logo from '../../assets/images/logo.webp';
import './footer.css';

const Footer = () => {
    const { usuarioLogado, logout } = useContext(GlobalContext);

    const getPOIUrl = () => {
        if (!usuarioLogado) return "/POIs/cards"; 
        if (usuarioLogado.role === "USER") return "/POIs/cards";
        if (usuarioLogado.role === "ADMIN" || usuarioLogado.role === "MASTER") return "/POIs/list";
        return "/POIs/cards";
    };

    return (
        <>
            <div className="container">
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <p className="col-md-4 mb-0 text-body-secondary"></p>

                    <div className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                        <img src={logo} className='logo-oval-footer mx-2' alt="Vamu!REC" /> &copy; {new Date().getFullYear()} Vamu!REC
                    </div>

                    <ul className="nav col-md-4 justify-content-end">
                        <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Home</a></li>
                        <li className="nav-item"><a href={getPOIUrl()} className="nav-link px-2 text-body-secondary">Pontos de Interesse</a></li>
                        <li className="nav-item"><a href="/recommendation" className="nav-link px-2 text-body-secondary">Recomendações</a></li>
                    </ul>
                </footer>
            </div>
        </>
    );
}

export default Footer;