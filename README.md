# 🚀 AI-Powered Ebook Generator - Complete SaaS Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![React](https://img.shields.io/badge/React-v18+-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-v8+-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)

**A fully functional, production-ready SaaS platform for generating professional ebooks using AI**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo) • [Support](#-support)

</div>

---

## 📖 Overview

Transform your ideas into complete, professionally-formatted ebooks in minutes using the power of AI. This platform provides everything you need to run a successful ebook generation SaaS business, including user authentication, subscription management, AI-powered content generation, rich text editing, and multi-format export capabilities.

### ✨ What Makes This Special

- **🎯 Production Ready**: Fully tested and ready to deploy
- **🔐 Enterprise Security**: JWT auth, rate limiting, input validation
- **💰 Monetization Built-In**: Stripe integration with 4 subscription tiers
- **🤖 AI-Powered**: Uses Anthropic's Claude for high-quality content
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **👨‍💼 Admin Panel**: Complete management dashboard
- **📊 Analytics**: Track usage, revenue, and performance

## 🎯 Features

### 🔐 Authentication & User Management
- ✅ User registration with email verification
- ✅ Secure login/logout with JWT tokens
- ✅ Password recovery and reset flow
- ✅ Session management
- ✅ User profile management
- ✅ Role-based access control (admin, user, premium)

### 📚 AI-Powered Ebook Generation
- ✅ Multi-chapter ebook creation (5-20 chapters)
- ✅ Topic/niche input system
- ✅ Customizable parameters:
  - Number of chapters
  - Words per chapter (500-5000)
  - Tone/style (professional, casual, academic, creative)
  - Target audience specification
- ✅ Auto-generated table of contents
- ✅ Introduction and conclusion generation
- ✅ Progress tracking with real-time updates

### ✏️ Rich Text Editor
- ✅ ReactQuill-based WYSIWYG editor
- ✅ Chapter management (add, delete, reorder)
- ✅ Real-time preview mode
- ✅ AI-assisted content regeneration
- ✅ Word count tracking
- ✅ Auto-save functionality

### 📤 Export & Download
- ✅ **PDF** - Professional formatting
- ✅ **EPUB** - For e-readers
- ✅ **MOBI** - For Kindle devices
- ✅ **DOCX** - For Microsoft Word editing
- ✅ Custom cover page generation
- ✅ One-click download

### 💳 Subscription & Payments
- ✅ Stripe integration (test and live modes)
- ✅ Credit-based usage tracking
- ✅ 4 subscription tiers (Free, Basic, Pro, Enterprise)
- ✅ Subscription management (upgrade, downgrade, cancel)
- ✅ Payment history and invoicing
- ✅ Webhook handling for automated billing

### 🎨 Template Library
- ✅ Pre-built templates by niche:
  - Business & Marketing
  - Self-help & Motivation
  - Technical & How-to guides
  - Fiction & Creative writing
  - Educational & Training materials
- ✅ Customizable template structures
- ✅ Premium and free templates

### 👨‍💼 Admin Panel
- ✅ System analytics dashboard
- ✅ User management (view, edit, suspend)
- ✅ Content moderation
- ✅ Revenue tracking
- ✅ Subscription management
- ✅ Template management

### 🛡️ Security Features
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Rate limiting (100 requests/15 min)
- ✅ SQL injection prevention
- ✅ XSS protection (Helmet.js)
- ✅ Input validation & sanitization
- ✅ CSRF protection

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js v16+ 
- MySQL 8.0+
- npm or yarn
```

### Installation (5 minutes)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd ebook-ai-generator

# 2. Install all dependencies
npm run install-all

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 4. Setup database
mysql -u root -p
CREATE DATABASE ebook_generator;
exit;

# 5. Run migrations and seed data
npm run migrate
node server/migrations/seed.js

# 6. Start development server
npm run dev
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 🔑 Required API Keys

1. **Anthropic API** (AI generation): https://console.anthropic.com/
2. **Stripe** (payments): https://stripe.com/
3. **SMTP Email** (notifications): Gmail, SendGrid, etc.

Add these to your `.env` file - see `.env.example` for all configuration options.

## 📁 Project Structure

```
ebook-ai-generator/
├── 📂 server/                   # Backend (Node.js + Express)
│   ├── 📂 config/              # Database configuration
│   ├── 📂 controllers/         # Business logic
│   ├── 📂 middleware/          # Auth, validation, etc.
│   ├── 📂 models/              # Database models (Sequelize)
│   ├── 📂 routes/              # API endpoints
│   ├── 📂 services/            # AI & export services
│   ├── 📂 utils/               # Helpers (JWT, email, logging)
│   └── 📄 index.js             # Server entry point
│
├── 📂 client/                   # Frontend (React + Tailwind)
│   ├── 📂 public/
│   └── 📂 src/
│       ├── 📂 components/      # Reusable components
│       ├── 📂 context/         # React Context (Auth)
│       ├── 📂 pages/           # Page components
│       │   ├── Landing.js
│       │   ├── Dashboard.js
│       │   ├── EbookCreator.js
│       │   ├── EbookEditor.js
│       │   └── admin/          # Admin pages
│       ├── App.js
│       └── index.js
│
├── 📂 uploads/                  # Generated files
├── 📂 logs/                     # Application logs
├── 📄 .env                      # Environment variables
├── 📄 package.json              # Dependencies
├── 📄 Dockerfile                # Docker configuration
├── 📄 docker-compose.yml        # Docker Compose setup
└── 📄 README.md                 # This file
```

## 🎨 Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MySQL 8.0 with Sequelize ORM
- **Authentication**: JWT + bcrypt
- **AI Integration**: Anthropic Claude API
- **Payments**: Stripe
- **Email**: Nodemailer (SMTP)
- **File Storage**: Local/AWS S3
- **Security**: Helmet.js, express-rate-limit

### Frontend
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Editor**: ReactQuill
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

## 📚 Documentation

- **[📖 Installation Guide](INSTALLATION.md)** - Detailed setup instructions
- **[🚀 Deployment Guide](DEPLOYMENT.md)** - Production deployment (VPS, Docker, Heroku)
- **[📋 Project Summary](PROJECT_SUMMARY.md)** - Complete feature overview
- **[🤝 Contributing](CONTRIBUTING.md)** - How to contribute

## 💰 Subscription Tiers

| Feature | Free | Basic ($19/mo) | Pro ($49/mo) | Enterprise ($199/mo) |
|---------|------|----------------|--------------|----------------------|
| Ebook Generations | 3 total | 50/month | Unlimited | Unlimited |
| Templates | Basic | All | All + Custom | All + Custom |
| Export Formats | PDF only | All formats | All formats | All formats |
| Support | Community | Email | Priority | Dedicated |
| API Access | ❌ | ❌ | ✅ | ✅ |
| White-label | ❌ | ❌ | ❌ | ✅ |

## 🎬 Demo

### User Flow
1. **Register** → Email verification → Dashboard
2. **Create Ebook** → Choose parameters → AI generates content
3. **Edit** → Rich text editor → Customize chapters
4. **Export** → Download in preferred format (PDF/EPUB/MOBI/DOCX)

### Admin Flow
1. **Login as Admin** → Access admin panel
2. **View Statistics** → Users, ebooks, revenue
3. **Manage Users** → View, edit, delete users
4. **Monitor Content** → Review generated ebooks

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
GET    /api/auth/verify-email/:token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
```

### Ebooks
```
GET    /api/ebooks                 # Get user's ebooks
POST   /api/ebooks                 # Create new ebook
GET    /api/ebooks/:id             # Get ebook details
PUT    /api/ebooks/:id             # Update ebook
DELETE /api/ebooks/:id             # Delete ebook
POST   /api/ebooks/:id/generate    # Generate content
POST   /api/ebooks/:id/export      # Export to format
```

### Subscriptions
```
GET    /api/subscriptions/plans
POST   /api/subscriptions/create-checkout-session
POST   /api/subscriptions/webhook  # Stripe webhooks
```

### Admin (Protected)
```
GET    /api/admin/stats            # System statistics
GET    /api/admin/users            # All users
GET    /api/admin/ebooks           # All ebooks
```

## 🐳 Docker Deployment

```bash
# Quick start with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔒 Security

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Rate limiting: 100 requests per 15 minutes
- ✅ Helmet.js for HTTP headers security
- ✅ Input validation with express-validator
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ XSS protection
- ✅ CSRF protection

## 📊 Database Schema

```sql
users           # User accounts
├── ebooks      # User's ebooks
│   └── chapters    # Ebook chapters
├── subscriptions   # Subscription records
└── payments        # Payment history

templates       # Ebook templates
```

## 🛠️ Development

```bash
# Run backend only
npm run server

# Run frontend only
npm run client

# Run both concurrently
npm run dev

# Build for production
npm run build

# Run production
npm start
```

## 🚢 Deployment Options

1. **VPS** (DigitalOcean, AWS EC2, Linode)
   - Full control, see [DEPLOYMENT.md](DEPLOYMENT.md)
   
2. **Docker**
   - One-command deploy with `docker-compose up`
   
3. **PaaS** (Heroku, Railway, Render)
   - Push-to-deploy, managed services
   
4. **Serverless** (AWS Lambda, Vercel)
   - Auto-scaling, pay-per-use

## 📈 Performance

- 🚀 AI generation: 5-10 minutes for full ebook
- ⚡ API response time: < 200ms average
- 💾 Database queries optimized with indexes
- 🎨 Frontend code-splitting with React lazy loading
- 📦 Static assets cached

## 🐛 Troubleshooting

### Common Issues

**AI Generation Not Working**
```bash
# Check Anthropic API key
echo $ANTHROPIC_API_KEY

# Check logs
tail -f logs/error.log
```

**Database Connection Failed**
```bash
# Verify MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

**Port Already in Use**
```bash
# Change PORT in .env
PORT=5001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Commit message conventions
- Pull request process
- Bug reporting

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 💬 Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our community]
- 🐛 Issues: [GitHub Issues]
- 📖 Docs: See markdown files in root directory

## 🌟 Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] AI image generation for covers
- [ ] Multi-language support
- [ ] Collaborative editing
- [ ] Ebook marketplace
- [ ] Analytics dashboard
- [ ] Integration with publishing platforms
- [ ] Custom AI model training

## 👏 Acknowledgments

- Anthropic for Claude API
- Stripe for payment processing
- React community for amazing tools
- All open-source contributors

## 📞 Contact

**Project Maintainer**: Your Name
- GitHub: [@yourusername]
- Email: your.email@example.com
- Website: https://yourdomain.com

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by developers, for developers

[Get Started](#-quick-start) • [View Demo](#-demo) • [Report Bug](issues) • [Request Feature](issues)

</div>
"# ebook-generator" 
