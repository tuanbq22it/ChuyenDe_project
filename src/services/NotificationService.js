/**
 * NotificationService - Quản lý thông báo real-time
 * Tích hợp với n8n để gửi email notifications
 */

const API_BASE = 'https://api.buiquoctuan.id.vn/api';
const N8N_NOTIFICATION_WEBHOOK = 'https://buiquoctuan.id.vn/webhook/send-notification';

class NotificationService {
  constructor() {
    this.subscribers = [];
    this.notifications = [];
    this.unreadCount = 0;
    this.pollingInterval = null;
  }

  /**
   * Khởi tạo service và bắt đầu polling
   */
  init(intervalMs = 30000) { // 30 seconds
    console.log('🔔 Initializing NotificationService...');
    this.startPolling(intervalMs);
    this.loadFromLocalStorage();
  }

  /**
   * Bắt đầu polling để check notifications mới
   */
  startPolling(intervalMs) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(() => {
      this.checkNewNotifications();
    }, intervalMs);

    // Check ngay lập tức
    this.checkNewNotifications();
  }

  /**
   * Dừng polling
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Check notifications mới từ API
   */
  async checkNewNotifications() {
    try {
      const response = await fetch(`${API_BASE}/notifications?limit=20`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      const newNotifications = data.notifications || [];
      
      // Merge với notifications hiện tại
      newNotifications.forEach(notif => {
        if (!this.notifications.find(n => n.id === notif.id)) {
          this.addNotification(notif);
        }
      });

      this.saveToLocalStorage();
      
    } catch (error) {
      console.error('❌ Error checking notifications:', error);
      // Fallback: check Facebook events manually
      await this.checkFacebookEvents();
    }
  }

  /**
   * Check Facebook events trực tiếp (fallback)
   */
  async checkFacebookEvents() {
    try {
      const pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID;
      const token = import.meta.env.VITE_FACEBOOK_PAGE_ACCESS_TOKEN;
      
      if (!pageId || !token) return;

      // Check new comments
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/posts?fields=comments.summary(true),likes.summary(true)&limit=5&access_token=${token}`
      );
      
      if (response.ok) {
        const data = await response.json();
        this.processFacebookData(data);
      }
    } catch (error) {
      console.error('❌ Error checking Facebook:', error);
    }
  }

  /**
   * Xử lý data từ Facebook
   */
  processFacebookData(data) {
    if (!data.data) return;

    data.data.forEach(post => {
      const commentCount = post.comments?.summary?.total_count || 0;
      const likeCount = post.likes?.summary?.total_count || 0;

      // Nếu có comment mới (so với lần check trước)
      const lastCheck = this.getLastCheckData(post.id);
      if (commentCount > lastCheck.comments) {
        this.createNotification({
          type: 'comment',
          title: 'Bình luận mới',
          message: `Có ${commentCount - lastCheck.comments} bình luận mới trên bài viết`,
          postId: post.id,
          count: commentCount - lastCheck.comments
        });
      }

      // Lưu lại để so sánh lần sau
      this.saveLastCheckData(post.id, { comments: commentCount, likes: likeCount });
    });
  }

  /**
   * Tạo notification mới
   */
  createNotification(notifData) {
    const notification = {
      id: Date.now() + Math.random(),
      type: notifData.type || 'info',
      title: notifData.title,
      message: notifData.message,
      postId: notifData.postId,
      count: notifData.count,
      timestamp: new Date().toISOString(),
      read: false,
      ...notifData
    };

    this.addNotification(notification);
    
    // Gửi email nếu là notification quan trọng
    if (this.shouldSendEmail(notification)) {
      this.sendEmailNotification(notification);
    }

    return notification;
  }

  /**
   * Thêm notification vào list
   */
  addNotification(notification) {
    this.notifications.unshift(notification);
    
    // Giữ tối đa 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    if (!notification.read) {
      this.unreadCount++;
    }

    // Notify subscribers
    this.notifySubscribers();
  }

  /**
   * Kiểm tra có nên gửi email không
   */
  shouldSendEmail(notification) {
    // Lấy settings từ localStorage
    const settings = this.getEmailSettings();
    
    if (!settings.enabled) return false;

    // Gửi email cho các loại notification quan trọng
    const importantTypes = ['comment', 'mention', 'viral', 'negative_sentiment'];
    return importantTypes.includes(notification.type);
  }

  /**
   * Gửi email notification qua n8n
   */
  async sendEmailNotification(notification) {
    try {
      const settings = this.getEmailSettings();
      
      const payload = {
        to: settings.email,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        postId: notification.postId,
        timestamp: notification.timestamp,
        priority: notification.type === 'viral' ? 'high' : 'normal'
      };

      console.log('📧 Sending email notification via n8n:', payload);

      const response = await fetch(N8N_NOTIFICATION_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Email notification sent successfully');
      } else {
        console.error('❌ Failed to send email:', response.status);
      }

    } catch (error) {
      console.error('❌ Error sending email notification:', error);
    }
  }

  /**
   * Đánh dấu notification là đã đọc
   */
  markAsRead(notificationId) {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif && !notif.read) {
      notif.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.notifySubscribers();
      this.saveToLocalStorage();
    }
  }

  /**
   * Đánh dấu tất cả là đã đọc
   */
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
    this.notifySubscribers();
    this.saveToLocalStorage();
  }

  /**
   * Xóa notification
   */
  deleteNotification(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      const notif = this.notifications[index];
      if (!notif.read) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      this.notifications.splice(index, 1);
      this.notifySubscribers();
      this.saveToLocalStorage();
    }
  }

  /**
   * Xóa tất cả notifications
   */
  clearAll() {
    this.notifications = [];
    this.unreadCount = 0;
    this.notifySubscribers();
    this.saveToLocalStorage();
  }

  /**
   * Subscribe để nhận updates
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    
    // Gọi callback ngay lập tức với data hiện tại
    callback({
      notifications: this.notifications,
      unreadCount: this.unreadCount
    });

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify tất cả subscribers
   */
  notifySubscribers() {
    const data = {
      notifications: this.notifications,
      unreadCount: this.unreadCount
    };

    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  /**
   * Get/Set email settings
   */
  getEmailSettings() {
    const defaultSettings = {
      enabled: false,
      email: '',
      types: ['comment', 'mention', 'viral']
    };

    try {
      const stored = localStorage.getItem('notification_email_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  setEmailSettings(settings) {
    localStorage.setItem('notification_email_settings', JSON.stringify(settings));
  }

  /**
   * LocalStorage helpers
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem('notifications', JSON.stringify({
        notifications: this.notifications.slice(0, 20), // Chỉ lưu 20 notifications gần nhất
        unreadCount: this.unreadCount
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications || [];
        this.unreadCount = data.unreadCount || 0;
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  /**
   * Helpers cho Facebook check
   */
  getLastCheckData(postId) {
    try {
      const stored = localStorage.getItem(`fb_check_${postId}`);
      return stored ? JSON.parse(stored) : { comments: 0, likes: 0 };
    } catch {
      return { comments: 0, likes: 0 };
    }
  }

  saveLastCheckData(postId, data) {
    localStorage.setItem(`fb_check_${postId}`, JSON.stringify(data));
  }

  /**
   * Get notifications by type
   */
  getByType(type) {
    return this.notifications.filter(n => n.type === type);
  }

  /**
   * Get unread notifications
   */
  getUnread() {
    return this.notifications.filter(n => !n.read);
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
