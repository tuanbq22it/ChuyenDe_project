import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import NotificationSystem from './NotificationSystem';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container-fluid px-4">
        <a className="navbar-brand fw-bold d-flex align-items-center" href="#">
          <i className="bi bi-speedometer2 me-2"></i> Admin Dashboard
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
          <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                <i className="bi bi-house-door me-1"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/posts' ? 'active' : ''}`} to="/posts">
                <i className="bi bi-file-earmark-text me-1"></i> Bài viết
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/categories' ? 'active' : ''}`} to="/categories">
                <i className="bi bi-folder me-1"></i> Danh mục
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`} to="/analytics">
                <i className="bi bi-bar-chart me-1"></i> Thống kê
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/comments' ? 'active' : ''}`} to="/comments">
                <i className="bi bi-chat-square-text me-1"></i> Bình luận
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`} to="/settings">
                <i className="bi bi-gear me-1"></i> Cài đặt
              </Link>
            </li>
          </ul>          <div className="d-flex align-items-center gap-3">
            <span className="text-light small opacity-75">
              <i className="bi bi-globe me-1"></i> api.buiquoctuan.id.vn
            </span>
            
            <NotificationSystem />
            
            <div className="dropdown">
              <button className="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-1"></i>
                {user?.name || 'Admin'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 className="dropdown-header">
                    <i className="bi bi-person me-1"></i>
                    {user?.email}
                  </h6>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-person-gear me-2"></i>Hồ sơ
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-gear me-2"></i>Cài đặt
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
            
            <button className="btn btn-outline-light btn-sm" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
