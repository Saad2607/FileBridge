import { useContext } from "react";

import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Avatar,
    TextField,
    InputAdornment,
    IconButton,
    Badge,
    Button,
} from "@mui/material";

import { AuthContext } from "../../context/AuthContext";

import CloudIcon from "@mui/icons-material/Cloud";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function Navbar() {

    const { user } = useContext(AuthContext);

    const initials =
        user?.username
            ?.substring(0, 1)
            ?.toUpperCase() || "U";

    return (

        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "#fff",
                borderBottom: "1px solid #ECEFF1",
                color: "#212121",
            }}
        >

            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    py: 1,
                }}
            >

                {/* Logo */}

                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                >

                    <CloudIcon
                        sx={{
                            color: "#1976d2",
                            fontSize: 34,
                        }}
                    />

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        FileBridge
                    </Typography>

                </Box>

                {/* Search */}

                <TextField
                    placeholder="Search files and folders..."
                    size="small"
                    sx={{
                        width: "40%",

                        "& .MuiOutlinedInput-root": {

                            borderRadius: 8,

                            bgcolor: "#F5F7FA",

                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon
                                    color="action"
                                />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Right Side */}

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <Button
                        variant="contained"
                        startIcon={
                            <UploadFileIcon />
                        }
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            px: 2.5,
                        }}
                    >
                        Upload
                    </Button>

                    <IconButton>

                        <Badge
                            badgeContent={0}
                            showZero
                            color="error"
                        >

                            <NotificationsNoneIcon />

                        </Badge>

                    </IconButton>

                    <Avatar
                        sx={{
                            bgcolor: "#1976d2",
                            fontWeight: 700,
                        }}
                    >
                        {initials}
                    </Avatar>

                    <Typography
                        fontWeight={600}
                    >
                        {user?.username}
                    </Typography>

                </Box>

            </Toolbar>

        </AppBar>

    );

}

export default Navbar;