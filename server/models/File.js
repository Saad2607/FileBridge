const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: true,
        },

        storedName: {
            type: String,
            required: true,
        },

        mimeType: {
            type: String,
            required: true,
        },

        size: {
            type: Number,
            required: true,
        },

        path: {
            type: String,
            required: true,
        },

        folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("File", fileSchema);