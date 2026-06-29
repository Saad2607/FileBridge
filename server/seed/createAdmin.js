require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await connectDB();

        const existingUser = await User.findOne({
            username: "saad",
        });

        if (existingUser) {
            console.log("✅ Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("12345678", 10);

        await User.create({
            username: "saad",
            password: hashedPassword,
        });

        console.log("🎉 Admin created successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();