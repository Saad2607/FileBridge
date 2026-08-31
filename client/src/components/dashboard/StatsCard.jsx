import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

function StatsCard({ title, value, icon, color = "#1976d2" }) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: 4,
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                overflow: "hidden",
                position: "relative",
                transition: "all .22s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
                    borderColor: color,
                },
            }}
        >
            <Box
                sx={{
                    height: 4,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                }}
            />

            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 700,
                                letterSpacing: 0.5,
                                textTransform: "uppercase",
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                mt: 0.5,
                                color: "#0F172A",
                                lineHeight: 1.1,
                            }}
                        >
                            {value ?? 0}
                        </Typography>
                    </Box>

                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: `${color}18`,
                            color: color,
                            borderRadius: 3,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>

                <Box
                    mt={2.5}
                    pt={1.5}
                    borderTop="1px solid #F1F5F9"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography variant="caption" color="text.secondary">
                        Active in cloud
                    </Typography>

                    <Box
                        sx={{
                            bgcolor: `${color}14`,
                            color: color,
                            px: 1,
                            py: 0.2,
                            borderRadius: 1.5,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                        }}
                    >
                        Live
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default StatsCard;