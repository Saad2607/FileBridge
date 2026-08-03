import {
    Card,
    CardContent,
    Typography,
    Box,
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
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                position: "relative",
                overflow: "hidden",
                transition: "all .25s ease",

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,.12)",
                },
            }}
        >

            {/* Top Accent */}
            <Box
                sx={{
                    height: 5,
                    bgcolor: color,
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
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 500,
                                mb: .5,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight={700}
                        >
                            {value}
                        </Typography>

                    </Box>

                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            bgcolor: `${color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color,
                        }}
                    >
                        {icon}
                    </Box>

                </Box>

            </CardContent>

        </Card>
    );

}

export default StatsCard;