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
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 3,
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