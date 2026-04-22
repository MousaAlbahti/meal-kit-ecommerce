# 🥗 Meal-Kit E-Commerce Platform
> A full-featured MERN Stack application for ordering and managing recipe-based meal kits.

[![Live Demo](https://img.shields.io/badge/Live-Demo-orange?style=for-the-badge)](https://YOUR_NETLIFY_LINK.netlify.app)
[![Backend API](https://img.shields.io/badge/API-Render-blue?style=for-the-badge)](https://meal-kit-ecommerce.onrender.com)

## 📖 Overview
Meal-Kit is a specialized e-commerce platform where users can browse, filter, and buy meal kits containing all necessary ingredients to cook at home. It includes a comprehensive Admin Dashboard to manage the entire ecosystem.

### 🚀 [Live Preview Here](https://YOUR_NETLIFY_LINK.netlify.app)
*(Note: The backend is hosted on a free Render tier. It may take ~40 seconds to wake up during the first request.)*

---

## ✨ Key Features

### 🛒 Customer Experience
- **Interactive Menu:** Browse meal kits with dynamic filtering by categories (e.g., Vegan, Under 30 mins).
- **Shopping Cart:** Full cart functionality (Add, Remove, Increase/Decrease quantities) with Redux state persistence.
- **Secure Checkout:** Multi-step process to collect shipping details and select payment methods.
- **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop using Chakra UI.

### 🛡️ Admin Dashboard (The "Chef's" Control Panel)
- **Analytics Overview:** Real-time stats for Total Revenue, Total Orders, and Active Users.
- **Meal Management:** Create, Read, Update, and Delete (CRUD) meal kits with image uploads (Cloudinary).
- **Category Control:** Manage food categories dynamically.
- **Order Tracking:** Monitor all customer orders and payment statuses.

---

## 🛠️ Tech Stack

**Frontend:**
- **React.js** (Functional Components & Hooks)
- **Redux Toolkit** (Global State Management)
- **Chakra UI** (Responsive Design & Components)
- **Axios** (API Requests)

**Backend:**
- **Node.js & Express.js**
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** (ODM)
- **JWT** (Secure Authentication)
- **Cloudinary** (Image Cloud Hosting)
- **Nodemailer** (Email Services)

---

## 📂 Project Structure
```text
meal-kit-ecommerce/
├── backend/            # Express Server & API Routes
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Endpoints
│   └── server.js       # Entry Point
├── frontend/           # React Application
│   ├── src/
│   │   ├── redux/      # Cart & Auth Slices
│   │   ├── components/ # Reusable UI Elements
│   │   └── pages/      # Home, Checkout, Dashboard
│   └── public/
└── README.md

<img width="1918" height="919" alt="image" src="https://github.com/user-attachments/assets/80719bc5-326f-452f-b060-6eafdf0ac6c2" />

<img width="1918" height="919" alt="image" src="https://github.com/user-attachments/assets/53dc7f9b-9c79-40c3-ba5f-f5a9829396e3" />

