# 📋 Consultation Recording Manager

A modern, production-style **MERN Stack** CRM application designed for astrologers, consultants, counselors, coaches, and advisors who conduct consultations over phone calls, WhatsApp, Zoom, Google Meet, or in-person meetings.

> **Submission for:** Chitkara University — Career Advancement Services Assignment  
> **Project Option Chosen:** Consultation Recording Manager  
> **Submitted by:** [Your Name]

---

## 🎯 Project Purpose

This application centralizes client consultation records, notes, and recording links in one clean, professional SaaS-style dashboard. The goal is to move away from scattered spreadsheets and notebooks toward a structured digital system.

---

## 🖼️ Screenshots

> _Add screenshots of your running application here_

---

## 🚀 Live Features

| Feature | Details |
|---|---|
| 🔐 Admin Authentication | JWT-based secure login. Protected routes on both frontend & backend |
| 📊 Dashboard | Live stats — Total Clients, Total Consultations, This Month's Count, Recent Activity Feed |
| 📋 Consultation List | Full searchable & filterable table of all records |
| ➕ Add Consultation | Form with validation — Name, Phone, Date, Duration, Category, Notes, Recording Link |
| ✏️ Edit Consultation | Pre-filled edit form for updating records |
| 👁️ View Consultation | Detailed view with PDF download |
| 📄 PDF Export | Generates a clean, professional PDF report per consultation |
| 🔍 Real-Time Search | Instant search by client name or phone number |
| 🏷️ Category Filter | Filter by Career, Marriage, Health, Finance, Business, Education, etc. |
| 🔔 Toast Notifications | Elegant success/error feedback on every action |
| 🌐 Recording Links | Store and access Zoom, Google Drive, Dropbox links directly |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **React Router v7** — Client-side routing
- **Axios** — HTTP requests with JWT interceptor
- **Tailwind CSS v4** — Utility-first styling
- **React Hot Toast** — Notifications
- **React Icons** — Icon library
- **html2pdf.js** — Client-side PDF generation

### Backend
- **Node.js** + **Express.js** — REST API server
- **Mongoose** — MongoDB ODM
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT authentication
- **dotenv** — Environment variable management
- **cors** — Cross-origin resource sharing

### Database
- **MongoDB** (Local or MongoDB Atlas)

---

## 🏗️ Architecture

```
AstroArchive/
├── client/                    # React Frontend (Vite)
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ConsultationList.jsx
│   │   │   ├── AddConsultation.jsx
│   │   │   ├── EditConsultation.jsx
│   │   │   └── ViewConsultation.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios instance with JWT interceptor
│   │   ├── App.jsx            # Routes + Protected Routes
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── server/                    # Express Backend
    ├── src/
    │   ├── config/
    │   │   └── db.js          # MongoDB connection
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   └── consultationController.js
    │   ├── middlewares/
    │   │   └── authMiddleware.js  # JWT protect middleware
    │   ├── models/
    │   │   ├── Admin.js
    │   │   ├── Consultation.js
    │   │   └── Activity.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   └── consultationRoutes.js
    │   └── index.js           # Server entry + auto-seed
    ├── .env
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (Local installation or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/consultation-recording-manager.git
cd consultation-recording-manager
```

### 2. Setup Backend (Server)
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/consultation-manager
JWT_SECRET=your_super_secret_key_here
```

Start the backend:
```bash
node src/index.js
```

> On first run, the server will automatically:
> - Create a default admin account: `admin@crm.com` / `admin123`
> - Seed 5 demo consultation records

### 3. Setup Frontend (Client)
Open a **new terminal**:
```bash
cd client
npm install
npm run dev
```

### 4. Open the App
Visit: **http://localhost:3000**

**Login Credentials:**
- Email: `admin@crm.com`
- Password: `admin123`

---

## 🔐 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login, returns JWT |
| GET | `/api/consultations` | Protected | Get all consultations |
| POST | `/api/consultations` | Protected | Create new consultation |
| GET | `/api/consultations/:id` | Protected | Get single consultation |
| PUT | `/api/consultations/:id` | Protected | Update consultation |
| DELETE | `/api/consultations/:id` | Protected | Delete consultation |
| GET | `/api/activities` | Protected | Get recent activity feed |

---

## 🔒 Security Implementation

- **Password Hashing**: Admin passwords are hashed using `bcryptjs` with a salt round of 10
- **JWT Tokens**: 30-day expiry tokens stored in `localStorage`
- **Protected API Routes**: All `/api/consultations` and `/api/activities` routes are guarded by the `authMiddleware`
- **Frontend Route Protection**: `ProtectedRoute` component redirects unauthenticated users to `/login`
- **Token Interceptor**: Axios automatically attaches the Bearer token to every API request

---

## 🌟 Future Improvements

- [ ] Multi-user role support (Admin + Viewer)
- [ ] WhatsApp / Email integration for client reminders
- [ ] Calendar view for scheduled consultations
- [ ] File upload for local recordings (with cloud storage like AWS S3)
- [ ] Analytics charts (monthly consultation trends)
- [ ] Mobile app (React Native)
- [ ] Automated backup to Google Sheets

---

## 📄 License

This project was built as part of the Chitkara University Career Advancement Services Assignment.

---

> Built with ❤️ using the MERN Stack
