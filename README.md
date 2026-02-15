# Commands

## Development

```bash
npm run dev
```

# Marbrest Stone - Premium Portfolio Website

A luxury, high-end portfolio website for Marbrest Stone, specialists in marble and fine stone craftsmanship. Built with Next.js 14, Tailwind CSS, Framer Motion, and Supabase.

## 🎨 Features

- **Premium Design**: Minimalist luxury aesthetic with deep charcoal, white, and gold accents
- **Responsive**: Pixel-perfect on iPhone, iPad, and 4K Desktop monitors
- **Smooth Animations**: Parallax effects, fade-in-on-scroll, and smooth transitions
- **Dynamic Content**: Portfolio and testimonials managed through Supabase
- **Admin Portal**: Password-protected dashboard for content management
- **Video Support**: YouTube and Vimeo embed support for project showcases
- **Contact Form**: Professional inquiry form for international clients

## 📁 Project Structure

```
marbrest-stone/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── contact/            # Contact page
│   ├── portfolio/          # Portfolio page
│   ├── testimonials/       # Testimonials page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── admin/              # Admin components
│   ├── home/               # Landing page components
│   ├── Footer.tsx          # Footer component
│   └── Navigation.tsx      # Navigation component
├── lib/
│   └── supabase.ts         # Supabase client
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier works)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd marbrest-stone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon key
   - Run the SQL schema from `supabase-schema.sql` in the SQL Editor

4. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

Access the admin dashboard at `/admin` with your configured password (default: `admin123` for development).

### Admin Features:
- Add, edit, and delete projects
- Add, edit, and delete testimonials
- Toggle visibility of content
- Upload images and video URLs
- Manage categories and ratings

## 🎯 Pages

### Landing Page (`/`)
- Parallax hero section with stunning imagery
- Heritage story section with statistics
- Featured projects slider
- Call-to-action section

### Portfolio (`/portfolio`)
- Dynamic grid layout
- Category filtering
- Video embed support (YouTube/Vimeo)
- Hover effects and animations

### Testimonials (`/testimonials`)
- Elegant masonry layout
- Star ratings
- Client information
- Project type categorization

### Contact (`/contact`)
- Professional inquiry form
- Contact information
- Business hours
- Form validation

## 🎨 Design System

### Colors
- **Charcoal**: `#1a1a1a` (Primary dark)
- **White**: `#ffffff` (Primary light)
- **Gold**: `#d4af37` (Accent)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Animations
- Parallax scrolling effects
- Fade-in on scroll
- Smooth transitions
- Hover effects

## 📊 Database Schema

### Projects Table
- `id` (UUID, Primary Key)
- `title` (Text)
- `location` (Text)
- `description` (Text)
- `image_url` (Text)
- `video_url` (Text, Optional)
- `category` (Text: residential, commercial, hospitality, luxury)
- `visible` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Testimonials Table
- `id` (UUID, Primary Key)
- `client_name` (Text)
- `client_title` (Text)
- `company` (Text)
- `content` (Text)
- `rating` (Integer, 1-5)
- `project_type` (Text: residential, commercial, hospitality, luxury)
- `visible` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
