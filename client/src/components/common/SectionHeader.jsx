import { Box, Typography, Chip } from "@mui/material";

function SectionHeader({ title, count }) {
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2, mt: 3.5 }}
        >
            <Typography
                variant="subtitle1"
                fontWeight={800}
                color="#0F172A"
                letterSpacing="-0.2px"
            >
                {title}
            </Typography>

            {count !== undefined && (
                <Chip
                    label={`${count} ${count === 1 ? "item" : "items"}`}
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        bgcolor: "#F1F5F9",
                        color: "#475569",
                        borderRadius: "6px",
                    }}
                />
            )}
        </Box>
    );
}

export default SectionHeader;