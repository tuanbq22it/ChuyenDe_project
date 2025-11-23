// API endpoints để tích hợp với n8n workflow
const API_BASE = 'https://api.buiquoctuan.id.vn/api';

// Webhook để n8n lấy danh sách bài viết chờ duyệt
export const getPostsForN8N = async () => {
  try {
    const response = await fetch(`${API_BASE}/posts/pending`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    
    // Chỉ trả về các bài viết chờ duyệt và đã duyệt tự tạo
    return posts.filter(post => 
      post.status === 'DRAFT' && 
      (post.source === 'MANUAL' || !post.source) // Bài viết tự tạo
    );
  } catch (error) {
    console.error('Error fetching posts for n8n:', error);
    return [];
  }
};

// Webhook để n8n cập nhật trạng thái bài viết sau khi đăng Facebook
export const updatePostStatus = async (postId, facebookPostId, status = 'PUBLISHED') => {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/facebook-publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        facebookPostId: facebookPostId,
        status: status,
        publishedAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update post status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating post status:', error);
    throw error;
  }
};

// Endpoint để n8n webhook gọi khi có bài viết được duyệt
export const triggerN8NPublish = async (postId) => {
  try {
    // Gọi webhook n8n để trigger publish workflow
    const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/publish-manual-post';
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId,
        source: 'admin_panel',
        timestamp: new Date().toISOString()
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error triggering n8n:', error);
    return false;
  }
};

// Mock data cho demo mode
export const mockPostsForN8N = [
  {
    _id: 'manual_1',
    title: 'Bài viết tự tạo số 1',
    content: '🔥 Tin nóng: Đây là bài viết được tạo thủ công từ Admin Panel!\n\nNội dung này đã được biên tập viên chuẩn bị kỹ lưỡng với những thông tin hữu ích cho người đọc.\n\n👉 Hãy để lại comment và chia sẻ ý kiến của bạn nhé!\n\n#TinTuc #Manual #AdminPanel',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=300&fit=crop',
    status: 'DRAFT',
    source: 'MANUAL',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    category: 'Tin tức',
    originalLink: null
  },
  {
    _id: 'manual_2', 
    title: 'Hướng dẫn sử dụng tính năng mới',
    content: '💡 Hướng dẫn sử dụng tính năng "Tạo tin mới" trong Admin Panel:\n\n1️⃣ Nhập tiêu đề hấp dẫn\n2️⃣ Viết nội dung Facebook\n3️⃣ Thêm ảnh minh họa\n4️⃣ Duyệt và đăng tự động\n\n✨ Đơn giản và hiệu quả!\n\n#Tutorial #AdminPanel #AutoPost',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
    status: 'DRAFT',
    source: 'MANUAL', 
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    category: 'Hướng dẫn',
    originalLink: null
  }
];