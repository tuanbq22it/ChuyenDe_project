import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      avatar: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReport: true,
      newComments: true,
      systemUpdates: false
    },
    appearance: {
      theme: 'light',
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      dateFormat: 'dd/mm/yyyy'
    },
    system: {
      autoBackup: true,
      backupFrequency: 'weekly',
      maxFileSize: '10',
      allowedFileTypes: ['jpg', 'png', 'gif', 'pdf', 'docx']
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user settings
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          bio: user.bio || '',
          avatar: user.avatar || ''
        }
      }));
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context
      if (updateUser) {
        updateUser({
          ...user,
          ...settings.profile
        });
      }
      
      alert('✅ Đã cập nhật thông tin cá nhân thành công!');
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify(settings.notifications));
    alert('✅ Đã lưu cài đặt thông báo!');
  };

  const handleSaveAppearance = () => {
    localStorage.setItem('appearance', JSON.stringify(settings.appearance));
    alert('✅ Đã lưu cài đặt giao diện!');
  };

  const handleSaveSystem = () => {
    localStorage.setItem('systemSettings', JSON.stringify(settings.system));
    alert('✅ Đã lưu cài đặt hệ thống!');
  };

  const handleExportData = () => {
    const exportData = {
      posts: JSON.parse(localStorage.getItem('posts') || '[]'),
      settings: settings,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-panel-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('✅ Đã xuất dữ liệu thành công!');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.posts) {
          localStorage.setItem('posts', JSON.stringify(data.posts));
        }
        if (data.settings) {
          setSettings(data.settings);
        }
        alert('✅ Đã nhập dữ liệu thành công! Vui lòng tải lại trang.');
      } catch (error) {
        alert('❌ File không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', name: 'Thông tin cá nhân', icon: 'bi-person' },
    { id: 'notifications', name: 'Thông báo', icon: 'bi-bell' },
    { id: 'appearance', name: 'Giao diện', icon: 'bi-palette' },
    { id: 'system', name: 'Hệ thống', icon: 'bi-gear' }
  ];

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <Navbar />
      
      <div className="container-fluid px-3 px-md-4 py-4">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold mb-1 d-flex align-items-center">
              <i className="bi bi-sliders text-primary me-2"></i>
              <span>Cài đặt hệ thống</span>
            </h2>
            <p className="text-muted mb-0">Quản lý cài đặt và tùy chọn cá nhân</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-12 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`${tab.icon} me-3`}></i>
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-12 col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h5 className="fw-bold mb-4">
                      <i className="bi bi-person text-primary me-2"></i>
                      Thông tin cá nhân
                    </h5>
                    <form onSubmit={handleSaveProfile}>
                      <div className="row g-3">
                        <div className="col-12 text-center mb-4">
                          <div className="position-relative d-inline-block">
                            <img
                              src={settings.profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.profile.name)}&background=007bff&color=fff&size=128`}
                              className="rounded-circle border border-3 border-primary"
                              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                              alt="Avatar"
                            />
                            <button
                              type="button"
                              className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0"
                              style={{ width: '32px', height: '32px' }}
                            >
                              <i className="bi bi-camera"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Họ và tên *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settings.profile.name}
                            onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            value={settings.profile.email}
                            onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Số điện thoại</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={settings.profile.phone}
                            onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                          />
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Link Avatar</label>
                          <input
                            type="url"
                            className="form-control"
                            value={settings.profile.avatar}
                            onChange={(e) => updateSetting('profile', 'avatar', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        
                        <div className="col-12">
                          <label className="form-label fw-bold">Giới thiệu bản thân</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={settings.profile.bio}
                            onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                            placeholder="Viết vài dòng về bản thân..."
                          ></textarea>
                        </div>
                        
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Đang lưu...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>
                                Lưu thông tin
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h5 className="fw-bold mb-4">
                      <i className="bi bi-bell text-primary me-2"></i>
                      Cài đặt thông báo
                    </h5>
                    
                    <div className="row g-4">
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary">Thông báo qua Email</h6>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                          />
                          <label className="form-check-label">
                            Nhận thông báo qua email
                          </label>
                        </div>
                        
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.notifications.weeklyReport}
                            onChange={(e) => updateSetting('notifications', 'weeklyReport', e.target.checked)}
                          />
                          <label className="form-check-label">
                            Báo cáo hàng tuần
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary">Hoạt động</h6>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.notifications.newComments}
                            onChange={(e) => updateSetting('notifications', 'newComments', e.target.checked)}
                          />
                          <label className="form-check-label">
                            Thông báo bình luận mới
                          </label>
                        </div>
                        
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.notifications.systemUpdates}
                            onChange={(e) => updateSetting('notifications', 'systemUpdates', e.target.checked)}
                          />
                          <label className="form-check-label">
                            Cập nhật hệ thống
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <button className="btn btn-primary" onClick={handleSaveNotifications}>
                          <i className="bi bi-check-circle me-2"></i>
                          Lưu cài đặt thông báo
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h5 className="fw-bold mb-4">
                      <i className="bi bi-palette text-primary me-2"></i>
                      Giao diện & Hiển thị
                    </h5>
                    
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Chủ đề</label>
                        <select
                          className="form-select"
                          value={settings.appearance.theme}
                          onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                        >
                          <option value="light">Sáng (Light)</option>
                          <option value="dark">Tối (Dark)</option>
                          <option value="auto">Tự động</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Ngôn ngữ</label>
                        <select
                          className="form-select"
                          value={settings.appearance.language}
                          onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Múi giờ</label>
                        <select
                          className="form-select"
                          value={settings.appearance.timezone}
                          onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                        >
                          <option value="Asia/Ho_Chi_Minh">GMT+7 (Việt Nam)</option>
                          <option value="Asia/Bangkok">GMT+7 (Bangkok)</option>
                          <option value="UTC">GMT+0 (UTC)</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Định dạng ngày</label>
                        <select
                          className="form-select"
                          value={settings.appearance.dateFormat}
                          onChange={(e) => updateSetting('appearance', 'dateFormat', e.target.value)}
                        >
                          <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                          <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                          <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                        </select>
                      </div>
                      
                      <div className="col-12">
                        <button className="btn btn-primary" onClick={handleSaveAppearance}>
                          <i className="bi bi-check-circle me-2"></i>
                          Lưu cài đặt giao diện
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                  <div>
                    <h5 className="fw-bold mb-4">
                      <i className="bi bi-gear text-primary me-2"></i>
                      Cài đặt hệ thống
                    </h5>
                    
                    <div className="row g-4">
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary">Sao lưu dữ liệu</h6>
                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.system.autoBackup}
                                onChange={(e) => updateSetting('system', 'autoBackup', e.target.checked)}
                              />
                              <label className="form-check-label">
                                Tự động sao lưu
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <select
                              className="form-select"
                              value={settings.system.backupFrequency}
                              onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)}
                              disabled={!settings.system.autoBackup}
                            >
                              <option value="daily">Hàng ngày</option>
                              <option value="weekly">Hàng tuần</option>
                              <option value="monthly">Hàng tháng</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2 mb-4">
                          <button className="btn btn-outline-primary" onClick={handleExportData}>
                            <i className="bi bi-download me-2"></i>
                            Xuất dữ liệu
                          </button>
                          <label className="btn btn-outline-secondary">
                            <i className="bi bi-upload me-2"></i>
                            Nhập dữ liệu
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportData}
                              className="d-none"
                            />
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary">Upload Files</h6>
                        <div className="row g-3 mb-4">
                          <div className="col-md-6">
                            <label className="form-label">Kích thước tối đa (MB)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.system.maxFileSize}
                              onChange={(e) => updateSetting('system', 'maxFileSize', e.target.value)}
                              min="1"
                              max="100"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Định dạng cho phép</label>
                            <input
                              type="text"
                              className="form-control"
                              value={settings.system.allowedFileTypes.join(', ')}
                              onChange={(e) => updateSetting('system', 'allowedFileTypes', e.target.value.split(', '))}
                              placeholder="jpg, png, gif, pdf"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <button className="btn btn-primary" onClick={handleSaveSystem}>
                          <i className="bi bi-check-circle me-2"></i>
                          Lưu cài đặt hệ thống
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;