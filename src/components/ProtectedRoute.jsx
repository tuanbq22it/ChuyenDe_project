import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <h5 className="text-muted">Đang kiểm tra đăng nhập...</h5>
        </div>
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;