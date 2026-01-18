# Bin Ayub - VPS Deployment Guide

## Prerequisites

- Ubuntu 20.04+ VPS
- Node.js 20+ installed
- PostgreSQL 14+ installed
- PM2 or Docker
- Nginx (for reverse proxy)
- SSL Certificate (Let's Encrypt)

## VPS Setup Steps

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Setup PostgreSQL Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE binayub_store;
CREATE USER binayub_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE binayub_store TO binayub_user;
ALTER DATABASE binayub_store OWNER TO binayub_user;
\q
```

### 3. Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/osamarehman/binayub.git
cd binayub/ayub-store

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env
```

Update `.env` with your VPS settings:
```
DATABASE_URL="postgresql://binayub_user:your_secure_password@localhost:5432/binayub_store?schema=public"
NEXTAUTH_URL="https://binayub.com"
NEXTAUTH_SECRET="generate-a-secure-random-secret"
# ... other env variables
```

### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### 5. Build Application

```bash
# Build for production
npm run build

# Test production build
npm start
```

### 6. Setup PM2

```bash
# Start application with PM2
pm2 start npm --name "binayub-store" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 7. Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/binayub.com
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name binayub.com www.binayub.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name binayub.com www.binayub.com;

    # SSL certificates (use certbot for Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/binayub.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/binayub.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Serve static files
    location /_next/static {
        alias /var/www/binayub/ayub-store/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias /var/www/binayub/ayub-store/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/binayub.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Setup SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d binayub.com -d www.binayub.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### 9. File Upload Directory

```bash
# Create uploads directory
mkdir -p public/uploads/products
mkdir -p public/uploads/categories

# Set permissions
chmod 755 public/uploads
```

## Monitoring & Maintenance

### View Application Logs

```bash
# PM2 logs
pm2 logs binayub-store

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Application

```bash
# Restart with PM2
pm2 restart binayub-store

# Reload Nginx
sudo systemctl reload nginx
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart binayub-store
```

### Database Backup

```bash
# Backup database
pg_dump -U binayub_user binayub_store > backup_$(date +%Y%m%d).sql

# Restore database
psql -U binayub_user binayub_store < backup_20231214.sql
```

## Performance Optimization

1. **Enable Redis for sessions** (optional)
2. **Setup CDN** for static assets
3. **Enable HTTP/2**
4. **Configure PM2 cluster mode**

```bash
pm2 start npm --name "binayub-store" -i max -- start
```

## Security Checklist

- [ ] Use strong PostgreSQL password
- [ ] Configure firewall (UFW)
- [ ] Enable fail2ban
- [ ] Regular security updates
- [ ] Secure .env file permissions
- [ ] Enable HTTPS only
- [ ] Configure rate limiting

## Troubleshooting

### Application won't start
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs binayub-store --lines 100
```

### Database connection errors
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U binayub_user -d binayub_store -h localhost
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check status
sudo systemctl status nginx
```
