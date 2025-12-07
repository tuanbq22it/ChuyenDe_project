import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// CSS for loading animation
const styles = `
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .post-hover:hover {
    background-color: #f8f9fa;
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosts: 0,
    followers: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    engagement: 0,
    todayPosts: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'https://api.buiquoctuan.id.vn/api/posts';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Facebook API configuration
      const pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID || '732045003335546';
      const token = import.meta.env.VITE_FACEBOOK_PAGE_ACCESS_TOKEN || 'EAAfPYE7egL8BQMLijv4aipXXaImbD0gCo8ozQ7XPpI9VIBw87lkZBEakkB5xPxc8LokpqnCW1C2W6q2FLZAU9aZA7pQOB5vWezBZCAEMULiSbm5rGzaBszrvnyFpU5Rw8LUhP712NR50KZC9ILZCySPxZBFtI5dtZC2NzpqfxIoaXO0mAZB60JiMLBRiFoSKcNkCo8WVU';
      
      console.log('🔗 Đang tải dữ liệu Dashboard từ Facebook...');
      
      if (!token) {
        throw new Error('Facebook Access Token không tìm thấy');
      }

      // Fetch page info with post images
      const pageResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=name,followers_count,likes,posts.limit(15){id,message,created_time,likes.summary(true),comments.summary(true),shares,full_picture}&access_token=${token}`
      );
      
      const pageData = await pageResponse.json();
      
      if (pageData.error) {
        throw new Error(`Facebook API Error: ${pageData.error.message}`);
      }
      
      console.log('✅ Dữ liệu Facebook Dashboard:', pageData);
      
      setPageInfo(pageData);
      
      // Process posts data
      const posts = pageData.posts?.data || [];
      updateStatsFromFacebook(pageData, posts);
      setRecentPosts(posts.slice(0, 5));
      
    } catch (error) {
      console.error('💥 Lỗi tải dữ liệu Facebook Dashboard:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatsFromFacebook = (pageData, posts) => {
    const totalPosts = posts.length;
    const today = new Date().toDateString();
    const todayPosts = posts.filter(p => 
      new Date(p.created_time).toDateString() === today
    ).length;
    
    // Calculate engagement metrics
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.summary?.total_count || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments?.summary?.total_count || 0), 0);
    const totalShares = posts.reduce((sum, post) => sum + (post.shares?.count || 0), 0);
    const engagement = totalLikes + totalComments + totalShares;

    setStats({ 
      totalPosts,
      followers: pageData.followers_count || 0,
      totalLikes,
      totalComments,
      totalShares,
      engagement,
      todayPosts
    });
  };

  const updateStats = (posts) => {
    // Fallback function for mock data
    const totalPosts = posts.length;
    const today = new Date().toDateString();
    const todayPosts = posts.filter(p => 
      new Date(p.createdAt).toDateString() === today
    ).length;

    setStats({ 
      totalPosts,
      followers: 2, // Mock follower count
      totalLikes: 25,
      totalComments: 8, 
      totalShares: 3,
      engagement: 36,
      todayPosts
    });
  };

  // Get post thumbnail - prioritize Facebook images, fallback to content-based
  const getPostThumbnail = (post) => {
    // First try to get image from Facebook full_picture
    if (post.full_picture) {
      return post.full_picture;
    }
    
    // Fallback to content-based thumbnails
    const content = post.message || post.title || '';
    const lowerContent = content.toLowerCase();
    
    // Sports/Football
    if (lowerContent.includes('ronaldo') || lowerContent.includes('bóng đá') || lowerContent.includes('football')) {
      return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=60&h=60&fit=crop&crop=face';
    }
    // Food/Health  
    if (lowerContent.includes('măng tây') || lowerContent.includes('thực đơn') || lowerContent.includes('sức khỏe')) {
      return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=60&h=60&fit=crop';
    }
    // Music/Entertainment
    if (lowerContent.includes('nhạc sĩ') || lowerContent.includes('âm nhạc') || lowerContent.includes('music')) {
      return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop';
    }
    // Business/Travel
    if (lowerContent.includes('vietjet') || lowerContent.includes('công ty') || lowerContent.includes('làm việc')) {
      return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=60&h=60&fit=crop';
    }
    // News/General
    return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=60&h=60&fit=crop';
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <style>{styles}</style>
      <Navbar />
      
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* Dashboard Header */}
        <div className="alert alert-primary border-0 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-facebook me-2"></i>
            <div className="flex-grow-1">
              <small className="fw-bold">📊 Dashboard Facebook Analytics</small>
              <div className="small">
                Trang: {pageInfo?.name || 'TT News'} • Followers: {stats.followers} • Tổng tương tác: {stats.engagement}
              </div>
            </div>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={fetchDashboardData}
              disabled={loading}
            >
              {loading ? (
                <><i className="spinner-border spinner-border-sm me-1"></i>Tải...</>
              ) : (
                <><i className="bi bi-arrow-clockwise me-1"></i>Làm mới</>
              )}
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
              <div>
                <h2 className="fw-bold mb-1 d-flex align-items-center flex-wrap gap-2">
                  <span>📊 Dashboard Facebook Analytics</span>
                </h2>
                <p className="text-muted mb-0">
                  Trang: <strong>{pageInfo?.name || 'TT News'}</strong> • 
                  Followers: <strong>{stats.followers}</strong> • 
                  Engagement: <strong>{stats.engagement}</strong>
                </p>
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
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Followers</h6>
                    <h3 className="fw-bold mb-0">{stats.followers}</h3>
                  </div>
                  <i className="bi bi-people fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Tổng Likes</h6>
                    <h3 className="fw-bold mb-0">{stats.totalLikes}</h3>
                  </div>
                  <i className="bi bi-heart-fill fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Bình luận</h6>
                    <h3 className="fw-bold mb-0">{stats.totalComments}</h3>
                  </div>
                  <i className="bi bi-chat-fill fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'}}>
              <div className="card-body text-dark">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Chia sẻ</h6>
                    <h3 className="fw-bold mb-0">{stats.totalShares}</h3>
                  </div>
                  <i className="bi bi-share fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-2 col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'}}>
              <div className="card-body text-dark">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Tương tác</h6>
                    <h3 className="fw-bold mb-0">{stats.engagement}</h3>
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
                  <div>
                    <h5 className="fw-bold mb-1">
                      <i className="bi bi-clock-history text-primary me-2"></i>
                      Hoạt động gần đây
                    </h5>
                    <p className="text-muted small mb-0">
                      {error ? 'Dữ liệu mẫu từ hệ thống' : 'Bài viết mới nhất từ Facebook'}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={fetchDashboardData}
                      disabled={loading}
                      title="Làm mới"
                    >
                      <i className={`bi ${loading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise'}`}></i>
                    </button>
                    <Link to="/posts" className="btn btn-sm btn-outline-primary">
                      Xem tất cả
                    </Link>
                  </div>
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
                      <div key={post.id || post._id} className="list-group-item border-0 px-0 py-3 post-hover rounded">
                        <div className="d-flex align-items-center">
                          <div className="position-relative me-3">
                            <img 
                              src={getPostThumbnail(post)} 
                              alt="Post thumbnail"
                              className="rounded shadow-sm" 
                              style={{
                                width: '60px', 
                                height: '60px', 
                                objectFit: 'cover',
                                border: post.full_picture ? '2px solid #1877f2' : '2px solid #e9ecef',
                                backgroundColor: '#f8f9fa'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                              loading="lazy"
                            />
                            <div 
                              className="rounded bg-primary d-none align-items-center justify-content-center text-white fw-bold shadow-sm" 
                              style={{
                                width: '60px', 
                                height: '60px', 
                                fontSize: '1.5rem', 
                                position: 'absolute', 
                                top: 0, 
                                left: 0,
                                border: '2px solid #e9ecef'
                              }}
                            >
                              📝
                            </div>
                            <div className="position-absolute bottom-0 end-0 translate-middle">
                              <span 
                                className={`badge ${post.full_picture ? 'bg-success' : 'bg-primary'} rounded-circle p-1`} 
                                style={{fontSize: '0.6rem'}}
                                title={post.full_picture ? 'Ảnh thật từ Facebook' : 'Ảnh mặc định'}
                              >
                                {post.full_picture ? '📸' : '📱'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1 min-width-0">
                            <h6 className="mb-1 text-truncate fw-semibold">
                              {post.message ? post.message.substring(0, 60) + '...' : post.title || 'Bài viết Facebook'}
                            </h6>
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-facebook text-primary me-1"></i>
                                Facebook
                              </span>
                              {post.likes?.summary && (
                                <small className="text-muted d-flex align-items-center">
                                  <i className="bi bi-heart-fill text-danger me-1"></i>
                                  {post.likes.summary.total_count}
                                </small>
                              )}
                              {post.comments?.summary && (
                                <small className="text-muted d-flex align-items-center">
                                  <i className="bi bi-chat-fill text-primary me-1"></i>
                                  {post.comments.summary.total_count}
                                </small>
                              )}
                              <small className="text-muted d-flex align-items-center">
                                <i className="bi bi-clock me-1"></i>
                                {new Date(post.created_time || post.createdAt).toLocaleDateString('vi-VN')}
                              </small>
                            </div>
                            {post.message && post.message.length > 60 && (
                              <p className="text-muted small mb-0 mt-1" style={{fontSize: '0.8rem'}}>
                                {post.message.substring(60, 120)}...
                              </p>
                            )}
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