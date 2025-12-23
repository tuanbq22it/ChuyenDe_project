import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EmailService from '../services/EmailService';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedComments, setSelectedComments] = useState([]);
  const [replyModal, setReplyModal] = useState({ show: false, comment: null });
  const [replyText, setReplyText] = useState('');
  const [keywordModal, setKeywordModal] = useState({ show: false });
  const [newKeyword, setNewKeyword] = useState('');
  const [notifiedComments, setNotifiedComments] = useState(new Set()); // Track đã gửi email
  const [sensitiveKeywords, setSensitiveKeywords] = useState([
    'spam', 'quảng cáo', 'bán hàng', 'mua ngay', 'giảm giá', 'khuyến mãi',
    'link', 'website', 'click', 'tải về', 'download', 'hack', 'crack',
    'fake', 'giả', 'lừa đảo', 'scam', 'virus', 'phishing',
    'sex', 'porn', 'xxx', 'địt', 'đụ', 'chịch', 'fuck', 'shit',
    'đĩ', 'cave', 'gái gọi', 'massage', 'happy ending',
    'cờ bạc', 'casino', 'bet', 'cá cược', 'lô đề', 'xổ số'
  ]);

  useEffect(() => {
    fetchComments();
  }, []);

  // Hàm phát hiện từ khóa nhạy cảm
  const detectSensitiveKeywords = (text) => {
    if (!text) return { hasSensitive: false, detectedKeywords: [] };
    
    const normalizedText = text.toLowerCase().trim();
    const detectedKeywords = [];
    
    sensitiveKeywords.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword);
      }
    });
    
    return {
      hasSensitive: detectedKeywords.length > 0,
      detectedKeywords
    };
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      // Fetch real comments from Facebook API
      const pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID || '732045003335546';
      const token = import.meta.env.VITE_FACEBOOK_PAGE_ACCESS_TOKEN || 'EAAfPYE7egL8BQMLijv4aipXXaImbD0gCo8ozQ7XPpI9VIBw87lkZBEakkB5xPxc8LokpqnCW1C2W6q2FLZAU9aZA7pQOB5vWezBZCAEMULiSbm5rGzaBszrvnyFpU5Rw8LUhP712NR50KZC9ILZCySPxZBFtI5dtZC2NzpqfxIoaXO0mAZB60JiMLBRiFoSKcNkCo8WVU';
      
      console.log('🔗 Đang tải bình luận từ Facebook...');

      if (!token) {
        throw new Error('Facebook Access Token không tìm thấy');
      }

      // Fetch posts first to get their comments
      const postsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,created_time,comments{id,message,from,created_time,like_count}&limit=10&access_token=${token}`
      );
      
      const postsData = await postsResponse.json();
      
      if (postsData.error) {
        throw new Error(`API Error: ${postsData.error.message}`);
      }

      console.log('✅ Dữ liệu bài viết và bình luận:', postsData);

      // Process comments from all posts
      const allComments = [];
      let commentIndex = 0;

      postsData.data?.forEach(post => {
        if (post.comments?.data) {
          post.comments.data.forEach(comment => {
            commentIndex++;
            const keywordCheck = detectSensitiveKeywords(comment.message);
            
            const newComment = {
              id: comment.id,
              author: comment.from?.name || 'Người dùng Facebook',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.from?.name || 'FB User')}&background=1877f2&color=fff`,
              content: comment.message || 'Bình luận không có nội dung',
              postTitle: post.message ? post.message.substring(0, 60) + '...' : 'Bài viết không có tiêu đề',
              status: keywordCheck.hasSensitive ? 'flagged' : 'clean',
              createdAt: comment.created_time,
              platform: 'facebook',
              likes: comment.like_count || 0,
              replies: [],
              postId: post.id,
              originalPost: post.message,
              sensitiveKeywords: keywordCheck.detectedKeywords,
              riskLevel: keywordCheck.detectedKeywords.length > 2 ? 'high' : keywordCheck.detectedKeywords.length > 0 ? 'medium' : 'low'
            };
            
            allComments.push(newComment);
            
            // Gửi email nếu phát hiện bình luận vi phạm (chỉ gửi 1 lần)
            if (keywordCheck.hasSensitive && keywordCheck.detectedKeywords.length > 0) {
              if (!notifiedComments.has(newComment.id)) {
                console.log('⚠️ Phát hiện comment vi phạm, gửi email...');
                EmailService.sendSpamCommentAlert({
                  message: newComment.content,
                  author: newComment.author,
                  postTitle: newComment.postTitle
                })
                  .then(res => {
                    console.log('✅ Email cảnh báo đã gửi:', res);
                    setNotifiedComments(prev => new Set(prev).add(newComment.id));
                  })
                  .catch(err => console.error('❌ Gửi email thất bại:', err));
              } else {
                console.log('ℹ️ Comment này đã gửi email rồi, bỏ qua:', newComment.id);
              }
            }
          });
        }
      });

      // Sort by creation time (newest first)
      allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      console.log('📝 Tổng số bình luận:', allComments.length);

      // If no real comments, show some mock data as fallback
      const mockComments = allComments.length > 0 ? allComments : [
        {
          id: '1',
          author: 'Nguyễn Văn An',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=007bff&color=fff',
          content: 'Bài viết rất hay và bổ ích! Cảm ơn admin đã chia sẻ.',
          postTitle: 'Ronaldo không có bàn thắng nào trong 4 trận gần nhất',
          status: 'approved',
          createdAt: new Date('2025-11-23T10:30:00').toISOString(),
          platform: 'facebook',
          likes: 12,
          replies: []
        },
        {
          id: '2', 
          author: 'Trần Thị Bình',
          avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=28a745&color=fff',
          content: 'Thông tin này có chính xác không? Tôi nghĩ cần kiểm tra lại nguồn.',
          postTitle: 'Lý do nên thêm măng tây vào thực đơn hàng ngày',
          status: 'pending',
          createdAt: new Date('2025-11-23T09:15:00').toISOString(),
          platform: 'facebook',
          likes: 3,
          replies: []
        },
        {
          id: '3',
          author: 'Phạm Minh Cường',
          avatar: 'https://ui-avatars.com/api/?name=Pham+Minh+Cuong&background=dc3545&color=fff',
          content: 'Spam content here... Buy cheap products now! Visit spamlink.com',
          postTitle: 'Nhạc sĩ Nguyễn Văn Chung chia sẻ về âm nhạc',
          status: 'spam',
          createdAt: new Date('2025-11-23T08:45:00').toISOString(),
          platform: 'facebook',
          likes: 0,
          replies: []
        },
        {
          id: '4',
          author: 'Lê Thị Dung',
          avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Dung&background=6f42c1&color=fff',
          content: 'Rất cảm ơn thông tin này! Mình đã áp dụng và thấy hiệu quả rồi 👍',
          postTitle: 'Vietjet vào top "Nơi làm việc tốt nhất châu Á"',
          status: 'approved',
          createdAt: new Date('2025-11-22T16:20:00').toISOString(),
          platform: 'facebook',
          likes: 8,
          replies: [
            {
              id: 'r1',
              author: 'Admin',
              content: 'Cảm ơn bạn đã chia sẻ! Chúng tôi rất vui khi thông tin hữu ích với bạn.',
              createdAt: new Date('2025-11-22T17:00:00').toISOString()
            }
          ]
        },
        {
          id: '5',
          author: 'Hoàng Văn Em',
          avatar: 'https://ui-avatars.com/api/?name=Hoang+Van+Em&background=fd7e14&color=fff',
          content: 'Nội dung không phù hợp và có chứa từ ngữ tiêu cực...',
          postTitle: 'Bài viết chờ duyệt mẫu',
          status: 'rejected',
          createdAt: new Date('2025-11-22T14:10:00').toISOString(),
          platform: 'facebook',
          likes: 1,
          replies: []
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('💥 Lỗi tải bình luận:', error);
      
      // Fallback to mock data if API fails
      const fallbackComments = [
        {
          id: 'fb_fallback_1',
          author: 'Nguyễn Văn An',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=1877f2&color=fff',
          content: 'Bài viết rất hay và bổ ích! Cảm ơn admin đã chia sẻ.',
          postTitle: 'Dữ liệu mẫu - Không thể kết nối Facebook API',
          status: 'approved',
          createdAt: new Date().toISOString(),
          platform: 'facebook',
          likes: 5,
          replies: []
        }
      ];
      setComments(fallbackComments);
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSafe = (commentId) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { 
        ...comment, 
        status: 'clean',
        riskLevel: 'low',
        sensitiveKeywords: []
      } : comment
    ));
    alert('✅ Đã đánh dấu an toàn!');
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      alert('⚠️ Vui lòng nhập từ khóa!');
      return;
    }
    
    if (sensitiveKeywords.includes(newKeyword.toLowerCase().trim())) {
      alert('⚠️ Từ khóa này đã tồn tại!');
      return;
    }
    
    setSensitiveKeywords(prev => [...prev, newKeyword.toLowerCase().trim()]);
    setNewKeyword('');
    alert('✅ Đã thêm từ khóa mới!');
  };

  const handleRemoveKeyword = (keyword) => {
    if (!confirm(`⚠️ Xóa từ khóa "${keyword}"?`)) return;
    setSensitiveKeywords(prev => prev.filter(k => k !== keyword));
    alert('✅ Đã xóa từ khóa!');
    
    // Re-check all comments
    setComments(prev => prev.map(comment => {
      const newCheck = detectSensitiveKeywords(comment.content);
      return {
        ...comment,
        status: newCheck.hasSensitive ? 'flagged' : 'clean',
        sensitiveKeywords: newCheck.detectedKeywords,
        riskLevel: newCheck.detectedKeywords.length > 2 ? 'high' : 
                   newCheck.detectedKeywords.length > 0 ? 'medium' : 'low'
      };
    }));
  };

  const handleDelete = (commentId) => {
    if (!confirm('⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn bình luận này?')) return;
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setSelectedComments(prev => prev.filter(id => id !== commentId));
    alert('✅ Đã xóa bình luận!');
  };

  const handleReply = () => {
    if (!replyText.trim()) {
      alert('⚠️ Vui lòng nhập nội dung phản hồi!');
      return;
    }

    const newReply = {
      id: 'r' + Date.now(),
      author: 'Admin',
      content: replyText,
      createdAt: new Date().toISOString()
    };

    setComments(prev => prev.map(comment =>
      comment.id === replyModal.comment.id
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    ));

    setReplyModal({ show: false, comment: null });
    setReplyText('');
    alert('✅ Đã gửi phản hồi!');
  };

  const handleBulkAction = (action) => {
    if (selectedComments.length === 0) {
      alert('⚠️ Vui lòng chọn ít nhất một bình luận!');
      return;
    }

    switch (action) {
      case 'approve':
        setComments(prev => prev.map(comment =>
          selectedComments.includes(comment.id) ? { ...comment, status: 'approved' } : comment
        ));
        alert(`✅ Đã duyệt ${selectedComments.length} bình luận!`);
        break;
      case 'reject':
        if (!confirm(`⚠️ Từ chối ${selectedComments.length} bình luận đã chọn?`)) return;
        setComments(prev => prev.map(comment =>
          selectedComments.includes(comment.id) ? { ...comment, status: 'rejected' } : comment
        ));
        alert(`✅ Đã từ chối ${selectedComments.length} bình luận!`);
        break;
      case 'spam':
        if (!confirm(`⚠️ Đánh dấu ${selectedComments.length} bình luận là spam?`)) return;
        setComments(prev => prev.map(comment =>
          selectedComments.includes(comment.id) ? { ...comment, status: 'spam' } : comment
        ));
        alert(`✅ Đã đánh dấu ${selectedComments.length} bình luận là spam!`);
        break;
      case 'delete':
        if (!confirm(`⚠️ Xóa vĩnh viễn ${selectedComments.length} bình luận?`)) return;
        setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)));
        alert(`✅ Đã xóa ${selectedComments.length} bình luận!`);
        break;
    }
    setSelectedComments([]);
  };

  const toggleSelectComment = (commentId) => {
    setSelectedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const selectAllComments = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map(c => c.id));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { class: 'bg-success', text: 'Đã duyệt', icon: 'bi-check-circle' },
      pending: { class: 'bg-warning', text: 'Chờ duyệt', icon: 'bi-clock' },
      rejected: { class: 'bg-danger', text: 'Từ chối', icon: 'bi-x-circle' },
      spam: { class: 'bg-dark', text: 'Spam', icon: 'bi-shield-exclamation' }
    };
    return badges[status] || badges.pending;
  };

  const filteredComments = comments.filter(comment => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'flagged') return comment.status === 'flagged';
    if (currentFilter === 'clean') return comment.status === 'clean';
    if (currentFilter === 'high-risk') return comment.riskLevel === 'high';
    if (currentFilter === 'medium-risk') return comment.riskLevel === 'medium';
    return comment.status === currentFilter;
  });

  const stats = {
    total: comments.length,
    clean: comments.filter(c => c.status === 'clean').length,
    flagged: comments.filter(c => c.status === 'flagged').length,
    highRisk: comments.filter(c => c.riskLevel === 'high').length,
    mediumRisk: comments.filter(c => c.riskLevel === 'medium').length,
    keywords: sensitiveKeywords.length
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <Navbar />
      
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* Facebook Comments Stats */}
        <div className="alert alert-primary border-0 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-facebook me-2"></i>
            <div className="flex-grow-1">
              <small className="fw-bold">🛡️ Bộ lọc từ khóa nhạy cảm Facebook</small>
              <div className="small text-muted">
                Tổng số: <strong>{comments.length}</strong> • 
                An toàn: <strong>{comments.filter(c => c.status === 'clean').length}</strong> • 
                Cảnh báo: <strong>{comments.filter(c => c.status === 'flagged').length}</strong> • 
                Từ khóa: <strong>{sensitiveKeywords.length}</strong>
              </div>
            </div>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={fetchComments}
              disabled={loading}
            >
              {loading ? (
                <><i className="spinner-border spinner-border-sm me-1"></i>Đang tải...</>
              ) : (
                <><i className="bi bi-arrow-clockwise me-1"></i>Làm mới</>
              )}
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div className="flex-grow-1">
                <h2 className="fw-bold mb-1 d-flex align-items-center">
                  <i className="bi bi-shield-exclamation text-primary me-2"></i>
                  <span>Bộ lọc từ khóa nhạy cảm</span>
                  <span className="badge bg-warning ms-2 small">
                    <i className="bi bi-cpu me-1"></i>
                    Tự động
                  </span>
                </h2>
                <p className="text-muted mb-0">Phát hiện và lọc bình luận có nội dung nhạy cảm trên Facebook</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setKeywordModal({ show: true })}
                >
                  <i className="bi bi-gear me-1"></i>
                  Quản lý từ khóa ({sensitiveKeywords.length})
                </button>
                {selectedComments.length > 0 && (
                  <>
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleBulkAction('clean')}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Đánh dấu an toàn ({selectedComments.length})
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleBulkAction('reject')}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Từ chối
                    </button>
                    <button 
                      className="btn btn-dark btn-sm"
                      onClick={() => handleBulkAction('spam')}
                    >
                      <i className="bi bi-shield-exclamation me-1"></i>
                      Spam
                    </button>
                  </>
                )}
                <button 
                  className="btn btn-outline-secondary"
                  onClick={fetchComments}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4 g-3">
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h4 className="fw-bold text-primary mb-1">{stats.total}</h4>
                <small className="text-muted">Tổng cộng</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h4 className="fw-bold text-success mb-1">{stats.clean}</h4>
                <small className="text-muted">An toàn</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h4 className="fw-bold text-warning mb-1">{stats.flagged}</h4>
                <small className="text-muted">Cảnh báo</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h4 className="fw-bold text-danger mb-1">{stats.highRisk}</h4>
                <small className="text-muted">Nguy cơ cao</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h4 className="fw-bold text-info mb-1">{stats.keywords}</h4>
                <small className="text-muted">Từ khóa</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h4 className="fw-bold text-info mb-1">{selectedComments.length}</h4>
                <small className="text-muted">Đã chọn</small>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            {[
              { key: 'all', label: 'Tất cả', count: stats.total },
              { key: 'clean', label: 'An toàn', count: stats.clean },
              { key: 'flagged', label: 'Cảnh báo', count: stats.flagged },
              { key: 'high-risk', label: 'Nguy cơ cao', count: stats.highRisk },
              { key: 'medium-risk', label: 'Nguy cơ vừa', count: stats.mediumRisk }
            ].map(filter => (
              <button
                key={filter.key}
                className={`btn ${currentFilter === filter.key ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setCurrentFilter(filter.key)}
              >
                {filter.label}
                <span className="badge bg-white text-primary ms-1">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải bình luận...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-chat-square fs-1 mb-3 d-block text-muted"></i>
            <h5 className="text-muted">Không có bình luận nào</h5>
            <p className="text-muted">Chưa có bình luận nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
                        onChange={selectAllComments}
                      />
                      <label className="form-check-label fw-bold">
                        Chọn tất cả ({filteredComments.length})
                      </label>
                    </div>
                    {selectedComments.length > 0 && (
                      <small className="text-muted">
                        Đã chọn {selectedComments.length} bình luận
                      </small>
                    )}
                  </div>
                </div>
                <div className="list-group list-group-flush">
                  {filteredComments.map((comment) => {
                    const status = getStatusBadge(comment.status);
                    return (
                      <div 
                        key={comment.id} 
                        className={`list-group-item ${selectedComments.includes(comment.id) ? 'bg-light' : ''}`}
                      >
                        <div className="d-flex align-items-start">
                          <div className="form-check me-3 mt-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedComments.includes(comment.id)}
                              onChange={() => toggleSelectComment(comment.id)}
                            />
                          </div>
                          
                          <img
                            src={comment.avatar}
                            className="rounded-circle me-3"
                            style={{ width: '48px', height: '48px' }}
                            alt={comment.author}
                          />
                          
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <div>
                                <h6 className="fw-bold mb-1">{comment.author}</h6>
                                <small className="text-muted">
                                  <i className="bi bi-facebook me-1"></i>
                                  Facebook • {new Date(comment.createdAt).toLocaleString('vi-VN')}
                                </small>
                              </div>
                              <span className={`badge ${status.class}`}>
                                <i className={`${status.icon} me-1`}></i>
                                {status.text}
                              </span>
                            </div>
                            
                            <p className="mb-2">{comment.content}</p>
                            
                            <div className="small text-muted mb-3">
                              <i className="bi bi-file-earmark-text me-1"></i>
                              Bài viết: <span className="fw-semibold">{comment.postTitle}</span>
                            </div>

                            {comment.replies.length > 0 && (
                              <div className="border-start border-3 border-primary ps-3 mb-3">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="bg-light p-2 rounded mb-2">
                                    <div className="d-flex align-items-center mb-1">
                                      <strong className="text-primary me-2">{reply.author}</strong>
                                      <small className="text-muted">
                                        {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                      </small>
                                    </div>
                                    <p className="mb-0 small">{reply.content}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Sensitive Keywords Alert */}
                            {comment.status === 'flagged' && comment.sensitiveKeywords && comment.sensitiveKeywords.length > 0 && (
                              <div className={`alert ${comment.riskLevel === 'high' ? 'alert-danger' : 'alert-warning'} py-2 mb-2`}>
                                <small>
                                  <i className="bi bi-exclamation-triangle me-1"></i>
                                  <strong>Phát hiện từ khóa nhạy cảm:</strong> 
                                  {comment.sensitiveKeywords.map((keyword, idx) => (
                                    <span key={idx} className={`badge ${comment.riskLevel === 'high' ? 'bg-danger' : 'bg-warning'} ms-1`}>
                                      {keyword}
                                    </span>
                                  ))}
                                </small>
                              </div>
                            )}

                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-3">
                                <small className="text-muted">
                                  <i className="bi bi-heart me-1"></i>
                                  {comment.likes} lượt thích
                                </small>
                                <small className="text-muted">
                                  <i className="bi bi-chat me-1"></i>
                                  {comment.replies.length} phản hồi
                                </small>
                                <span className={`badge ${
                                  comment.status === 'clean' ? 'bg-success' : 
                                  comment.riskLevel === 'high' ? 'bg-danger' : 'bg-warning'
                                }`}>
                                  {comment.status === 'clean' ? '✅ An toàn' : 
                                   comment.riskLevel === 'high' ? '🚨 Nguy cơ cao' : '⚠️ Cảnh báo'}
                                </span>
                              </div>
                              
                              <div className="btn-group btn-group-sm" role="group">
                                {comment.status === 'flagged' && (
                                  <>
                                    <button
                                      className="btn btn-outline-success"
                                      onClick={() => handleMarkSafe(comment.id)}
                                      title="Đánh dấu an toàn"
                                    >
                                      <i className="bi bi-shield-check"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger"
                                      onClick={() => handleDelete(comment.id)}
                                      title="Xóa bình luận"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </>
                                )}
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => setReplyModal({ show: true, comment })}
                                  title="Phản hồi"
                                >
                                  <i className="bi bi-reply"></i>
                                </button>
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => handleMarkSpam(comment.id)}
                                  title="Đánh dấu spam"
                                >
                                  <i className="bi bi-shield-exclamation"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(comment.id)}
                                  title="Xóa"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {replyModal.show && (
          <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      <i className="bi bi-reply text-primary me-2"></i>
                      Phản hồi bình luận
                    </h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setReplyModal({ show: false, comment: null })}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="bg-light p-3 rounded mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={replyModal.comment?.avatar}
                          className="rounded-circle me-2"
                          style={{ width: '32px', height: '32px' }}
                          alt={replyModal.comment?.author}
                        />
                        <strong>{replyModal.comment?.author}</strong>
                      </div>
                      <p className="mb-0 small">{replyModal.comment?.content}</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Nội dung phản hồi:</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập phản hồi của bạn..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-light"
                      onClick={() => setReplyModal({ show: false, comment: null })}
                    >
                      Hủy
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleReply}
                    >
                      <i className="bi bi-send me-1"></i>
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}

        {/* Keyword Management Modal */}
        {keywordModal.show && (
          <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      <i className="bi bi-gear text-primary me-2"></i>
                      Quản lý từ khóa nhạy cảm
                    </h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setKeywordModal({ show: false })}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* Add New Keyword */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">Thêm từ khóa mới:</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Nhập từ khóa nhạy cảm..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        />
                        <button 
                          className="btn btn-primary"
                          onClick={handleAddKeyword}
                        >
                          <i className="bi bi-plus me-1"></i>
                          Thêm
                        </button>
                      </div>
                    </div>

                    {/* Keywords List */}
                    <div>
                      <label className="form-label fw-bold">
                        Danh sách từ khóa ({sensitiveKeywords.length}):
                      </label>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {sensitiveKeywords.map((keyword, index) => (
                          <div key={index} className="d-flex align-items-center justify-content-between border-bottom py-2">
                            <span className="badge bg-warning">{keyword}</span>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemoveKeyword(keyword)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="alert alert-info mt-3">
                      <small>
                        <i className="bi bi-info-circle me-1"></i>
                        <strong>Thống kê:</strong> Có {stats.flagged} bình luận được phát hiện có từ khóa nhạy cảm
                      </small>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-light"
                      onClick={() => setKeywordModal({ show: false })}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;