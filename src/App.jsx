import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import EditModal from './components/EditModal';

const API_BASE = 'https://api.buiquoctuan.id.vn/api/posts';

function App() {
  const [allPosts, setAllPosts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('DRAFT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Không kết nối được Server');
      const data = await res.json();
      setAllPosts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = async (id, data) => {
    setLoading(true);
    setEditingPost(null); // Close modal immediately
    try {
      const res = await fetch(`${API_BASE}/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (result.success) {
        alert('✅ Đã gửi lệnh đăng thành công!');
        setTimeout(fetchPosts, 3000);
      } else {
        alert('❌ Có lỗi: ' + result.message);
        // Re-open modal if failed? Or just let user try again from list
      }
    } catch (e) {
      alert('Lỗi kết nối: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn bài viết này không?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAllPosts(prev => prev.filter(p => p._id !== id));
      } else {
        alert('Không thể xóa bài viết. Vui lòng thử lại.');
      }
    } catch (e) {
      alert('Lỗi kết nối: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = allPosts
    .filter(p => p.status === currentFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const countDraft = allPosts.filter(p => p.status === 'DRAFT').length;
  const countPub = allPosts.filter(p => p.status === 'PUBLISHED').length;

  return (
    <div className="App">
      <Navbar onRefresh={fetchPosts} />

      <div className="container pb-5">
        <div className="d-flex justify-content-center mb-4">
          <ul className="nav nav-pills bg-white p-1 rounded shadow-sm">
            <li className="nav-item">
              <button 
                className={`nav-link px-4 ${currentFilter === 'DRAFT' ? 'active' : ''}`} 
                onClick={() => setCurrentFilter('DRAFT')}
              >
                Chờ duyệt <span className="badge bg-warning text-dark ms-1">{countDraft}</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link px-4 ${currentFilter === 'PUBLISHED' ? 'active' : ''}`} 
                onClick={() => setCurrentFilter('PUBLISHED')}
              >
                Đã đăng <span className="badge bg-success ms-1">{countPub}</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="row g-4">
          {error ? (
            <div className="col-12 text-center text-danger mt-5">
              <h4><i className="bi bi-wifi-off"></i> Lỗi kết nối</h4>
              <p>{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">Không có bài viết nào.</div>
          ) : (
            filteredPosts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onEdit={setEditingPost} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </div>
      </div>

      <EditModal 
        show={!!editingPost} 
        post={editingPost} 
        onClose={() => setEditingPost(null)} 
        onApprove={handleApprove} 
      />

      {loading && (
        <div className="loading-overlay">
          <div className="text-center">
            <div className="spinner-grow text-primary mb-3" role="status"></div>
            <h5 className="fw-light">Đang xử lý...</h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
