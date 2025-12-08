import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import EditModal from '../components/EditModal';
import CreatePostModal from '../components/CreatePostModal';
import { notifyPost, notifySuccess, notifyError } from '../utils/notifications';

const Posts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    draftPosts: 0,
    publishedPosts: 0
  });

  const API_BASE = 'https://api.buiquoctuan.id.vn/api/posts';

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
    updateStats();
  }, [posts, currentFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    console.log('🔄 Fetching posts from API:', API_BASE);
    
    try {
      const response = await fetch(API_BASE, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Fetch API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Fetch API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Fetched posts from API:', data.length, 'posts');
      setPosts(data);
      
    } catch (error) {
      console.error('❌ Failed to fetch from API, using mock data:', error);
      // Sử dụng mock data khi API không khả dụng
        // Mock data nếu API không hoạt động
        const mockPosts = [
          {
            _id: '1',
            title: 'Ronaldo không có bàn thắng nào trong 4 trận gần nhất',
            content: 'Cristiano Ronaldo đã trải qua 4 trận đấu liên tiếp mà không ghi được bàn thắng nào...',
            status: 'PUBLISHED',
            createdAt: new Date('2025-11-20').toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop'
          },
          {
            _id: '2',
            title: 'Lý do nên thêm măng tây vào thực đơn hàng ngày',
            content: 'Măng tây không chỉ ngon mà còn rất tốt cho sức khỏe với nhiều vitamin và khoáng chất...',
            status: 'PUBLISHED', 
            createdAt: new Date('2025-11-20').toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=200&fit=crop'
          },
          {
            _id: '3',
            title: 'Nhạc sĩ Nguyễn Văn Chung chia sẻ về âm nhạc',
            content: 'Trong buổi phỏng vấn mới đây, nhạc sĩ Nguyễn Văn Chung đã chia sẻ nhiều điều thú vị...',
            status: 'PUBLISHED',
            createdAt: new Date('2025-11-20').toISOString(), 
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop'
          },
          {
            _id: '4',
            title: 'Vietjet vào top "Nơi làm việc tốt nhất châu Á"',
            content: 'Hãng hàng không Vietjet đã được vinh danh trong danh sách những nơi làm việc tốt nhất...',
            status: 'PUBLISHED',
            createdAt: new Date('2025-11-20').toISOString(),
            imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop'
          },
          {
            _id: '5',
            title: 'Bài viết chờ duyệt mẫu',
            content: 'Đây là nội dung bài viết đang chờ được duyệt và đăng lên Facebook...',
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            imageUrl: 'https://via.placeholder.com/400x200?text=Draft+Post'
          }
        ];
        setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered;
    if (currentFilter === 'ALL') {
      filtered = posts;
    } else {
      filtered = posts.filter(post => post.status === currentFilter);
    }
    setFilteredPosts(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const updateStats = () => {
    const totalPosts = posts.length;
    const draftPosts = posts.filter(p => p.status === 'DRAFT').length;
    const publishedPosts = posts.filter(p => p.status === 'PUBLISHED').length;
    setStats({ totalPosts, draftPosts, publishedPosts });
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const postToDelete = posts.find(p => p._id === id);
    
    if (!confirm(`⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn bài viết "${postToDelete?.title || 'này'}"?\n\n${postToDelete?.facebookPostId ? '🔴 Bài viết này đã đăng trên Facebook và sẽ bị xóa!' : '📝 Bài viết này chỉ có trong hệ thống.'}`)) return;
    
    try {
      // 1. Xóa trên database
      console.log('🗑️ Deleting post:', { id, url: `${API_BASE}/${id}` });
      const res = await fetch(`${API_BASE}/${id}`, { 
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Delete response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Delete API error:', errorText);
        throw new Error(`Delete failed: ${res.status} - ${errorText}`);
      }

      // 2. Nếu có facebookPostId, gọi n8n để xóa trên Facebook
      if (postToDelete?.facebookPostId) {
        try {
          console.log('🗑️ Calling n8n to delete from Facebook:', postToDelete.facebookPostId);
          // Force HTTPS - không dùng env variable để tránh cache HTTP cũ
          const n8nResponse = await fetch('https://buiquoctuan.id.vn/webhook/delete-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              postId: postToDelete.facebookPostId,
              title: postToDelete.title,
              deletedBy: user?.email || 'admin'
            })
          });
          
          console.log('📡 N8N delete response status:', n8nResponse.status);
          
          if (n8nResponse.ok) {
            const n8nResult = await n8nResponse.json();
            
            if (n8nResult.success) {
              console.log('✅ Đã xóa trên Facebook:', n8nResult);
              notifySuccess(`Đã xóa bài viết "${postToDelete.title}" (cả trên Facebook)`);
            } else {
              console.warn('⚠️ Facebook delete failed:', n8nResult);
              notifySuccess(`Đã xóa "${postToDelete.title}" khỏi hệ thống. ${n8nResult.message || 'Không xóa được trên Facebook'}`);
            }
          } else {
            console.error('❌ N8N webhook error:', n8nResponse.status);
            notifySuccess(`Đã xóa "${postToDelete.title}" khỏi hệ thống (n8n error ${n8nResponse.status})`);
          }
        } catch (n8nError) {
          console.error('❌ Lỗi khi gọi n8n:', n8nError);
          console.error('Error details:', {
            name: n8nError.name,
            message: n8nError.message,
            stack: n8nError.stack
          });
          notifySuccess(`Đã xóa "${postToDelete.title}" khỏi hệ thống. ⚠️ Không xóa được trên Facebook (${n8nError.message || 'Network error'})`);
        }
      } else {
        notifySuccess(`Đã xóa bài viết "${postToDelete.title}"`);
      }
      
      // 3. Xóa khỏi state
      console.log('✅ Removing post from state');
      setPosts(posts.filter(p => p._id !== id));
    } catch (error) {
      console.log('🔄 Xóa bài offline mode');
      setPosts(posts.filter(p => p._id !== id));
      notifyError(`Không thể kết nối API khi xóa bài viết`);
    }
  };

  const handleApprove = async (postData) => {
    console.log('✅ Approving post:', postData._id);
    
    try {
      console.log('🌐 Sending approve request to API:', `${API_BASE}/${postData._id}/approve`);
      
      const response = await fetch(`${API_BASE}/${postData._id}/approve`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      console.log('📡 Approve API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Approve API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Approve API Success:', result);
      
      if (result.success) {
        // Cập nhật state với dữ liệu từ API
        const updatedPosts = posts.map(p => 
          p._id === postData._id 
            ? { ...p, status: 'PUBLISHED', approvedAt: new Date().toISOString(), ...result.post }
            : p
        );
        setPosts(updatedPosts);
        setCurrentFilter('PUBLISHED');
        
        notifyPost(postData.title);
      } else {
        throw new Error(result.message || 'Unknown API error');
      }
      
    } catch (error) {
      console.error('❌ Failed to approve via API:', error);
      
      // Fallback: Cập nhật local state
      const updatedPosts = posts.map(p => 
        p._id === postData._id 
          ? { ...p, status: 'PUBLISHED', approvedAt: new Date().toISOString(), isLocalApproved: true }
          : p
      );
      setPosts(updatedPosts);
      setCurrentFilter('PUBLISHED');
      
      notifyError(`Không thể duyệt bài: ${error.message}`);
    }
    
    setShowModal(false);
  };

  const handleCreatePost = async (postData) => {
    console.log('🚀 Creating new post:', postData);
    
    // Tạo payload chuẩn để gửi lên API
    const newPostPayload = {
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image',
      status: 'DRAFT',
      source: 'MANUAL', // Đánh dấu là bài viết tự tạo
      createdAt: new Date().toISOString()
    };

    try {
      console.log('🌐 Attempting to save to API:', API_BASE);
      
      // Gửi lên API server
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newPostPayload)
      });

      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        // Log chi tiết lỗi
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // Parse response
      const responseData = await response.json();
      console.log('✅ API Success:', responseData);
      
      // Cập nhật state với dữ liệu từ API
      setPosts(prev => [responseData, ...prev]);
      setCurrentFilter('DRAFT');
      
      // Thông báo thành công
      notifySuccess(`Đã tạo bài viết "${newPostPayload.title}"`);
      
    } catch (error) {
      console.error('❌ Failed to save to API:', error);
      
      // Fallback: Lưu local với ID tạm
      const localPost = {
        _id: 'local_' + Date.now(),
        ...newPostPayload,
        isLocal: true // Đánh dấu là bài viết local
      };
      
      setPosts(prev => [localPost, ...prev]);
      setCurrentFilter('DRAFT');
      
      // Thông báo fallback
      notifyError(`Không thể kết nối API: ${error.message}`);
    }
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <Navbar />
      
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div className="flex-grow-1">
                <h2 className="fw-bold mb-1 d-flex align-items-center">
                  <i className="bi bi-file-earmark-text text-primary me-2"></i>
                  <span>Quản lý bài viết</span>
                </h2>
                <p className="text-muted mb-0">Duyệt và quản lý nội dung trước khi đăng</p>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                <button 
                  className="btn btn-success d-flex align-items-center justify-content-center" 
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Tạo bài viết
                </button>
                <button 
                  className="btn btn-primary d-flex align-items-center justify-content-center" 
                  onClick={fetchPosts} 
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mb-4 g-3">
          <div className="col-12 col-sm-6 col-lg-4 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body text-white py-3">
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
          
          <div className="col-12 col-sm-6 col-lg-4 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
              <div className="card-body text-white py-3">
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
          
          <div className="col-12 col-sm-6 col-lg-4 mb-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
              <div className="card-body text-white py-3">
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
        </div>

        {/* Filter Tabs */}
        <div className="d-flex justify-content-center mb-4">
          <div className="nav nav-pills bg-white p-1 rounded shadow-sm w-100" style={{maxWidth: '500px'}}>
            <button 
              className={`nav-link flex-fill text-center px-2 px-md-3 ${currentFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('ALL')}
            >
              <span className="d-none d-sm-inline">Tất cả </span>
              <span className="d-sm-none">All </span>
              <span className="badge bg-primary ms-1">{stats.totalPosts}</span>
            </button>
            <button 
              className={`nav-link flex-fill text-center px-2 px-md-3 ${currentFilter === 'DRAFT' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('DRAFT')}
            >
              <span className="d-none d-sm-inline">Chờ duyệt </span>
              <span className="d-sm-none">Chờ </span>
              <span className="badge bg-warning text-dark ms-1">{stats.draftPosts}</span>
            </button>
            <button 
              className={`nav-link flex-fill text-center px-2 px-md-3 ${currentFilter === 'PUBLISHED' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('PUBLISHED')}
            >
              <span className="d-none d-sm-inline">Đã đăng </span>
              <span className="d-sm-none">Đăng </span>
              <span className="badge bg-success ms-1">{stats.publishedPosts}</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="row g-3 g-lg-4 posts-grid">
            {filteredPosts.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">
                <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
                <h5>Không có bài viết nào</h5>
                <p>Chưa có bài viết nào trong danh mục này.</p>
                {currentFilter === 'DRAFT' && (
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Tạo bài viết đầu tiên
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post._id} className="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-3">
                  <PostCard 
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <EditModal
          show={showModal}
          post={editingPost}
          onClose={() => setShowModal(false)}
          onApprove={handleApprove}
        />
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onCreate={handleCreatePost}
        />
      )}
    </div>
  );
};

export default Posts;