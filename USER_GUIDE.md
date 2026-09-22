# 📘 Social Library Platform (NetSocial) — User & Developer Guide

<div align="center">
  <img src="https://img.shields.io/badge/Platform-Full--Stack_Web-38BDF8?style=for-the-badge&logo=react&logoColor=white" alt="Full Stack Platform" />
  <img src="https://img.shields.io/badge/Architecture-REST_API_%2B_SPA-6366F1?style=for-the-badge&logo=node.js&logoColor=white" alt="Architecture" />
  <img src="https://img.shields.io/badge/UI_Design-Glassmorphism-EC4899?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Glassmorphism UI" />
  <img src="https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge" alt="License" />
</div>

---

## 📌 Executive Summary

**NetSocial (Social Library Platform)** is a full-stack media discovery and social logging platform designed with a premium, Netflix-inspired dark glassmorphism interface. Users can search and explore movies via the TMDB API, discover books via the Google Books API, maintain personalized bookshelves and watchlists, write reviews, interact with fellow readers, and track activity metrics in real time.

---

## 📐 System Architecture Flowchart

```
┌────────────────────────────────────────────────────────────────────────┐
│                          REACT SPA CLIENT                              │
│  [ React 19 + Vite + Tailwind CSS + Lucide Icons + Toast System ]      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / Axios (JWT Auth Header)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          EXPRESS API SERVER                            │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Middleware: Authentication (JWT) | CORS | Error Handlers        │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│       ┌───────────────────────────┼───────────────────────────┐        │
│       ▼                           ▼                           ▼        │
│  [ Auth Controller ]     [ Media Controller ]     [ Activity Controller] │
└───────┬───────────────────────────┬───────────────────────────┬────────┘
        │                           │                           │
        ▼                           ▼                           ▼
 ┌──────────────┐           ┌──────────────┐           ┌──────────────────┐
 │ SQLite DB    │           │ External     │           │ Dynamic Toast    │
 │ (Sequelize)  │           │ REST APIs    │           │ & Banner System  │
 └──────────────┘           │ (TMDB &      │           └──────────────────┘
                            │ Google Books)│
                            └──────────────┘
```

---

## 🛠️ Feature Breakdown Matrix

| Feature | Description | Technical Implementation |
| :--- | :--- | :--- |
| **Movie Discovery** | Search & browse popular/top-rated movies with posters, cast, and trailers | TMDB API Integration (`/api/media/search`) |
| **Book Discovery** | Explore millions of books, authors, and page counts | Google Books API Integration |
| **Social Feed** | Live activity feed showing friend reviews, ratings, and list updates | SQLite Sequelize Relations & Activity Logs |
| **Glassmorphism UI** | Modern dark-themed dashboard with animated notification toasts | Tailwind CSS backdrop-blur, custom ToastContext |
| **Personal Lists** | Watched, To Watch, Read, To Read, and custom collection management | User Activity state mapping |
| **User Profile & Avatars**| Customizable user bios and vector avatar gallery selection | DiceBear API integration |

---

## 🚀 Environment Setup & Prerequisites

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Installed on system

### Installation Steps

1. **Clone Repository:**
   ```bash
   git clone https://github.com/Mervann/social-library-platform.git
   cd social-library-platform
   ```

2. **Configure Server Environment:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

   Edit `.env` file with required variables:
   ```env
   PORT=5000
   JWT_SECRET=super_secret_jwt_key_2026
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

3. **Configure Client Environment:**
   ```bash
   cd ../client
   npm install
   ```

4. **Launch Development Servers:**

   **Terminal 1 (Backend API Server):**
   ```bash
   cd server
   node index.js
   ```

   **Terminal 2 (Frontend Web Client):**
   ```bash
   cd client
   npm run dev
   ```

   Navigate to `http://localhost:5173` in your browser.

---

## 📡 API Reference Endpoint Guide

### Authentication Endpoints
- `POST /api/auth/register` — Create a new user account.
- `POST /api/auth/login` — Authenticate user and receive JWT bearer token.
- `GET /api/auth/me` — Retrieve current authenticated user session details.

### Media & Search Endpoints
- `GET /api/media/search?type=movie&q=Inception` — Search movies or books.
- `GET /api/media/details/:type/:id` — Retrieve comprehensive item details and user status.

### Activity & Social Endpoints
- `POST /api/activities` — Log a rating, review, or list update.
- `GET /api/activities/feed` — Retrieve global/following activity feed.

---

## 🔔 UI Notification Toast System

The client includes an enterprise-grade Toast Notification System (`ToastNotification.jsx` & `ToastContext.jsx`).

### Notification Types
- 🟢 **Success**: Green banner with checkmark icon for successful actions (e.g., list additions, profile saved).
- 🔴 **Error**: Red alert banner with error details for API failures.
- 🟡 **Warning**: Amber banner for validation reminders (e.g., selecting a star rating before submission).
- 🔵 **Info**: Blue notification banner for custom list updates.

---

## 📄 License & Author Information

Developed by **Mervan Elbahadır**  
🎓 *Computer Engineering Student @ Kocaeli University*  
📫 Contact: `mervanelbahadir587@gmail.com`
