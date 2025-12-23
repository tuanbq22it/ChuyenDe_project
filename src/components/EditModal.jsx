import React, { useState, useEffect } from 'react';
import EmailService from '../services/EmailService';

const EditModal = ({ show, post, onClose, onApprove }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });
  const [isApproving, setIsApproving] = useState(false);

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
    if (isApproving) {
      console.warn('⚠️ Already approving, please wait...');
      return;
    }
    
    if (!window.confirm('Xác nhận duyệt và đăng bài này lên Facebook?')) return;
    
    setIsApproving(true);
    
    // Tạo postData object hoàn chỉnh với dữ liệu đã chỉnh sửa
    const postData = {
      ...post,
      ...formData
    };
    
    try {
      // Trigger n8n workflow - n8n sẽ tự động đăng lên Facebook và gọi approve API
      await triggerN8NPublish(post._id, postData);
      
      // N8n workflow sẽ xử lý việc approve trong database
      // Không cần gọi onApprove ở đây để tránh đăng 2 lần
      
      // Đóng modal và refresh danh sách
      onClose();
      
      // Sau 2 giây reload để lấy dữ liệu mới từ API
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error triggering n8n:', error);
      alert('⚠️ Có lỗi khi kết nối với hệ thống tự động đăng. Bạn có muốn duyệt bài thủ công không?');
      if (window.confirm('Tiếp tục duyệt bài thủ công?')) {
        // Nếu n8n lỗi, gọi approve API trực tiếp
        onApprove(postData);
      }
    } finally {
      setIsApproving(false);
    }
  };

  // Hàm trigger n8n webhook
  const triggerN8NPublish = async (postId, postData) => {
    // Force HTTPS - không dùng env variable để tránh cache HTTP cũ
    const N8N_WEBHOOK_URL = 'https://buiquoctuan.id.vn/webhook/publish-post';
    
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
    
    // Tạm thời tắt demo mode để test webhook thật
    // if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    //   console.log('🔄 [DEMO MODE] n8n webhook would be triggered');
    //   alert('🔄 [Demo Mode] n8n webhook sẽ được gọi với URL: ' + N8N_WEBHOOK_URL);
    //   return true;
    // }
    
    try {
      console.log('🌐 Making fetch request to:', N8N_WEBHOOK_URL);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ N8N returned error:', errorText);
        throw new Error(`N8N webhook failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.text();
      console.log('✅ N8N workflow triggered successfully:', result);
      
      // Gửi email notification
      console.log('📧 Sending email notification...');
      EmailService.sendPostPublishedEmail({
        title: payload.title,
        content: payload.content,
        imageUrl: payload.imageUrl,
        facebookPostId: null // Will be updated by n8n
      })
        .then(res => console.log('✅ Email sent successfully:', res))
        .catch(err => console.error('❌ Email notification failed:', err));
      
      // Thông báo thành công
      alert('✅ Đã gửi yêu cầu đăng bài đến n8n thành công! Hệ thống sẽ tự động đăng lên Facebook.');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to trigger N8N workflow:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
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
              <button type="button" className="btn btn-light text-secondary" onClick={onClose} disabled={isApproving}>
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-success px-4 fw-bold" 
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send"></i> DUYỆT & ĐĂNG NGAY
                  </>
                )}
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
