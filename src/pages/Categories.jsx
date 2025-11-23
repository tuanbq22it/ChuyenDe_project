import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff',
    icon: 'bi-folder'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Mock data cho demo
      const mockCategories = [
        {
          _id: '1',
          name: 'Thể thao',
          description: 'Tin tức bóng đá, thể thao trong nước và quốc tế',
          color: '#28a745',
          icon: 'bi-trophy',
          postCount: 15,
          createdAt: new Date('2025-11-20').toISOString()
        },
        {
          _id: '2', 
          name: 'Sức khỏe',
          description: 'Mẹo sức khỏe, dinh dưỡng và lối sống lành mạnh',
          color: '#17a2b8',
          icon: 'bi-heart-pulse',
          postCount: 8,
          createdAt: new Date('2025-11-19').toISOString()
        },
        {
          _id: '3',
          name: 'Công nghệ',
          description: 'Công nghệ mới, thiết bị điện tử và xu hướng tech',
          color: '#6f42c1',
          icon: 'bi-cpu',
          postCount: 12,
          createdAt: new Date('2025-11-18').toISOString()
        },
        {
          _id: '4',
          name: 'Du lịch',
          description: 'Địa điểm du lịch, kinh nghiệm và gợi ý chuyến đi',
          color: '#fd7e14',
          icon: 'bi-geo-alt',
          postCount: 6,
          createdAt: new Date('2025-11-17').toISOString()
        }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      handleUpdateCategory();
    } else {
      handleCreateCategory();
    }
  };

  const handleCreateCategory = () => {
    const newCategory = {
      _id: Date.now().toString(),
      ...formData,
      postCount: 0,
      createdAt: new Date().toISOString()
    };
    setCategories(prev => [newCategory, ...prev]);
    resetForm();
    alert('✅ Tạo danh mục thành công!');
  };

  const handleUpdateCategory = () => {
    const updatedCategories = categories.map(cat =>
      cat._id === editingCategory._id ? { ...cat, ...formData } : cat
    );
    setCategories(updatedCategories);
    resetForm();
    alert('✅ Cập nhật danh mục thành công!');
  };

  const handleDeleteCategory = (id) => {
    if (!confirm('⚠️ Xóa danh mục này sẽ ảnh hưởng đến các bài viết. Bạn có chắc chắn?')) return;
    setCategories(categories.filter(cat => cat._id !== id));
    alert('✅ Đã xóa danh mục!');
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#007bff',
      icon: 'bi-folder'
    });
    setEditingCategory(null);
    setShowCreateModal(false);
  };

  const iconOptions = [
    'bi-folder', 'bi-trophy', 'bi-heart-pulse', 'bi-cpu', 'bi-geo-alt',
    'bi-book', 'bi-camera', 'bi-music-note', 'bi-palette', 'bi-shopping-bag',
    'bi-house', 'bi-car-front', 'bi-airplane', 'bi-phone', 'bi-laptop'
  ];

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <Navbar />
      
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* Demo Mode Alert */}
        <div className="alert alert-info border-0 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2"></i>
            <div className="flex-grow-1">
              <small className="fw-bold">Chế độ Demo - Categories Management</small>
              <div className="small text-muted">
                Quản lý danh mục bài viết: Tạo, chỉnh sửa và phân loại nội dung một cách có hệ thống.
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div className="flex-grow-1">
                <h2 className="fw-bold mb-1 d-flex align-items-center">
                  <i className="bi bi-folder-fill text-primary me-2"></i>
                  <span>Quản lý danh mục</span>
                  <span className="badge bg-secondary ms-2 small">
                    <i className="bi bi-wifi-off me-1"></i>
                    Demo Mode
                  </span>
                </h2>
                <p className="text-muted mb-0">Tạo và quản lý danh mục để phân loại bài viết</p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary d-flex align-items-center justify-content-center" 
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Tạo danh mục mới
                </button>
                <button 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center" 
                  onClick={fetchCategories} 
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4 g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Tổng danh mục</h6>
                    <h3 className="fw-bold mb-0">{categories.length}</h3>
                  </div>
                  <i className="bi bi-folder2-open fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
              <div className="card-body text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Tổng bài viết</h6>
                    <h3 className="fw-bold mb-0">{categories.reduce((sum, cat) => sum + cat.postCount, 0)}</h3>
                  </div>
                  <i className="bi bi-file-earmark-text fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
              <div className="card-body text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Phổ biến nhất</h6>
                    <h3 className="fw-bold mb-0 text-truncate" style={{fontSize: '1.2rem'}}>
                      {categories.length > 0 ? categories.reduce((max, cat) => cat.postCount > max.postCount ? cat : max, categories[0])?.name : 'N/A'}
                    </h3>
                  </div>
                  <i className="bi bi-star-fill fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
              <div className="card-body text-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase fw-bold opacity-75 mb-1 small">Mới nhất</h6>
                    <h3 className="fw-bold mb-0 text-truncate" style={{fontSize: '1.2rem'}}>
                      {categories.length > 0 ? categories[0]?.name : 'N/A'}
                    </h3>
                  </div>
                  <i className="bi bi-clock-history fs-2 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải danh mục...</p>
          </div>
        ) : (
          <div className="row g-3 g-lg-4">
            {categories.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">
                <i className="bi bi-folder-x fs-1 mb-3 d-block"></i>
                <h5>Chưa có danh mục nào</h5>
                <p>Hãy tạo danh mục đầu tiên để phân loại bài viết.</p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Tạo danh mục đầu tiên
                </button>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="card h-100 shadow-sm border-0 hover-lift">
                    <div className="card-body">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            backgroundColor: category.color,
                            width: '50px',
                            height: '50px'
                          }}
                        >
                          <i className={`${category.icon} text-white fs-4`}></i>
                        </div>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => handleEditCategory(category)}
                              >
                                <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteCategory(category._id)}
                              >
                                <i className="bi bi-trash me-2"></i>Xóa danh mục
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <h5 className="fw-bold mb-2">{category.name}</h5>
                      <p className="text-muted small mb-3 lh-sm">
                        {category.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center text-muted small">
                          <i className="bi bi-file-earmark-text me-1"></i>
                          <span>{category.postCount} bài viết</span>
                        </div>
                        <small className="text-muted">
                          {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title fw-bold">
                        <i className="bi bi-folder-plus text-primary me-2"></i>
                        {editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
                      </h5>
                      <button type="button" className="btn-close" onClick={resetForm}></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Tên danh mục *</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="VD: Thể thao, Công nghệ..."
                          required 
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Mô tả</label>
                        <textarea 
                          className="form-control" 
                          rows="3"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Mô tả ngắn về danh mục này..."
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Màu sắc</label>
                          <input 
                            type="color" 
                            className="form-control form-control-color" 
                            value={formData.color}
                            onChange={(e) => setFormData({...formData, color: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Icon</label>
                          <select 
                            className="form-select"
                            value={formData.icon}
                            onChange={(e) => setFormData({...formData, icon: e.target.value})}
                          >
                            {iconOptions.map(icon => (
                              <option key={icon} value={icon}>
                                {icon.replace('bi-', '')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 p-3 border rounded bg-light">
                        <label className="form-label small fw-bold text-muted">XEM TRƯỚC:</label>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              backgroundColor: formData.color,
                              width: '40px',
                              height: '40px'
                            }}
                          >
                            <i className={`${formData.icon} text-white`}></i>
                          </div>
                          <div>
                            <div className="fw-bold">{formData.name || 'Tên danh mục'}</div>
                            <small className="text-muted">{formData.description || 'Mô tả danh mục'}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-light" onClick={resetForm}>
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-check-circle me-1"></i>
                        {editingCategory ? 'Cập nhật' : 'Tạo danh mục'}
                      </button>
                    </div>
                  </form>
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

export default Categories;