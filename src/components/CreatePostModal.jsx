import { useState } from 'react';

const CreatePostModal = ({ show, onHide, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }

    setLoading(true);
    try {
      await onCreate(formData);
      // Reset form
      setFormData({ title: '', content: '', imageUrl: '' });
      setError('');
      onHide();
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', content: '', imageUrl: '' });
    setError('');
    onHide();
  };

  const previewImg = () => {
    const imgPreview = document.getElementById('createImgPreview');
    if (imgPreview) {
      imgPreview.src = formData.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-plus-circle me-2"></i>
              Tạo bài viết mới
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleClose}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="createTitle" className="form-label fw-bold text-secondary small">
                  <i className="bi bi-type me-1"></i>
                  TIÊU ĐỀ *
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="createTitle"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="createContent" className="form-label fw-bold text-secondary small">
                  <i className="bi bi-text-paragraph me-1"></i>
                  NỘI DUNG FACEBOOK *
                </label>
                <textarea
                  className="form-control"
                  id="createContent"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Viết nội dung sẽ được đăng lên Facebook...\n\nBạn có thể thêm emoji 🔥, hashtag #, mention @..."
                  style={{
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '0.9rem',
                    backgroundColor: '#f8f9fa',
                    resize: 'vertical'
                  }}
                  required
                  disabled={loading}
                ></textarea>
                <div className="form-text small">
                  💡 Mẹo: Sử dụng emoji, hashtag và mention để tăng tương tác
                </div>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <label htmlFor="createImage" className="form-label fw-bold text-secondary small">
                    <i className="bi bi-image me-1"></i>
                    LINK ẢNH
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-link-45deg"></i>
                    </span>
                    <input
                      type="url"
                      className="form-control"
                      id="createImage"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        handleChange(e);
                        setTimeout(previewImg, 100);
                      }}
                      placeholder="https://example.com/image.jpg"
                      disabled={loading}
                    />
                  </div>
                  <div className="form-text small">
                    Để trống nếu không có ảnh đi kèm
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary small">
                    <i className="bi bi-eye me-1"></i>
                    PREVIEW
                  </label>
                  <img 
                    id="createImgPreview" 
                    src="https://via.placeholder.com/300x200?text=No+Image" 
                    className="img-fluid rounded border" 
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      backgroundColor: '#f8f9fa'
                    }}
                    alt="Preview"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer bg-light">
              <button 
                type="button" 
                className="btn btn-light text-secondary" 
                onClick={handleClose}
                disabled={loading}
              >
                <i className="bi bi-x-lg me-1"></i>
                Hủy
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4 fw-bold"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    TẠO BÀI VIẾT
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;