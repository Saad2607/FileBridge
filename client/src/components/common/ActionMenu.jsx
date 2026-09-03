import { useState, Fragment } from "react";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";

function ActionMenu({ items = [] }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setAnchorEl(null);
    };

    const getIcon = (item) => {
        if (item.icon) return item.icon;
        const label = item.label || "";

        if (label.includes("Preview"))
            return <VisibilityRoundedIcon fontSize="small" sx={{ color: "#1976D2" }} />;
        if (label.includes("Studio"))
            return <AutoFixHighRoundedIcon fontSize="small" sx={{ color: "#0D9488" }} />;
        if (label.includes("Edit"))
            return <EditNoteRoundedIcon fontSize="small" sx={{ color: "#4F46E5" }} />;
        if (label.includes("Download"))
            return <DownloadRoundedIcon fontSize="small" sx={{ color: "#0284C7" }} />;
        if (label.includes("Rename"))
            return <DriveFileRenameOutlineRoundedIcon fontSize="small" sx={{ color: "#64748B" }} />;
        if (label.includes("Star") || label.includes("Favorite"))
            return <StarRoundedIcon fontSize="small" sx={{ color: "#F59E0B" }} />;
        if (label.includes("Share"))
            return <ShareRoundedIcon fontSize="small" sx={{ color: "#8B5CF6" }} />;
        if (label.includes("Properties"))
            return <InfoOutlinedIcon fontSize="small" sx={{ color: "#64748B" }} />;
        if (label.includes("Delete"))
            return <DeleteOutlineRoundedIcon fontSize="small" sx={{ color: "#EF4444" }} />;
        return null;
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                size="small"
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    color: "#94A3B8",
                    "&:hover": {
                        bgcolor: "#F1F5F9",
                        color: "#0F172A",
                    },
                }}
            >
                <MoreVertRoundedIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        mt: 0.5,
                        minWidth: 180,
                        borderRadius: 3,
                        border: "1px solid #E2E8F0",
                        p: 0.5,
                    },
                }}
            >
                {items.map((item, index) => {
                    const isDelete = item.label.toLowerCase().includes("delete");

                    return (
                        <Fragment key={index}>
                            {isDelete && <Divider sx={{ my: 0.5 }} />}
                            <MenuItem
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleClose();
                                    item.onClick();
                                }}
                                sx={{
                                    py: 0.85,
                                    px: 1.5,
                                    borderRadius: 2,
                                    color: isDelete ? "#EF4444" : "#1E293B",
                                    "&:hover": {
                                        bgcolor: isDelete ? "#FEF2F2" : "#F8FAFC",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    {getIcon(item)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: 600,
                                        fontSize: "0.85rem",
                                    }}
                                />
                            </MenuItem>
                        </Fragment>
                    );
                })}
            </Menu>
        </>
    );
}

export default ActionMenu;