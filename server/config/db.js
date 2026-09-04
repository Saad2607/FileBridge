const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/filebridge";

        await mongoose.connect(mongoUri);

        console.log("✅ MongoDB Connected");

        // Asynchronously sync existing local disk files into MongoDB Atlas
        try {
            const { syncExistingFilesToDatabase } = require("../utils/storageSync");
            syncExistingFilesToDatabase().catch((e) => console.error("StorageSync error:", e.message));
        } catch {}
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);
        if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
            console.error("💡 Tip: Make sure to define MONGODB_URI in your server/.env file or start your MongoDB service.");
        }
        process.exit(1);
    }
};

module.exports = connectDB;