# Build Guide — Implementation Plan

## Project Overview
A modern, trustworthy, responsive website helping Indian homeowners (aged 40–70) find Architects, Painters, Interior Designers, Contractors, Civil Engineers, and other home construction professionals near their location.

## Design Principles
- NOT a flashy startup; must feel like a premium banking/government portal
- Simplicity > creativity; Clarity > decoration; Trust > trends; Accessibility > minimalism
- No hamburger menu on desktop; navigation always visible
- Never hide contact information behind premium access

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Data:** Local JSON files (mock data)
- **Deployment:** Vercel

## Design Tokens

### Colors
- Primary: Deep Blue
- Secondary: Green
- Background: White
- Surface: Light Gray
- Text: Dark Gray/Black

### Typography
- Headings: 40–44px
- Section titles: 28–32px
- Body: 18px
- Buttons: 18–20px

### Buttons
- Minimum height: 52px
- Rounded corners: 10–14px
- Visible borders
- Soft shadows
- Press states: moves down 2px

### Cards
- Rounded corners
- Soft shadows
- Visible borders
- Generous padding

### Animations (Minimal)
- Button press
- Card hover
- Smooth scrolling
- Fade transitions
- Loading skeletons only

## Pages to Build

### 1. Homepage (`/`)
- Hero with location picker
- Search bar
- Service cards (Architects, Painters, Interior Designers, Contractors, Civil Engineers)
- Featured Professionals
- Latest Projects
- Construction Tips
- Cost Calculator (preview)
- Home Owner Guide (preview)
- Footer

### 2. Search Results (`/search`)
- Search filters: City, Budget, Experience, Verified, Residential, Commercial
- Professional cards with: photo, name, specialty, rating, experience, verified badge

### 3. Professional Profile (`/professional/[id]`)
- Photo, verified badges, experience, reviews, gallery, map
- Contact options: Call Now, WhatsApp, Request Callback
- Sticky call button on mobile
- Bottom nav on mobile

### 4. Cost Calculator (`/cost-calculator`)
- Interactive form for estimating construction costs
- Location, area, material quality, professional type

### 5. Home Owner Guide (`/guide`)
- SEO-optimized articles
- Topics: Construction cost calculator, How to choose architect, Paint types, Building permissions, Vastu tips

### 6. About (`/about`)
- Mission, values, team

### 7. Contact (`/contact`)
- Contact form, phone, email, address

## Mobile Requirements
- Fully responsive
- Sticky call button on professional profile pages
- Bottom navigation on mobile
- Touch-friendly targets (52px minimum)

## Mock Data Structure

### professionals.json
```json
{
  "id": "string",
  "name": "string",
  "specialty": "string",
  "city": "string",
  "experience": "number",
  "rating": "number",
  "reviewCount": "number",
  "verified": "boolean",
  "type": "residential | commercial",
  "photo": "string",
  "gallery": ["string"],
  "description": "string",
  "contact": {
    "phone": "string",
    "whatsapp": "string",
    "email": "string"
  },
  "location": {
    "lat": "number",
    "lng": "number",
    "address": "string"
  }
}
```

### services.json
```json
{
  "id": "string",
  "name": "string",
  "icon": "string",
  "description": "string",
  "slug": "string"
}
```

### guides.json
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string",
  "category": "string",
  "publishedAt": "string"
}
```

## Project Structure
```
build_guide/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── professional/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── cost-calculator/
│   │   └── page.tsx
│   ├── guide/
│   │   └── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── SearchBar.tsx
│   ├── ServiceCard.tsx
│   ├── ProfessionalCard.tsx
│   ├── CostCalculator.tsx
│   ├── MobileNav.tsx
│   └── ...
├── data/
│   ├── professionals.json
│   ├── services.json
│   └── guides.json
├── lib/
│   └── utils.ts
├── public/
│   └── images/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

## Build Order
1. Project setup (Next.js + Tailwind + TypeScript)
2. Global layout (Header, Footer, MobileNav)
3. Homepage (Hero, Search, Service Cards, Featured Professionals)
4. Search page with filters
5. Professional Profile page
6. Cost Calculator
7. Home Owner Guide
8. About & Contact pages
9. Mock data creation
10. Responsive testing
11. Deploy to Vercel

## Success Criteria
- Find and contact a professional within one minute
- Fully responsive on all devices
- No hamburger menu on desktop
- Contact info always visible
- All buttons meet 52px height minimum
- Clean, trustworthy design (premium banking feel)
- SEO-optimized Home Owner Guide
