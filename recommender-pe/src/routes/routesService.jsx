import Login from '../pages/Login';
import UsuarioForm from '../pages/User/UserForm';
import POIForm from '../pages/POI/POIForm';
import Home from '../pages/Home';
import RecommendationForm from '../pages/Recommendation/RecommendationForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function RouteService() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<UsuarioForm />} />
                <Route path="/" element={<Home />} />
                <Route path="/POI/register" element={<POIForm />} />
                <Route path="/recommendation" element={<RecommendationForm />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteService;