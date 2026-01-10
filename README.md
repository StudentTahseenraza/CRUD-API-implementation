## 🚀 Scalable Task Management API with JWT Authentication & RBAC

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)



A production-ready, scalable REST API with JWT authentication, Role-Based Access Control (RBAC), and a modern React frontend for task management.

------------
✨ Features
---------------
🔐 Authentication & Security
------------------

✅ JWT-based authentication with refresh tokens

✅ Role-Based Access Control (User/Admin)

✅ Password hashing with bcrypt

✅ Rate limiting and CORS protection

✅ Input validation and sanitization

✅ Protected routes with middleware


🚀 Backend Features
------------------

✅ RESTful API design with versioning (/api/v1/)

✅ MongoDB with Mongoose ODM

✅ Complete CRUD operations for tasks

✅ Advanced filtering, sorting, and pagination

✅ Comprehensive error handling

✅ API documentation with Swagger UI

✅ Modular and scalable architecture


🎨 Frontend Features
------------------

✅ Modern React.js with Vite (Fast Build Tool)

✅ Tailwind CSS for responsive design

✅ Real-time dashboard with statistics

✅ Task management interface

✅ Admin panel with user management

✅ Protected routes and role-based UI

✅ Toast notifications

✅ Form validation with react-hook-form


👑 Admin Features
------------------

✅ User management system

✅ Role assignment (User ↔ Admin)

✅ System-wide task monitoring

✅ Delete any user/task

✅ System statistics dashboard

✅ Activity monitoring


🚀 Local Setup Guide

-----------

Prerequisites
------
Node.js (v16 or higher)

MongoDB (Local or Atlas)

Git

Code Editor (VS Code recommended)

🚀 Local Setup Guide

    Step 1: Clone the Repository
    git clone https://github.com/StudentTahseenraza/CRUD-API-implementation.git
    cd CRUD-API-implementation
    
    Step 2: Backend Setup
    2.1 Navigate to backend directory
    cd backend
    
    2.2 Install dependencies
    npm install
    
    2.3 Configure environment variables
    
    # Copy the example environment file
    cp .env.example .env
    # Edit .env file with your configurations
    
    2.4 Update .env file with these values:
    env
    # Server Configuration
    PORT=5000
    NODE_ENV=development
    
    # Database Configuration (Choose one)
    # Option A: Local MongoDB
    MONGODB_URI=mongodb://localhost:27017/task_manager_db
    
    # Option B: MongoDB Atlas (Recommended for production)
    # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task_manager_db
    
    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
    JWT_EXPIRE=7d
    
    # Security Configuration
    BCRYPT_SALT_ROUNDS=10
    RATE_LIMIT_WINDOW=900000  # 15 minutes in milliseconds
    RATE_LIMIT_MAX=100
    
    # Development mode (with auto-restart)
    npm run dev
    
    # Production mode
    npm start
    ✅ Backend should now be running at: http://localhost:5000
    
    Step 3: Frontend Setup
    3.1 Open a new terminal and navigate to frontend
    cd ../frontend
    
    3.2 Install dependencies
    npm install
    
    3.3 Configure environment variables
    # Copy the example environment file
    cp .env.example .env
    
    # Edit .env file
    3.4 Update .env file:
    env
    VITE_API_BASE_URL=http://localhost:5000/api/v1
    VITE_APP_NAME=Task Management System
    VITE_APP_VERSION=1.0.0
    VITE_NODE_ENV=development
    
    3.5 Start the frontend development server
    npm run dev
    ✅ Frontend should now be running at: http://localhost:3000


👑 Admin Setup & Login Credentials

---------------

Default Admin Account
-----
The system automatically creates a default admin user on first startup:

📧 Email: admin@taskmaster.com
🔑 Password: Admin@123

Go to Admin Dashboard → User Management

Find the user you want to promote

Change their role from "User" to "Admin"

Save changes


🔧 API Endpoints

------------------

🔐 Authentication

| Method | Endpoint                       | Description          | Access  |
| ------ | ------------------------------ | -------------------- | ------- |
| POST   | `/api/v1/auth/register`        | Register new user    | Public  |
| POST   | `/api/v1/auth/login`           | Login user           | Public  |
| GET    | `/api/v1/auth/me`              | Get current user     | Private |
| PUT    | `/api/v1/auth/update-profile`  | Update user profile  | Private |
| PUT    | `/api/v1/auth/change-password` | Change user password | Private |
| POST   | `/api/v1/auth/logout`          | Logout user          | Private |


📝 Tasks

| Method | Endpoint              | Description                  | Access          |
| ------ | --------------------- | ---------------------------- | --------------- |
| POST   | `/api/v1/tasks`       | Create new task              | Private         |
| GET    | `/api/v1/tasks`       | Get all tasks (with filters) | Private         |
| GET    | `/api/v1/tasks/:id`   | Get single task              | Private         |
| PUT    | `/api/v1/tasks/:id`   | Update task                  | Private (Owner) |
| DELETE | `/api/v1/tasks/:id`   | Delete task                  | Admin Only      |
| GET    | `/api/v1/tasks/stats` | Get task statistics          | Private         |


🛡️ Admin (Admin Access Only)

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/v1/admin/users`     | Get all users              |
| GET    | `/api/v1/admin/users/:id` | Get user by ID             |
| PUT    | `/api/v1/admin/users/:id` | Update user                |
| DELETE | `/api/v1/admin/users/:id` | Delete user                |
| GET    | `/api/v1/admin/tasks`     | Get all tasks (admin view) |
| GET    | `/api/v1/admin/stats`     | Get system statistics      |


📊 API Documentation
----------------------
Access Swagger UI for interactive API documentation:

    http://localhost:5000/api-docs
    
🎯 Quick Test Commands

------------

Test Registration

    curl -X POST http://localhost:5000/api/v1/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
      }'
      
Test Login

    curl -X POST http://localhost:5000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "password123"
      }'
      
Test Task Creation (with JWT)

    curl -X POST http://localhost:5000/api/v1/tasks \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \
      -d '{
        "title": "Complete Project",
        "description": "Finish the task management system",
        "status": "pending",
        "priority": "high"
      }'


