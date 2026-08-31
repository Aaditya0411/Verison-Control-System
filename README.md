# 🚀 Revix Version Control System

Full-stack Version Control System application built with Node.js, Express, MongoDB, and React.

---

## 🌐 Live Application Link

- **Live URL:** [http://52.202.129.198:3002/](http://52.202.129.198:3002/)
- **Static Elastic IP:** `52.202.129.198`

---

## 📖 EC2 Restart & Quick Start Instructions

Jab bhi aap AWS EC2 Instance ko **Start** karo:

1. **EC2 me SSH karein:**
   ```bash
   cd ~/Revix-Backend
   git pull origin main
   node index.js start
   ```

2. **Browser me kholein:**
   👉 [http://52.202.129.198:3002/](http://52.202.129.198:3002/)

---

## 🔄 24/7 PM2 Auto-Restart (Optional 1-Time Setup)

Server ko hamesha background me chalu rakhne ke liye:

```bash
cd ~/Revix-Backend
npm install -g pm2
pm2 start index.js --name "revix-backend" -- start
pm2 save
pm2 startup
```

---

## 💻 Local Setup

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
