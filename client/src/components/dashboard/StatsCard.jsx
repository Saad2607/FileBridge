import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
} from "@mui/material";

function StatsCard({
    title,
    value,
    icon,
    color = "#1976d2",
}) {

    return (

        <Card
            elevation={0}
            sx={{

                height: "100%",

                borderRadius: 5,

                border: "1px solid #E8EDF3",

                bgcolor: "#FFFFFF",

                overflow: "hidden",

                position: "relative",

                transition: "all .25s ease",

                "&:hover": {

                    transform: "translateY(-8px)",

                    boxShadow:
                        "0 18px 40px rgba(0,0,0,.12)",

                    borderColor: color,

                },

            }}
        >

            {/* Gradient Accent */}

            <Box
                sx={{
                    height: 6,
                    background: `linear-gradient(90deg, ${color}, ${color}99)`,
                }}
            />

            <CardContent
                sx={{
                    p: 3,
                }}
            >

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >

                    <Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 600,
                                letterSpacing: .4,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mt: 1,
                                lineHeight: 1,
                            }}
                        >
                            {value}
                        </Typography>

                    </Box>

                    <Avatar
                        sx={{

                            width: 60,

                            height: 60,

                            bgcolor: `${color}18`,

                            color: color,

                            boxShadow: `0 8px 20px ${color}25`,

                        }}
                    >
                        {icon}
                    </Avatar>

                </Box>

                <Box
                    mt={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Updated just now
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            bgcolor: "#F5F7FA",
                            px: 1.2,
                            py: .4,
                            borderRadius: 10,
                            fontWeight: 600,
                        }}
                    >
                        Live
                    </Typography>

                </Box>

            </CardContent>

        </Card>

    );

}

export default StatsCard;