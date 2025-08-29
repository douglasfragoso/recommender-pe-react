import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/DashBoard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFoundPage from '../pages/NotFoundPage';
import POICards from '../pages/POI/POICard';
import POIForm from '../pages/POI/POIForm';
import POIList from '../pages/POI/POIList';
import POIUpdateForm from '../pages/POI/POIUpdateForm';
import RecommendationForm from '../pages/Recommendation/RecommendationForm';
import RecommendationResults from '../pages/Recommendation/RecommendationResults';
import UserAdminForm from '../pages/User/UserAdminForm';
import UsuarioForm from '../pages/User/UserForm';
import UserList from '../pages/User/UserList';
import UserProfileForm from '../pages/User/UserProfileForm';
import Protection from './protection';
import RecommendationList from '../pages/Recommendation/RecommendationList';
import RecommendationDetails from '../pages/Recommendation/RecommendationDetails';
import RecommendationByUser from '../pages/Recommendation/RecommendationByUser';


function RouteService() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<UsuarioForm />} />
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/POIs/cards" element={<POICards />} />

                <Route path="/users/list" element={<Protection allowedRoles={['ADMIN', 'MASTER']}>
                    <UserList />
                </Protection>} />

                <Route path="/profile/me" element={<Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                    <UserProfileForm />
                </Protection>} />

                <Route path="/users/:id" element={<Protection allowedRoles={['ADMIN', 'MASTER']}>
                    <UserAdminForm />
                </Protection>} />

                <Route path="/POIs/list" element={<Protection allowedRoles={['ADMIN', 'MASTER']}>
                    <POIList />
                </Protection>} />

                <Route path="/POIs/register" element={<Protection allowedRoles={['ADMIN', 'MASTER']}>
                    <POIForm />
                </Protection>} />

                <Route path="/dashboard" element={<Protection allowedRoles={['ADMIN', 'MASTER']}>
                    <Dashboard />
                </Protection>} />

                <Route path="/POIs/:id" element={<Protection allowedRoles={['ADMIN', 'MASTER']}>
                    <POIUpdateForm />
                </Protection>} />

                <Route path="/recommendation" element={<Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                    <RecommendationForm />
                </Protection>} />

                <Route path="/recommendation/results" element={<Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                    <RecommendationResults />
                </Protection>} />

                <Route path="/recommendation/list" element={<Protection allowedRoles={['ADMIN', 'MASTER']}>
                    <RecommendationList />
                </Protection>} />

                <Route path="/recommendation/:id" element={<Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                    <RecommendationDetails />
                </Protection>} />

                <Route path="/recommendation/user" element={<Protection allowedRoles={['ADMIN', 'USER', 'MASTER']}>
                    <RecommendationByUser />
                </Protection>} />

            </Routes>
        </BrowserRouter>
    );
}

export default RouteService;