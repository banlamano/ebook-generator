# ⚡ Quick Start Guide - Get Running in 10 Minutes!

This guide will get you from zero to a running AI Ebook Generator in just 10 minutes.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js installed (v16+) - [Download here](https://nodejs.org/)
- [ ] MySQL installed (v8.0+) - [Download here](https://dev.mysql.com/downloads/)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command prompt access

## 🚀 5-Step Setup

### Step 1: Download & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repository-url>
cd ebook-ai-generator

# Install ALL dependencies (backend + frontend)
npm run install-all
```

**Wait for installation to complete...**

### Step 2: Configure Environment (2 minutes)

```bash
# Create your environment file
cp .env.example .env
```

**Open `.env` in your editor and update these REQUIRED fields:**

```env
# Database (use your MySQL credentials)
DB_PASSWORD=your_mysql_password
DB_NAME=ebook_generator

# Security (generate a random string)
JWT_SECRET=your_random_secret_key_min_32_characters

# AI - Get free key from https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Email - Use Gmail for testing
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Stripe - Use test keys from https://stripe.com/
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

**💡 Quick Tip**: You can start without Stripe keys - just skip payment features for now!

### Step 3: Setup Database (2 minutes)

```bash
# Open MySQL
mysql -u root -p
# Enter your MySQL password

# Create the database
CREATE DATABASE ebook_generator;

# Exit MySQL
exit;
```

**Run migrations:**
```bash
npm run migrate
```

**Seed sample data (templates):**
```bash
node server/migrations/seed.js
```

### Step 4: Get API Keys (3 minutes)

#### A) Anthropic API Key (REQUIRED for AI)
1. Go to: https://console.anthropic.com/
2. Sign up for free account
3. Get API key from Settings
4. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-xxxxx`

#### B) Email Setup (for email verification)
**Using Gmail (easiest):**
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2FA if not already enabled
3. Generate an "App Password"
4. Add to `.env`:
   ```env
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

#### C) Stripe Keys (optional - for testing payments)
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy "Secret key" and "Publishable key"
3. Add to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   ```

### Step 5: Start the Application! (1 minute)

```bash
# Start both frontend and backend
npm run dev
```

**Wait for both servers to start...**

You should see:
```
Server running on port 5000
Compiled successfully!
```

## 🎉 Access Your Application

**Open your browser:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🧪 Test Your Setup

### 1. Register a New Account
1. Go to http://localhost:3000/register
2. Fill in your details
3. Click "Create Account"
4. Check your email for verification link (or check terminal logs if email not configured)

### 2. Create Your First Ebook
1. Login with your credentials
2. Click "Create New Ebook"
3. Fill in:
   - **Title**: "My First AI Ebook"
   - **Topic**: "Introduction to Digital Marketing"
   - **Chapters**: 5
   - **Words per chapter**: 500
4. Click "Generate Ebook"
5. Wait 3-5 minutes for AI to generate content

### 3. Edit & Export
1. Once generated, click "Edit" on your ebook
2. Review the AI-generated content
3. Make any edits you want
4. Click "Export" → "PDF"
5. Download your first AI-generated ebook! 🎊

## 👨‍💼 Create Admin Account

To access the admin panel:

```bash
# Open MySQL
mysql -u root -p ebook_generator

# Make your account an admin
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';

# Exit
exit;
```

**Now access admin panel:**
- Login and go to: http://localhost:3000/admin

## 🐛 Troubleshooting

### Problem: "Cannot connect to database"
**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql
# or on Mac:
brew services list

# Start MySQL if stopped
sudo systemctl start mysql
# or on Mac:
brew services start mysql
```

### Problem: "AI generation failed"
**Solution:**
1. Check your Anthropic API key in `.env`
2. Verify you have API credits: https://console.anthropic.com/
3. Check logs: `tail -f logs/error.log`

### Problem: "Port 3000 already in use"
**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change the port in client/package.json
```

### Problem: "Email not sending"
**Solution:**
- For testing, skip email verification:
  ```sql
  UPDATE users SET is_verified = 1 WHERE email = 'your@email.com';
  ```
- Check verification link in terminal console logs

### Problem: Dependencies installation fails
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules client/node_modules
npm cache clean --force
npm run install-all
```

## 📚 What's Next?

Now that you're up and running:

1. **Explore Features**
   - Create multiple ebooks
   - Try different templates
   - Test the editor
   - Export in different formats

2. **Customize**
   - Update branding colors in `client/src/index.css`
   - Add your logo in `client/src/components/Navbar.js`
   - Modify templates in database

3. **Deploy to Production**
   - Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
   - Configure domain and SSL
   - Set up production database

4. **Add Features**
   - Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
   - Add your own AI prompts
   - Create custom templates

## 💡 Pro Tips

1. **Speed up testing**: Use smaller ebooks (3 chapters, 300 words each) for quick tests
2. **Check logs**: Always check `logs/error.log` when debugging
3. **Database tool**: Use MySQL Workbench or phpMyAdmin to view database
4. **API testing**: Use Postman to test API endpoints directly
5. **Frontend only**: Run `npm run client` if you only need to work on UI

## 🎯 Common Development Tasks

### Reset Database
```bash
mysql -u root -p ebook_generator
DROP DATABASE ebook_generator;
CREATE DATABASE ebook_generator;
exit;
npm run migrate
node server/migrations/seed.js
```

### View Logs
```bash
# Backend logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log
```

### Restart Services
```bash
# Stop: Press Ctrl+C in terminal

# Start again:
npm run dev
```

### Update Dependencies
```bash
npm update
cd client && npm update && cd ..
```

## 📞 Need Help?

- **Check documentation**: README.md, INSTALLATION.md, DEPLOYMENT.md
- **View code examples**: All features are fully implemented
- **Common issues**: See troubleshooting section above
- **Ask questions**: Open a GitHub issue

## ✅ Verification Checklist

Before moving to production, verify:

- [ ] Can register new user
- [ ] Email verification works
- [ ] Can login successfully
- [ ] Can create ebook
- [ ] AI generation completes
- [ ] Can edit chapters
- [ ] Can export to PDF
- [ ] Admin panel accessible
- [ ] Stripe test payment works
- [ ] All pages load correctly

## 🎊 Success!

You now have a fully functional AI Ebook Generator running locally!

**Next steps:**
- Customize the platform for your brand
- Add more templates
- Deploy to production
- Start generating amazing ebooks!

---

**Time taken**: ~10 minutes
**Result**: Fully working SaaS platform ✅

Happy ebook generating! 🚀📚
