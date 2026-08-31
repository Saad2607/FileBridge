const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");
const searchRoutes = require("./routes/searchRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const recycleBinRoutes = require("./routes/recycleBinRoutes");
const shareRoutes = require("./routes/shareRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityRoutes = require("./routes/activityRoutes");

const path = require("path");
const fs = require("fs");

const app = express();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads/files");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

// Serve static uploads with Cross-Origin Resource Policy and CORS headers
app.use(
    "/uploads",
    (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
        next();
    },
    express.static(path.join(__dirname, "uploads")),
    express.static(path.resolve("uploads")),
    express.static(path.join(__dirname, "../uploads"))
);

app.get("/", (req, res) => {
    res.send("Welcome to FileBridge API 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/recycle-bin", recycleBinRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);

module.exports = app;