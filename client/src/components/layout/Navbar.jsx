import { useContext } from "react";

import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    Avatar,
    Button,
    IconButton,
    Badge,
    TextField,
    InputAdornment,
} from "@mui/material";

import { AuthContext } from "../../context/AuthContext";

import CloudIcon from "@mui/icons-material/Cloud";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function Navbar() {

    const { user } = useContext(AuthContext);

    const initials =
        user?.username?.charAt(0)?.toUpperCase() || "U";

    return (

        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "#fff",
                color: "#212121",
                borderBottom: "1px solid #ECEFF1",
                zIndex: 1201,
            }}
        >

            <Toolbar
                sx={{
                    height: 72,
                    px: 4,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >

                {/* Left Logo */}

                <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    sx={{
                        minWidth: 220,
                    }}
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

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        px: 4,
                    }}
                >

                    <TextField
                        fullWidth
                        placeholder="Search files and folders..."
                        size="small"
                        sx={{
                            maxWidth: 600,

                            "& .MuiOutlinedInput-root": {
                                bgcolor: "#F8FAFC",
                                borderRadius: "999px",

                                "& fieldset": {
                                    borderColor: "#E2E8F0",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#1976d2",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#1976d2",
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                </Box>

                {/* Right Section */}

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        sx={{
                            textTransform: "none",
                            borderRadius: "999px",
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            boxShadow: "none",

                            "&:hover": {
                                boxShadow: "none",
                            },
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

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                            cursor: "pointer",
                        }}
                    >

                        <Avatar
                            sx={{
                                bgcolor: "#1976d2",
                                width: 40,
                                height: 40,
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

                        <KeyboardArrowDownIcon
                            fontSize="small"
                            color="action"
                        />

                    </Box>

                </Box>

            </Toolbar>

        </AppBar>

    );

}

export default Navbar;