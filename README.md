# 🏋️ GymManager Pro - Management System

A polished, full-stack Gym Management Web Application suitable for production, built with **React**, **Vite**, **Bootstrap 5**, **Node.js (Express)**, and **PostgreSQL** using **Prisma 7**.

## 🚀 Advanced Features Implemented
*   **Authentication Hardened**: JWT-based login and registration with automated frontend logout upon 401 Expiry via Axios Interceptors.
*   **Members Management**: Complete CRUD operations wrapped in React Bootstrap Modals with responsive Spinners and Toasts.
*   **Dynamic Search & Filtering**: Client-side reactive search bar to instantly query through gym members by name or email.
*   **Pagination Algorithm**: Segmented data rendering strictly displaying 5 entries per page for heavy lists (Members and Payments).
*   **Automated Expiration Check**: Synchronously checks and enforces expiration status updates in the database when pulling Dashboard statistics.
*   **Dashboard Visuals**: Integrated `Chart.js` mapping real-time live active vs active distributions against total revenue visually.
*   **Email Automation Engine**: Built-in Nodemailer service for automatic robust HTML Welcome and Payment Confirmation emails directly parsing standard JSON outputs.

## 🧱 Technology Stack
*   **Frontend**: React, Vite, React Router, Bootstrap 5, Axios, React-Toastify, Chart.js.
*   **Backend**: Node.js, Express, Prisma ORM, JSON Web Tokens, bcrypt, Nodemailer.
*   **Database**: PostgreSQL.

---

## ⚙️ Step-by-Step Setup Instructions

### 1. Connecting the Database (PostgreSQL)
Run the provided Docker configuration from the root directory to instantly spool a containerized database:
```bash
docker-compose up -d
```
This generates a database `gym_db` on port `5432` with user `gym_user` and password `gym_password`.

### 2. Configure Environment Variables
Inside `/server`, verify the `.env` file reflects:
```env
PORT=5000
DATABASE_URL="postgresql://gym_user:gym_password@localhost:5432/gym_db?schema=public"
JWT_SECRET="super_secret_gym_key_change_me_in_prod"
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT=587
SMTP_USER="ethereal_user"
SMTP_PASS="ethereal_pass"
```

### 3. Initialize Backend
Open your terminal and navigate to the backend:
```bash
cd server
npm install
npx prisma db push
npm run dev
```

### 4. Initialize Frontend
Open a new terminal tab and navigate to the frontend:
```bash
cd client
npm install
npm run dev
```

### 5. Access the Application
Navigate your browser to `http://localhost:5173`. Create an account via the clean toggle interface, login, and explore! You can observe email traces dropping sequentially into your backend Node.js terminal exactly imitating an active SMTP gateway.
