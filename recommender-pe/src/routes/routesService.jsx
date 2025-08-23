import Login from '../pages/Login';
import UsuarioForm from '../pages/User/UserForm';
import POIForm from '../pages/POI/POIForm';
import Home from '../pages/Home';
import RecommendationForm from '../pages/Recommendation/RecommendationForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import POIList from '../pages/POI';
import Protection from './protection';
import RecommendationResults from '../pages/Recommendation';
import UserList from '../pages/User';
import NotFoundPage from '../pages/NotFoundPage';
import UserProfileForm from '../pages/User/UserProfileForm';
import UserAdminForm from '../pages/User/UserAdminForm';   
import POIUpdateForm from '../pages/POI/POIUpdateForm';  


const RouteService = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<UsuarioForm />} />
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFoundPage />} />

                

                <Route path="/users" element={
                    <Protection allowedRoles={['ADMIN', 'MASTER']}>
                        <UserList />
                    </Protection>
                } />

                <Route path="/profile/me" element={
                    <Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                        <UserProfileForm />
                    </Protection>
                } />

                <Route path="/users/:id" element={
                    <Protection allowedRoles={['ADMIN', 'MASTER']}>
                        <UserAdminForm />
                    </Protection>
                } />

                <Route path="/POIs" element={
                    <Protection allowedRoles={['ADMIN', 'MASTER']}>
                        <POIList />
                    </Protection>
                } />

                <Route path="/POIs/register" element={
                    <Protection allowedRoles={['ADMIN', 'MASTER']}>
                        <POIForm />
                    </Protection>
                } />

                <Route path="/POIs/:id" element={
                    <Protection allowedRoles={['ADMIN', 'MASTER']}>
                        <POIUpdateForm />
                    </Protection>
                } />

                <Route path="/recommendation" element={
                    <Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                        <RecommendationForm />
                    </Protection>
                } />

                <Route path="/recommendation/results" element={
                    <Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                        <RecommendationResults />
                    </Protection>
                } />


            </Routes>
        </BrowserRouter>
    )
}

export default RouteService;