# Hướng dẫn tích hợp n8n với Admin Panel

## 🎯 Mục tiêu
Tích hợp Admin Panel với n8n để tự động đăng tin tức tự tạo lên Facebook thay vì chỉ dùng tin từ VnExpress.

## 🔄 Workflow hiện tại
1. **Auto Mode**: n8n → VnExpress RSS → AI tạo content → Facebook
2. **Manual Mode** (mới): Admin Panel → Tạo tin → Duyệt → n8n → Facebook

## 📋 Các bước thiết lập

### 1. Import workflow mới vào n8n
```bash
# Copy file workflow mới vào n8n
cp n8n-workflows/manual-posts-workflow.json /path/to/n8n/workflows/
```

### 2. Cấu hình webhook URLs
Trong file `src/components/EditModal.jsx`, cập nhật URL webhook:
```javascript
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/manual-post-publish';
```

### 3. Cấu hình Facebook credentials
Trong n8n workflow, cập nhật:
- Facebook Page ID
- Facebook Graph API credentials
- Email notification settings

### 4. API endpoints cần thiết

#### 4.1 GET `/api/posts/pending`
Trả về danh sách bài viết chờ duyệt tự tạo:
```json
{
  "posts": [
    {
      "_id": "post_id",
      "title": "Tiêu đề bài viết",
      "content": "Nội dung Facebook",
      "imageUrl": "https://example.com/image.jpg",
      "status": "DRAFT",
      "source": "MANUAL",
      "createdAt": "2025-11-23T10:00:00Z"
    }
  ]
}
```

#### 4.2 POST `/api/posts/{id}/facebook-publish`
Cập nhật trạng thái sau khi đăng Facebook:
```json
{
  "facebookPostId": "fb_post_id",
  "status": "PUBLISHED", 
  "publishedAt": "2025-11-23T10:05:00Z"
}
```

### Webhook endpoint cho n8n
URL: `http://buiquoctuan.id.vn:5678/webhook/publish-post`

Payload gửi từ Admin Panel (khớp với workflow hiện có):
```json
{
  "draftId": "post_id_from_admin",
  "source": "admin_panel", 
  "timestamp": "2025-11-23T10:00:00Z",
  "title": "Tiêu đề đã chỉnh sửa",
  "content": "Nội dung đã chỉnh sửa", 
  "imageUrl": "URL ảnh"
}
```

## 🔧 Quy trình hoạt động

### Tạo tin mới:
1. User click "Tạo bài viết" trong Admin Panel
2. Điền form: tiêu đề, nội dung, ảnh
3. Hệ thống tạo bài với `status: "DRAFT"` và `source: "MANUAL"`

### Duyệt tin:
1. User chọn bài viết DRAFT và click "BIÊN TẬP"
2. Chỉnh sửa nội dung nếu cần
3. Click "DUYỆT & ĐĂNG NGAY"
4. Admin Panel gọi n8n webhook
5. n8n tự động đăng lên Facebook
6. n8n cập nhật trạng thái bài viết về "PUBLISHED"

### Theo dõi:
1. Nhận email thông báo khi đăng thành công
2. Xem bài viết trong tab "Đã đăng"
3. Check Facebook để xác nhận

## 🧪 Test trong Demo Mode

Khi chạy localhost, hệ thống sẽ:
- Log thông tin n8n trigger ra console
- Không gọi API thật
- Vẫn cập nhật UI bình thường

## 📊 Ưu điểm của workflow mới

1. **Kiểm soát nội dung**: Tự tạo tin thay vì phụ thuộc VnExpress
2. **Linh hoạt**: Có thể chỉnh sửa trước khi đăng
3. **Tự động hóa**: Vẫn dùng n8n để đăng Facebook
4. **Theo dõi**: Email thông báo và cập nhật trạng thái
5. **Dual mode**: Vừa có auto (VnExpress) vừa có manual

## 🔗 URLs cần cấu hình

```bash
# n8n webhook
https://your-n8n-instance.com/webhook/manual-post-publish

# API endpoints  
https://api.buiquoctuan.id.vn/api/posts
https://api.buiquoctuan.id.vn/api/posts/{id}/facebook-publish

# Facebook Graph API
https://graph.facebook.com/v18.0/{page-id}/photos
```

## 🚀 Deployment checklist

- [ ] Import workflow vào n8n
- [ ] Cấu hình Facebook credentials
- [ ] Update webhook URLs  
- [ ] Test với bài viết mẫu
- [ ] Cấu hình email notifications
- [ ] Monitor logs và error handling