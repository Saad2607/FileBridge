import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import SortMenu from "./SortMenu";
import FilterMenu from "./FilterMenu";
import ViewToggle from "./ViewToggle";

function ExplorerToolbar({
    totalItems,
    search,
    onSearch,
    sort,
    onSort,
    filter,
    onFilter,
    view,
    onViewChange,
}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", md: "center" },
                gap: 1.5,
                mb: 3,
                p: 1.5,
                px: 2,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
            }}
        >
            {/* Left: Section Info & Total Items Pill */}
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25 }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0F172A">
                    Workspace Explorer
                </Typography>
                <Chip
                    label={`${totalItems} ${totalItems === 1 ? "item" : "items"}`}
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        bgcolor: "#EEF2FF",
                        color: "#4F46E5",
                        borderRadius: "6px",
                    }}
                />
            </Box>

            {/* Right: Search, Filter, Sort, View */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    width: { xs: "100%", md: "auto" },
                    justifyContent: { xs: "space-between", sm: "flex-end" },
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search in folder..."
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    sx={{
                        width: { xs: "100%", sm: 200, md: 240 },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            bgcolor: "#F8FAFC",
                            fontSize: "0.82rem",
                            height: 34,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
                            </InputAdornment>
                        ),
                        endAdornment: search ? (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => onSearch("")}>
                                    <ClearRoundedIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <SortMenu
                        value={sort}
                        onChange={onSort}
                    />

                    <FilterMenu
                        value={filter}
                        onChange={onFilter}
                    />

                    <ViewToggle
                        view={view}
                        onChange={onViewChange}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default ExplorerToolbar;