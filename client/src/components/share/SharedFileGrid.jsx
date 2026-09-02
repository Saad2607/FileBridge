import Box from "@mui/material/Box";
import SharedFileCard from "./SharedFileCard";

function SharedFileGrid({ files, onDisable }) {
    if (!files || files.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fill, minmax(300px, 1fr))" },
                gap: { xs: 2, sm: 3 },
            }}
        >
            {files.map((file) => (
                <SharedFileCard
                    key={file._id}
                    file={file}
                    onDisable={onDisable}
                />
            ))}
        </Box>
    );
}

export default SharedFileGrid;