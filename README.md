# 🚀 Revix — Version Control System

Revix is a full-stack **Version Control System (VCS)** built from scratch to understand and implement the core concepts behind modern version control platforms.

The project includes a command-line version control engine along with a web interface for repository management, authentication, issue tracking, file storage, and version management.

---

## 🌐 Live Application

**Frontend:** AWS Amplify  
**Backend:** AWS EC2  
**Database:** MongoDB  
**Storage:** AWS S3

🔗 **Live Application:** http://52.202.129.198:3002/

🔗 **GitHub Repository:** https://github.com/Aaditya0411/Verison-Control-System

---

## ✨ Features

### 📦 Version Control

- Repository initialization
- File staging
- Commit creation
- Push and pull operations
- Revert changes
- Version and change tracking

### 📁 Repository Management

- Create and manage repositories
- Manage repository files
- Track repository versions
- Repository-based project management

### 👤 Authentication

- User registration and login
- JWT-based authentication
- Password hashing using Bcrypt
- Protected API routes

### 🐛 Issue Management

- Create and manage issues
- Associate issues with repositories
- Track issue information

### ⚡ Real-Time Communication

- Real-time communication using Socket.IO
- Event-based updates between clients and server

### ☁️ Cloud Storage & Deployment

- Backend deployed on AWS EC2
- Frontend deployed using AWS Amplify
- File/object storage using AWS S3

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React, JavaScript, HTML, CSS, Bootstrap |
| **Backend** | Node.js, Express.js, Yargs |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, Bcrypt |
| **Testing** | Jest |
| **Real-Time** | Socket.IO |
| **Cloud & Deployment** | AWS EC2, AWS Amplify, AWS S3 |

---

## 🏗️ Project Structure

```text
Verison-Control-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 🔄 System Architecture

```text
                         ┌───────────────────┐
                         │     Frontend      │
                         │ React + Bootstrap │
                         └─────────┬─────────┘
                                   │
                              REST APIs
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Backend      │
                         │ Node.js + Express │
                         └─────────┬─────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
                  ▼                ▼                ▼
             ┌─────────┐     ┌─────────┐     ┌───────────┐
             │ MongoDB │     │ AWS S3  │     │ Socket.IO │
             │ Database│     │ Storage │     │ Real-Time │
             └─────────┘     └─────────┘     └───────────┘
```

---

# 💻 Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Aaditya0411/Verison-Control-System.git

cd Verison-Control-System
```

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=3002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

Start the backend server:

```bash
npm start
```

The backend will run on:

```text
http://localhost:3002
```

---

## 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite.

---

# ☁️ Deployment

## Backend — AWS EC2

The backend is deployed on an **AWS EC2 instance**.

To update the deployed backend:

```bash
cd ~/Revix-Backend

git pull origin main

npm install

npm start
```

The backend is configured to run on port `3002`.

---

## Frontend — AWS Amplify

The frontend is deployed using **AWS Amplify**.

The application is connected to the Git repository and the frontend is built and deployed through the configured Amplify environment.

---

## Storage — AWS S3

**AWS S3** is used for storing application files and objects in the cloud.

---

# 🖥️ Version Control Commands

Revix includes a CLI-based version control workflow with commands such as:

```text
init
add
commit
push
pull
revert
```

These commands form the core of the version control engine and provide functionality for managing repositories and tracking changes.

---

# 🧪 Testing

The project uses **Jest** for testing.

Run the test suite using:

```bash
npm test
```

---

# 🔐 Environment Variables

Sensitive credentials should never be committed to the repository.

The following values should be stored in environment variables:

```text
MongoDB connection string
JWT secret
AWS access key
AWS secret key
AWS S3 configuration
Application port
```



# 🔮 Future Improvements

- Branch management
- Pull request functionality
- Code review
- Improved collaboration features
- CI/CD integration
- Better test coverage
- Advanced repository management
- Improved monitoring and logging
- Custom domain with HTTPS

---

# 👨‍💻 Author

**Aaditya Goswami**

GitHub:  
https://github.com/Aaditya0411

---

⭐ If you find this project interesting, consider giving the repository a star.
