import React, { useState, useEffect } from 'react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Mock notifications
    const mockNotifications = [
      {
        id: '1',
        type: 'comment',
        title: 'Bình luận mới',
        message: 'Nguyễn Văn An đã bình luận',
        time: new Date(Date.now() - 300000).toISOString(),
        read: false,
        icon: 'bi-chat-dots',
        color: 'primary'
      },
      {
        id: '2',
        type: 'post',
        title: 'Bài viết mới được tạo',
        message: 'Bài viết "Xu hướng công nghệ 2025" đã được thêm',
        time: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        icon: 'bi-file-earmark-plus',
        color: 'success'
      },
      {
        id: '3',
        type: 'system',
        title: 'Cập nhật hệ thống',
        message: 'Hệ thống đã được cập nhật lên phiên bản mới',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        icon: 'bi-gear',
        color: 'info'
      },
      {
        id: '4',
        type: 'warning',
        title: 'Cảnh báo bảo mật',
        message: 'Phát hiện hoạt động đăng nhập bất thường',
        time: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        icon: 'bi-shield-exclamation',
        color: 'warning'
      }
    ];
    
    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification = {
          id: Date.now().toString(),
          type: 'comment',
          title: 'Thông báo mới',
          message: 'Có hoạt động mới trên hệ thống',
          time: new Date().toISOString(),
          read: false,
          icon: 'bi-bell',
          color: 'primary'
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: '/favicon.ico'
          });
        }
      }
    }, 10000); // Every 10 seconds

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    if (confirm('⚠️ Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
      setNotifications([]);
    }
  };

  const getTimeAgo = (time) => {
    const diff = Date.now() - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  return (
    <div className="position-relative">
      {/* Notification Bell */}
      <button
        className="btn btn-outline-light position-relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="position-absolute top-100 end-0 mt-2" style={{ width: '400px', zIndex: 1050 }}>
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-bell me-2"></i>
                Thông báo ({notifications.length})
              </h6>
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-three-dots"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={markAllAsRead}>
                      <i className="bi bi-check-all me-2"></i>
                      Đánh dấu tất cả đã đọc
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={clearAllNotifications}>
                      <i className="bi bi-trash me-2"></i>
                      Xóa tất cả
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-bell-slash fs-1 mb-2 d-block"></i>
                  <p className="mb-0">Không có thông báo nào</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`list-group-item list-group-item-action ${!notification.read ? 'border-start border-3 border-primary' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-start gap-2">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center bg-${notification.color} bg-opacity-10`} style={{ width: '36px', height: '36px', minWidth: '36px' }}>
                          <i className={`${notification.icon} text-${notification.color} fs-6`}></i>
                        </div>
                        
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0 fw-semibold small">{notification.title}</h6>
                            <button
                              className="btn btn-sm p-0 text-muted"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              title="Xóa"
                              style={{ marginLeft: '8px' }}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                          <p className="mb-1 text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                            {notification.message}
                          </p>
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {getTimeAgo(notification.time)}
                            </small>
                            {!notification.read && (
                              <span className="badge bg-primary rounded-pill" style={{ fontSize: '0.65rem' }}>Mới</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="card-footer text-center">
                <small className="text-muted">
                  Thông báo được cập nhật tự động
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showNotifications && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040 }}
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationSystem;