# 🚀 Revix Version Control System

Full-stack Version Control System application built with Node.js, Express, MongoDB, and React.

---

## 🌐 Live Application Link

- **Live Application URL:** [http://52.202.129.198:3002/](http://52.202.129.198:3002/)
- **Static Elastic IP:** `52.202.129.198`
- **Port:** `3002`

---

## ⚡ Quick Start Guide (Jab bhi EC2 Instance Start karo)

Jab bhi aap AWS EC2 Instance ko **Start** karo, bas ye simple steps follow karo:

### 1. EC2 me SSH Terminal kholein
SSH terminal (ya AWS EC2 Instance Connect) ke zariye EC2 instance me login karein.

### 2. Backend Server Start karein
Terminal par ye commands chalayein:

```bash
cd ~/Revix-Backend
git pull origin main
node index.js start
```

### 3. Browser me Open karein
Browser me direct ye link kholein:
👉 **[http://52.202.129.198:3002/](http://52.202.129.198:3002/)**

*(Frontend aur Backend dono ek sath smooth chalenge!)*

---

## 💻 Local Setup (Apne PC Par Chalane Ke Liye)

```bash
# 1. Frontend Build
cd frontend
npm install
npm run build

# 2. Backend Start
cd ../backend
npm install
npm start
```
