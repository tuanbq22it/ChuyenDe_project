import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filterType, setFilterType] = useState('all'); // all, images, videos
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      // Mock media data
      const mockMedia = [
        {
          id: '1',
          name: 'hero-image.jpg',
          type: 'image/jpeg',
          size: 1024000,
          url: 'https://picsum.photos/400/300?random=1',
          uploadedAt: new Date('2025-11-20').toISOString(),
          alt: 'Hero image cho trang chủ',
          tags: ['hero', 'homepage', 'banner']
        },
        {
          id: '2',
          name: 'product-showcase.png',
          type: 'image/png', 
          size: 2048000,
          url: 'https://picsum.photos/400/300?random=2',
          uploadedAt: new Date('2025-11-19').toISOString(),
          alt: 'Sản phẩm nổi bật',
          tags: ['product', 'showcase']
        },
        {
          id: '3',
          name: 'team-photo.jpg',
          type: 'image/jpeg',
          size: 1536000,
          url: 'https://picsum.photos/400/300?random=3',
          uploadedAt: new Date('2025-11-18').toISOString(),
          alt: 'Ảnh team công ty',
          tags: ['team', 'about', 'people']
        },
        {
          id: '4',
          name: 'news-thumbnail.jpg',
          type: 'image/jpeg',
          size: 896000,
          url: 'https://picsum.photos/400/300?random=4',
          uploadedAt: new Date('2025-11-17').toISOString(),
          alt: 'Thumbnail tin tức',
          tags: ['news', 'thumbnail', 'blog']
        },
        {
          id: '5',
          name: 'logo-transparent.png',
          type: 'image/png',
          size: 45000,
          url: 'https://picsum.photos/200/200?random=5',
          uploadedAt: new Date('2025-11-16').toISOString(),
          alt: 'Logo công ty',
          tags: ['logo', 'brand', 'transparent']
        },
        {
          id: '6',
          name: 'background-pattern.svg',
          type: 'image/svg+xml',
          size: 12000,
          url: 'https://picsum.photos/400/300?random=6',
          uploadedAt: new Date('2025-11-15').toISOString(),
          alt: 'Pattern nền trang web',
          tags: ['background', 'pattern', 'design']
        }
      ];
      setMedia(mockMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const newMedia = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        alt: '',
        tags: []
      };
      setMedia(prev => [newMedia, ...prev]);
    });
    
    alert(`✅ Đã upload ${files.length} file thành công!`);
    fileInputRef.current.value = '';
  };

  const handleDeleteMedia = (id) => {
    if (!confirm('⚠️ Bạn có chắc chắn muốn xóa file này?')) return;
    setMedia(media.filter(m => m.id !== id));
    setSelectedFiles(selectedFiles.filter(f => f !== id));
    alert('✅ Đã xóa file thành công!');
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    
    if (!confirm(`⚠️ Bạn có chắc chắn muốn xóa ${selectedFiles.length} file đã chọn?`)) return;
    
    setMediaFiles(mediaFiles.filter(f => !selectedFiles.includes(f.id)));
    setSelectedFiles([]);
  };

  const toggleSelectFile = (id) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const selectAllFiles = () => {
    if (selectedFiles.length === filteredMedia.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredMedia.map(m => m.id));
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('✅ Đã copy link ảnh vào clipboard!');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (type) => {
    if (type.startsWith('image/')) return 'bi-image';
    if (type.startsWith('video/')) return 'bi-camera-video';
    if (type.startsWith('audio/')) return 'bi-music-note';
    return 'bi-file-earmark';
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || 
                       (filterType === 'images' && item.type.startsWith('image/')) ||
                       (filterType === 'videos' && item.type.startsWith('video/'));
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <Navbar />
      
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* Page Header */
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div className="flex-grow-1">
                <h2 className="fw-bold mb-1 d-flex align-items-center">
                  <i className="bi bi-folder2-open text-primary me-2"></i>
                  <span>Media Manager</span>
                </h2>
                <p className="text-muted mb-0">Quản lý hình ảnh và tài nguyên media</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button 
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-cloud-upload me-2"></i>
                  Upload Files
                </button>
                {selectedFiles.length > 0 && (
                  <button 
                    className="btn btn-danger"
                    onClick={handleBulkDelete}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Xóa ({selectedFiles.length})
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*,video/*"
                  className="d-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="row g-3 align-items-center">
                  <div className="col-12 col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-3">
                    <select
                      className="form-select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">Tất cả files</option>
                      <option value="images">Hình ảnh</option>
                      <option value="videos">Video</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-3">
                    <div className="btn-group w-100" role="group">
                      <button
                        className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <i className="bi bi-grid"></i>
                      </button>
                      <button
                        className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <i className="bi bi-list"></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-12 col-md-2">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={selectAllFiles}
                    >
                      <i className="bi bi-check-all me-1"></i>
                      {selectedFiles.length === filteredMedia.length && filteredMedia.length > 0 ? 'Bỏ chọn' : 'Chọn tất cả'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="row mb-4 g-3">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h3 className="fw-bold text-primary mb-1">{media.length}</h3>
                <small className="text-muted">Tổng files</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h3 className="fw-bold text-success mb-1">{media.filter(m => m.type.startsWith('image/')).length}</h3>
                <small className="text-muted">Hình ảnh</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h3 className="fw-bold text-info mb-1">
                  {formatFileSize(media.reduce((sum, m) => sum + m.size, 0))}
                </h3>
                <small className="text-muted">Dung lượng</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-3">
                <h3 className="fw-bold text-warning mb-1">{selectedFiles.length}</h3>
                <small className="text-muted">Đã chọn</small>
              </div>
            </div>
          </div>
        </div>

        {/* Media Grid/List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải media...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-images fs-1 mb-3 d-block text-muted"></i>
            <h5 className="text-muted">Không có file nào</h5>
            <p className="text-muted">
              {searchQuery ? 'Không tìm thấy file nào phù hợp với tìm kiếm.' : 'Hãy upload file đầu tiên.'}
            </p>
            {!searchQuery && (
              <button 
                className="btn btn-primary mt-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="bi bi-cloud-upload me-2"></i>
                Upload Files
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'row g-3' : ''}>
            {viewMode === 'grid' ? (
              filteredMedia.map((file) => (
                <div key={file.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                  <div className={`card h-100 shadow-sm border-0 hover-lift ${selectedFiles.includes(file.id) ? 'border-primary' : ''}`}>
                    <div className="position-relative">
                      <img
                        src={file.url}
                        className="card-img-top"
                        style={{ height: '120px', objectFit: 'cover' }}
                        alt={file.alt || file.name}
                        loading="lazy"
                      />
                      <div className="position-absolute top-0 start-0 m-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleSelectFile(file.id)}
                        />
                      </div>
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className={`badge ${file.type.startsWith('image/') ? 'bg-success' : 'bg-info'}`}>
                          <i className={`${getFileTypeIcon(file.type)} me-1`}></i>
                          {file.type.split('/')[1]?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-2">
                      <h6 className="card-title fw-bold mb-1 text-truncate" style={{fontSize: '0.8rem'}} title={file.name}>
                        {file.name}
                      </h6>
                      <p className="card-text text-muted small mb-2">
                        {formatFileSize(file.size)}
                      </p>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-outline-primary btn-sm flex-grow-1"
                          onClick={() => copyToClipboard(file.url)}
                          title="Copy link"
                        >
                          <i className="bi bi-link"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteMedia(file.id)}
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th width="50">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedFiles.length === filteredMedia.length && filteredMedia.length > 0}
                            onChange={selectAllFiles}
                          />
                        </th>
                        <th>Preview</th>
                        <th>Tên file</th>
                        <th>Loại</th>
                        <th>Kích thước</th>
                        <th>Upload</th>
                        <th width="100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedia.map((file) => (
                        <tr key={file.id} className={selectedFiles.includes(file.id) ? 'table-primary' : ''}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => toggleSelectFile(file.id)}
                            />
                          </td>
                          <td>
                            <img
                              src={file.url}
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              className="rounded"
                              alt={file.alt || file.name}
                              loading="lazy"
                            />
                          </td>
                          <td>
                            <div className="fw-semibold">{file.name}</div>
                            {file.alt && <small className="text-muted">{file.alt}</small>}
                          </td>
                          <td>
                            <span className={`badge ${file.type.startsWith('image/') ? 'bg-success' : 'bg-info'}`}>
                              <i className={`${getFileTypeIcon(file.type)} me-1`}></i>
                              {file.type}
                            </span>
                          </td>
                          <td>{formatFileSize(file.size)}</td>
                          <td>
                            <small className="text-muted">
                              {new Date(file.uploadedAt).toLocaleDateString('vi-VN')}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => copyToClipboard(file.url)}
                                title="Copy link"
                              >
                                <i className="bi bi-link"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteMedia(file.id)}
                                title="Xóa"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;