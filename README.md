# ⚡ FileBridge

> **A modern, high-performance personal cloud storage and desktop synchronization platform built with the MERN stack and Electron.**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Electron](https://img.shields.io/badge/Electron-35.0-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Material UI](https://img.shields.io/badge/MUI-v6-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

**FileBridge** is an all-in-one personal cloud file management suite combining a **modern React web application** with an **Electron desktop companion**. Inspired by platforms like Google Drive and Dropbox, FileBridge provides a seamless, intuitive environment for organizing, previewing, searching, sharing, and syncing your files across devices.

Designed with an **Electric Indigo (`#4F46E5`) & Sky Blue (`#0284C7`)** SaaS design system, FileBridge emphasizes micro-interactions, responsive ergonomics, and high security.

---

## ✨ Features

### 🖥️ Dual-Platform Duality (Web & Desktop)
- **Web Cloud Client**: Lightweight, fast single-page app accessible from any browser with companion download promotions.
- **Electron Desktop Companion**: Frameless custom dark titlebar (`#0F172A`), native window controls, system tray minimization, local folder synchronization engine, and quick file manager shortcuts.
- **Real-Time Sync Pulse**: Instant visual feedback on desktop sync state (`⚡ Synced` / `🔄 Syncing...`).

### 📁 Advanced Folder & File Management
- **Hierarchical Organization**: Create, navigate, and nest folders with interactive breadcrumbs.
- **Dual View Modes**: Switch seamlessly between **Grid View** and **List/Table View**.
- **MIME-Based Badges**: Smart color-coded icons and tags for Images, PDFs, Videos, Audio, Archives, and Code.
- **Drag & Drop Uploads**: Fluid multi-file upload drop zone with floating progress tracker.
- **Multi-Selection & Batch Actions**: Batch favorite or batch move items to Recycle Bin with a floating action capsule.
- **Quick Hover Actions**: Instant preview, download, rename, star, share, and delete directly on card hover.

### 👁️ Instant In-App File Previews
- **Images**: High-resolution viewer with smooth scaling.
- **PDF Documents**: Embedded native document preview.
- **Code & Text**: Monospace formatted text reader.

### 🔗 Granular File Sharing
- **Secure Share Links**: Unique UUID-generated public share links.
- **Password Protection**: Optional bcrypt-hashed password protection on public downloads.
- **Configurable Expiration**: Set link lifetimes (`1h`, `24h`, `7d`, `30d`, or `Never`).
- **Dedicated Recipient Portal**: Clean public download page for recipients.
- **Instant Revocation**: One-click sharing disable and active links management hub.

### 📊 Storage & Analytics
- **Live Storage Quota Bar**: Visual breakdown of storage consumption against tier limits.
- **File Type Distribution**: Interactive file category analytics and storage allocation meters.
- **Largest Files Analyzer**: Rapidly identify and manage storage-heavy files.
- **Activity Feed**: Comprehensive audit trail of uploads, downloads, renames, and deletions.

### ♻️ Safe Two-Step Deletion (Recycle Bin)
- **Soft Deletion**: Accidental deletions move items to the Recycle Bin with cascade guards.
- **One-Click Restoration**: Restore folders and files back to their original hierarchy.
- **Permanent Purge**: Clean disk storage and unlink backend files permanently.

### 🔐 Security & Auth
- **JWT-Powered Authentication**: Secure token-based session handling.
- **Bcrypt Password Encryption**: Industry-standard password hashing.
- **Protected Routing**: Navigation guards ensuring secure data isolation.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Material UI v6, Tailwind CSS v4, Emotion, React Router v7, Framer Motion, Axios, React Hot Toast, React Dropzone |
| **Desktop Client** | Electron 35, Chokidar (File Watcher), Axios, Form-Data, Node.js IPC Bridge |
| **Backend API** | Node.js, Express.js 5, MongoDB Atlas, Mongoose 9, Multer, JSON Web Tokens (JWT), Bcrypt, UUID |
| **Styling & Theme** | Custom Electric Indigo & Sky Blue Design System, Inter typography |

---

## 📂 Project Architecture

```
FileBridge/
├── client/                     # React 19 + Vite Frontend
│   ├── public/                 # Static assets & modern cloud favicon
│   ├── src/
│   │   ├── components/         # Modular UI Components
│   │   │   ├── common/         # ActionMenu, Dialogs, Toolbars, SearchBar
│   │   │   ├── dashboard/      # Overview, QuickActions, RecentActivity, Storage
│   │   │   ├── desktop/        # Frameless DesktopTitlebar, DesktopSyncHub
│   │   │   ├── file/           # FileCard, FileGrid, FileUpload
│   │   │   ├── folder/         # FolderCard, FolderGrid, Breadcrumbs
│   │   │   ├── layout/         # AppLayout, Sidebar, Navbar, MainContent
│   │   │   ├── preview/        # FilePreviewDialog, Image/Pdf/Text Previewers
│   │   │   ├── recycleBin/     # RecycleFileCard, RecycleFolderCard
│   │   │   ├── share/          # ShareDialog, SharedFileCard
│   │   │   └── upload/         # DragDropZone, UploadProgress
│   │   ├── constants/          # Application route definitions
│   │   ├── context/            # AuthContext, FolderContext, UploadContext
│   │   ├── pages/              # Splash, Login, Dashboard, Statistics, Favorites, SharedFiles, RecycleBin, Settings, SharePage
│   │   ├── services/           # Axios API service layer (auth, file, folder, share, etc.)
│   │   ├── styles/             # Global CSS & Tailwind configuration
│   │   ├── theme/              # MUI custom palette & typography
│   │   └── utils/              # Storage helpers, file formatters, URL resolvers
│   └── package.json
│
├── server/                     # Node.js + Express REST API
│   ├── config/                 # MongoDB connection setup
│   ├── controllers/            # Controller logic (Auth, File, Folder, Share, RecycleBin, Dashboard)
│   ├── middleware/             # JWT auth & Multer upload middleware
│   ├── models/                 # Mongoose schemas (User, File, Folder, Activity)
│   ├── routes/                 # Express API route declarations
│   ├── seed/                   # Database seed scripts
│   ├── uploads/                # Local file storage repository
│   ├── utils/                  # Activity logger & helper utilities
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Entrypoint listener
│   └── package.json
│
├── desktop/                    # Electron Desktop Application
│   ├── sync/                   # SyncEngine (Chokidar local file watcher & uploader)
│   ├── main.js                 # Electron main process & IPC handlers
│   ├── preload.js              # Context bridge API
│   └── package.json
│
├── package.json                # Root monorepo workspace scripts
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB**: Local instance or MongoDB Atlas connection URI

---

### 1. Clone the Repository
```bash
git clone https://github.com/Saad2607/FileBridge.git
cd FileBridge
```

---

### 2. Configure Backend Environment
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### 3. Install Dependencies

You can install dependencies for all modules:

```bash
# Install Server dependencies
cd server && npm install

# Install Client dependencies
cd ../client && npm install

# Install Desktop dependencies
cd ../desktop && npm install

# Return to root
cd ..
```

---

### 4. Seed Admin User (Optional)
To quickly create a default administrator account:

```bash
cd server
npm run seed
```

---

### 5. Running the Application

You can run the different parts of FileBridge using the root scripts or in separate terminals:

#### Running the Backend API:
```bash
npm run dev:server
# Server runs on http://localhost:5000
```

#### Running the Web Client:
```bash
npm run dev:client
# Vite Dev Server runs on http://localhost:5173
```

#### Running the Electron Desktop Client:
```bash
npm run dev:desktop
# Launches the Electron application window with local sync engine
```

#### Building the Client for Production:
```bash
npm run build:client
```

---

## 🔒 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT token | No |
| `GET` | `/api/folders` | Retrieve folders (root or by parent query) | Yes |
| `POST` | `/api/folders` | Create a new folder | Yes |
| `PUT` | `/api/folders/:id` | Rename folder | Yes |
| `DELETE` | `/api/folders/:id` | Move folder to Recycle Bin | Yes |
| `GET` | `/api/files` | Retrieve files (root or by folder query) | Yes |
| `POST` | `/api/files/upload` | Multipart file upload | Yes |
| `GET` | `/api/files/download/:id` | Download file by ID | Yes |
| `PUT` | `/api/files/:id` | Rename file | Yes |
| `DELETE` | `/api/files/:id` | Move file to Recycle Bin | Yes |
| `POST` | `/api/share/:id` | Generate secure public share link | Yes |
| `GET` | `/api/share/:token` | Retrieve public file metadata | No |
| `GET` | `/api/share/:token/download` | Download shared file (with password validation) | No |
| `GET` | `/api/dashboard/stats` | Retrieve aggregate storage & file metrics | Yes |
| `GET` | `/api/dashboard/analytics` | Retrieve MIME-type distribution & largest files | Yes |
| `GET` | `/api/recycle-bin/files` | Retrieve deleted files | Yes |
| `GET` | `/api/recycle-bin/folders` | Retrieve deleted folders | Yes |
| `PATCH` | `/api/recycle-bin/files/:id/restore` | Restore file from Recycle Bin | Yes |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Saad2607/FileBridge/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Mohammed Saad Shaikh**  
- GitHub: [@Saad2607](https://github.com/Saad2607)