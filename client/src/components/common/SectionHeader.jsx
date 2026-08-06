import { Box, Typography, Chip } from "@mui/material";

function SectionHeader({ title, count }) {
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2, mt: 3 }}
        >
            <Typography
                variant="h5"
                fontWeight={700}
            >
                {title}
            </Typography>

            <Chip
                label={`${count} items`}
                color="primary"
                variant="outlined"
            />
        </Box>
    );
}

export default SectionHeader;