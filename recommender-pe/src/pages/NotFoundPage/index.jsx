import Header from "../../components/Header";
import Footer from "../../components/Footer";
import error from '../../assets/images/error.webp';
import { useNavigate } from "react-router-dom";


const NotFoundPage = () => {
    const navigate = useNavigate(); 

    const handleClick = () => {
        navigate("/");
    };

    return (
        <div>
            <Header />
            <div className="container mt-3">
                <div className="d-flex justify-content-center">
                    <img src={error} alt="Erro 404 - Not Found" width={"30%"} onClick={handleClick}/>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NotFoundPage;
