# Gospool - Faith-Based Ride Sharing Platform

## 🚗⛪ Project Overview

Gospool is a comprehensive faith-based ride sharing platform that connects christian communities through reliable and free transportation solutions. The platform bridges the gap between isolated communities and their places of worship, ensuring that distance is no longer a barrier to church and community participation.

## ✨ Key Features

### **Public Platform**

- 🏠 **Homepage** - Hero section with call-to-action and platform overview
- 📊 **Impact Page** - Showcases community projects, success stories, and news
- 💝 **Sponsorship Page** - Donation portal with Paystack integration and sponsorship opportunities
- 🌙 **Dark/Light Mode** - Full theme support across all pages

### **Admin Dashboard**

- 🔐 **Secure Authentication** - Admin login with role-based access
- 📈 **Dashboard Overview** - Key metrics and platform statistics
- 💰 **Donations Management** - Track and manage all donations
- 🤝 **Sponsorships Management** - Handle sponsorship applications and partnerships
- 📋 **Projects Management** - Create and monitor community projects
- 📰 **News Management** - Publish and manage news articles
- 👥 **Team Management** - Manage team members and roles
- 🎓 **Advisors Management** - Handle advisor profiles and information
- 🏢 **Sponsors Management** - Maintain sponsor relationships
- 📄 **Applications Management** - Process various applications
- 👤 **User Management** - Admin user accounts and permissions
- 📊 **Impact Reports** - Generate and manage impact reports

### **Technical Features**

- 💳 **Paystack Integration** - Secure payment processing
- 🗄️ **Supabase Backend** - Database and authentication
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Fast Performance** - Optimized with Vite and modern React patterns
- 🎨 **Custom Branding** - Clean, professional UI with custom logos and favicon

## 🛠️ Technology Stack

### **Frontend**

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching

### **Backend & Services**

- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **Paystack** - Payment processing for donations
- **PostgreSQL** - Database (via Supabase)

### **Development Tools**

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🏗️ Project Structure

```
gospool-share-the-ride/
├── 📁 public/
│   ├── favicon.svg              # Custom Gospool favicon
│   ├── placeholder.svg
│   ├── robots.txt
│   └── 📁 images/
│       ├── Logo mark v2 dark.png    # Dark logo for light backgrounds
│       └── Logomark v1 white.png    # White logo for dark backgrounds
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 admin/            # Admin dashboard components
│   │   ├── 📁 impact/           # Impact page components
│   │   ├── 📁 sponsorship/      # Sponsorship page components
│   │   ├── 📁 shared/           # Reusable components
│   │   ├── 📁 ui/               # shadcn/ui components
│   │   ├── CallToAction.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── Navigation.tsx
│   │
│   ├── 📁 pages/
│   │   ├── 📁 admin/            # Admin dashboard pages
│   │   ├── Impact.tsx           # Public impact page
│   │   ├── Index.tsx            # Homepage
│   │   ├── NotFound.tsx         # 404 page
│   │   └── Sponsorship.tsx      # Public sponsorship page
│   │
│   ├── 📁 contexts/
│   │   └── AdminThemeContext.tsx
│   │
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 integrations/         # External service integrations
│   │   └── 📁 supabase/
│   ├── 📁 lib/                  # Utility libraries
│   ├── 📁 utils/                # Helper functions
│   └── App.tsx                  # Main app component
│
├── 📁 supabase/
│   ├── config.toml
│   ├── 📁 functions/            # Edge functions
│   │   ├── paystack-initialize/
│   │   └── paystack-verify/
│   └── 📁 migrations/           # Database migrations
│
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and npm
- Git

### **Installation**

1. **Clone the repository:**

```bash
git clone https://github.com/TemitopeDiana/gospool-share-the-ride.git
cd gospool-share-the-ride
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env.local
# Add your Supabase and Paystack credentials
```

4. **Start the development server:**

```bash
npm run dev
```

5. **Open your browser:**
   Navigate to `http://localhost:8080`

## 🌐 Application Routes

### **Public Routes**

- `/` - Homepage with hero section and platform overview
- `/impact` - Community impact stories, projects, and news
- `/sponsorship` - Donation portal and sponsorship opportunities

### **Admin Routes**

- `/admin/login` - Admin authentication
- `/admin` - Dashboard overview
- `/admin/donations` - Donations management
- `/admin/sponsorships` - Sponsorships management
- `/admin/projects` - Projects management
- `/admin/news` - News & announcements
- `/admin/team` - Team members management
- `/admin/advisors` - Advisors management
- `/admin/sponsors` - Sponsors management
- `/admin/applications` - Applications management
- `/admin/users` - Admin users management
- `/admin/reports` - Impact reports

## 🏗️ Build & Deployment

### **Build for Production**

```bash
npm run build
```

### **Preview Production Build**

```bash
npm run preview
```

### **Deployment Options**

- **Vercel** (Recommended) - Automatic deployments from Git
- **Netlify** - Static site deployment
- **AWS S3 + CloudFront** - Custom AWS deployment
- **Any static hosting provider**

## 🎨 Branding & Assets

- **Logo Files**: Located in `/public/images/`
  - Dark logo for light backgrounds
  - White logo for dark backgrounds
- **Favicon**: Custom SVG favicon with cross design
- **Color Scheme**:
  - Primary: `#2F5233` (Dark Green)
  - Accent: Various mint and teal shades
  - Supports full dark/light mode theming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Features in Detail

### **Donation System**

- Secure Paystack integration
- Multiple donation amounts
- Recurring donation options
- Real-time payment verification

### **Impact Tracking**

- Project progress monitoring
- Community success stories
- Financial transparency
- Regular impact reports

### **Admin Management**

- Role-based access control
- Comprehensive dashboard
- Content management system
- User and sponsor management

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@gospool.com or join our community Discord.

---

**Built with ❤️ for Nigerian church communities**
