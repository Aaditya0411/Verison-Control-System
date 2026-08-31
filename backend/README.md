# 🚀 Revix Backend & Deployment Guide

This guide contains step-by-step instructions for running, managing, and deploying the **Revix Version Control System** on AWS EC2.

---

## 📌 Application Details & Links

- **Elastic IP (Static):** `52.202.129.198`
- **Live Application URL:** [http://52.202.129.198:3002/](http://52.202.129.198:3002/)
- **Backend Port:** `3002`

---

## ⚡ Quick Start Guide (Jab bhi EC2 Start karo)

Jab bhi aap AWS EC2 Instance ko **Start** karo, bas ye simple steps follow karo:

### 1. EC2 SSH Terminal kholein
SSH terminal (ya AWS EC2 Instance Connect) ke zariye EC2 instance me login karein.

### 2. Backend Server Start karein
Terminal par ye commands chalayein:

```bash
cd ~/Revix-Backend
git pull origin main
node index.js start
```

### 3. Application Kholein
Browser me direct ye link kholein:
👉 **[http://52.202.129.198:3002/](http://52.202.129.198:3002/)**

*(Frontend aur Backend dono ek sath smooth chalenge!)*

---

## 🔄 24/7 Background Running (PM2 Setup)

Agar aap chahte ho ki terminal/SSH close karne ke baad bhi server **24/7 chalta rahe**, toh PM2 setup karein:

```bash
cd ~/Revix-Backend
npm install -g pm2
pm2 start index.js --name "revix-backend" -- start
pm2 save
pm2 startup
```

Iske baad terminal band karne par bhi server kabhi band nahi hoga!

---

## 💻 Local Development Setup (Apne PC Par Chalane Ke Liye)

Apne local system par development aur testing ke liye:

1. **Backend start karein:**
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Browser me open karein: `http://localhost:3002/`

---

## 🛠️ Architecture Summary

- **Unified Single-Origin Server:** Express backend directly serves the compiled React frontend static files (`frontend/dist`).
- **No CORS / Mixed Content Issues:** Both API and UI run on the exact same port (`3002`).
- **Database:** Connected to MongoDB Atlas.
- **Authentication:** JWT (JSON Web Tokens) + bcryptjs password hashing.
