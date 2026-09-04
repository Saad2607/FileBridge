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

        favorite: {
            type: Boolean,
            default: false,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },

        shareToken: {
            type: String,
            default: null,
        },

        isPublic: {
            type: Boolean,
            default: false,
        },

        shareExpiry: {
            type: Date,
            default: null,
        },
        sharePassword: {
            type: String,
            default: null,
        },
        burnAfterDownload: {
            type: Boolean,
            default: false,
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
        fileData: {
            type: Buffer,
            default: null,
            select: false,
        },
        textContent: {
            type: String,
            default: null,
            select: false,
        },
        tags: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                color: {
                    type: String,
                    default: "#4F46E5",
                },
            },
        ],
        versions: {
            type: [
                {
                    versionNumber: Number,
                    textContent: String,
                    size: Number,
                    savedAt: {
                        type: Date,
                        default: Date.now,
                    },
                    comment: {
                        type: String,
                        default: "Code editor update",
                    },
                },
            ],
            default: [],
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("File", fileSchema);