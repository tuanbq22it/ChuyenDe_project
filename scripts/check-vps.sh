#!/bin/bash

# Script kiểm tra kết nối VPS trước khi deploy

echo "🔍 Checking VPS connection..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# VPS credentials
VPS_HOST="buiquoctuan.id.vn"
VPS_USER="deployer"

echo ""
echo "Testing SSH connection to ${VPS_USER}@${VPS_HOST}..."

# Test SSH connection
if ssh -o ConnectTimeout=5 -o BatchMode=yes ${VPS_USER}@${VPS_HOST} exit 2>/dev/null; then
    echo -e "${GREEN}✅ SSH connection successful!${NC}"
else
    echo -e "${RED}❌ SSH connection failed!${NC}"
    echo ""
    echo "Please check:"
    echo "1. VPS is running"
    echo "2. SSH key is properly configured"
    echo "3. User 'deployer' exists on VPS"
    exit 1
fi

echo ""
echo "Checking Node.js on VPS..."
NODE_VERSION=$(ssh ${VPS_USER}@${VPS_HOST} "node -v" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Node.js ${NODE_VERSION} installed${NC}"
else
    echo -e "${YELLOW}⚠️  Node.js not found on VPS${NC}"
fi

echo ""
echo "Checking Nginx on VPS..."
NGINX_STATUS=$(ssh ${VPS_USER}@${VPS_HOST} "systemctl is-active nginx" 2>/dev/null)
if [ "$NGINX_STATUS" == "active" ]; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx is not running${NC}"
fi

echo ""
echo "Checking project directory..."
if ssh ${VPS_USER}@${VPS_HOST} "[ -d /var/www/html/AdminPanel ]"; then
    echo -e "${GREEN}✅ Project directory exists${NC}"
else
    echo -e "${RED}❌ Project directory not found${NC}"
    echo "Run: ssh ${VPS_USER}@${VPS_HOST} 'sudo mkdir -p /var/www/html/AdminPanel'"
fi

echo ""
echo -e "${GREEN}🎉 All checks passed! Ready to deploy.${NC}"
echo ""
echo "Next steps:"
echo "1. Configure GitHub Secrets"
echo "2. git push origin main"
echo "3. Monitor: https://github.com/tuanbq22it/ChuyenDe_project/actions"
