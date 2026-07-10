import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

function FolderToolbar({ children }) {
    return (
        <Paper
            elevation={2}
            sx={{
                padding: 2,
                marginBottom: 3,
            }}
        >
            <Stack
                direction="row"
                spacing={2}
            >
                {children}
            </Stack>
        </Paper>
    );
}

export default FolderToolbar;