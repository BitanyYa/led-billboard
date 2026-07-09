# AWLO Advertising Website - Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Node.js
If you don't have Node.js installed:
1. Visit https://nodejs.org/
2. Download the LTS version (18.x or higher)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Dependencies
Open terminal/command prompt in the project folder:

```bash
npm install
```

This will install:
- Next.js 15.0
- React 18.3
- TypeScript 5.6
- Tailwind CSS 3.4
- Framer Motion 11.5
- Lucide React 0.445

### Step 3: Run Development Server

```bash
npm run dev
```

The website will be available at: **http://localhost:3000**

### Step 4: Make Changes
- Edit components in the `components/` folder
- Changes auto-reload in the browser
- No need to restart the server

## Common Issues & Solutions

### Issue: "npm is not recognized"
**Solution:** Install Node.js (includes npm) from nodejs.org

### Issue: Port 3000 already in use
**Solution:** Either:
- Stop the other app using port 3000
- Or run on different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Issue: Module not found errors
**Solution:** Delete node_modules and reinstall:
```bash
rmdir /s node_modules  # Windows
npm install
```

### Issue: Build errors with TypeScript
**Solution:** Check `tsconfig.json` is present and run:
```bash
npm run build
```

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in `.next/` folder.

### Test Production Build Locally

```bash
npm start
```

### Deploy to Vercel (Free & Easy)

1. **Create Vercel account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

3. **Import to Vercel**
   - Click "Add New Project"
   - Select your repository
   - Click "Deploy"
   - Done! Your site is live

## Environment Variables (Optional)

Create a `.env.local` file for sensitive data:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_api_key_here

# Email Service
EMAIL_SERVICE_API_KEY=your_email_api_key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Important:** Never commit `.env.local` to git!

## Updating Content

### Update Contact Information

Edit `components/Contact.tsx` and `components/Footer.tsx`:

```typescript
// Change phone number
value: "+251 911 234 567"  // Replace with actual number

// Change email
value: "info@awloadvertising.com"  // Replace with actual email

// Change address
value: "Addis Ababa, Ethiopia"  // Add specific address
```

### Update Company Description

Edit `components/About.tsx`:

```typescript
// Find and update the paragraph text
<p className="text-gray-600 text-lg leading-relaxed mb-8">
  AWLO Advertising is an Ethiopian company...  // Update this
</p>
```

### Update Pricing

Edit `components/Packages.tsx`:

```typescript
const packages = [
  {
    duration: "1 Week",
    price: "$500",  // Add actual price
    // ...
  },
];
```

### Add Real Billboard Images

1. Create folder: `public/images/`
2. Add your photos: `billboard-1.jpg`, `billboard-2.jpg`, etc.
3. Update `components/Gallery.tsx`:

```typescript
const galleryImages = [
  {
    id: 1,
    src: "/images/billboard-1.jpg",
    title: "Billboard at Night",
    // ...
  },
];
```

4. Replace placeholder with `<img>`:

```jsx
<img 
  src={img.src} 
  alt={img.title}
  className="w-full h-full object-cover"
/>
```

## Customizing Styles

### Change Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#0057D9',  // Change to your blue
    dark: '#003DA0',
    light: '#1E73FF',
  },
  secondary: {
    DEFAULT: '#FFD400',  // Change to your yellow
    dark: '#E6BF00',
    light: '#FFDD33',
  },
}
```

All components will automatically use the new colors!

### Change Fonts

Edit `app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap');
```

Then update `tailwind.config.ts`:

```typescript
fontFamily: {
  sans: ['YourFont', 'sans-serif'],
  heading: ['YourHeadingFont', 'sans-serif'],
}
```

## Adding New Sections

Create a new component in `components/`:

```typescript
// components/NewSection.tsx
export default function NewSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">New Section</h2>
        {/* Your content */}
      </div>
    </section>
  );
}
```

Add to `app/page.tsx`:

```typescript
import NewSection from "@/components/NewSection";

export default function Home() {
  return (
    <main>
      {/* ... other sections ... */}
      <NewSection />
      {/* ... */}
    </main>
  );
}
```

## Performance Optimization

### Optimize Images

Install next/image for automatic optimization:

```jsx
import Image from 'next/image';

<Image 
  src="/images/billboard.jpg"
  width={1200}
  height={800}
  alt="Billboard"
/>
```

### Add Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  setLoading(true);
  // Submit form
  setLoading(false);
};
```

### Enable Analytics

Add Google Analytics to `app/layout.tsx`:

```jsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  strategy="afterInteractive"
/>
```

## Testing

### Test Responsiveness

1. Open browser DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Test these sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

### Test Navigation

Click every link to ensure smooth scrolling works.

### Test Form

1. Fill out contact form
2. Click submit
3. Verify alert appears (or email sends if configured)

## Getting Help

### Documentation
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/

### Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Check code quality
```

## Next Steps

1. ✅ Install and run the project
2. ✅ Update contact information
3. ✅ Add real billboard images
4. ✅ Customize colors to match brand
5. ✅ Set up contact form backend
6. ✅ Deploy to Vercel
7. ✅ Add custom domain
8. ✅ Set up analytics

**Questions?** Check the main README.md for more details!
