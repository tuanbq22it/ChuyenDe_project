import React, { useState, useEffect } from 'react';

const EditModal = ({ show, post, onClose, onApprove }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        imageUrl: post.imageUrl || ''
      });
    }
  }, [post]);

  if (!show || !post) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleApprove = async () => {
    if (!window.confirm('Xác nhận duyệt và đăng bài này lên Facebook?')) return;
    
    // Tạo postData object hoàn chỉnh với dữ liệu đã chỉnh sửa
    const postData = {
      ...post,
      ...formData
    };
    
    try {
      // Nếu là bài viết tự tạo, trigger n8n workflow
      if (post.source === 'MANUAL' || !post.source) {
        await triggerN8NPublish(post._id, postData);
      }
      
      // Gọi hàm approve trong component cha
      onApprove(postData);
    } catch (error) {
      console.error('Error triggering n8n:', error);
      alert('⚠️ Có lỗi khi kết nối với hệ thống tự động đăng. Bạn có muốn duyệt bài thủ công không?');
      if (window.confirm('Tiếp tục duyệt bài thủ công?')) {
        onApprove(postData);
      }
    }
  };

  // Hàm trigger n8n webhook
  const triggerN8NPublish = async (postId, postData) => {
    const N8N_WEBHOOK_URL = 'http://buiquoctuan.id.vn:5678/webhook/publish-post';
    
    // Payload khớp với workflow hiện có
    const payload = {
      draftId: postId,
      source: 'admin_panel',
      timestamp: new Date().toISOString(),
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl
    };
    
    console.log('🚀 Triggering n8n workflow:', N8N_WEBHOOK_URL);
    console.log('📦 Payload:', payload);
    
    // Trong demo mode, chỉ log và return success
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('🔄 [DEMO MODE] n8n webhook would be triggered');
      alert('🔄 [Demo Mode] n8n webhook sẽ được gọi với URL: ' + N8N_WEBHOOK_URL);
      return true;
    }
    
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`N8N webhook failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.text();
      console.log('✅ N8N workflow triggered successfully:', result);
      
      // Thông báo thành công
      alert('✅ Đã gửi yêu cầu đăng bài đến n8n thành công! Hệ thống sẽ tự động đăng lên Facebook.');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to trigger N8N workflow:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold text-primary">
                <i className="bi bi-pencil-square"></i> Biên tập nội dung
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold text-secondary small">TIÊU ĐỀ</label>
                <input 
                  type="text" 
                  className="form-control fw-bold" 
                  id="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold text-secondary small">NỘI DUNG FACEBOOK</label>
                <textarea 
                  className="form-control" 
                  id="content" 
                  rows="6" 
                  style={{ fontFamily: 'Consolas, monospace', fontSize: '0.9rem', backgroundColor: '#f8f9fa' }}
                  value={formData.content}
                  onChange={handleChange}
                ></textarea>
                <div className="form-text small">Bạn có thể sửa lại lời dẫn, thêm icon 🔥 hoặc hashtag #.</div>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <label className="form-label fw-bold text-secondary small">LINK ẢNH</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-image"></i></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="imageUrl" 
                      value={formData.imageUrl} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <img 
                    src={formData.imageUrl || 'https://via.placeholder.com/400x200'} 
                    className="img-fluid rounded border mt-2" 
                    style={{ maxHeight: '100px', width: '100%', objectFit: 'cover' }}
                    alt="Preview"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-light text-secondary" onClick={onClose}>Hủy</button>
              <button type="button" className="btn btn-success px-4 fw-bold" onClick={handleApprove}>
                <i className="bi bi-send"></i> DUYỆT & ĐĂNG NGAY
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default EditModal;
