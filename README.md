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

---

## 📄 File Management

- Upload Files
- Download Files
- Rename Files
- Soft Delete
- Restore Deleted Files
- Permanent Delete
- Favorite Files

---

## 🔍 Search

- Search Files
- Search Folders
- Instant Search Results

---

## ⭐ Favorites

- Mark Files as Favorite
- Mark Folders as Favorite
- Dedicated Favorites Page

---

## ♻️ Recycle Bin

- Soft Delete
- Restore Items
- Delete Forever
- Dedicated Recycle Bin

---

## 🔗 File Sharing

- Generate Public Share Links
- UUID-Based Secure Links
- Copy Link to Clipboard
- Public File Download
- Share Dialog UI

---

## 🎨 User Interface

- Material UI
- Responsive Layout
- Sidebar Navigation
- Reusable Components
- Dialog System
- Action Menus
- Modern Dashboard

---

## 🏗 Architecture

- RESTful API
- Context API
- Component-Based React
- Modular Backend
- JWT Authentication
- MongoDB Data Modeling

---

# 🚀 Upcoming Features

## Sharing

- Password Protected Links
- Link Expiry
- Disable Sharing
- Share Permissions

## File Management

- Drag & Drop Upload
- File Preview
- Multiple File Upload
- Folder Color Tags

## Dashboard

- Storage Analytics
- Recent Files
- Activity Feed

## User Settings

- Profile Management
- Change Password
- Avatar Upload
- Dark Mode

## Desktop

- Electron Desktop Client
- Automatic File Sync
- Offline Support

---

# 🛠 Tech Stack

## Frontend

- React
- React Router
- Context API
- Axios
- Material UI

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
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── package.json
│
├── docs/
│
├── desktop/          # Planned
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

## Completed

- Authentication
- Dashboard
- Folder Management
- File Upload
- File Download
- Rename
- Search
- Favorites
- Recycle Bin
- File Sharing (v1)
- Responsive UI
- Logout

---

## In Progress

- Advanced File Sharing
- User Settings
- Storage Dashboard

---

## Planned

- Electron Desktop Sync
- File Versioning
- Notifications
- Real-time Updates
- Multi-device Synchronization

---

# 🎯 Learning Goals

- Build a production-ready MERN application
- Learn scalable backend architecture
- Design reusable React components
- Implement secure authentication
- Develop RESTful APIs
- Build a cloud storage platform from scratch
- Explore desktop synchronization using Electron

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