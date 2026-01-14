# 🚀 DEPLOY STEP-BY-STEP GUIDE

You chose: All three options! Let's do them in order.

---

## 🥇 STEP 1: REPLIT (1 Minute - Quick Demo)

### Prerequisites:
- Your code needs to be on GitHub first

### Steps:

**A. Push to GitHub (if not done):**

```bash
cd C:\Users\Installation\Desktop\ebook1

# Initialize git
git init
git add .
git commit -m "Deploy to Replit"
git branch -M main

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/ebook-generator.git
git push -u origin main
```

**B. Deploy to Replit:**

1. Go to: https://replit.com
2. Sign up/Login (use GitHub)
3. Click "Create Repl"
4. Click "Import from GitHub"
5. Paste your repo URL: `https://github.com/YOUR_USERNAME/ebook-generator`
6. Click "Import from GitHub"
7. Wait 1 minute for setup
8. Click "Run"

**Done!** Replit gives you a URL: `https://ebook-generator.YOUR_USERNAME.repl.co`

### Note:
Replit uses SQLite (not MySQL), so some features work differently. Good for quick demo!

---

## 🥈 STEP 2: RAILWAY (5 Minutes - Production)

### Prerequisites:
- GitHub account
- Code pushed to GitHub

### Steps:

**A. Create Railway Account:**

1. Go to: https://railway.app
2. Click "Login"
3. Sign in with GitHub
4. Authorize Railway

**B. Create New Project:**

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `ebook-generator`
4. Railway starts deploying automatically!

**C. Add MySQL Database:**

1. In your project, click "New"
2. Click "Database"
3. Select "MySQL"
4. Wait 30 seconds - Database created!

**D. Configure Environment Variables:**

1. Click on your service (not the database)
2. Go to "Variables" tab
3. Add these variables:

```env
NODE_ENV=production
PORT=$PORT
DATABASE_URL=${{MySQL.DATABASE_URL}}

# Required
JWT_SECRET=your_super_secret_key_min_32_characters_change_this

# Optional (add if you have them)
ANTHROPIC_API_KEY=your_anthropic_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com
```

**E. Run Migrations:**

Option 1 - Using Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run node server/migrations/migrate.js
railway run node server/migrations/seed.js
```

Option 2 - Using Railway Dashboard:
1. Go to your service
2. Click "Deployments"
3. Click on latest deployment
4. Click "View Logs"
5. You can run commands from there

**F. Access Your Site:**

1. Click on your service
2. Go to "Settings" tab
3. Under "Domains", Railway shows your URL
4. Click it!

**Your site is LIVE!** 🎉

URL format: `https://your-app.up.railway.app`

---

## 🥉 STEP 3: VERCEL + RAILWAY (10 Minutes - Best Performance)

### Why this combo?
- Vercel = Super fast frontend (Edge network)
- Railway = Backend + Database
- Best of both worlds!

### A. Deploy Backend to Railway:

Follow all steps from STEP 2 above ☝️

After deployment, note your Railway backend URL:
`https://your-app.up.railway.app`

### B. Update Frontend for Vercel:

**1. Create vercel.json:**

Create this file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-railway-backend-url.up.railway.app"
  }
}
```

**2. Update client/.env:**

```env
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app
```

**3. Update axios config (client/src/index.js or api config):**

Add this at the top:
```javascript
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

**4. Push changes:**

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### C. Deploy Frontend to Vercel:

1. Go to: https://vercel.com
2. Click "Sign Up" (use GitHub)
3. Click "Import Project"
4. Click "Import Git Repository"
5. Select your GitHub repo
6. Configure:
   - Framework Preset: Create React App
   - Root Directory: client
   - Build Command: `npm run build`
   - Output Directory: `build`
7. Environment Variables:
   - Add: `REACT_APP_API_URL` = `https://your-railway-backend-url.up.railway.app`
8. Click "Deploy"

Wait 2 minutes...

**Done!** Vercel gives you a URL: `https://your-app.vercel.app`

### D. Update Backend CORS:

In Railway, add environment variable:
```env
CLIENT_URL=https://your-app.vercel.app
```

Redeploy backend if needed.

---

## 🎯 SUMMARY OF YOUR DEPLOYMENTS

After completing all three:

| Platform | URL | Type | Use Case |
|----------|-----|------|----------|
| **Replit** | `your-app.repl.co` | Full Stack | Quick Demo |
| **Railway** | `your-app.up.railway.app` | Full Stack | Production |
| **Vercel + Railway** | `your-app.vercel.app` | Separate | Best Performance |

---

## ✅ POST-DEPLOYMENT CHECKLIST

For each deployment:

- [ ] Site loads without errors
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard displays
- [ ] Templates page works
- [ ] Can create ebook (if API keys added)
- [ ] No console errors

---

## 🔧 TROUBLESHOOTING

### "Build Failed"
- Check package.json
- Check build logs
- Verify all dependencies listed

### "Database Connection Failed"
- Check DATABASE_URL is set
- Verify MySQL database is running
- Check connection string format

### "Cannot connect to backend"
- Check CORS settings
- Verify CLIENT_URL is set
- Check API URL in frontend

### "API Key errors"
- Add ANTHROPIC_API_KEY for AI features
- Add STRIPE keys for payments
- Check .env variables are set

---

## 🎊 CONGRATULATIONS!

You now have your ebook generator deployed in 3 different ways!

**Choose which one to use:**
- **Quick Demo:** Use Replit
- **Production:** Use Railway
- **Best Performance:** Use Vercel + Railway

---

## 📞 NEED HELP?

Check the deployment logs in each platform:
- **Replit:** Console tab
- **Railway:** Deployments → View Logs
- **Vercel:** Deployments → View Function Logs

---

## 🚀 NEXT STEPS

1. Add custom domain (optional)
2. Add SSL certificate (automatic on all platforms)
3. Add API keys for full functionality
4. Test all features
5. Share your URL!

**Your ebook generation platform is LIVE!** 🎉
