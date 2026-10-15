# Dokan - Online Shopping Platform

Dokan is a modern, high-performance ecommerce application built with **React 19**, **TypeScript**, and **Tailwind CSS**. It offers a seamless shopping experience with a focus on speed, aesthetics, and user-friendly interaction.

## 🚀 Key Features

- **Modern UI/UX**: Premium design with glassmorphism, smooth animations, and responsive layouts.
- **Dynamic Search**: Real-time product filtering and search results page.
- **Shopping Cart & Wishlist**: Fully functional state management for managing products.
- **Checkout Flow**: Complete billing details collection and order success confirmation.
- **Product Management**: Detailed product views, category filtering, and API integration.
- **User Authentication**: Secure login and signup flows with protected routes.
- **SEO Optimized**: Semantic HTML and dynamic page titles for better search engine visibility.
- **Multilingual Support**: Full RTL support and translation management (English & Arabic).

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router 7
- **UI Components**: Shadcn UI
- **Backend/Auth**: Supabase
- **Internationalization**: react-i18next

## 📦 Getting Started

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   ```

2. **Use Node.js 20 or newer** (see `.nvmrc`):
   ```bash
   nvm use
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure environment variables** (see [Environment variables](#environment-variables)):
   Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Type-check, build for production, and preview the build**:
   ```bash
   npm run typecheck
   npm run build
   npm run preview
   ```

## 🔐 Environment variables

All configuration lives in `.env.example`, which lists every variable the app reads.

- **Local development**: copy `.env.example` to `.env.local` and fill in your values. `.env.local` is git-ignored.
- **Production (Vercel)**: set the same variables in the Vercel dashboard under *Project Settings > Environment Variables*. Vercel does not read your local `.env` files, so the production build will not work without them.

> **Warning:** Every variable prefixed with `VITE_` is compiled into the client-side JavaScript bundle and is visible to anyone who loads the site. Never put secrets (service-role keys, database URLs, private API keys, payment secrets) in `VITE_` variables. Server-only secrets such as `SUPABASE_SECRET_KEY` and `SUPABASE_DB_URL` must never be prefixed with `VITE_` and must never be committed.

## 📄 License

This project is licensed under the MIT License.

