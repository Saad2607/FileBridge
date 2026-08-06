import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Chip,
} from "@mui/material";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";

function RecentActivity() {

    const activities = [

        {
            icon: <UploadFileRoundedIcon />,
            title: "Resume.pdf uploaded",
            subtitle: "Documents",
            time: "2 min ago",
            color: "#1976d2",
        },

        {
            icon: <CreateNewFolderRoundedIcon />,
            title: "Projects folder created",
            subtitle: "Workspace",
            time: "Yesterday",
            color: "#43A047",
        },

        {
            icon: <DeleteOutlineRoundedIcon />,
            title: "Old Files moved to Bin",
            subtitle: "Recycle Bin",
            time: "2 days ago",
            color: "#FB8C00",
        },

        {
            icon: <ShareRoundedIcon />,
            title: "Resume shared",
            subtitle: "Shared Files",
            time: "3 days ago",
            color: "#8E24AA",
        },

    ];

    return (

        <Card
            elevation={0}
            sx={{

                borderRadius: 5,

                border: "1px solid #E8EDF3",

                height: "100%",

                overflow: "hidden",

            }}
        >

            <Box
                sx={{
                    height: 6,
                    background:
                        "linear-gradient(90deg,#1976d2,#42A5F5)",
                }}
            />

            <CardContent sx={{ p: 3 }}>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={3}
                >
                    Recent Activity
                </Typography>

                {activities.map((activity, index) => (

                    <Box
                        key={index}
                        sx={{

                            display: "flex",

                            alignItems: "center",

                            gap: 2,

                            py: 2,

                            position: "relative",

                            borderBottom:
                                index !== activities.length - 1
                                    ? "1px solid #F1F3F5"
                                    : "none",

                            transition: ".2s",

                            "&:hover": {

                                bgcolor: "#F8FAFC",

                                borderRadius: 3,

                            },

                        }}
                    >

                        <Avatar
                            sx={{

                                bgcolor: `${activity.color}18`,

                                color: activity.color,

                                width: 48,

                                height: 48,

                            }}
                        >
                            {activity.icon}
                        </Avatar>

                        <Box flex={1}>

                            <Typography
                                fontWeight={600}
                            >
                                {activity.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {activity.subtitle}
                            </Typography>

                        </Box>

                        <Chip
                            label={activity.time}
                            size="small"
                            variant="outlined"
                        />

                    </Box>

                ))}

            </CardContent>

        </Card>

    );

}

export default RecentActivity;