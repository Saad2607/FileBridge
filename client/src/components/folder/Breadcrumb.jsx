import { useContext } from "react";
import {
    Breadcrumbs as MuiBreadcrumbs,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { FolderContext } from "../../context/FolderContext";

function Breadcrumb() {
    const {
        breadcrumbs,
        setCurrentFolder,
        setBreadcrumbs,
    } = useContext(FolderContext);

    const handleClick = (index) => {
        const selected = breadcrumbs[index];
        setCurrentFolder(selected._id ? selected : null);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <MuiBreadcrumbs
                separator={<NavigateNextRoundedIcon fontSize="small" sx={{ color: "#94A3B8", mx: 0.25 }} />}
                aria-label="folder navigation"
                sx={{
                    "& .MuiBreadcrumbs-ol": {
                        alignItems: "center",
                    },
                }}
            >
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    const isHome = index === 0;

                    if (isLast) {
                        return (
                            <Chip
                                key={item._id ?? "home"}
                                icon={
                                    isHome ? (
                                        <HomeRoundedIcon sx={{ fontSize: "16px !important", color: "#4F46E5 !important" }} />
                                    ) : (
                                        <FolderRoundedIcon sx={{ fontSize: "16px !important", color: "#4F46E5 !important" }} />
                                    )
                                }
                                label={item.name}
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    height: 28,
                                    fontSize: "0.82rem",
                                    borderRadius: "8px",
                                    bgcolor: "#EEF2FF",
                                    color: "#4F46E5",
                                    border: "1px solid #C7D2FE",
                                }}
                            />
                        );
                    }

                    return (
                        <Box
                            key={item._id ?? "home"}
                            onClick={() => handleClick(index)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                color: "#64748B",
                                textDecoration: "none",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                px: 1,
                                py: 0.4,
                                borderRadius: "6px",
                                transition: "all .15s ease",
                                "&:hover": {
                                    color: "#4F46E5",
                                    bgcolor: "#F1F5F9",
                                },
                            }}
                        >
                            {isHome ? (
                                <HomeRoundedIcon sx={{ fontSize: 16 }} />
                            ) : (
                                <FolderRoundedIcon sx={{ fontSize: 16 }} />
                            )}
                            <Typography variant="body2" fontWeight={600} color="inherit">
                                {item.name}
                            </Typography>
                        </Box>
                    );
                })}
            </MuiBreadcrumbs>
        </Box>
    );
}

export default Breadcrumb;