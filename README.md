# FileBridge

> A modern cloud file management and synchronization platform built with the MERN stack and Electron.

FileBridge is a cloud-inspired file management application that allows users to securely upload, organize, search, share, and manage files through a modern web interface. The long-term vision is to provide seamless synchronization across devices using an Electron desktop application.

---

# 📖 Overview

FileBridge is a full-stack portfolio project inspired by platforms like **Google Drive**, **Dropbox**, and **Microsoft OneDrive**.

The application focuses on providing a clean architecture, scalable backend, reusable React components, and production-ready development practices while implementing real-world cloud storage features.

---

# ✨ Current Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Persistent Sessions
- Logout

---

## 📁 Folder Management

- Create Folders
- Nested Folder Navigation
- Breadcrumb Navigation
- Rename Folders
- Soft Delete
- Restore Deleted Folders
- Permanent Delete
- Favorite Folders
- Folder Properties
- Modern Folder Cards

---

## 📄 File Management

- Upload Files
- Drag & Drop Upload
- Upload Progress Indicator
- Download Files
- Rename Files
- Soft Delete
- Restore Deleted Files
- Permanent Delete
- Favorite Files
- File Properties
- Modern File Cards

---

## 🔍 Search

- Global Search
- Search Files
- Search Folders
- Instant Search Results

---

## ⭐ Favorites

- Favorite Files
- Favorite Folders
- Dedicated Favorites Page

---

## ♻️ Recycle Bin

- Soft Delete
- Restore Items
- Delete Forever
- Dedicated Recycle Bin

---

## 🔗 File Sharing

- UUID Secure Share Links
- Public File Download
- Copy Share Link
- Share Dialog
- Disable Sharing
- Configurable Link Expiry
- Password Protected Sharing (UI)

---

## 📊 Dashboard

- Storage Usage Card
- Dashboard Statistics
- Recent Files
- Recent Activity Panel
- Quick Actions Panel
- Storage Progress
- Responsive Dashboard

---

## 🎨 User Interface

- Material UI
- Responsive Layout
- Sidebar Navigation
- Sticky Navbar
- Dashboard Overview
- Folder Grid
- File Grid
- Empty States
- Loading Skeletons
- Action Menus
- Dialog System
- Breadcrumb Navigation
- Upload Progress
- Explorer Toolbar (Search, Sort, Filter, View Toggle)
- Modern Cards & Hover Effects

---

## 🏗 Architecture

- REST API
- Context API
- Component-Based React
- Modular Backend
- JWT Authentication
- MongoDB Data Modeling
- Reusable UI Components
- Service Layer Architecture

---

# 🚀 Upcoming Features

## Explorer

- Functional Sorting
- Advanced Filtering
- Grid/List View Persistence
- Multi Select
- Bulk Operations

## File Preview

- Image Preview
- PDF Viewer
- Video Preview
- Audio Preview
- Office Document Preview

## Dashboard

- Storage Analytics
- Charts
- File Type Statistics
- Upload History

## Sharing

- Email Sharing
- Permission Management
- Collaboration
- Shared Workspace

## User Settings

- Profile Management
- Change Password
- Avatar Upload
- Dark Mode
- Notification Preferences

## Desktop

- Electron Desktop Client
- Automatic File Sync
- Offline Mode
- Background Sync

## Advanced

- File Versioning
- Activity Logs
- Notifications
- Real-time Updates

---

# 🛠 Tech Stack

## Frontend

- React
- React Router
- Context API
- Axios
- Material UI
- React Dropzone

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- UUID

## Desktop (Planned)

- Electron

---

# 📂 Project Structure

```
FileBridge/
│
├── client/
│   ├── src/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── file/
│   │   ├── folder/
│   │   ├── layout/
│   │   ├── share/
│   │   ├── skeleton/
│   │   └── upload/
│   │
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── constants/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── utils/
│
├── desktop/        # Planned
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <repository-url>
```

```bash
cd FileBridge
```

---

## Install Backend

```bash
cd server
npm install
```

---

## Install Frontend

```bash
cd ../client
npm install
```

---

# Environment Variables

Create `.env` inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# Run Backend

```bash
cd server
npm run dev
```

---

# Run Frontend

```bash
cd client
npm run dev
```

---

# 📸 Screenshots

Screenshots will be added as development progresses.

---

# 📌 Current Progress

## ✅ Completed

- Authentication System
- Dashboard
- Folder Management
- File Management
- File Upload
- Drag & Drop Upload
- File Download
- Rename
- Search
- Favorites
- Recycle Bin
- File Sharing (v1)
- Properties Dialog
- Responsive UI
- Dashboard Widgets
- Loading Skeletons
- Upload Progress
- Explorer Toolbar UI
- Modern Card-based Interface
- Logout

---

## 🚧 In Progress

- Explorer Sorting
- Explorer Filtering
- Grid/List View
- User Settings
- Storage Analytics

---

## 📅 Planned

- Electron Desktop Client
- Automatic Synchronization
- Notifications
- Real-time Updates
- Multi-device Support
- File Preview
- Dark Mode

---

# 🎯 Learning Goals

- Build a production-ready MERN application
- Design scalable REST APIs
- Create reusable React components
- Learn advanced Material UI design
- Implement secure authentication
- Develop cloud storage architecture
- Build an Electron desktop sync client
- Practice modern frontend architecture
- Improve UX/UI design skills

---

# 🤝 Contributing

This project is currently developed as a personal portfolio and learning project.

Suggestions, issues, and discussions are always welcome.

---

# 📄 License

Licensed under the MIT License.

---

# 👨‍💻 Author

**Mohammed Saad Shaikh**

Built with ❤️ using the MERN Stack and Electron.