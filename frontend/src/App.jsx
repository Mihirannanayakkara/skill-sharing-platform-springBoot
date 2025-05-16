import { Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import MyCourseDetail from './pages/MyCourseDetail';
import CertificatePage from './pages/CertificatePage'; // ➡️ Add import
import PostListPage from './pages/PostListPage';
import CreatePost from './pages/CreatePost';
import ViewMyPosts from './pages/ViewMyPosts';
import EditProfilePage from './pages/EditProfilePage';
import NetworkPage from './pages/NetworkPage';
import ProfilePage from './pages/ProfilePage';
import UserProfileView from './pages/UserProfileView';
import Navbar from './components/NavBar';
import SavedItemsPage from './pages/SavedItemsPage';

import LearningProgressPage from './pages/LearningProgressPage';
import LearningPlanPage from './pages/LearningPlanPage';
import LearningPlanDetailPage from './pages/LearningPlanDetailPage';
import AIGenerateTasksPage from "./pages/AIGenerateTasksPage";
import ShareLearningPlan from './pages/ShareLearningPlan';

function App() {
    const location = useLocation();
    const showNavbar = location.pathname !== '/';
    return (
        <>
            {showNavbar && <Navbar />}
        <SnackbarProvider maxSnack={3}>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/my-course/:courseId" element={<MyCourseDetail />} />
                <Route path="/certificate/:courseId" element={<CertificatePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/saved-items" element={<SavedItemsPage />} />
                <Route path="/user/:userId" element={<UserProfileView />} />
                <Route path="/post/viewall" element={<PostListPage />} />
                <Route path="/post/create" element={<CreatePost />} />
                <Route path="/post/myposts" element={<ViewMyPosts />} />

<Route path="/learning-progress" element={<LearningProgressPage />} />
 <Route path="/learningplan" element={<LearningPlanPage />} />
      <Route path="/learningplan/view/:planId" element={<LearningPlanDetailPage />} />
      <Route path="/aigenerate-tasks" element={<AIGenerateTasksPage />} />
      <Route path="/learningplan/share/:planId" element={<ShareLearningPlan />} />

                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />



                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
        </SnackbarProvider>
    </>);
}

export default App;
