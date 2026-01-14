# ⚡ QUICK DEPLOY COMMANDS

Copy-paste these commands for each deployment method.

---

## 🎯 STEP 1: PUSH TO GITHUB (Required for all)

```bash
# Navigate to your project
cd C:\Users\Installation\Desktop\ebook1

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Deploy ebook generator"

# Create main branch
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ebook-generator.git

# Push to GitHub
git push -u origin main
```

**If you get an error about remote already exists:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ebook-generator.git
git push -u origin main
```

---

## 🥇 OPTION 1: REPLIT (1 Minute)

### Commands:
```
No commands needed!
Just go to: https://replit.com
Import from GitHub
Click Run
```

### URL Format:
`https://ebook-generator.YOUR_USERNAME.repl.co`

---

## 🥈 OPTION 2: RAILWAY (5 Minutes)

### Initial Setup:
```
1. Go to: https://railway.app
2. Login with GitHub
3. New Project → Deploy from GitHub
4. Select your repository
5. Add MySQL database (New → Database → MySQL)
```

### Run Migrations:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project (follow prompts)
railway link

# Run migrations
railway run node server/migrations/migrate.js

# Seed data
railway run node server/migrations/seed.js
```

### Environment Variables (Add in Railway Dashboard):
```env
NODE_ENV=production
JWT_SECRET=your_random_32_character_secret_key_here
ANTHROPIC_API_KEY=your_anthropic_key_if_you_have_it
STRIPE_SECRET_KEY=your_stripe_key_if_you_have_it
```

### URL Format:
`https://your-app.up.railway.app`

---

## 🥉 OPTION 3: VERCEL + RAILWAY (10 Minutes)

### Backend (Railway):
Follow Option 2 above, then note your Railway URL.

### Frontend (Vercel):

**1. Create vercel.json in project root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ]
}
```

**2. Update client/.env:**
```env
REACT_APP_API_URL=https://your-railway-url.up.railway.app
```

**3. Commit and push:**
```bash
git add .
git commit -m "Configure for Vercel"
git push
```

**4. Deploy to Vercel:**
```
1. Go to: https://vercel.com
2. Import Project
3. Select your GitHub repo
4. Root Directory: client
5. Build Command: npm run build
6. Output Directory: build
7. Environment Variable: REACT_APP_API_URL = your-railway-url
8. Deploy!
```

### Frontend URL Format:
`https://your-app.vercel.app`

### Backend URL Format:
`https://your-app.up.railway.app`

---

## 🔍 VERIFICATION COMMANDS

### Test Backend Health:
```bash
curl https://your-app.up.railway.app/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend:
Open in browser:
```
https://your-app.vercel.app
or
https://your-app.up.railway.app
```

---

## 🐛 TROUBLESHOOTING COMMANDS

### Check Git Status:
```bash
git status
```

### Check Git Remote:
```bash
git remote -v
```

### Force Push (if needed):
```bash
git push -u origin main --force
```

### Check Railway Logs:
```bash
railway logs
```

### Restart Railway Service:
```bash
railway restart
```

---

## 📝 COMMON ISSUES

### "Permission denied"
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### "Repository not found"
Make sure you created the repository on GitHub first!
Go to: https://github.com/new

### "Failed to push"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] MySQL database added
- [ ] Migrations run
- [ ] Environment variables set
- [ ] Site accessible
- [ ] Can register/login
- [ ] No errors in logs

---

## 🎉 DONE!

Your ebook generator is now deployed and accessible online!

**Test it:**
1. Open your deployment URL
2. Click "Register"
3. Create account
4. Login
5. Create ebook!

**Share your URL with others!** 🚀
