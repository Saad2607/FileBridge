import { Grid } from "@mui/material";
import FileCard from "./FileCard";

function FileGrid({
    files,
    view,
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
                    md={view === "grid" ? 6 : 12}
                    lg={view === "grid" ? 4 : 12}
                    key={file._id}
                >
                    <FileCard
                        file={file}
                        view={view}
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