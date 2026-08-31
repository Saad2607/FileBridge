const Activity = require("../models/Activity");

/**
 * Log a user action to the activity collection asynchronously.
 * Does not block the main request if an error occurs.
 */
const logUserActivity = async ({
    user,
    action,
    targetType,
    targetId,
    targetName,
    metadata = {},
}) => {
    try {
        if (!user || !action || !targetType || !targetId || !targetName) {
            return;
        }

        await Activity.create({
            user,
            action,
            targetType,
            targetId,
            targetName,
            metadata,
        });
    } catch (error) {
        console.error("Activity logging error:", error.message);
    }
};

module.exports = { logUserActivity };
