#!/bin/bash

# Script test API connection và CRUD operations
echo "🧪 Testing API Database Connection..."

API_BASE="https://api.buiquoctuan.id.vn/api/posts"

echo "📡 API Endpoint: $API_BASE"
echo ""

# Test 1: GET - Lấy danh sách bài viết
echo "1️⃣ Testing GET /posts (Fetch all posts)"
echo "🚀 Calling: GET $API_BASE"

GET_RESPONSE=$(curl -s -w "\n%{http_code}" -H "Accept: application/json" "$API_BASE")
GET_BODY=$(echo "$GET_RESPONSE" | head -n -1)
GET_STATUS=$(echo "$GET_RESPONSE" | tail -n 1)

echo "📊 Status: $GET_STATUS"
if [ "$GET_STATUS" -eq 200 ]; then
    echo "✅ GET Success - Found posts:"
    echo "$GET_BODY" | jq -r '.[] | "  - " + .title + " (" + .status + ")"' 2>/dev/null || echo "$GET_BODY"
else
    echo "❌ GET Failed"
    echo "Response: $GET_BODY"
fi

echo ""
echo "---"

# Test 2: POST - Tạo bài viết mới  
echo "2️⃣ Testing POST /posts (Create new post)"

TEST_POST='{
  "title": "🧪 Test bài viết từ Admin Panel Script",
  "content": "🚀 Đây là test content được tạo từ script kiểm tra API\n\nNếu bạn thấy bài này nghĩa là API đang hoạt động tốt! ✅\n\n#TestAPI #AdminPanel #CRUD",
  "imageUrl": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=300&fit=crop",
  "status": "DRAFT",
  "source": "MANUAL",
  "createdAt": "'$(date -Iseconds)'"
}'

echo "🚀 Calling: POST $API_BASE"
echo "📦 Payload:"
echo "$TEST_POST" | jq .

POST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "$TEST_POST" \
  "$API_BASE")

POST_BODY=$(echo "$POST_RESPONSE" | head -n -1)  
POST_STATUS=$(echo "$POST_RESPONSE" | tail -n 1)

echo "📊 Status: $POST_STATUS"
if [ "$POST_STATUS" -eq 200 ] || [ "$POST_STATUS" -eq 201 ]; then
    echo "✅ POST Success - Created post:"
    POST_ID=$(echo "$POST_BODY" | jq -r '._id' 2>/dev/null)
    echo "📝 Post ID: $POST_ID"
    echo "$POST_BODY" | jq . 2>/dev/null || echo "$POST_BODY"
    
    # Test 3: POST Approve nếu tạo thành công
    if [ "$POST_ID" != "null" ] && [ "$POST_ID" != "" ]; then
        echo ""
        echo "---" 
        echo "3️⃣ Testing POST /posts/{id}/approve (Approve post)"
        
        APPROVE_URL="$API_BASE/$POST_ID/approve"
        echo "🚀 Calling: POST $APPROVE_URL"
        
        APPROVE_PAYLOAD=$(echo "$POST_BODY" | jq '. + {"status": "PUBLISHED"}')
        
        APPROVE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
          -H "Content-Type: application/json" \
          -H "Accept: application/json" \
          -d "$APPROVE_PAYLOAD" \
          "$APPROVE_URL")
          
        APPROVE_BODY=$(echo "$APPROVE_RESPONSE" | head -n -1)
        APPROVE_STATUS=$(echo "$APPROVE_RESPONSE" | tail -n 1)
        
        echo "📊 Status: $APPROVE_STATUS"
        if [ "$APPROVE_STATUS" -eq 200 ]; then
            echo "✅ APPROVE Success"
            echo "$APPROVE_BODY" | jq . 2>/dev/null || echo "$APPROVE_BODY"
        else
            echo "❌ APPROVE Failed"
            echo "Response: $APPROVE_BODY"
        fi
    fi
    
else
    echo "❌ POST Failed"
    echo "Response: $POST_BODY"
fi

echo ""
echo "🏁 Test Summary:"
echo "GET /posts: $([ "$GET_STATUS" -eq 200 ] && echo "✅ PASS" || echo "❌ FAIL")"
echo "POST /posts: $([ "$POST_STATUS" -eq 200 -o "$POST_STATUS" -eq 201 ] && echo "✅ PASS" || echo "❌ FAIL")"

if [ "$POST_STATUS" -eq 200 ] || [ "$POST_STATUS" -eq 201 ]; then
    echo "POST /approve: $([ "$APPROVE_STATUS" -eq 200 ] && echo "✅ PASS" || echo "❌ FAIL")"
fi

echo ""
echo "📋 Để test từ Admin Panel:"
echo "   1. npm run dev"
echo "   2. Tạo bài viết mới"
echo "   3. Kiểm tra console logs"
echo "   4. Duyệt bài viết"