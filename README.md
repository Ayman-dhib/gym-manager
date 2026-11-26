<div align="center">

# 🏋️ GymManager Pro

**Full-stack gym management app: members, payments, subscriptions and automated emails**

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

## Overview

GymManager Pro helps a gym track its members, payments and subscriptions. It has JWT authentication, a dashboard with revenue charts, automatic subscription expiry, and welcome and payment emails sent automatically.

## Features

- **JWT authentication**: login and registration, automatic logout when the token expires (Axios interceptors)
- **Members**: full CRUD in modals, with instant search by name or email
- **Payments** with pagination
- **Automatic expiry**: subscriptions are checked and updated when the dashboard loads
- **Dashboard**: Chart.js charts of active members and revenue
- **Email automation**: HTML welcome and payment confirmation emails (Nodemailer)

## Tech stack

| Layer | Technologies |
|---|---|
| Front-end | React, Vite, React Router, Bootstrap 5, Axios, React-Toastify, Chart.js |
| Back-end | Node.js, Express, Prisma ORM, JWT, bcrypt, Nodemailer |
| Database | PostgreSQL (Docker) |

## Getting started

```bash
# Database
docker-compose up -d

# Back-end (create server/.env first: PORT, DATABASE_URL, JWT_SECRET, SMTP_*)
cd server
npm install
npx prisma db push
npm run dev

# Front-end
cd ../client
npm install
npm run dev     # http://localhost:5173
```

## Project structure

```
client/src/
  pages/        dashboard, members, payments, login
  components/   modals, tables, charts
  services/     API client
server/
  prisma/       schema
  src/          routes, controllers, email service
docker-compose.yml   PostgreSQL
```

---

Built by [Ayman Dhib](https://www.linkedin.com/in/ayman-dhib/)
