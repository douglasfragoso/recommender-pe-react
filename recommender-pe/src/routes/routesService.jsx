import Login from '../pages/Login';
import UsuarioForm from '../pages/User/UserForm';
import Home from '../pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function RouteService() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<UsuarioForm />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteService;