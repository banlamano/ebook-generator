# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager
- Git

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd ebook-ai-generator
```

## Step 2: Install Dependencies

### Install Backend Dependencies
```bash
npm install
```

### Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and configure the following variables:

### Database Configuration
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ebook_generator
DB_PORT=3306
```

### JWT Configuration
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### AI Configuration (Claude API)
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```
Get your API key from: https://console.anthropic.com/

### Email Configuration (SMTP)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com
```

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords

### Stripe Configuration
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```
Get your keys from: https://dashboard.stripe.com/apikeys

### AWS S3 (Optional - for file storage)
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name
```

## Step 4: Set Up the Database

1. Create the MySQL database:
```bash
mysql -u root -p
CREATE DATABASE ebook_generator;
exit;
```

2. Run migrations:
```bash
npm run migrate
```

3. Seed initial data (templates):
```bash
node server/migrations/seed.js
```

## Step 5: Start the Application

### Development Mode
```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## Step 6: Create an Admin User

1. Register a new account through the UI at http://localhost:3000/register
2. Manually update the user in the database to make them admin:

```bash
mysql -u root -p ebook_generator
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
exit;
```

## Docker Deployment

Alternatively, you can use Docker:

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration

# Start with Docker Compose
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- Application on port 5000

## Stripe Webhook Configuration

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:5000/api/subscriptions/webhook
```
3. Copy the webhook signing secret to your `.env` file

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `sudo systemctl status mysql`
- Check credentials in `.env`
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use
- Backend (5000): Change `PORT` in `.env`
- Frontend (3000): Change in `client/package.json` proxy

### Email Not Sending
- Check SMTP credentials
- For Gmail, use App Password, not regular password
- Verify firewall isn't blocking port 587

### AI Generation Fails
- Verify Anthropic API key is valid
- Check API quota/limits
- Review logs in `logs/error.log`

## Next Steps

1. Access the application at http://localhost:3000
2. Register an account
3. Create your first ebook
4. Configure Stripe for payments
5. Customize templates and branding

## Support

For issues and questions:
- Check the README.md
- Review logs in the `logs/` directory
- Open an issue on GitHub

## Security Notes

- Change all default secrets in production
- Use environment variables, never commit `.env`
- Enable HTTPS in production
- Set up proper firewall rules
- Regular database backups
- Keep dependencies updated

Congratulations! Your AI Ebook Generator is now ready to use! 🎉
