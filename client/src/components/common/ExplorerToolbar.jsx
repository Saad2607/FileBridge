import {
    Box,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

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
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 4,
                p: 2.5,
                bgcolor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 4,
            }}
        >

            {/* Left */}

            <Box>

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Files
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {totalItems} Items
                </Typography>

            </Box>

            {/* Right */}

            <Box
                display="flex"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
            >

                <TextField
                    size="small"
                    placeholder="Search files..."
                    value={search}
                    onChange={(e) =>
                        onSearch(e.target.value)
                    }
                    sx={{
                        width: 260,

                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            bgcolor: "#F8FAFC",
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon />
                            </InputAdornment>
                        ),
                    }}
                />

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

    );

}

export default ExplorerToolbar;