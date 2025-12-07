#!/bin/bash

# Script tự động setup VPS cho CI/CD deployment

VPS_HOST="160.250.181.107"
DEPLOY_USER="deployer"
PROJECT_DIR="/var/www/html/AdminPanel"
GITHUB_REPO="https://github.com/tuanbq22it/ChuyenDe_project.git"

echo "🚀 Bắt đầu setup VPS cho CI/CD deployment..."
echo ""

# Bước 1: Tạo user deployer
echo "📝 Bước 1: Tạo user deployer..."
echo "Chạy lệnh sau trên VPS:"
echo ""
echo "adduser deployer"
echo "usermod -aG sudo deployer"
echo "echo 'deployer ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/deployer"
echo ""

# Bước 2: Tạo SSH key
echo "🔑 Bước 2: Tạo SSH key cho user deployer..."
echo "Chạy lệnh sau trên VPS:"
echo ""
echo "su - deployer"
echo "ssh-keygen -t rsa -b 4096 -C 'deploy@160.250.181.107'"
echo "cat ~/.ssh/id_rsa"
echo ""
echo "⚠️  Copy toàn bộ nội dung private key (từ -----BEGIN đến -----END)"
echo ""

# Bước 3: Cài đặt dependencies
echo "📦 Bước 3: Cài đặt Node.js và Nginx (nếu chưa có)..."
echo "Chạy lệnh sau trên VPS:"
echo ""
echo "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
echo "sudo apt install -y nodejs nginx git"
echo "node --version"
echo "nginx -v"
echo ""

# Bước 4: Clone project
echo "📂 Bước 4: Clone project..."
echo "Chạy lệnh sau trên VPS (as deployer):"
echo ""
echo "sudo mkdir -p /var/www/html"
echo "sudo chown -R deployer:deployer /var/www/html"
echo "cd /var/www/html"
echo "git clone $GITHUB_REPO AdminPanel"
echo "cd AdminPanel"
echo "npm install"
echo ""

# Bước 5: Cấu hình Nginx
echo "🌐 Bước 5: Cấu hình Nginx..."
echo "Tạo file /etc/nginx/sites-available/admin:"
echo ""
cat << 'NGINX'
server {
    listen 80;
    server_name 160.250.181.107;

    root /var/www/html/AdminPanel/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX
echo ""
echo "Sau đó chạy:"
echo "sudo ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/"
echo "sudo nginx -t"
echo "sudo systemctl reload nginx"
echo ""

# Bước 6: GitHub Secrets
echo "🔐 Bước 6: Thêm GitHub Secrets..."
echo "Vào: https://github.com/tuanbq22it/ChuyenDe_project/settings/secrets/actions"
echo ""
echo "Thêm các secrets sau:"
echo "  VPS_HOST = 160.250.181.107"
echo "  VPS_USERNAME = deployer"
echo "  VPS_SSH_KEY = [paste private key từ bước 2]"
echo "  VITE_FACEBOOK_APP_ID = [your app id]"
echo "  VITE_FACEBOOK_PAGE_ACCESS_TOKEN = [your token]"
echo "  VITE_FACEBOOK_PAGE_ID = [your page id]"
echo "  VITE_API_BASE_URL = https://graph.facebook.com/v18.0"
echo "  VITE_N8N_WEBHOOK_URL = http://160.250.181.107:5678"
echo ""

# Bước 7: Build lần đầu
echo "🔨 Bước 7: Build project lần đầu..."
echo "Chạy lệnh sau trên VPS (trong thư mục project):"
echo ""
echo "npm run build"
echo "sudo chown -R www-data:www-data dist/"
echo ""

echo "✅ Hoàn tất! Sau khi làm xong các bước trên:"
echo "   git push origin main"
echo "   → CI/CD sẽ tự động deploy!"
echo ""
echo "📊 Theo dõi deployment tại:"
echo "   https://github.com/tuanbq22it/ChuyenDe_project/actions"

