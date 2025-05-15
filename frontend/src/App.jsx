import { Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboard from './pages/AdminDashboard';
import LearningProgressPage from './pages/LearningProgressPage';
import ProtectedRoute from './routes/ProtectedRoute';
import MyCourseDetail from './pages/MyCourseDetail';
import CertificatePage from './pages/CertificatePage'; // ➡️ Add import
import PostListPage from './pages/PostListPage';
import CreatePost from './pages/CreatePost';
import ViewMyPosts from './pages/ViewMyPosts';



function App() {
    return (
        <SnackbarProvider maxSnack={3}>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/learning-progress" element={<LearningProgressPage />} />
                <Route path="/my-course/:courseId" element={<MyCourseDetail />} />
                <Route path="/certificate/:courseId" element={<CertificatePage />} />

                <Route path="/post/viewall" element={<PostListPage />} />
                <Route path="/post/create" element={<CreatePost />} />
                <Route path="/post/myposts" element={<ViewMyPosts />} />

                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />



                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
        </SnackbarProvider>
    );
}

export default App;
