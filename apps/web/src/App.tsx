
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ModuleList from './pages/ModuleList';
import ModuleDetail from './pages/ModuleDetail';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import Progress from './pages/Progress';
import GamesList from './pages/GamesList';
import GameRouter from './pages/GameRouter';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateLesson from './pages/instructor/CreateLesson';
import CreateQuiz from './pages/instructor/CreateQuiz';
import CreateRecipe from './pages/instructor/CreateRecipe';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="modules" element={<ModuleList />} />
            <Route path="modules/:id" element={<ModuleDetail />} />
            <Route path="lessons/:id" element={<LessonView />} />
            <Route path="quizzes/:id" element={<QuizView />} />
            <Route path="recipes" element={<RecipeList />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="games" element={<GamesList />} />
            <Route path="games/:slug" element={<GameRouter />} />
            <Route path="progress" element={
              <ProtectedRoute><Progress /></ProtectedRoute>
            } />
            <Route path="instructor" element={
              <ProtectedRoute roles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>
            } />
            <Route path="instructor/lessons/new" element={
              <ProtectedRoute roles={['instructor', 'admin']}><CreateLesson /></ProtectedRoute>
            } />
            <Route path="instructor/quizzes/new" element={
              <ProtectedRoute roles={['instructor', 'admin']}><CreateQuiz /></ProtectedRoute>
            } />
            <Route path="instructor/recipes/new" element={
              <ProtectedRoute roles={['instructor', 'admin']}><CreateRecipe /></ProtectedRoute>
            } />
            <Route path="admin" element={
              <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
