const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body || {};

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, username, email, password) are required.",
            });
        }

        const trimmedName = name.trim();
        const trimmedUsername = username.trim().toLowerCase();
        const trimmedEmail = email.trim().toLowerCase();

        if (trimmedUsername.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters long.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: trimmedUsername });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken. Please choose another.",
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: trimmedEmail });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "An account with this email address already exists.",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name: trimmedName,
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPassword,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during registration.",
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required.",
            });
        }

        const cleanIdentifier = username.trim().toLowerCase();

        // Support login via username or email
        const user = await User.findOne({
            $or: [{ username: cleanIdentifier }, { email: cleanIdentifier }],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password.",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password.",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name || user.username,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

module.exports = { register, login };