import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Categories from './pages/Categories';
import Analytics from './pages/CleanAnalytics';
import Settings from './pages/Settings';
import Comments from './pages/Comments';
import TestPage from './pages/TestPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/posts" 
            element={
              <ProtectedRoute>
                <Posts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            } 
          />
          <Route path="/analytics" element={<Analytics />} />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/comments" 
            element={
              <ProtectedRoute>
                <Comments />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
