# FileBridge

> A modern cloud file management and synchronization platform built with the MERN stack and Electron.

FileBridge allows users to securely upload, organize, download, and manage files through a web application, with future support for desktop synchronization across multiple devices.

---

## 📖 Overview

FileBridge is a full-stack personal project inspired by cloud storage platforms such as Google Drive, OneDrive, and Dropbox. The goal is to build a secure and scalable file management system where users can access their files from anywhere through a web interface and, in future releases, automatically synchronize files using a desktop application.

This project is being developed incrementally with a focus on clean architecture, reusable components, and production-ready coding practices.

---

## ✨ Current Features

### Authentication
- Secure JWT authentication
- Protected API routes
- Persistent user sessions
- Login system

### Folder Management
- Create folders
- Navigate nested folders
- Breadcrumb navigation
- Delete folders
- Rename folders (in progress)

### File Management
- Upload files
- Download files
- Delete files

### User Interface
- Material UI based interface
- Responsive dashboard
- Sidebar navigation
- Reusable dialogs
- Reusable action menus

### Architecture
- RESTful API
- Context API for state management
- Component-based frontend
- Modular backend structure

---

## 🚀 Planned Features

- Desktop synchronization using Electron
- Drag & Drop uploads
- File previews
- Search functionality
- Favorites
- Rename files
- File sharing
- User registration
- Role-based access
- Storage usage statistics
- Dark mode
- Recycle Bin
- Version history

---

## 🛠 Tech Stack

### Frontend

- React
- React Router
- Material UI
- Axios
- Context API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer

### Desktop (Planned)

- Electron

---

## 📂 Project Structure

```
FileBridge/
│
├── client/          # React Frontend
├── server/          # Express Backend
├── docs/            # Documentation
├── desktop/         # Electron App (Planned)
└── README.md
```

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd FileBridge
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run Backend

```bash
npm run dev
```

### Run Frontend

```bash
npm run dev
```

---

## 📸 Screenshots

Screenshots will be added as development progresses.

---

## 📌 Development Status

This project is currently under active development.

Completed modules include:

- Authentication
- Folder Management
- File Upload
- File Download
- File Deletion
- Dashboard UI

Upcoming modules include:

- Rename functionality
- Search
- Favorites
- Electron synchronization
- Advanced file management

---

## 🎯 Project Goals

- Learn full-stack application architecture
- Build a production-ready MERN application
- Implement secure authentication
- Practice scalable React component design
- Develop an Electron desktop companion
- Explore cloud file synchronization concepts

---

## 🤝 Contributing

This is currently a personal learning and portfolio project. Contributions, suggestions, and feedback are welcome.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mohammed Saad Shaikh**

Built as a full-stack portfolio project using the MERN stack and Electron.