const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            required: true,
            enum: [
                "UPLOAD_FILE",
                "DOWNLOAD_FILE",
                "DELETE_FILE",
                "RESTORE_FILE",
                "PERMANENT_DELETE_FILE",
                "RENAME_FILE",
                "FAVORITE_FILE",
                "UNFAVORITE_FILE",
                "SHARE_FILE",
                "UNSHARE_FILE",
                "EDIT_FILE",
                "UPDATE_TAGS",
                "BATCH_TAGS",
                "RESTORE_VERSION",
                "CREATE_FOLDER",
                "DELETE_FOLDER",
                "RESTORE_FOLDER",
                "PERMANENT_DELETE_FOLDER",
                "RENAME_FOLDER",
                "FAVORITE_FOLDER",
                "UNFAVORITE_FOLDER",
            ],
        },

        targetType: {
            type: String,
            required: true,
            enum: ["file", "folder"],
        },

        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        targetName: {
            type: String,
            required: true,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);