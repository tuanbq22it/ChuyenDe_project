// Notification utility functions

export const addNotification = (notification) => {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  const newNotification = {
    id: Date.now().toString(),
    time: new Date().toISOString(),
    read: false,
    ...notification
  };
  
  // Add to beginning and keep max 20 notifications
  const updated = [newNotification, ...notifications].slice(0, 20);
  localStorage.setItem('notifications', JSON.stringify(updated));
  
  // Trigger storage event for other tabs/windows
  window.dispatchEvent(new Event('storage'));
  
  // Show browser notification if permission granted
  if (Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: newNotification.id
    });
  }
  
  return newNotification;
};

export const notificationTypes = {
  COMMENT: {
    icon: 'bi-chat-dots',
    color: 'primary'
  },
  POST: {
    icon: 'bi-file-earmark-plus',
    color: 'success'
  },
  LIKE: {
    icon: 'bi-heart-fill',
    color: 'danger'
  },
  SHARE: {
    icon: 'bi-share',
    color: 'info'
  },
  SYSTEM: {
    icon: 'bi-gear',
    color: 'info'
  },
  WARNING: {
    icon: 'bi-exclamation-triangle',
    color: 'warning'
  },
  SUCCESS: {
    icon: 'bi-check-circle',
    color: 'success'
  },
  ERROR: {
    icon: 'bi-x-circle',
    color: 'danger'
  }
};

// Quick notification creators
export const notifyComment = (userName, postTitle) => {
  return addNotification({
    type: 'comment',
    title: 'Bình luận mới',
    message: `${userName} đã bình luận về "${postTitle}"`,
    ...notificationTypes.COMMENT
  });
};

export const notifyPost = (postTitle) => {
  return addNotification({
    type: 'post',
    title: 'Bài viết mới',
    message: `Bài viết "${postTitle}" đã được tạo`,
    ...notificationTypes.POST
  });
};

export const notifySuccess = (message) => {
  return addNotification({
    type: 'success',
    title: 'Thành công',
    message,
    ...notificationTypes.SUCCESS
  });
};

export const notifyError = (message) => {
  return addNotification({
    type: 'error',
    title: 'Lỗi',
    message,
    ...notificationTypes.ERROR
  });
};
