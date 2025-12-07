# 🚀 Hướng dẫn Setup VPS & GitHub Actions CI/CD

## Bước 1: Chuẩn bị VPS

### 1.1 SSH vào VPS
```bash
ssh root@buiquoctuan.id.vn
```

### 1.2 Cài đặt môi trường
```bash
# Update system
apt update && apt upgrade -y

# Cài Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Cài Nginx
apt install -y nginx

# Cài Git
apt install -y git

# Kiểm tra version
node -v  # v18.x.x
npm -v   # 9.x.x
nginx -v # nginx/1.x.x
```

### 1.3 Tạo user deploy (bảo mật hơn dùng root)
```bash
# Tạo user
adduser deployer
usermod -aG sudo deployer

# Cho phép sudo không cần password
echo "deployer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Chuyển sang user deployer
su - deployer
```

### 1.4 Clone project lần đầu
```bash
# Tạo thư mục
sudo mkdir -p /var/www/html
cd /var/www/html

# Clone project
sudo git clone https://github.com/tuanbq22it/ChuyenDe_project.git AdminPanel
cd AdminPanel

# Set permissions
sudo chown -R deployer:deployer /var/www/html/AdminPanel
```

---

## Bước 2: Tạo SSH Key cho GitHub Actions

### 2.1 Tạo SSH key trên VPS
```bash
# Vẫn trong VPS, user deployer
ssh-keygen -t rsa -b 4096 -C "github-actions"
# Enter 3 lần (không đặt password)

# Key được tạo tại:
# Private key: ~/.ssh/id_rsa
# Public key: ~/.ssh/id_rsa.pub
```

### 2.2 Add public key vào authorized_keys
```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 2.3 Copy private key (cần paste vào GitHub)
```bash
cat ~/.ssh/id_rsa
```
**→ Copy toàn bộ từ `-----BEGIN RSA PRIVATE KEY-----` đến `-----END RSA PRIVATE KEY-----`**

### 2.4 Test SSH connection
```bash
# Trên máy local
ssh -i ~/.ssh/id_rsa deployer@buiquoctuan.id.vn
# Nếu vào được không cần password = OK
```

---

## Bước 3: Setup Nginx

### 3.1 Tạo Nginx config
```bash
# Trên VPS
sudo nano /etc/nginx/sites-available/admin
```

**Nội dung file:**
```nginx
server {
    listen 80;
    server_name buiquoctuan.id.vn;
    root /var/www/html/AdminPanel/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 3.2 Enable site
```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3.3 Setup SSL với Let's Encrypt (Optional nhưng khuyên dùng)
```bash
# Cài Certbot
sudo apt install -y certbot python3-certbot-nginx

# Tạo SSL certificate
sudo certbot --nginx -d buiquoctuan.id.vn

# Auto renew
sudo systemctl enable certbot.timer
```

---

## Bước 4: Cấu hình GitHub Secrets

### 4.1 Vào GitHub Repository
```
https://github.com/tuanbq22it/ChuyenDe_project/settings/secrets/actions
```

### 4.2 Click "New repository secret" và thêm:

**VPS Connection Secrets:**
```
Name: VPS_HOST
Value: buiquoctuan.id.vn (hoặc IP của VPS)

Name: VPS_USERNAME
Value: deployer

Name: VPS_SSH_KEY
Value: (Paste private key từ ~/.ssh/id_rsa trên VPS)
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...toàn bộ nội dung...
-----END RSA PRIVATE KEY-----
```

**Environment Variables Secrets:**
```
Name: VITE_FACEBOOK_APP_ID
Value: 2198337383989439

Name: VITE_FACEBOOK_PAGE_ACCESS_TOKEN
Value: EAAfPYE7egL8BQMLijv4aipXXaImbD0gCo8ozQ7XPpI9VIBw87lkZBEakkB5xPxc8LokpqnCW1C2W6q2FLZAU9aZA7pQOB5vWezBZCAEMULiSbm5rGzaBszrvnyFpU5Rw8LUhP712NR50KZC9ILZCySPxZBFtI5dtZC2NzpqfxIoaXO0mAZB60JiMLBRiFoSKcNkCo8WVU

Name: VITE_FACEBOOK_PAGE_ID
Value: 732045003335546

Name: VITE_API_BASE_URL
Value: https://api.buiquoctuan.id.vn

Name: VITE_N8N_WEBHOOK_URL
Value: http://buiquoctuan.id.vn:5678/webhook/publish-post
```

**Telegram Notification Secrets (Optional):**
```
Name: TELEGRAM_CHAT_ID
Value: (ID chat Telegram của bạn)

Name: TELEGRAM_BOT_TOKEN
Value: (Token bot Telegram)
```

### 4.3 Cách lấy Telegram credentials (optional):
```
1. Chat với @BotFather trên Telegram
2. Gửi: /newbot
3. Đặt tên bot, nhận token
4. Chat với @userinfobot để lấy chat ID
```

---

## Bước 5: Build lần đầu trên VPS

```bash
# SSH vào VPS
ssh deployer@buiquoctuan.id.vn

# Vào thư mục project
cd /var/www/html/AdminPanel

# Tạo file .env
nano .env
```

**Nội dung .env:**
```env
VITE_FACEBOOK_APP_ID=2198337383989439
VITE_FACEBOOK_PAGE_ACCESS_TOKEN=EAAfPYE7egL8BQMLijv4aipXXaImbD0gCo8ozQ7XPpI9VIBw87lkZBEakkB5xPxc8LokpqnCW1C2W6q2FLZAU9aZA7pQOB5vWezBZCAEMULiSbm5rGzaBszrvnyFpU5Rw8LUhP712NR50KZC9ILZCySPxZBFtI5dtZC2NzpqfxIoaXO0mAZB60JiMLBRiFoSKcNkCo8WVU
VITE_FACEBOOK_PAGE_ID=732045003335546
VITE_ANALYTICS_MODE=production
VITE_API_BASE_URL=https://api.buiquoctuan.id.vn
VITE_N8N_WEBHOOK_URL=http://buiquoctuan.id.vn:5678/webhook/publish-post
```

```bash
# Cài dependencies
npm install

# Build
npm run build

# Set permissions
sudo chown -R www-data:www-data dist/
sudo chmod -R 755 dist/

# Reload Nginx
sudo systemctl reload nginx
```

**Kiểm tra:** Mở http://buiquoctuan.id.vn (hoặc https nếu đã setup SSL)

---

## Bước 6: Test CI/CD

### 6.1 Trên máy local
```bash
cd /home/qutuan/AdminPanel

# Commit và push workflow file
git add .github/workflows/deploy.yml
git add docs/SETUP_VPS.md
git commit -m "Add CI/CD workflow"
git push origin main
```

### 6.2 Xem deployment progress
```
1. Vào: https://github.com/tuanbq22it/ChuyenDe_project/actions
2. Sẽ thấy workflow "Deploy Admin Panel to VPS" đang chạy
3. Click vào để xem log real-time
```

### 6.3 Workflow sẽ:
- ✅ Clone code
- ✅ SSH vào VPS
- ✅ Pull code mới
- ✅ Install dependencies
- ✅ Build project
- ✅ Reload Nginx
- ✅ Gửi thông báo Telegram (nếu setup)

---

## Bước 7: Quy trình làm việc hàng ngày

### Mỗi khi sửa code:
```bash
# 1. Sửa code trong VS Code
# 2. Test local
npm run dev

# 3. Commit và push
git add .
git commit -m "Fix: update dashboard UI"
git push origin main

# 4. Đợi 2-3 phút → Web tự động cập nhật!
```

### Xem kết quả:
- GitHub Actions: https://github.com/tuanbq22it/ChuyenDe_project/actions
- Website: https://buiquoctuan.id.vn

---

## Troubleshooting

### Lỗi: Permission denied
```bash
# Trên VPS
sudo chown -R deployer:deployer /var/www/html/AdminPanel
```

### Lỗi: Git pull failed
```bash
# Trên VPS
cd /var/www/html/AdminPanel
git reset --hard origin/main
```

### Lỗi: Build failed
```bash
# Kiểm tra logs trên GitHub Actions
# Hoặc build thủ công trên VPS để xem lỗi
cd /var/www/html/AdminPanel
npm run build
```

### Rollback về version cũ
```bash
# Trên VPS
cd /var/www/html/AdminPanel
ls backups/  # Xem các backup
cp -r backups/backup_YYYYMMDD_HHMMSS/* dist/
sudo systemctl reload nginx
```

---

## Monitoring

### Xem Nginx logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Xem system resources
```bash
htop
df -h  # Disk usage
free -m  # Memory usage
```

---

## Security Best Practices

1. ✅ Không dùng root, dùng user riêng
2. ✅ SSH key thay vì password
3. ✅ Firewall: Chỉ mở port 22, 80, 443
4. ✅ SSL certificate (HTTPS)
5. ✅ Regular updates: `apt update && apt upgrade`
6. ✅ Backup định kỳ

---

## Kết luận

Sau khi setup xong:
- ✅ Mỗi lần `git push` → Tự động deploy
- ✅ Thời gian: 2-3 phút
- ✅ An toàn: Có backup tự động
- ✅ Professional: Như công ty thực tế

**Good luck! 🚀**
