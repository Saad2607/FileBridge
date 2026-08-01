import { useState } from "react";

import FolderIcon from "@mui/icons-material/Folder";
import ActionMenu from "../common/ActionMenu";

import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";

function FolderCard({ folder, onOpen, onDelete, onRename }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card
            elevation={2}
            sx={{
                mb: 2,
                borderRadius: 2,
                transition: "0.2s",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 6,
                },
            }}
        >
            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{
                            cursor: "pointer",
                            flex: 1,
                        }}
                        onClick={() => onOpen(folder)}
                    >
                        <FolderIcon
                            color="primary"
                            fontSize="large"
                        />

                        <Typography variant="h6">
                            {folder.name}
                        </Typography>
                    </Box>

                    <ActionMenu
                        items={[
                            {
                                label: "Rename",
                                onClick: () => onRename(folder),
                            },
                            {
                                label: "Delete",
                                onClick: () => onDelete(folder),
                            },
                        ]}
                    />

                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                >
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            onDelete(folder);
                        }}
                    >
                        Delete
                    </MenuItem>
                </Menu>

            </CardContent>
        </Card>
    );
}

export default FolderCard;