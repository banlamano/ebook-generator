# 🚀 Deploy to Render - Complete Guide

## Why Render?
- ✅ 100% FREE (no credit card required!)
- ✅ Free PostgreSQL database included
- ✅ 750 free hours per month
- ✅ Automatic SSL
- ✅ Easy setup
- ✅ Production-ready

---

## STEP-BY-STEP DEPLOYMENT (10 Minutes)

### STEP 1: Create Render Account (2 min)

1. Go to: **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access GitHub

---

### STEP 2: Create PostgreSQL Database (2 min)

1. In Render dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `ebook-generator-db`
   - **Database:** `ebook_generator`
   - **User:** `ebook_user` (auto-generated)
   - **Region:** Choose closest to you
   - **Plan:** Select **"Free"** ✅
4. Click **"Create Database"**
5. Wait 1 minute for creation
6. **IMPORTANT:** Copy the **Internal Database URL** (you'll need this!)

---

### STEP 3: Create Web Service (3 min)

1. Click **"New +"** again
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Select your GitHub repo: **ebook-generator**
5. Configure:

**Basic Settings:**
- **Name:** `ebook-generator`
- **Region:** Same as database
- **Branch:** `main`
- **Root Directory:** (leave empty)
- **Runtime:** `Node`
- **Build Command:** 
  ```
  npm install && cd client && npm install && npm run build && cd ..
  ```
- **Start Command:**
  ```
  npm start
  ```

**Plan:**
- Select **"Free"** ✅

6. Click **"Create Web Service"**

---

### STEP 4: Add Environment Variables (2 min)

1. In your web service, go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add these variables:

```env
NODE_ENV=production

# Database (use Internal Database URL from Step 2)
DATABASE_URL=your_postgresql_internal_url_here

# JWT Secret
JWT_SECRET=render_production_secret_key_minimum_32_characters

# Optional (add if you have them)
ANTHROPIC_API_KEY=your_anthropic_key
STRIPE_SECRET_KEY=your_stripe_test_key
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

4. Click **"Save Changes"**

---

### STEP 5: Update Database Config for PostgreSQL

**Option A: In Render, edit the file directly**

Go to your service → **Shell** tab

**Option B: Update locally and push to GitHub**

Update `server/config/database.js`:

```javascript
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Support both MySQL and PostgreSQL
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME || 'ebook_generator',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
      }
    );

module.exports = sequelize;
```

**Then install PostgreSQL driver:**

Add to `package.json` dependencies:
```json
"pg": "^8.11.3",
"pg-hstore": "^2.3.4"
```

Push to GitHub:
```bash
git add .
git commit -m "Add PostgreSQL support for Render"
git push
```

Render will auto-deploy!

---

### STEP 6: Run Migrations

After deployment completes:

1. Go to your web service
2. Click **"Shell"** tab (at the top)
3. Wait for shell to load
4. Run:

```bash
node server/migrations/migrate.js
```

Then:
```bash
node server/migrations/seed.js
```

---

### STEP 7: Access Your Site!

1. Render shows your URL at the top of the dashboard
2. Format: `https://ebook-generator.onrender.com`
3. Click it!

**✅ Your site is LIVE!**

---

## TESTING YOUR DEPLOYMENT

1. Open your Render URL
2. Click **"Register"**
3. Create an account
4. Login
5. Try creating an ebook
6. Everything works! ✅

---

## TROUBLESHOOTING

### "Application failed to respond"
**Wait 1-2 minutes** - Render free tier takes time to start up on first request.

### "Database connection failed"
- Check DATABASE_URL is set correctly
- Verify database is created
- Check logs in Dashboard → Logs tab

### "Build failed"
- Check build command is correct
- View logs for specific error
- Make sure all dependencies are in package.json

### "Module not found"
Add missing dependency to package.json:
```bash
npm install package-name --save
git add package.json
git commit -m "Add missing dependency"
git push
```

---

## UPDATING YOUR DEPLOYMENT

When you make changes:

```bash
git add .
git commit -m "Your changes"
git push
```

Render automatically redeploys! 🚀

---

## RENDER FREE TIER LIMITS

- ✅ 750 hours per month (25 days)
- ✅ Free PostgreSQL database (1GB)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start time: 30 seconds - 2 minutes

**For production:** Upgrade to paid plan ($7/month) for always-on

---

## KEEPING YOUR APP AWAKE (Free)

Use **UptimeRobot**:
1. Go to: https://uptimerobot.com
2. Create free account
3. Add new monitor
4. Monitor type: HTTP(s)
5. URL: Your Render URL
6. Interval: Every 5 minutes
7. Prevents sleeping!

---

## NEXT STEPS

After successful deployment:

1. ✅ Test all features
2. ✅ Add custom domain (optional)
3. ✅ Add API keys (Anthropic, Stripe)
4. ✅ Share your URL!
5. ✅ Consider upgrading for production use

---

## COST SUMMARY

**Development (Free):**
- Web Service: FREE (750 hrs/month)
- PostgreSQL: FREE (1GB storage)
- SSL: FREE
- **Total: $0/month**

**Production (Recommended):**
- Web Service: $7/month (always-on)
- PostgreSQL: $7/month (or keep free)
- **Total: $7-14/month**

---

## SUCCESS! 🎉

Your AI Ebook Generator is now deployed on Render!

**Your URL:** https://ebook-generator.onrender.com

**You can:**
- Share with anyone
- Use for production
- Add custom domain
- Scale as needed

**Congratulations!** 🚀
