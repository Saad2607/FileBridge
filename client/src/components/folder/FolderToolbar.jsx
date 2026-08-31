import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

function FolderToolbar({ children }) {
    return (
        <Box
            sx={{
                p: 2,
                px: 2.5,
                mb: 3,
                borderRadius: 3.5,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
            }}
        >
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {children}
            </Stack>
        </Box>
    );
}

export default FolderToolbar;