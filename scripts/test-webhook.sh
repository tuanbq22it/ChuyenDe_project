#!/bin/bash

# Script test webhook n8n
echo "🧪 Testing n8n webhook connection..."

WEBHOOK_URL="http://buiquoctuan.id.vn:5678/webhook/publish-post"

# Test payload giống như Admin Panel sẽ gửi
TEST_PAYLOAD='{
  "draftId": "test_post_123",
  "source": "admin_panel_test", 
  "timestamp": "'$(date -Iseconds)'",
  "title": "Test bài viết từ Admin Panel",
  "content": "🧪 Đây là test content từ Admin Panel\n\nNếu bạn nhận được tin này nghĩa là webhook đang hoạt động tốt! 🎉\n\n#Test #AdminPanel #n8n",
  "imageUrl": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop"
}'

echo "📡 Sending test request to: $WEBHOOK_URL"
echo "📦 Payload:"
echo "$TEST_PAYLOAD" | jq .

echo ""
echo "🚀 Calling webhook..."

# Gửi request với timeout 30 giây
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_PAYLOAD" \
  --connect-timeout 30 \
  --max-time 60 \
  "$WEBHOOK_URL")

# Tách response body và status code
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)

echo "📊 Response Status: $HTTP_STATUS"
echo "📄 Response Body: $HTTP_BODY"

if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 300 ]; then
    echo "✅ Webhook test THÀNH CÔNG!"
    echo "🎉 n8n workflow đã nhận được request và xử lý"
else
    echo "❌ Webhook test THẤT BẠI!"
    echo "🔍 Vui lòng kiểm tra:"
    echo "   - n8n server có đang chạy?"
    echo "   - Workflow có active không?"
    echo "   - Network có kết nối được không?"
fi

echo ""
echo "📋 Để test từ Admin Panel:"
echo "   1. Tạo bài viết mới" 
echo "   2. Click 'BIÊN TẬP'"
echo "   3. Click 'DUYỆT & ĐĂNG NGAY'"
echo "   4. Kiểm tra console logs và n8n execution"