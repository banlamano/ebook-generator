# 🚀 Easy Preview, Test & Deploy Guide

## The EASIEST Way to Get Your Platform Running

This guide will get you from zero to a running platform in the simplest way possible.

---

## 🎯 Choose Your Path

### Path A: Quick Preview (5 minutes)
Just want to see the code and UI? → **Use Online IDE**

### Path B: Full Local Testing (15 minutes)
Want to test everything locally? → **Use Docker + XAMPP**

### Path C: Deploy Online (20 minutes)
Ready to go live? → **Deploy to Railway or Render**

---

## 🌐 PATH A: Quick Preview (EASIEST - No Installation)

### Option 1: GitHub Codespaces (Recommended)

**Step 1: Push to GitHub**
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/ebook-generator.git
git push -u origin main
```

**Step 2: Open in Codespaces**
1. Go to your GitHub repository
2. Click green "Code" button
3. Click "Codespaces" tab
4. Click "Create codespace on main"
5. Wait 2 minutes for setup

**Step 3: Setup in Codespace**
```bash
# Install dependencies (auto-runs)
npm install
cd client && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with basic values

# Start with SQLite (no MySQL needed!)
npm run dev
```

**Access:** Click "Open in Browser" when ports appear

### Option 2: Replit (Even Easier!)

**Step 1: Create Replit**
1. Go to https://replit.com
2. Create account (free)
3. Click "Create Repl"
4. Choose "Import from GitHub"
5. Paste your repo URL

**Step 2: Configure**
Replit auto-detects Node.js and installs dependencies!

**Step 3: Run**
Click "Run" button - that's it!

---

## 💻 PATH B: Full Local Testing (BEST for Testing)

### Super Easy with Docker (Recommended)

**Prerequisites:**
- Docker Desktop installed

**Step 1: Install Docker Desktop**
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

**Step 2: One Command Deploy**
```bash
# Start everything with one command!
docker-compose up -d
```

That's it! Docker will:
- ✅ Install MySQL
- ✅ Create database
- ✅ Run migrations
- ✅ Start backend
- ✅ Start frontend

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Stop:**
```bash
docker-compose down
```

### Alternative: XAMPP (No Docker)

**Step 1: Install XAMPP (5 minutes)**
1. Download: https://www.apachefriends.org/
2. Install (keep all defaults)
3. Open XAMPP Control Panel
4. Start "Apache" and "MySQL"

**Step 2: Create Database**
1. Open browser: http://localhost/phpmyadmin
2. Click "New" 
3. Database name: `ebook_generator`
4. Click "Create"

**Step 3: Setup and Run**
```bash
# Update .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ebook_generator

# Run migrations
node server/migrations/migrate.js
node server/migrations/seed.js

# Start app
npm run dev
```

**Access:** http://localhost:3000

---

## ☁️ PATH C: Deploy Online (Live Website!)

### Option 1: Railway (EASIEST - Recommended) ⭐

**Free tier includes:**
- 500 hours/month
- MySQL database
- Auto-deploy
- Custom domain

**Step 1: Sign Up**
1. Go to https://railway.app
2. Sign up with GitHub (free)

**Step 2: Create New Project**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your ebook-generator repo

**Step 3: Add MySQL Database**
1. Click "New" → "Database" → "Add MySQL"
2. Railway creates database automatically

**Step 4: Configure Environment Variables**
Click on your service → Variables → Add:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${DATABASE_URL}  # Auto-filled by Railway

JWT_SECRET=your_random_secret_key_change_this
ANTHROPIC_API_KEY=your_anthropic_key
STRIPE_SECRET_KEY=your_stripe_key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your@email.com
EMAIL_PASSWORD=your_app_password
```

**Step 5: Deploy!**
Railway auto-deploys on every push!

**Step 6: Access Your Site**
Railway gives you a URL like: `ebook-generator-production.up.railway.app`

**Add Custom Domain (Optional):**
Settings → Domains → Add your domain

### Option 2: Render (Also Very Easy)

**Step 1: Sign Up**
1. Go to https://render.com
2. Sign up with GitHub (free)

**Step 2: Create Web Service**
1. New → Web Service
2. Connect your repo
3. Settings:
   - Name: ebook-generator
   - Environment: Node
   - Build Command: `npm install && cd client && npm install && npm run build`
   - Start Command: `npm start`

**Step 3: Add Database**
1. New → PostgreSQL (or use external MySQL)
2. Copy connection string

**Step 4: Environment Variables**
Add all variables from `.env.example`

**Step 5: Deploy**
Render auto-deploys!

### Option 3: Heroku (Classic Choice)

**Step 1: Install Heroku CLI**
```bash
# Download: https://devcenter.heroku.com/articles/heroku-cli
# Or use: npm install -g heroku
```

**Step 2: Login and Create App**
```bash
heroku login
heroku create your-ebook-generator
```

**Step 3: Add MySQL**
```bash
heroku addons:create jawsdb:kitefin
```

**Step 4: Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set ANTHROPIC_API_KEY=your_key
# ... add all other variables
```

**Step 5: Deploy**
```bash
git push heroku main
```

**Step 6: Run Migrations**
```bash
heroku run node server/migrations/migrate.js
heroku run node server/migrations/seed.js
```

**Access:** Your app at `your-ebook-generator.herokuapp.com`

### Option 4: Vercel + PlanetScale (Modern Stack)

**For Frontend:**
1. Push to GitHub
2. Go to https://vercel.com
3. Import project
4. Deploy (1 click!)

**For Backend + Database:**
1. Use Railway or Render for backend
2. Or use serverless functions on Vercel

---

## 🔑 Getting API Keys (Required for Full Functionality)

### 1. Anthropic API (AI Generation) - FREE TIER AVAILABLE

**Steps:**
1. Go to https://console.anthropic.com/
2. Sign up for free account
3. Get $5 free credits
4. Go to Settings → API Keys
5. Create new key
6. Copy and add to `.env`: `ANTHROPIC_API_KEY=sk-ant-xxxxx`

**Free tier:** Enough for ~100 ebook generations!

### 2. Stripe (Payments) - FREE TEST MODE

**Steps:**
1. Go to https://stripe.com
2. Create free account
3. Go to Developers → API Keys
4. Copy test keys:
   - Secret key: `sk_test_xxxxx`
   - Publishable key: `pk_test_xxxxx`
5. Add to `.env`

**Test mode:** No real money, test payments with card: `4242 4242 4242 4242`

### 3. Email Service (Optional)

**Gmail (Easiest):**
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2FA if not enabled
3. Generate App Password
4. Add to `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

**Or use SendGrid (More reliable):**
1. Sign up: https://sendgrid.com (free 100 emails/day)
2. Get API key
3. Configure in `.env`

---

## 🧪 Testing Your Deployment

### Quick Test Checklist

```bash
# 1. Check health
curl https://your-url.com/api/health

# 2. Test in browser
Open: https://your-url.com

# 3. Try registration
Register a new account

# 4. Check database
Verify user was created

# 5. Test login
Login with credentials

# 6. Test dashboard
View dashboard stats

# 7. Browse templates
Go to templates page

# 8. Test pricing
Check pricing page
```

### Full Functionality Test

If you added API keys:

1. ✅ **AI Generation**
   - Create new ebook
   - Wait for generation
   - Check chapters

2. ✅ **Email**
   - Register account
   - Check verification email
   - Test password reset

3. ✅ **Payments**
   - Click upgrade
   - Use test card: 4242 4242 4242 4242
   - Verify subscription

4. ✅ **Export**
   - Generate ebook
   - Export to PDF
   - Download file

5. ✅ **Admin**
   - Make yourself admin in database
   - Access admin panel
   - View statistics

---

## 🎯 RECOMMENDED: Easiest Complete Setup

**For Quick Testing:**
```
Docker → One command setup
```

**For Online Demo:**
```
Railway → Click & Deploy
```

**For Production:**
```
Railway + Custom Domain + SSL (auto)
```

---

## 📋 Step-by-Step: The ABSOLUTE Easiest Way

### Using Railway (Total time: 20 minutes)

**Step 1: Prepare Repository (2 minutes)**
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/ebook-generator.git
git push -u origin main
```

**Step 2: Deploy to Railway (5 minutes)**
1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub
4. Select your repo
5. Add MySQL database (click "New" → "Database" → "MySQL")
6. Done! Railway deploys automatically

**Step 3: Add Environment Variables (5 minutes)**
1. Click on your service
2. Go to Variables tab
3. Add these minimum variables:
   ```
   NODE_ENV=production
   JWT_SECRET=any_random_string_min_32_characters
   ```
4. Optional: Add API keys for full functionality

**Step 4: Run Migrations (3 minutes)**
1. Go to service → Deployments
2. Click on latest deployment
3. Click "View Logs"
4. Use Railway CLI or run migrations via:
   ```bash
   railway run node server/migrations/migrate.js
   railway run node server/migrations/seed.js
   ```

**Step 5: Access Your Site (1 minute)**
1. Railway gives you a URL
2. Open in browser
3. Register and test!

**Step 6: Add Custom Domain (Optional - 5 minutes)**
1. Settings → Domains
2. Add your domain
3. Update DNS records
4. SSL auto-configured!

---

## 🎉 Summary

### Fastest Preview:
**Replit** - Just click Run!

### Best for Local Testing:
**Docker** - One command: `docker-compose up`

### Best for Online Deploy:
**Railway** - Auto-deploy, free tier, MySQL included

### Production Ready:
**Railway + Custom Domain** - Professional setup in 20 minutes

---

## 🆘 Troubleshooting

### "Module not found"
```bash
npm install
cd client && npm install
```

### "Cannot connect to database"
- Check DATABASE_URL is set
- Verify database is running
- Run migrations

### "Port already in use"
- Change PORT in environment variables
- Or use Railway (handles ports automatically)

### "AI generation failed"
- Add ANTHROPIC_API_KEY
- Check API credits

### "Deployment failed"
- Check logs in Railway/Render
- Verify all environment variables
- Check build command

---

## 💡 Pro Tips

1. **Start with Railway** - Easiest deployment
2. **Use test API keys** - Don't spend money while testing
3. **Check logs** - Railway has great log viewer
4. **Use health endpoint** - `/api/health` to verify
5. **Test locally first** - Use Docker for safety

---

## 📞 Need Help?

1. Check Railway/Render documentation
2. View deployment logs
3. Test locally with Docker first
4. Verify all environment variables

---

**Ready to deploy?** Choose Railway and you'll be live in 20 minutes! 🚀
