import { useState } from "react";

import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

function ActionMenu({ items }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getIcon = (label) => {

        if (label.includes("Download"))
            return <DownloadRoundedIcon fontSize="small" />;

        if (label.includes("Rename"))
            return <DriveFileRenameOutlineRoundedIcon fontSize="small" />;

        if (label.includes("Favorite"))
            return <FavoriteRoundedIcon fontSize="small" />;

        if (label.includes("Share"))
            return <ShareRoundedIcon fontSize="small" />;

        if (label.includes("Properties"))
            return <InfoOutlinedIcon fontSize="small" />;

        if (label.includes("Delete"))
            return <DeleteOutlineRoundedIcon fontSize="small" />;

        return null;
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                size="small"
                sx={{

                    width: 38,

                    height: 38,

                    borderRadius: 2,

                    bgcolor: "#F5F7FA",

                    transition: ".2s",

                    "&:hover": {

                        bgcolor: "#E3F2FD",

                    },

                }}
            >
                <MoreHorizRoundedIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{

                    elevation: 8,

                    sx: {

                        mt: 1,

                        minWidth: 220,

                        borderRadius: 3,

                        border: "1px solid #ECEFF1",

                        overflow: "hidden",

                    },

                }}
            >
                {items.map((item, index) => (

                    <MenuItem
                        key={index}
                        onClick={(event) => {

                            event.stopPropagation();

                            handleClose();

                            item.onClick();

                        }}
                        sx={{

                            py: 1.2,

                            px: 2,

                            transition: ".2s",

                            "&:hover": {

                                bgcolor: "#F5F9FF",

                            },

                        }}
                    >

                        <ListItemIcon
                            sx={{
                                minWidth: 36,
                            }}
                        >
                            {getIcon(item.label)}
                        </ListItemIcon>

                        <ListItemText>
                            {item.label}
                        </ListItemText>

                    </MenuItem>

                ))}
            </Menu>
        </>
    );
}

export default ActionMenu;