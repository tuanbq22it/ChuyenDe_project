# 🚀 Admin Panel - Tích hợp n8n Auto Publishing

## 🎯 Tổng quan
Hệ thống Admin Panel tích hợp với n8n để tự động đăng tin tức lên Facebook theo 2 cách:
1. **Auto Mode**: n8n tự động lấy tin từ VnExpress → AI tạo content → Đăng Facebook  
2. **Manual Mode**: Tự tạo tin trong Admin Panel → Duyệt → n8n đăng Facebook

## ✨ Tính năng chính

### 🔄 Workflow tự tạo tin
- ✅ Tạo bài viết với editor WYSIWYG
- ✅ Upload và quản lý hình ảnh  
- ✅ Preview nội dung trước khi đăng
- ✅ Tích hợp n8n webhook tự động
- ✅ Email notification khi đăng thành công
- ✅ Tracking trạng thái bài viết

### 📊 Dashboard quản lý
- ✅ Thống kê tổng quan (tổng bài, chờ duyệt, đã đăng)
- ✅ Filter theo trạng thái (All, Draft, Published)  
- ✅ Grid view responsive
- ✅ Demo mode với mock data

## 🛠️ Cài đặt và sử dụng

### 1. Clone và setup
```bash
git clone <repo-url>
cd AdminPanel
npm install
npm run dev
```

### 2. Cấu hình n8n
1. Import workflow từ `n8n-workflows/complete-manual-workflow.json`
2. Cập nhật Facebook credentials
3. Cấu hình webhook URL
4. Test workflow

### 3. Sử dụng Admin Panel

#### Tạo tin mới:
1. Vào trang **Posts** 
2. Click **"Tạo bài viết"**
3. Điền form:
   - **Tiêu đề**: Tiêu đề hấp dẫn
   - **Nội dung Facebook**: Content sẽ đăng (có thể dùng emoji, hashtag)
   - **Link ảnh**: URL hình ảnh minh họa
4. Click **"TẠO BÀI VIẾT"**
5. Bài viết được lưu với trạng thái **DRAFT**

#### Duyệt và đăng:
1. Tìm bài viết trong tab **"Chờ duyệt"**
2. Click **"BIÊN TẬP"** 
3. Chỉnh sửa nội dung nếu cần
4. Click **"DUYỆT & ĐĂNG NGAY"**
5. Hệ thống tự động:
   - Gọi n8n webhook
   - n8n tải ảnh và đăng Facebook  
   - Cập nhật trạng thái thành **PUBLISHED**
   - Gửi email thông báo

## 🔧 Cấu hình n8n

### Webhook URL
```javascript
// Trong src/components/EditModal.jsx
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/manual-post-publish';
```

### Payload gửi đến n8n
```json
{
  "postId": "post_id_from_admin",
  "postData": {
    "title": "Tiêu đề đã chỉnh sửa", 
    "content": "Nội dung Facebook đã chỉnh sửa",
    "imageUrl": "URL ảnh"
  },
  "source": "admin_panel",
  "timestamp": "2025-11-23T10:00:00Z"
}
```

### API endpoints cần thiết
```bash
# Lấy chi tiết bài viết  
GET /api/posts/{id}

# Cập nhật trạng thái sau khi đăng Facebook
POST /api/posts/{id}/facebook-publish
```

## 📱 Demo và Test

### Demo Mode (Localhost)
- Chạy offline với mock data
- Log n8n webhook ra console  
- UI hoạt động đầy đủ
- Không gọi API thật

### Production Mode
- Gọi n8n webhook thật
- Đăng Facebook thật
- Email notifications
- API tracking

## 🎨 Screenshots

### Trang chính
![Posts Management](docs/screenshots/posts-page.png)

### Tạo bài viết mới  
![Create Post](docs/screenshots/create-post.png)

### Duyệt bài viết
![Edit Post](docs/screenshots/edit-post.png)

### n8n Integration Guide
![n8n Guide](docs/screenshots/n8n-guide.png)

## 📋 Workflow Files

### Admin Panel
- `src/pages/Posts.jsx` - Trang quản lý bài viết chính
- `src/components/CreatePostModal.jsx` - Modal tạo bài mới
- `src/components/EditModal.jsx` - Modal duyệt và chỉnh sửa  
- `src/components/N8NIntegrationGuide.jsx` - Hướng dẫn tích hợp
- `src/api/webhooks.js` - API utility functions

### n8n Workflows  
- `n8n-workflows/complete-manual-workflow.json` - Workflow hoàn chỉnh
- `n8n-workflows/manual-posts-workflow.json` - Workflow đơn giản

### Documentation
- `docs/n8n-integration-guide.md` - Hướng dẫn chi tiết
- `README.md` - File này

## 🚦 Trạng thái bài viết

| Trạng thái | Mô tả | Hành động có thể |
|------------|--------|------------------|
| **DRAFT** | Bài viết mới tạo, chờ duyệt | Chỉnh sửa, Duyệt, Xóa |
| **PUBLISHED** | Đã đăng lên Facebook | Xem trên Facebook |

## 🔍 Troubleshooting

### Lỗi thường gặp:

**1. n8n webhook không hoạt động**
- Kiểm tra URL webhook
- Verify n8n workflow đã active  
- Check network connectivity

**2. Facebook đăng bài thất bại**
- Kiểm tra Facebook access token
- Verify page permissions
- Check image URL accessibility  

**3. Email notification không gửi được**
- Cấu hình Gmail OAuth2 trong n8n
- Kiểm tra email credentials

### Debug logs:
```bash
# Admin Panel (browser console)
🔄 [DEMO MODE] Triggering n8n workflow for post: post_id
📝 Post data: {...}

# n8n workflow logs  
=== WEBHOOK RECEIVED ===
Post ID: post_id
Source: admin_panel
```

## 🤝 Support

Nếu có vấn đề:
1. Check file `docs/n8n-integration-guide.md`
2. Xem logs trong browser console và n8n
3. Test với bài viết mẫu trước
4. Liên hệ team development

## 📈 Roadmap  

- [ ] Tích hợp với nhiều social platforms (Twitter, Instagram)
- [ ] Scheduled publishing  
- [ ] Advanced analytics
- [ ] Content templates
- [ ] Multi-user collaboration

---

**🎉 Chúc bạn sử dụng hiệu quả!**# CI/CD configured

