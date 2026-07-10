import { Grid } from "@mui/material";
import FileCard from "./FileCard";

function FileGrid({ files, onDownload }) {

    if (files.length === 0) {
        return <p>No files found.</p>;
    }

    return (
        <Grid container spacing={2}>
            {files.map((file) => (
                <Grid
                    item
                    xs={12}
                    key={file._id}
                >
                    <FileCard
                        file={file}
                        onDownload={onDownload}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default FileGrid;