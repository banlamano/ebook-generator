# Production Deployment Guide

This guide covers deploying the AI Ebook Generator to production environments.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backup strategy in place
- [ ] SSL certificate obtained
- [ ] Domain name configured
- [ ] Email service configured
- [ ] Stripe account set up with live keys
- [ ] Anthropic API key with sufficient quota
- [ ] AWS S3 bucket created (optional)
- [ ] Monitoring tools configured

## Deployment Options

### Option 1: VPS Deployment (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

#### 2. Clone and Setup Application

```bash
# Clone repository
git clone <your-repo-url> /var/www/ebook-generator
cd /var/www/ebook-generator

# Install dependencies
npm run install-all

# Copy and configure environment
cp .env.example .env
nano .env  # Edit with production values

# Build frontend
npm run build

# Run migrations
npm run migrate

# Seed templates
node server/migrations/seed.js
```

#### 3. Configure PM2

```bash
# Start application with PM2
pm2 start server/index.js --name ebook-generator

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 4. Configure Nginx

Create `/etc/nginx/sites-available/ebook-generator`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve static files
    location /uploads {
        alias /var/www/ebook-generator/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # File upload size
    client_max_body_size 50M;
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/ebook-generator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 6. Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Option 2: Docker Deployment

#### Using Docker Compose

```bash
# Clone repository
git clone <your-repo-url>
cd ebook-generator

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec app npm run migrate

# Seed data
docker-compose exec app node server/migrations/seed.js
```

### Option 3: Platform-as-a-Service (Heroku, Railway, Render)

#### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create application
heroku create your-app-name

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set ANTHROPIC_API_KEY=your_key
heroku config:set STRIPE_SECRET_KEY=your_key
# ... set all other variables

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate

# Seed data
heroku run node server/migrations/seed.js
```

### Option 4: Serverless (AWS, Vercel, Netlify)

For serverless deployment, you'll need to adapt the architecture:
- Frontend: Deploy to Vercel/Netlify
- Backend: AWS Lambda with API Gateway
- Database: AWS RDS or PlanetScale

## Post-Deployment Tasks

### 1. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/subscriptions/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy webhook signing secret to environment variables

### 2. Setup Monitoring

#### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

#### Error Tracking (Sentry)
```bash
npm install @sentry/node
```

Add to `server/index.js`:
```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### 3. Setup Automated Backups

#### Database Backup Script
Create `/root/backup-db.sh`:
```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
DB_NAME="ebook_generator"

mkdir -p $BACKUP_DIR

mysqldump -u root -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

Setup cron job:
```bash
chmod +x /root/backup-db.sh
crontab -e
# Add: 0 2 * * * /root/backup-db.sh
```

### 4. Performance Optimization

#### Enable Redis Caching
```bash
sudo apt install redis-server
npm install redis
```

#### CDN Configuration
- Use Cloudflare or AWS CloudFront
- Configure for static assets and uploads

#### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_ebook_user ON ebooks(user_id);
CREATE INDEX idx_chapter_ebook ON chapters(ebook_id);
```

### 5. Security Hardening

```bash
# Install fail2ban
sudo apt install fail2ban

# Configure fail2ban for Nginx
sudo nano /etc/fail2ban/jail.local
```

Add:
```
[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
```

## Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com

# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=strong-password
DB_NAME=ebook_generator

# Security
JWT_SECRET=very-long-random-string-min-64-chars
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# API Keys
ANTHROPIC_API_KEY=your-production-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-production-bucket

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or AWS ELB
2. **Multiple App Instances**: Run multiple PM2 instances
3. **Session Storage**: Use Redis for session management
4. **File Storage**: Move to S3/CloudFront

### Vertical Scaling

- **Database**: Upgrade to larger RDS instance
- **Server**: Increase CPU/RAM
- **Caching**: Implement Redis caching layer

## Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs ebook-generator

# Check Node process
ps aux | grep node

# Check port availability
netstat -tlnp | grep 5000
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -h localhost -u user -p

# Check MySQL status
sudo systemctl status mysql

# View MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### High Memory Usage
```bash
# Monitor with PM2
pm2 monit

# Check system resources
htop

# Restart application
pm2 restart ebook-generator
```

## Maintenance

### Updating the Application

```bash
# Pull latest changes
cd /var/www/ebook-generator
git pull origin main

# Install dependencies
npm install
cd client && npm install && cd ..

# Rebuild frontend
npm run build

# Run migrations
npm run migrate

# Restart application
pm2 restart ebook-generator
```

### Database Maintenance

```bash
# Optimize tables
mysqlcheck -u root -p --optimize ebook_generator

# Analyze tables
mysqlcheck -u root -p --analyze ebook_generator
```

## Monitoring Checklist

- [ ] Server CPU/RAM usage
- [ ] Disk space
- [ ] Database performance
- [ ] API response times
- [ ] Error rates
- [ ] Uptime monitoring
- [ ] SSL certificate expiration
- [ ] Backup verification

## Support

For deployment issues:
1. Check application logs: `pm2 logs`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Check system logs: `journalctl -xe`
4. Review INSTALLATION.md

## Success Metrics

After deployment, monitor:
- Page load times < 2 seconds
- API response times < 500ms
- Uptime > 99.9%
- Error rate < 0.1%

Congratulations on your production deployment! 🚀
