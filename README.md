# SolveIt — Frontend Client

<div align="center">

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**The React.js frontend powering SolveIt — Bangladesh's Problem Solving Marketplace**

[🌍 Live Site](https://solveit-place.vercel.app) · [🖥️ Backend Repo](https://github.com/jamilalways/solveit-server) · [📋 API Health](https://solveit-server.onrender.com/api/health)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Pages & Routes](#-pages--routes)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Component Architecture](#-component-architecture)
- [State Management](#-state-management)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🚀 About the Project

This repository contains the **React.js frontend** for **SolveIt** — a two-sided Problem Solving Marketplace where Clients post real-world problems and Solvers bid to resolve them in exchange for payment.

Built with **React 18 + Vite + Tailwind CSS**, the frontend is a fully responsive Single Page Application (SPA) that communicates with the Node.js backend via **Axios (REST API)** and **Socket.io** for real-time features.

**Backend Repository:** [solveit-server](https://github.com/jamilalways/solveit-server)

---

## 🌍 Live Demo

| | Link |
|---|---|
| 🌐 **Live Site** | [https://solveit-place.vercel.app](https://solveit-place.vercel.app) |
| 🖥️ **Backend API** | [https://solveit-server.onrender.com/api/health](https://solveit-server.onrender.com/api/health) |
| 💻 **Frontend GitHub** | [https://github.com/jamilalways/solveit-client](https://github.com/jamilalways/solveit-client) |
| 🔧 **Backend GitHub** | [https://github.com/jamilalways/solveit-server](https://github.com/jamilalways/solveit-server) |

### Test Accounts

| Role | Email | Password |
|---|---|---|
| Client | client@demo.com | demo1234 |
| Solver | solver@demo.com | demo1234 |
| Admin | admin@demo.com | demo1234 |

> ⚠️ Demo accounts are for testing only. Data may be reset periodically.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Register / Login with JWT, role-based route protection |
| 📋 **Problem Listing** | Search, filter by category/budget, sort, pagination |
| ✏️ **Post a Problem** | Form with file attachments, category picker, deadline selector |
| 📨 **Bidding System** | Submit proposals, view bids, accept/reject with modal |
| 💰 **Wallet & Escrow** | Deposit modal with quick amounts, balance display, escrow tracking |
| 💬 **Real-Time Chat** | Socket.io chat with typing indicator, optimistic UI, auto-scroll |
| ⭐ **Reviews & Ratings** | Star rating system with review cards |
| 🔔 **Notifications** | Real-time bell icon with unread count badge |
| 🌙 **Dark / Light Mode** | Toggle switch with localStorage persistence |
| 👤 **Edit Profile** | Avatar upload (camera icon), bio, skills selector |
| 🛡️ **Admin Dashboard** | Analytics, user ban/unban, dispute resolution, problem moderation |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 📄 Pages & Routes

| Route | Page | Access | Description |
|---|---|---|---|
| `/` | Home | Public | Landing page — hero, categories, how-it-works, CTA |
| `/login` | Login | Public | Email + password login |
| `/register` | Register | Public | Role selector + registration form |
| `/problems` | Problem List | Public | Browse all open problems with filters |
| `/problems/:id` | Problem Detail | Public | Full details, bids, submit proposal |
| `/post-problem` | Post Problem | Client | Create new problem listing |
| `/dashboard/client` | Client Dashboard | Client | Wallet, own problems, edit/delete |
| `/dashboard/solver` | Solver Dashboard | Solver | Earnings, active jobs, recent bids |
| `/chat/:contractId` | Chat Page | Auth | Real-time contract messaging |
| `/profile/:id` | Public Profile | Public | Solver portfolio, reviews, badge |
| `/profile/edit` | Edit Profile | Auth | Update name, bio, avatar, skills |
| `/admin` | Admin Dashboard | Admin | Stats, users, disputes, moderation |

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Framework | React.js 18 | Component-based UI |
| Build Tool | Vite 5.x | Fast dev server + production build |
| Styling | Tailwind CSS v4 | Utility-first CSS framework |
| Routing | React Router v6 | SPA navigation + protected routes |
| HTTP Client | Axios | REST API calls + JWT interceptor |
| Real-time | Socket.io-client | WebSocket chat + notifications |
| State | Zustand | Notification store (lightweight) |
| Context | React Context API | Auth, Socket, Theme global state |
| Forms | React Hook Form | Form validation and submission |
| Dates | date-fns | Date formatting utilities |

---

## 📁 Project Structure

```
solveit-client/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── api/
│   │   ├── axios.js              # Axios instance + JWT interceptor + auto-logout
│   │   ├── auth.api.js           # register, login, getMe, logout
│   │   ├── problems.api.js       # getProblems, getProblem, createProblem, update, delete
│   │   ├── bids.api.js           # getBids, submitBid, acceptBid, rejectBid
│   │   ├── contracts.api.js      # getContracts, getContract, submitSolution, complete
│   │   ├── payments.api.js       # getWallet, deposit, withdraw, lockEscrow
│   │   └── chat.api.js           # getMessages, sendMessage
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx        # Role-aware navbar with notification bell + dark mode
│   │   │   ├── Footer.jsx        # Site footer with links
│   │   │   ├── ProblemCard.jsx   # Problem listing card with category badge
│   │   │   ├── BidCard.jsx       # Bid proposal card with accept/reject buttons
│   │   │   ├── ReviewCard.jsx    # User review display card
│   │   │   ├── Badge.jsx         # Solver reputation badge (5 levels)
│   │   │   ├── Spinner.jsx       # Loading spinner component
│   │   │   └── Modal.jsx         # Reusable modal with ESC-to-close
│   │   │
│   │   └── layout/
│   │       └── DashboardLayout.jsx  # Sidebar layout with dark mode toggle
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # User auth state, login(), logout(), register()
│   │   ├── SocketContext.jsx     # Socket.io connection lifecycle management
│   │   └── ThemeContext.jsx      # Dark/light mode toggle + localStorage persistence
│   │
│   ├── hooks/
│   │   ├── useAuth.js            # Re-export from AuthContext
│   │   ├── useSocket.js          # Re-export from SocketContext
│   │   └── useDebounce.js        # Debounce hook for search input (400ms)
│   │
│   ├── pages/
│   │   ├── landing/
│   │   │   └── Home.jsx          # Landing page — hero, stats, categories, steps, CTA
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx         # Login with validation + error handling
│   │   │   └── Register.jsx      # Role selector + registration form
│   │   │
│   │   ├── problems/
│   │   │   ├── ProblemList.jsx   # Search, filter sidebar, sort, pagination
│   │   │   ├── ProblemDetail.jsx # Problem info, bid list, submit bid modal
│   │   │   └── PostProblem.jsx   # Multi-field form with file upload
│   │   │
│   │   ├── dashboard/
│   │   │   ├── ClientDashboard.jsx  # Stat cards, wallet + deposit modal, own problems
│   │   │   └── SolverDashboard.jsx  # Earnings, active jobs, recent bids table
│   │   │
│   │   ├── chat/
│   │   │   └── ChatPage.jsx      # Real-time chat with Socket.io, typing indicator
│   │   │
│   │   ├── profile/
│   │   │   ├── PublicProfile.jsx # Avatar, badge, skills, reviews, stats
│   │   │   └── EditProfile.jsx   # Photo upload, name, bio, skill tag selector
│   │   │
│   │   └── admin/
│   │       └── AdminDashboard.jsx  # 4-tab: Overview, Users, Problems, Disputes
│   │
│   ├── store/
│   │   └── notifStore.js         # Zustand store — notifications + unread count
│   │
│   ├── utils/
│   │   ├── formatDate.js         # formatDate(), timeAgo(), daysLeft()
│   │   └── formatCurrency.js     # formatBDT() — Bangladeshi Taka formatter
│   │
│   ├── App.jsx                   # Main router with PrivateRoute guard
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Tailwind imports + global styles
│
├── .env                          # Local environment variables (not committed)
├── .env.production               # Production environment variables
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js            # Tailwind v4 configuration
├── vercel.json                   # Vercel rewrite rules for React Router
└── vite.config.js                # Vite build configuration
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- The backend server running (see [solveit-server](https://github.com/jamilalways/solveit-server))

### 1. Clone the repository

```bash
git clone https://github.com/jamilalways/solveit-client.git
cd solveit-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and set your backend URL:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Start the development server

```bash
npm run dev
```

The app opens at **http://localhost:5173**

> Make sure the backend server is also running on port 5000 for full functionality.

### 5. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Backend Socket.io server URL | `http://localhost:5000` |

**For production** (in `.env.production`):

```env
VITE_API_URL=https://solveit-server.onrender.com/api
VITE_SOCKET_URL=https://solveit-server.onrender.com
```

> ⚠️ All Vite environment variables **must** start with `VITE_` to be accessible in the browser.

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build locally
```

---

## 🧩 Component Architecture

```
App.jsx
├── ThemeProvider         (dark/light mode)
│   └── AuthProvider      (user authentication)
│       └── SocketProvider (Socket.io connection)
│           └── BrowserRouter
│               ├── Public Routes
│               │   ├── Home
│               │   ├── Login / Register
│               │   ├── ProblemList / ProblemDetail
│               │   └── PublicProfile
│               │
│               └── Private Routes (PrivateRoute guard)
│                   ├── ClientDashboard    [role: client]
│                   ├── SolverDashboard    [role: solver]
│                   ├── PostProblem        [role: client]
│                   ├── ChatPage           [authenticated]
│                   ├── EditProfile        [authenticated]
│                   └── AdminDashboard     [role: admin]
```

### Route Protection

The `PrivateRoute` component handles authentication and role-based access:

```jsx
function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading)                        return <Spinner />
  if (!user)                          return <Navigate to="/login" />
  if (role && user.role !== role)     return <Navigate to="/" />
  return children
}
```

---

## 🗂️ State Management

The app uses a combination of three state management approaches:

| Approach | Used For | Location |
|---|---|---|
| **React Context** | Auth user, Socket connection, Theme | `src/context/` |
| **Zustand** | Notification list + unread count | `src/store/notifStore.js` |
| **Local State (useState)** | Component-level UI state | Inside each page/component |

### Axios JWT Interceptor

Every API request automatically attaches the JWT from localStorage:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

Expired tokens are automatically cleared and the user is redirected to login:

```js
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
```

---

## 🚀 Deployment

This frontend is deployed on **[Vercel](https://vercel.com)** (free tier).

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your `solveit-client` repository
4. Vercel auto-detects Vite — confirm these settings:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

5. Add environment variables:

```
VITE_API_URL    = https://solveit-server.onrender.com/api
VITE_SOCKET_URL = https://solveit-server.onrender.com
```

6. Click **Deploy** — your site is live in ~2 minutes

### Why `vercel.json` is needed

Without this file, refreshing any page other than `/` gives a 404 error because Vercel tries to find the actual file. The rewrite rule fixes this:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🎨 Design System

| Element | Value |
|---|---|
| **Primary Color** | Indigo `#4f46e5` |
| **Accent Color** | Orange `#f97316` |
| **Font** | Plus Jakarta Sans |
| **Border Radius** | 10px – 20px (cards and inputs) |
| **Dark Background** | `#0f0f1a` |
| **Light Background** | `#f8f9fc` |
| **Card Shadow** | `0 1px 3px rgba(0,0,0,.06)` |

---

## 📊 Key User Flows

### Client Flow
```
Register (Client) → Post Problem → Receive Bids
→ Accept Best Bid → Deposit & Lock Escrow
→ Review Solution → Release Payment → Leave Review
```

### Solver Flow
```
Register (Solver) → Browse Problems → Submit Proposal
→ Get Accepted → Start Work via Chat
→ Submit Solution → Receive Payment → Build Reputation
```

### Admin Flow
```
Login (Admin) → View Analytics → Manage Users
→ Moderate Problems → Resolve Disputes → Govern Platform
```

---

## 🤝 Related Repository

| Repository | Description | Link |
|---|---|---|
| **solveit-client** | React.js frontend (this repo) | [GitHub](https://github.com/jamilalways/solveit-client) |
| **solveit-server** | Node.js + Express.js backend API | [GitHub](https://github.com/jamilalways/solveit-server) |

---

## 👨‍💻 Author

**Md. Jamil**

- 🌍 Live Site: [https://solveit-place.vercel.app](https://solveit-place.vercel.app)
- 💻 GitHub: [@jamilalways](https://github.com/jamilalways)
- 📧 Final Year CSE Project

---

## 📄 License

This project is developed as a **Final Year CSE Project** for academic purposes.

---

<div align="center">

Made with ❤️ by **Md. Jamil** — Final Year CSE Project

⭐ If you found this project helpful, please give it a star!

</div>
