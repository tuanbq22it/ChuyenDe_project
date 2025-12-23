import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notificationService from '../services/NotificationService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((data) => {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    });

    // Initialize service - DISABLED: API endpoint not implemented yet
    // notificationService.init(30000); // Poll every 30 seconds

    return () => {
      unsubscribe();
      notificationService.stopPolling();
    };
  }, []);

  const handleMarkAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleDelete = (notificationId, e) => {
    e.stopPropagation();
    notificationService.deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    if (window.confirm('Xóa tất cả thông báo?')) {
      notificationService.clearAll();
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      comment: '💬',
      mention: '@',
      viral: '🔥',
      negative_sentiment: '⚠️',
      post_published: '📝',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  const getNotificationColor = (type) => {
    const colors = {
      comment: 'primary',
      mention: 'warning',
      viral: 'danger',
      negative_sentiment: 'warning',
      post_published: 'success',
      info: 'info'
    };
    return colors[type] || 'info';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="notification-bell position-relative">
      <style>{`
        .notification-bell .dropdown-menu {
          width: 380px;
          max-height: 500px;
          overflow-y: auto;
        }
        
        .notification-item {
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }
        
        .notification-item:hover {
          background-color: #f8f9fa;
        }
        
        .notification-item.unread {
          background-color: #e8f4fd;
          border-left-color: #0d6efd;
        }
        
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .notification-bell-icon {
          font-size: 20px;
          cursor: pointer;
          transition: transform 0.3s;
        }
        
        .notification-bell-icon:hover {
          transform: scale(1.1);
        }
        
        .notification-empty {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }
      `}</style>

      <div className="position-relative">
        <button 
          className="btn btn-link notification-bell-icon position-relative p-2"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="Notifications"
        >
          <i className="bi bi-bell"></i>
          {unreadCount > 0 && (
            <span className="notification-badge bg-danger text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <>
            <div 
              className="position-fixed top-0 start-0 w-100 h-100" 
              style={{ zIndex: 1040 }}
              onClick={() => setShowDropdown(false)}
            />
            
            <div 
              className="dropdown-menu dropdown-menu-end show shadow-lg border-0"
              style={{ zIndex: 1050 }}
            >
              {/* Header */}
              <div className="dropdown-header d-flex justify-content-between align-items-center bg-light border-bottom">
                <h6 className="mb-0 fw-bold">
                  <i className="bi bi-bell me-2"></i>
                  Thông báo
                </h6>
                <div className="d-flex gap-2">
                  {unreadCount > 0 && (
                    <button 
                      className="btn btn-sm btn-link text-primary p-0 text-decoration-none"
                      onClick={handleMarkAllAsRead}
                      title="Đánh dấu tất cả đã đọc"
                    >
                      <i className="bi bi-check2-all"></i>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button 
                      className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                      onClick={handleClearAll}
                      title="Xóa tất cả"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                  <Link 
                    to="/notification-settings"
                    className="btn btn-sm btn-link text-secondary p-0 text-decoration-none"
                    title="Cài đặt"
                    onClick={() => setShowDropdown(false)}
                  >
                    <i className="bi bi-gear"></i>
                  </Link>
                </div>
              </div>

              {/* Notifications List */}
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  <i className="bi bi-bell-slash fs-1 text-muted"></i>
                  <p className="mt-3 mb-0">Không có thông báo mới</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={`list-group-item notification-item ${!notif.read ? 'unread' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fs-5">{getNotificationIcon(notif.type)}</span>
                            <h6 className="mb-0 fw-bold small">{notif.title}</h6>
                            {!notif.read && (
                              <span className="badge bg-primary rounded-pill" style={{ fontSize: '8px' }}>
                                Mới
                              </span>
                            )}
                          </div>
                          <p className="mb-1 text-muted small">{notif.message}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {formatTime(notif.timestamp)}
                            </small>
                            {notif.count && (
                              <span className={`badge bg-${getNotificationColor(notif.type)} badge-sm`}>
                                +{notif.count}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-link text-muted p-1"
                          onClick={(e) => handleDelete(notif.id, e)}
                          title="Xóa"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              {notifications.length > 10 && (
                <div className="dropdown-footer text-center border-top">
                  <Link 
                    to="/notifications" 
                    className="btn btn-link text-decoration-none small"
                    onClick={() => setShowDropdown(false)}
                  >
                    Xem tất cả thông báo ({notifications.length})
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
