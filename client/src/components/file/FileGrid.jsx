import { Grid } from "@mui/material";
import FileCard from "./FileCard";

function FileGrid({
    files,
    view,
    selectedIds = [],
    onToggleSelect,
    onOpen,
    onDownload,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
    onShare,
    onStudio,
    onEdit,
    onManageTags,
}) {
    if (!files || files.length === 0) {
        return null;
    }

    return (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {files.map((file) => (
                <Grid
                    size={{
                        xs: view === "grid" ? 6 : 12,
                        sm: view === "grid" ? 4 : 12,
                        md: view === "grid" ? 4 : 12,
                        lg: view === "grid" ? 3 : 12,
                        xl: view === "grid" ? 2.4 : 12,
                    }}
                    key={file._id}
                >
                    <FileCard
                        file={file}
                        view={view}
                        isSelected={selectedIds.includes(file._id)}
                        onToggleSelect={onToggleSelect}
                        onOpen={onOpen}
                        onDownload={onDownload}
                        onDelete={onDelete}
                        onRename={onRename}
                        onProperties={onProperties}
                        onFavorite={onFavorite}
                        onShare={onShare}
                        onStudio={onStudio}
                        onEdit={onEdit}
                        onManageTags={onManageTags}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default FileGrid;