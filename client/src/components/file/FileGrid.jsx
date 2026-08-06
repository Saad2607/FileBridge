import { Grid } from "@mui/material";
import FileCard from "./FileCard";

function FileGrid({
    files,
    onOpen,
    onDownload,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
    onShare,
}) {

    if (files.length === 0) {
        return null;
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
                        onOpen={onOpen}
                        onDownload={onDownload}
                        onDelete={onDelete}
                        onRename={onRename}
                        onProperties={onProperties}
                        onFavorite={onFavorite}
                        onShare={onShare}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default FileGrid;