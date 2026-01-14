# 🧪 Testing the Application Locally

## Current Status Check

✅ Project structure created
✅ Node.js installed (v24.12.0)
✅ npm available (v11.6.2)
⚠️ Dependencies need to be installed
⚠️ MySQL needs to be installed/configured
⚠️ Environment variables need API keys

## Step-by-Step Testing Guide

### Step 1: Install Dependencies (5 minutes)

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

**Expected result**: `node_modules` folders created in root and client directories

### Step 2: Install and Configure MySQL

#### Option A: Using XAMPP (Easiest for Windows)
1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP
3. Start Apache and MySQL from XAMPP Control Panel
4. Open phpMyAdmin: http://localhost/phpmyadmin
5. Create database: `ebook_generator`

#### Option B: Using MySQL Installer
1. Download: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Set root password
4. Start MySQL service

#### Option C: Using Docker (Alternative)
```bash
docker run --name mysql-ebook -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=ebook_generator -p 3306:3306 -d mysql:8.0
```

### Step 3: Update Environment Variables

Edit `.env` file with these MINIMUM required values:

```env
# Database (update with your MySQL password)
DB_PASSWORD=your_mysql_password

# JWT (can use this for testing)
JWT_SECRET=test_secret_key_for_local_development_only_min_32_chars

# For testing WITHOUT actual API keys, you can proceed
# But AI generation won't work until you add real keys
```

**To test with full functionality, add:**

1. **Anthropic API Key** (for AI generation)
   - Sign up: https://console.anthropic.com/
   - Get API key
   - Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-xxxxx`

2. **Email (optional for testing - can skip verification)**
   - Use Gmail App Password
   - Or skip and manually verify users in database

3. **Stripe (optional for testing - can test without payments)**
   - Use test keys from https://stripe.com/

### Step 4: Create Database

```bash
# Using MySQL command line
mysql -u root -p
# Enter your password

CREATE DATABASE ebook_generator;
exit;
```

**Or using phpMyAdmin:**
- Go to http://localhost/phpmyadmin
- Click "New" 
- Database name: `ebook_generator`
- Click "Create"

### Step 5: Run Migrations

```bash
# This creates all database tables
node server/migrations/migrate.js
```

**Expected output:**
```
Database synchronized successfully
```

### Step 6: Seed Sample Data (Templates)

```bash
node server/migrations/seed.js
```

**Expected output:**
```
Database seeding completed successfully
```

### Step 7: Start the Application

#### Option A: Start Both Servers (Recommended)
```bash
npm run dev
```

#### Option B: Start Separately (for debugging)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

**Expected output:**
- Backend: `Server running on port 5000`
- Frontend: `Compiled successfully!`

### Step 8: Access the Application

**Open your browser:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

**You should see:**
- Beautiful landing page
- Navigation menu
- "Get Started" button

### Step 9: Test Core Features

#### A. Test Registration & Login
1. Click "Get Started" or "Register"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Create Account"
4. **Note**: Email verification won't work without email config
   - **Workaround**: Manually verify in database:
     ```sql
     UPDATE users SET is_verified = 1 WHERE email = 'test@example.com';
     ```

#### B. Test Login
1. Go to Login page
2. Enter credentials
3. Should redirect to Dashboard

#### C. Test Dashboard
1. Should see:
   - Welcome message
   - Statistics cards (0 ebooks, 3 credits)
   - "Create New Ebook" button
   - Recent ebooks section (empty)

#### D. Test Ebook Creator (WITHOUT AI)
1. Click "Create New Ebook"
2. Fill in Step 1:
   - Title: "Test Ebook"
   - Topic: "Testing"
   - Description: "This is a test"
3. Click "Next"
4. Fill in Step 2 (use defaults)
5. Click "Next"
6. Review and click "Generate Ebook"
7. **Note**: Without Anthropic API key, generation will fail
   - This is expected!

#### E. Test with Mock Data (Manual Testing)
Since AI generation requires API key, let's test other features:

1. **Templates Page**: 
   - Go to http://localhost:3000/templates
   - Should see 5 pre-loaded templates

2. **Pricing Page**:
   - Go to http://localhost:3000/pricing
   - Should see 4 pricing tiers

3. **Settings Page**:
   - Go to http://localhost:3000/settings
   - Test profile update
   - Test password change

4. **Admin Panel** (make yourself admin first):
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'test@example.com';
   ```
   - Go to http://localhost:3000/admin
   - Should see admin dashboard with stats

## Troubleshooting Common Issues

### Issue 1: "Cannot connect to database"

**Solution:**
```bash
# Check if MySQL is running
# For XAMPP: Start MySQL in XAMPP Control Panel
# For Windows Service:
net start MySQL80

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue 2: "Port 3000 already in use"

**Solution:**
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Issue 3: "Port 5000 already in use"

**Solution:**
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

### Issue 4: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm install
cd client && npm install && cd ..
```

### Issue 5: "AI generation failed"

**Expected** - You need a real Anthropic API key:
1. Sign up at https://console.anthropic.com/
2. Get your API key
3. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-xxxxx`
4. Restart the server

### Issue 6: "Email not sending"

**Expected** - For testing, you can:
- Skip email verification
- Manually verify users in database:
  ```sql
  UPDATE users SET is_verified = 1 WHERE email = 'your@email.com';
  ```

## Testing Checklist

### Basic Functionality (Can test without API keys)
- [ ] Application starts without errors
- [ ] Landing page loads
- [ ] Can register new user
- [ ] Can login (after manual verification)
- [ ] Dashboard displays correctly
- [ ] Templates page shows 5 templates
- [ ] Pricing page displays
- [ ] Settings page works
- [ ] Profile update works
- [ ] Password change works
- [ ] Can logout
- [ ] Admin panel accessible (after role change)

### Advanced Functionality (Requires API keys)
- [ ] AI ebook generation works
- [ ] Email verification works
- [ ] Password reset emails work
- [ ] Stripe payments work
- [ ] Subscription management works

### With Anthropic API Key
- [ ] Can create ebook
- [ ] AI generates table of contents
- [ ] AI generates chapters
- [ ] Progress tracking works
- [ ] Chapter editing works
- [ ] Export to PDF works
- [ ] Export to EPUB works
- [ ] Export to MOBI works
- [ ] Export to DOCX works

## Quick Test Without API Keys

You can test the platform without external API keys by:

1. **Install dependencies** ✅
2. **Setup MySQL database** ✅
3. **Run migrations** ✅
4. **Start the app** ✅
5. **Test UI/UX** ✅
6. **Test authentication** ✅
7. **Test dashboard** ✅
8. **Test admin panel** ✅

**What won't work without API keys:**
- ❌ AI ebook generation (needs Anthropic)
- ❌ Email sending (needs SMTP)
- ❌ Payment processing (needs Stripe)

**But you can still verify:**
- ✅ All pages load correctly
- ✅ Forms work
- ✅ Navigation works
- ✅ Database integration works
- ✅ Authentication works
- ✅ UI/UX is professional
- ✅ No console errors (except API key related)

## Expected Console Output

### Successful Start:

**Backend (Terminal 1):**
```
info: Database synchronized successfully
info: Server running on port 5000 in development mode
```

**Frontend (Terminal 2):**
```
Compiled successfully!

You can now view ebook-ai-generator-client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

## Performance Benchmarks

After successful start, check:
- Frontend loads in < 2 seconds
- API responds in < 100ms (health check)
- No memory leaks
- No console errors (except missing API keys)

## Next Steps After Local Testing

1. ✅ **Verify core functionality works**
2. ✅ **Get real API keys for full testing**
3. ✅ **Test ebook generation with real AI**
4. ✅ **Test payment flow with Stripe test mode**
5. ✅ **Customize branding/content**
6. ✅ **Deploy to production**

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Check `logs/error.log` for backend errors
3. Check browser console for frontend errors
4. Verify all dependencies are installed
5. Ensure MySQL is running
6. Check `.env` configuration

## Summary

To test locally, you ONLY need:
1. Node.js ✅ (installed)
2. MySQL ⚠️ (needs setup)
3. Dependencies ⚠️ (needs installation)

Everything else (API keys) is optional for basic testing!

---

**Ready to start?** Follow steps 1-8 above! 🚀
