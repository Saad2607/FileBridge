import { Grid } from "@mui/material";
import FolderCard from "./FolderCard";

function FolderGrid({
    folders,
    view,
    selectedIds = [],
    onToggleSelect,
    onOpen,
    onDelete,
    onRename,
    onProperties,
    onFavorite,
}) {
    if (!folders || folders.length === 0) {
        return null;
    }

    return (
        <Grid container spacing={2}>
            {folders.map((folder) => (
                <Grid
                    size={{
                        xs: 12,
                        sm: view === "grid" ? 6 : 12,
                        md: view === "grid" ? 4 : 12,
                        lg: view === "grid" ? 3 : 12,
                    }}
                    key={folder._id}
                >
                    <FolderCard
                        folder={folder}
                        view={view}
                        isSelected={selectedIds.includes(folder._id)}
                        onToggleSelect={onToggleSelect}
                        onOpen={onOpen}
                        onDelete={onDelete}
                        onRename={onRename}
                        onProperties={onProperties}
                        onFavorite={onFavorite}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default FolderGrid;