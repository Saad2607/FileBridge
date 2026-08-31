const Activity = require("../models/Activity");

const getRecentActivities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 15;

        const activities = await Activity.find({
            user: req.user.id,
        })
            .sort({
                createdAt: -1,
            })
            .limit(limit);

        res.status(200).json({
            success: true,
            activities,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load activities.",
        });
    }
};

module.exports = { getRecentActivities };