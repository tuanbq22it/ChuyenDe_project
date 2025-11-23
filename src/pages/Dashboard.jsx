import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    draftPosts: 0,
    publishedPosts: 0,
    todayPosts: 0,
    weeklyViews: 0,
    monthlyGrowth: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://api.buiquoctuan.id.vn/api/posts';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const contentType = res.headers.get('content-type');
      
      if (res.ok && contentType && contentType.includes('application/json')) {
        const posts = await res.json();
        updateStats(posts);
        setRecentPosts(posts.slice(0, 5));
      } else {
        throw new Error('API không khả dụng');
      }
    } catch (error) {
      console.log('🔄 Sử dụng dữ liệu mẫu (API không khả dụng)');
      // Sử dụng mock data khi API không hoạt động
        // Mock data nếu API không hoạt động
        const mockPosts = [
          {
            _id: '1',
            title: 'Ronaldo không có bàn thắng nào trong 4 trận gần nhất',
            content: 'Cristiano Ronaldo đã trải qua 4 trận đấu liên tiếp...',
            status: 'PUBLISHED',
            createdAt: new Date('2025-11-20').toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop'
          },
          {
            _id: '2',
            title: 'Lý do nên thêm măng tây vào thực đơn hàng ngày',
            content: 'Măng tây không chỉ ngon mà còn rất tốt cho sức khỏe...',
            status: 'PUBLISHED', 
            createdAt: new Date('2025-11-20').toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=100&h=100&fit=crop'
          },
          {
            _id: '3',
            title: 'Nhạc sĩ Nguyễn Văn Chung chia sẻ về âm nhạc',
            status: 'PUBLISHED',
            createdAt: new Date('2025-11-20').toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'
          },
          {
            _id: '4',
            title: 'Bài viết chờ duyệt mẫu',
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            imageUrl: 'https://via.placeholder.com/100x100?text=Draft'
          }
        ];
      updateStats(mockPosts);
      setRecentPosts(mockPosts.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (posts) => {
    const totalPosts = posts.length;
    const draftPosts = posts.filter(p => p.status === 'DRAFT').length;
    const publishedPosts = posts.filter(p => p.status === 'PUBLISHED').length;
    const today = new Date().toDateString();
    const todayPosts = posts.filter(p => 
      new Date(p.createdAt).toDateString() === today
    ).length;

    setStats({ 
      totalPosts, 
      draftPosts, 
      publishedPosts, 
      todayPosts,
      weeklyViews: Math.floor(Math.random() * 2000) + 800,
      monthlyGrowth: Math.floor(Math.random() * 30) + 5
    });
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <Navbar />
      
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* Demo Mode Alert */}
        <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill me-2"></i>
            <div className="flex-grow-1">
              <small className="fw-bold">Admin Panel Demo</small>
              <div className="small">
                Chào mừng bạn đến với trang quản trị! Tất cả tính năng đều hoạt động với dữ liệu mẫu.
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
              <div>
                <h2 className="fw-bold mb-1 d-flex align-items-center flex-wrap gap-2">
                  <span>Chào mừng, {user?.name || 'Admin'}! 👋</span>
                  <span className="badge bg-secondary small">
                    <i className="bi bi-wifi-off me-1"></i>
                    Demo Mode
                  </span>
                </h2>
                <p className="text-muted mb-0">Tổng quan hệ thống quản lý nội dung</p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/posts" className="btn btn-primary">
                  <i className="bi bi-file-earmark-text me-1"></i>
                  Quản lý bài viết
                </Link>
                <button className="btn btn-outline-secondary" onClick={fetchDashboardData}>
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Tổng bài viết</h6>
                    <h3 className="fw-bold mb-0">{stats.totalPosts}</h3>
                  </div>
                  <i className="bi bi-file-earmark-text fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Chờ duyệt</h6>
                    <h3 className="fw-bold mb-0">{stats.draftPosts}</h3>
                  </div>
                  <i className="bi bi-clock fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Đã đăng</h6>
                    <h3 className="fw-bold mb-0">{stats.publishedPosts}</h3>
                  </div>
                  <i className="bi bi-check-circle fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Hôm nay</h6>
                    <h3 className="fw-bold mb-0">{stats.todayPosts}</h3>
                  </div>
                  <i className="bi bi-calendar-today fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'}}>
              <div className="card-body text-dark">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Lượt xem tuần</h6>
                    <h3 className="fw-bold mb-0">{stats.weeklyViews.toLocaleString()}</h3>
                  </div>
                  <i className="bi bi-eye fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'}}>
              <div className="card-body text-dark">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Tăng trưởng</h6>
                    <h3 className="fw-bold mb-0">+{stats.monthlyGrowth}%</h3>
                  </div>
                  <i className="bi bi-graph-up fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-clock-history text-primary me-2"></i>
                    Hoạt động gần đây
                  </h5>
                  <Link to="/posts" className="btn btn-sm btn-outline-primary">
                    Xem tất cả
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Đang tải...</span>
                    </div>
                  </div>
                ) : recentPosts.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-3 mb-2 d-block"></i>
                    <p className="mb-0">Chưa có hoạt động nào</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {recentPosts.map((post, index) => (
                      <div key={post._id} className="list-group-item border-0 px-0 py-3">
                        <div className="d-flex align-items-center">
                          <img 
                            src={post.imageUrl || 'https://via.placeholder.com/50x50'} 
                            alt="" 
                            className="rounded me-3" 
                            style={{width: '50px', height: '50px', objectFit: 'cover'}}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'}
                          />
                          <div className="flex-grow-1 min-width-0">
                            <h6 className="mb-1 text-truncate">{post.title}</h6>
                            <div className="d-flex align-items-center gap-3">
                              <span className={`badge ${post.status === 'PUBLISHED' ? 'bg-success' : 'bg-warning text-dark'} badge-sm`}>
                                {post.status === 'PUBLISHED' ? 'Đã đăng' : 'Chờ duyệt'}
                              </span>
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-lightning text-warning me-2"></i>
                  Thao tác nhanh
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-3">
                  <Link to="/posts" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Duyệt bài viết
                  </Link>
                  <Link to="/posts" className="btn btn-outline-success btn-lg">
                    <i className="bi bi-plus-circle me-2"></i>
                    Tạo bài viết mới
                  </Link>
                  <button className="btn btn-outline-info btn-lg">
                    <i className="bi bi-graph-up me-2"></i>
                    Xem báo cáo
                  </button>
                  <button className="btn btn-outline-secondary btn-lg">
                    <i className="bi bi-gear me-2"></i>
                    Cài đặt hệ thống
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;