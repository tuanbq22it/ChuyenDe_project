import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFacebookData();
  }, []);

  const loadFacebookData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID || '732045003335546';
      const token = import.meta.env.VITE_FACEBOOK_PAGE_ACCESS_TOKEN || 'EAAfPYE7egL8BQMLijv4aipXXaImbD0gCo8ozQ7XPpI9VIBw87lkZBEakkB5xPxc8LokpqnCW1C2W6q2FLZAU9aZA7pQOB5vWezBZCAEMULiSbm5rGzaBszrvnyFpU5Rw8LUhP712NR50KZC9ILZCySPxZBFtI5dtZC2NzpqfxIoaXO0mAZB60JiMLBRiFoSKcNkCo8WVU';
      
      console.log('🔗 Loading Facebook data...');
      console.log('📋 Config:', {
        pageId,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 15)}...` : 'NO_TOKEN',
        env: import.meta.env.MODE
      });

      if (!token) {
        throw new Error('Facebook Access Token không tìm thấy trong .env');
      }

      // Load page info
      const pageResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=name,followers_count,likes&access_token=${token}`
      );
      const pageData = await pageResponse.json();
      
      if (pageData.error) {
        throw new Error(`Page Info Error: ${pageData.error.message}`);
      }
      
      console.log('✅ Page Info:', pageData);
      setPageInfo(pageData);

      // Load posts
      const postsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/posts?fields=message,created_time,likes.summary(true),comments.summary(true),shares&limit=10&access_token=${token}`
      );
      const postsData = await postsResponse.json();
      
      if (postsData.error) {
        throw new Error(`Posts Error: ${postsData.error.message}`);
      }
      
      console.log('✅ Posts Data:', postsData);

      // Process posts
      const processedPosts = postsData.data?.map(post => {
        const likes = post.likes?.summary?.total_count || 0;
        const comments = post.comments?.summary?.total_count || 0;
        const shares = post.shares?.count || 0;
        const engagement = likes + comments + shares;
        
        return {
          id: post.id,
          title: truncateText(post.message || 'Bài viết không có tiêu đề', 50),
          message: post.message,
          likes,
          comments,
          shares,
          engagement,
          created_time: post.created_time
        };
      }) || [];

      // Sort by engagement
      const topPostsSorted = processedPosts
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5);
        
      setTopPosts(topPostsSorted);

      // Calculate analytics
      const totalEngagement = processedPosts.reduce((sum, post) => sum + post.engagement, 0);
      const totalLikes = processedPosts.reduce((sum, post) => sum + post.likes, 0);
      const totalComments = processedPosts.reduce((sum, post) => sum + post.comments, 0);
      const totalShares = processedPosts.reduce((sum, post) => sum + post.shares, 0);
      
      const analyticsData = {
        impressions: totalEngagement * 5, // Estimate
        reach: totalEngagement * 3, // Estimate 
        engagement: totalEngagement,
        engagementRate: totalLikes > 0 ? ((totalEngagement / totalLikes) * 100).toFixed(1) : 0,
        followers: pageData.followers_count || 0,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        postsCount: processedPosts.length
      };
      
      console.log('📊 Analytics Data:', analyticsData);
      setAnalytics(analyticsData);
      
    } catch (err) {
      console.error('💥 Error loading Facebook data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return 'Không có nội dung';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container-fluid px-4 py-3">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <h3 className="mt-3">Đang tải dữ liệu Facebook Analytics...</h3>
            <p className="text-muted">Kết nối với Facebook Graph API</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container-fluid px-4 py-3">
          <div className="alert alert-danger text-center">
            <h4>❌ Lỗi tải dữ liệu Facebook</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadFacebookData}>
              🔄 Thử lại
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid px-4 py-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 mb-0">📊 Facebook Analytics</h1>
            <p className="text-muted">
              Trang: <strong>{pageInfo?.name || 'TT News'}</strong> • 
              Followers: <strong>{formatNumber(pageInfo?.followers_count || 0)}</strong> • 
              Likes: <strong>{formatNumber(pageInfo?.likes || 0)}</strong>
            </p>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={loadFacebookData}>
            🔄 Tải lại
          </button>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      👁️ Lượt hiển thị (Ước tính)
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {formatNumber(analytics?.impressions || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      👥 Tiếp cận (Ước tính)
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {formatNumber(analytics?.reach || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      ❤️ Tổng tương tác
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {formatNumber(analytics?.engagement || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      📝 Bài viết đã phân tích
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {analytics?.postsCount || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-left-danger shadow h-100 py-2">
              <div className="card-body text-center">
                <div className="h4 mb-0 font-weight-bold text-danger">
                  ❤️ {formatNumber(analytics?.likes || 0)}
                </div>
                <div className="text-xs text-uppercase">Lượt thích</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body text-center">
                <div className="h4 mb-0 font-weight-bold text-warning">
                  💬 {formatNumber(analytics?.comments || 0)}
                </div>
                <div className="text-xs text-uppercase">Bình luận</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body text-center">
                <div className="h4 mb-0 font-weight-bold text-success">
                  🔄 {formatNumber(analytics?.shares || 0)}
                </div>
                <div className="text-xs text-uppercase">Chia sẻ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Posts */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">🏆 Bài viết hàng đầu (Dữ liệu thực từ Facebook)</h6>
              </div>
              <div className="card-body">
                {topPosts.length > 0 ? topPosts.map((post, index) => {
                  const icons = ['🥇', '🥈', '🥉', '🏅', '⭐'];
                  return (
                    <div key={post.id} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                      <div className="me-3">
                        <span style={{fontSize: '2rem'}}>{icons[index] || '📝'}</span>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="font-weight-bold mb-2">{post.title}</h6>
                        <div className="row">
                          <div className="col-md-8">
                            <small className="text-muted d-block mb-1">
                              📅 {new Date(post.created_time).toLocaleDateString('vi-VN')}
                            </small>
                            {post.message && (
                              <p className="text-muted small mb-0">
                                {truncateText(post.message, 100)}
                              </p>
                            )}
                          </div>
                          <div className="col-md-4">
                            <div className="d-flex gap-3 justify-content-end">
                              <span className="badge bg-danger">❤️ {post.likes}</span>
                              <span className="badge bg-warning">💬 {post.comments}</span>
                              <span className="badge bg-success">🔄 {post.shares}</span>
                              <span className="badge bg-primary">📊 {post.engagement}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-4">
                    <div style={{fontSize: '3rem'}}>📊</div>
                    <p className="text-muted">Không có dữ liệu bài viết</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="alert alert-info text-center">
          ✨ <strong>Facebook Analytics Dashboard</strong> - Dữ liệu thực từ Facebook Graph API v18.0
        </div>
      </div>
    </>
  );
};

export default Analytics;