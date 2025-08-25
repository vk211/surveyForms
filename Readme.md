
# 📝 Survey Application

A full-stack **Survey App** built with **React + TypeScript (frontend)**, **Node.js + Express + TypeScript (backend)**, and **MongoDB (database)**.  
This project simulates a real-world Waterlily intake form system, where users can sign up, log in securely, fill out surveys, and view their submitted responses.

---

## � Folder Structure

```
Waterlily/
  frontend/   # React + TypeScript + TailwindCSS
  backend/    # Node.js + Express + TypeScript + MongoDB
```

---

---

## �🚀 Features Implemented


### 🔐 Authentication & Security
- **User Sign Up & Login** with email + password
- **Password hashing** using bcryptjs
- **JWT-based authentication** to protect survey routes
- **Rate limiting** (express-rate-limit)
- **CORS** for frontend-backend communication
- **Input validation** on both client and server

### 📋 Survey
- Users can:
  - View survey questions (with title & description)
  - Submit their responses
  - Review their submitted responses after submission
- Backend API endpoints for survey storage

### 🎨 Frontend
- Built with **React + TypeScript** and **TailwindCSS**
- Responsive, modern survey form UI
- Client-side routing with protected routes
- Clean error/success handling in forms

### ⚙️ Backend
- **Express + TypeScript** REST API
- **MongoDB** for persistent storage (native driver)
- Middleware for:
  - JWT authentication
  - Error handling
  - Rate limiting

---


## 📂 Tech Stack
- **Frontend:** React, TypeScript, TailwindCSS, React Router
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (native driver)
- **Authentication:** JWT, bcryptjs
- **Security:** Rate limiting, CORS, Input validation

---

## 🏗️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/vk211/surveyForms.git
cd surveyForms
```

### 2️⃣ Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3️⃣ Start the apps

#### Start MongoDB (if not already running)
```
mongod
```

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
cd ../frontend
npm run dev
```

---

## 🌐 Usage

- Visit `http://localhost:5173` in your browser.
- Sign up as a new user, then sign in.
- Fill out the survey form and review your answers after submission.
- All API requests are protected by JWT and rate limiting.

---

## 📢 Notes
- Passwords are securely hashed before storage.
- JWT tokens are used for authentication and session management.
- Rate limiting is enabled to prevent abuse.
- All sensitive routes are protected.

---

## 📜 License
MIT
