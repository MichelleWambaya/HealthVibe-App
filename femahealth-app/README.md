# 🌿 HealthVibe - Natural Healing Made Simple

A modern, intuitive web application for discovering and managing natural home remedies. Built with Next.js, Supabase, and Tailwind CSS.

![HealthVibe App](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📱 Features

### 🔍 **AI-Powered Remedy Search**
- Search for any health concern and get instant AI-generated remedies
- Top 3 personalized natural solutions for each query
- Detailed ingredients, instructions, and preparation time
- Bookmark your favorite remedies

### 🌱 **Browse Natural Remedies**
- Pinterest-style masonry layout
- Categories: Stress, Digestive, Respiratory, Skin, Sleep, Pain Relief, Immune, Mental Health
- Creator attribution and user-generated content
- Rating and review system

### 🏥 **Find Medical Centers**
- Location-based search for nearby health facilities
- Filter by specialty (Body, Optical, Gyno, Ortho, etc.)
- Real-time data with contact information and directions
- Live wait times and facility services

### 👤 **User Profiles & Authentication**
- Secure sign-up and sign-in with Supabase
- Profile image upload and management
- Personal statistics and activity tracking
- Bookmark management and preferences

### 🎨 **Modern UI/UX**
- Clean, meditation-app inspired design
- Light and dark theme support
- Responsive design for all devices
- Smooth animations and transitions
- Accessibility-focused design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for authentication and storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthvibe-app.git
   cd healthvibe-app/femahealth-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor
   - For profile images, also run `supabase-profile-images.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
femahealth-app/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── search/            # AI remedy search
│   │   ├── remedies/          # Browse remedies
│   │   ├── medical-centers/   # Find medical centers
│   │   ├── profile/           # User profile
│   │   └── categories/        # Health categories
│   ├── components/            # Reusable components
│   │   ├── Header.tsx         # App header with profile
│   │   ├── BottomNavigation.tsx # Mobile navigation
│   │   ├── AuthProvider.tsx   # Authentication context
│   │   └── ThemeProvider.tsx  # Theme management
│   └── lib/                   # Utilities and services
│       ├── supabase.ts        # Supabase client
│       ├── data.ts           # Static data and helpers
│       └── profile-image-service.ts # Image upload service
├── supabase-schema.sql        # Database schema
├── supabase-profile-images.sql # Profile image setup
└── tailwind.config.ts         # Tailwind configuration
```

## 🎯 How to Use

### For End Users

1. **Sign Up/In**: Create an account or sign in to access all features
2. **Search Remedies**: Use the AI search to find remedies for any health concern
3. **Browse Categories**: Explore remedies by health category
4. **Find Medical Centers**: Locate nearby healthcare facilities
5. **Manage Profile**: Upload profile picture and track your health journey

### For Developers

1. **Customize Themes**: Modify colors in `tailwind.config.ts`
2. **Add New Categories**: Update the categories array in `src/lib/data.ts`
3. **Extend AI Search**: Enhance the AI remedy generation in `src/app/search/page.tsx`
4. **Add New Features**: Follow the existing component patterns

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.5.4, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Heroicons
- **Fonts**: Abril Fatface (headings), Montserrat (body)
- **Deployment**: Vercel-ready

## 🎨 Design System

### Colors
- **Primary Green**: #059669
- **Secondary Green**: #10b981
- **Accent Green**: #34d399
- **Background**: White/Slate-900 (dark mode)

### Typography
- **Headings**: Abril Fatface (serif, elegant)
- **Body**: Montserrat (sans-serif, readable)

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Navigation**: Bottom navigation (mobile), side navigation (desktop)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Bottom nav on mobile, side nav on desktop
- **Images**: Responsive with proper aspect ratios

## 🔒 Security Features

- **Authentication**: Supabase Auth with email/password
- **Row Level Security**: Database policies for data protection
- **Input Validation**: Sanitized user inputs
- **File Upload**: Secure image upload with validation
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy**: Vercel will automatically build and deploy

### Other Platforms

The app is compatible with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for backend services
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for beautiful icons
- **Unsplash** for high-quality images

## 📞 Support

If you have any questions or need help:

1. **Check the documentation** in the `/docs` folder
2. **Open an issue** on GitHub
3. **Contact the maintainers**

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Community features (reviews, comments)
- [ ] Prescription tracking
- [ ] Health journal
- [ ] Integration with health devices
- [ ] Multi-language support

---

**Made with ❤️ for better health and wellness**

*HealthVibe - Your natural healing companion*