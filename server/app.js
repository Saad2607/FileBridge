const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Welcome to FileBridge API 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

module.exports = app;