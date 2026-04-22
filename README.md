# 🥗 Meal-Kit E-Commerce Platform
> A full-featured MERN Stack application for ordering and managing recipe-based meal kits.



## 📖 Overview
Meal-Kit is a specialized e-commerce platform where users can browse, filter, and buy meal kits containing all necessary ingredients to cook at home. It includes a comprehensive Admin Dashboard to manage the entire ecosystem.

### 🚀 [Live Preview Here](https://effulgent-crostata-6d013d.netlify.app/)
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

<img width="1918" height="919" alt="لقطة شاشة 2026-04-22 220933" src="https://github.com/user-attachments/assets/2500fa57-9885-4f95-bf1f-6f8090181ccf" />
![Uploading لقطة شاشة 2026-04-22 220915.png…]()

