import logo from '../../assets/images/logo.png';
import './footer.css';

function Footer() {
  return (
    <>
        <div className="container">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <p className="col-md-4 mb-0 text-body-secondary"></p>

                <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                    <img src={logo} className='logo-oval-footer mx-2' alt="Vamu!REC"/> &copy; { new Date().getFullYear() } Vamu!REC
                </a>

                <ul className="nav col-md-4 justify-content-end">
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Home</a></li>
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Recomendações</a></li>
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Dashboard</a></li>
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Pontos de Interesse</a></li>
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Usuários</a></li>
                </ul>
            </footer>
        </div>
    </>
  );
}

export default Footer;