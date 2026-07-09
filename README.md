# AWLO Advertising - LED Billboard Website

A modern, responsive corporate website for **AWLO Advertising**, an Ethiopian company specializing in Digital LED Billboard Advertising. Built with Next.js, TypeScript, and Tailwind CSS.

![AWLO Advertising](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🎯 Project Overview

This is a professional demo website showcasing AWLO Advertising's LED billboard services. The website features:

- **10m × 7m LED Screen** - High-resolution digital billboard
- **40 Displays Daily** - Maximum brand exposure
- **Flexible Packages** - Weekly to yearly advertising plans
- **24/7 Visibility** - Day and night advertising power

## ✨ Features

### Design & UX
- 🎨 Modern, clean, and professional design
- 📱 Fully responsive (mobile, tablet, desktop)
- ✨ Smooth animations with Framer Motion
- 🌙 Dark hero section with LED billboard visual
- 🎭 Elegant color scheme (Blue #0057D9 & Yellow #FFD400)
- 🔤 Premium typography (Poppins + Inter fonts)

### Sections
1. **Navigation Bar** - Sticky, animated navbar with mobile menu
2. **Hero Section** - Eye-catching billboard visualization with CTAs
3. **About AWLO** - Company overview, mission, and vision
4. **Why Advertise With Us** - 6 benefit cards with icons
5. **Billboard Information** - Technical specifications
6. **Advertising Packages** - 5 pricing tiers (Weekly to Yearly)
7. **How It Works** - 4-step process visualization
8. **Gallery** - Masonry grid for billboard photos
9. **Contact Section** - Form + contact information
10. **Footer** - Company details, links, and social media

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd led-billboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📦 Tech Stack

- **Framework:** Next.js 15.0 (App Router)
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 11.5
- **Icons:** Lucide React 0.445
- **Fonts:** Google Fonts (Poppins + Inter)

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#0057D9` | Main brand color, CTAs |
| Primary Dark | `#003DA0` | Hover states |
| Secondary Yellow | `#FFD400` | Accents, highlights |
| Light Gray | `#F8FAFC` | Backgrounds |
| Dark Gray | `#1F2937` | Text |
| White | `#FFFFFF` | Backgrounds, text |

## 📐 Responsive Breakpoints

The website is fully responsive with optimized layouts for:

- **Mobile:** 320px - 640px (sm)
- **Tablet:** 640px - 1024px (md/lg)
- **Desktop:** 1024px+ (lg/xl)

### Responsive Features

✅ **Mobile Navigation** - Hamburger menu with slide animation  
✅ **Flexible Grid Layouts** - Adapts from 1 to 3-5 columns  
✅ **Touch-Friendly** - Large tap targets and spacing  
✅ **Optimized Typography** - Scales appropriately per screen  
✅ **Hero Section** - Stacks vertically on mobile  
✅ **Package Cards** - 1 column (mobile) → 5 columns (desktop)  
✅ **Form Fields** - Full width on mobile, grid on desktop  

## 🎭 Animations

All animations are implemented using Framer Motion:

- Fade-in effects on scroll
- Slide-up card animations
- Smooth hover transitions
- Button hover effects
- LED screen scan animation
- Floating badge effects
- Navbar scroll behavior

## 📁 Project Structure

```
led-billboard/
├── app/
│   ├── globals.css          # Global styles + Tailwind imports
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Home page (all sections)
├── components/
│   ├── Navbar.tsx            # Sticky navigation
│   ├── Hero.tsx              # Hero section with LED visual
│   ├── About.tsx             # About AWLO section
│   ├── WhyUs.tsx             # Benefits section
│   ├── Billboard.tsx         # Technical specs
│   ├── Packages.tsx          # Pricing packages
│   ├── HowItWorks.tsx        # 4-step process
│   ├── Gallery.tsx           # Image gallery
│   ├── Contact.tsx           # Contact form + info
│   └── Footer.tsx            # Footer section
├── public/                   # Static assets (add images here)
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.mjs           # Next.js configuration
└── package.json              # Dependencies

```

## 🖼️ Adding Images

Replace placeholder content in the Gallery section:

1. Add your billboard photos to the `public/images` folder
2. Update `components/Gallery.tsx` with actual image paths:

```typescript
const galleryImages = [
  {
    id: 1,
    src: "/images/billboard-night.jpg",
    title: "Billboard at Night",
    // ...
  },
  // ...
];
```

## 📧 Contact Form Integration

The contact form currently shows a browser alert. To integrate with a backend:

### Option 1: Email Service (Recommended)
- [SendGrid](https://sendgrid.com/)
- [EmailJS](https://www.emailjs.com/)
- [Resend](https://resend.com/)

### Option 2: Custom API
Create an API route at `app/api/contact/route.ts`:

```typescript
export async function POST(request: Request) {
  const data = await request.json();
  // Send email or save to database
  return Response.json({ success: true });
}
```

## 🗺️ Google Maps Integration

To add a real map to the Contact section:

1. Get a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
2. Replace the map placeholder in `components/Contact.tsx`:

```jsx
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL"
  className="w-full h-full border-0"
  loading="lazy"
/>
```

## 📱 Social Media Links

Update social media links in `components/Footer.tsx`:

```typescript
const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/awlo", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/awlo", label: "Instagram" },
  // ...
];
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Deploy with one click!

### Deploy to Netlify

```bash
npm run build
# Upload the .next folder to Netlify
```

## 📝 Customization Guide

### Update Company Information

Edit contact details in:
- `components/Contact.tsx` - Contact information
- `components/Footer.tsx` - Footer details
- `app/layout.tsx` - SEO metadata

### Change Colors

Modify `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR',
  },
  secondary: {
    DEFAULT: '#YOUR_COLOR',
  },
}
```

### Update Pricing

Edit package details in `components/Packages.tsx`:

```typescript
const packages = [
  {
    duration: "1 Week",
    price: "Contact for pricing", // Add actual prices
    // ...
  },
];
```

## 🧪 Testing Checklist

- [ ] Test on mobile devices (320px - 480px)
- [ ] Test on tablets (768px - 1024px)
- [ ] Test on desktop (1280px+)
- [ ] Test all navigation links
- [ ] Test contact form submission
- [ ] Test all CTAs and buttons
- [ ] Verify smooth scrolling works
- [ ] Check animations on scroll
- [ ] Test mobile hamburger menu
- [ ] Verify all external links

## 🐛 Known Issues / TODOs

- [ ] Add actual billboard images to gallery
- [ ] Integrate contact form with email service
- [ ] Add Google Maps embed
- [ ] Update social media links
- [ ] Add actual pricing information
- [ ] Set up analytics (Google Analytics / Plausible)
- [ ] Add loading states to contact form
- [ ] Implement form validation feedback
- [ ] Add success/error toast notifications

## 📄 License

This project is created as a demo for AWLO Advertising.

## 👨‍💻 Development

Built with ❤️ using modern web technologies.

---

**Ready to advertise?** Contact AWLO Advertising today and make your brand impossible to ignore!